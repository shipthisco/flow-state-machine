import { useCallback, useMemo, useEffect, useRef, useState } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
} from '@xyflow/react'
import StateNode from './StateNode'
import ActionEdge from './ActionEdge'
import ContextMenu from './ContextMenu'

const nodeTypes = { stateNode: StateNode }
const edgeTypes = { actionEdge: ActionEdge }

const EMPTY_STATE = {
  state_id: '',
  title: '',
  actions: [],
  enable_grouped_state: false,
  enable_dependency_state: false,
  include_in_timeline: false,
  events_tab_only: false,
  enable_required_fields: false,
  is_alternate_state: false,
  enable_field_criterion: false,
  enable_workflow_update: false,
}

const EMPTY_ACTION = {
  title: '',
  action_id: '',
  next_state_id: '',
  is_primary_action: false,
  enable_role_criterion: false,
  enable_field_criterion: false,
  field_criterion: [],
  enable_events: false,
  enable_confirmation: false,
  enable_email_confirmation: false,
  enable_tasks_update: false,
  enable_update_fields: false,
  enable_remark_field: false,
  enable_customer_action: false,
  enable_workflow_update: false,
  enable_code_check: false,
  enable_all_task_completed_check: false,
  enable_show_action_on_failed_condition: false,
}

function workflowToFlow(workflow, onAddActionOnEdge, onInsertStateOnEdge) {
  const states = workflow.states || []
  const isDirectMode = !!workflow.enable_direct_mode

  let nodes
  if (isDirectMode) {
    // Horizontal layout for direct mode: left → right
    nodes = states.map((state, idx) => ({
      id: state.state_id || `state-${idx}`,
      type: 'stateNode',
      position: {
        x: idx * 320 + 80,
        y: 150,
      },
      data: {
        state,
        stateIdx: idx,
        isStartState: workflow.start_state_id === state.state_id,
        isDirectMode: true,
      },
    }))
  } else {
    // Hierarchical layout: BFS from start state, arrange top→bottom by level
    const stateIdToIdx = {}
    states.forEach((s, i) => { stateIdToIdx[s.state_id] = i })

    const startId = workflow.start_state_id || states[0]?.state_id
    const levels = {} // stateId → depth level
    const queue = []

    // BFS to assign levels based on action connections
    if (startId && stateIdToIdx[startId] !== undefined) {
      levels[startId] = 0
      queue.push(startId)
    }

    while (queue.length > 0) {
      const currentId = queue.shift()
      const currentState = states[stateIdToIdx[currentId]]
      const currentLevel = levels[currentId]

      for (const action of (currentState.actions || [])) {
        const nextId = action.next_state_id
        if (nextId && stateIdToIdx[nextId] !== undefined && levels[nextId] === undefined) {
          levels[nextId] = currentLevel + 1
          queue.push(nextId)
        }
      }
    }

    // Assign orphan states (unreachable from start) to the end
    let maxLevel = Object.values(levels).length > 0 ? Math.max(...Object.values(levels)) : -1
    const orphans = states.filter(s => levels[s.state_id] === undefined)
    if (orphans.length > 0) {
      maxLevel++
      orphans.forEach(s => { levels[s.state_id] = maxLevel })
    }

    // Group states by level
    const levelGroups = {}
    states.forEach((s, idx) => {
      const level = levels[s.state_id] ?? 0
      if (!levelGroups[level]) levelGroups[level] = []
      levelGroups[level].push({ state: s, idx })
    })

    const X_GAP = 280
    const Y_GAP = 180
    const sortedLevels = Object.keys(levelGroups).map(Number).sort((a, b) => a - b)

    nodes = []
    sortedLevels.forEach(level => {
      const group = levelGroups[level]
      const totalWidth = (group.length - 1) * X_GAP
      const startX = -totalWidth / 2

      group.forEach((item, i) => {
        nodes.push({
          id: item.state.state_id || `state-${item.idx}`,
          type: 'stateNode',
          position: {
            x: startX + i * X_GAP + 400,
            y: level * Y_GAP + 80,
          },
          data: {
            state: item.state,
            stateIdx: item.idx,
            isStartState: workflow.start_state_id === item.state.state_id,
            isDirectMode: false,
          },
        })
      })
    })
  }

  const edges = []

  // Direct mode sequential edges
  if (isDirectMode && states.length > 1) {
    for (let i = 0; i < states.length - 1; i++) {
      const sourceId = states[i].state_id || `state-${i}`
      const targetId = states[i + 1].state_id || `state-${i + 1}`
      edges.push({
        id: `direct-${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        type: 'actionEdge',
        markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
        data: {
          isDirectModeEdge: true,
          sequenceLabel: String(i + 1),
          stateIdx: i,
          onInsertState: onInsertStateOnEdge ? () => onInsertStateOnEdge(i, null) : undefined,
        },
      })
    }
  }

  // Action-based edges
  states.forEach((state, stateIdx) => {
    ;(state.actions || []).forEach((action, actionIdx) => {
      if (action.next_state_id) {
        const sourceId = state.state_id || `state-${stateIdx}`
        const targetId = action.next_state_id
        edges.push({
          id: `${sourceId}-${actionIdx}-${targetId}`,
          source: sourceId,
          target: targetId,
          type: 'actionEdge',
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
          data: {
            action,
            stateIdx,
            actionIdx,
            isPrimary: !!action.is_primary_action,
            onAddAction: onAddActionOnEdge ? () => onAddActionOnEdge(stateIdx, targetId) : undefined,
            onInsertState: onInsertStateOnEdge ? () => onInsertStateOnEdge(stateIdx, actionIdx) : undefined,
          },
        })
      }
    })
  })

  return { nodes, edges }
}

export default function FlowCanvas({ workflow, onChange, selectedElement, onSelectElement }) {
  const reactFlowInstance = useReactFlow()
  const [contextMenu, setContextMenu] = useState(null)

  // Edge menu handlers
  const onAddActionOnEdge = useCallback(
    (stateIdx, targetStateId) => {
      const newAction = { ...EMPTY_ACTION, next_state_id: targetStateId }
      const newStates = [...workflow.states]
      newStates[stateIdx] = {
        ...newStates[stateIdx],
        actions: [...(newStates[stateIdx].actions || []), newAction],
      }
      onChange({ ...workflow, states: newStates })
      onSelectElement({
        type: 'action',
        stateIdx,
        actionIdx: newStates[stateIdx].actions.length - 1,
      })
    },
    [workflow, onChange, onSelectElement]
  )

  const onInsertStateOnEdge = useCallback(
    (stateIdx, actionIdx) => {
      const newStateId = `new_state_${Date.now()}`
      const newState = { ...EMPTY_STATE, state_id: newStateId, title: 'New State' }
      const newStates = [...workflow.states]

      if (actionIdx !== null && actionIdx !== undefined) {
        // Action-based edge: rewire source action to new state, create action on new state pointing to original target
        const originalAction = newStates[stateIdx].actions[actionIdx]
        const originalTarget = originalAction.next_state_id

        // Update the source action to point to new state
        const updatedActions = [...newStates[stateIdx].actions]
        updatedActions[actionIdx] = { ...originalAction, next_state_id: newStateId }
        newStates[stateIdx] = { ...newStates[stateIdx], actions: updatedActions }

        // New state has action pointing to original target
        newState.actions = [{ ...EMPTY_ACTION, next_state_id: originalTarget, title: 'Continue' }]
      } else {
        // Direct mode: insert state between stateIdx and stateIdx+1
        // Just insert after the source state in the array
      }

      // Insert new state after the source state
      newStates.splice(stateIdx + 1, 0, newState)
      onChange({ ...workflow, states: newStates })
      onSelectElement({ type: 'state', stateIdx: stateIdx + 1 })
    },
    [workflow, onChange, onSelectElement]
  )

  const initial = useMemo(
    () => workflowToFlow(workflow, onAddActionOnEdge, onInsertStateOnEdge),
    [workflow, onAddActionOnEdge, onInsertStateOnEdge]
  )
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges)

  // Sync nodes/edges when workflow changes externally
  const lastSyncedRef = useRef(workflow)
  useEffect(() => {
    if (lastSyncedRef.current === workflow) return
    lastSyncedRef.current = workflow

    const { nodes: newNodes, edges: newEdges } = workflowToFlow(workflow, onAddActionOnEdge, onInsertStateOnEdge)
    const posMap = {}
    nodes.forEach((n) => { posMap[n.id] = n.position })
    setNodes(newNodes.map((n) => ({ ...n, position: posMap[n.id] || n.position })))
    setEdges(newEdges)
  }, [workflow, onAddActionOnEdge, onInsertStateOnEdge])

  const onNodeClick = useCallback(
    (_, node) => {
      setContextMenu(null)
      onSelectElement({ type: 'state', stateIdx: node.data.stateIdx })
    },
    [onSelectElement]
  )

  const onEdgeClick = useCallback(
    (_, edge) => {
      setContextMenu(null)
      if (edge.data?.isDirectModeEdge) {
        onSelectElement({ type: 'state', stateIdx: edge.data.stateIdx })
      } else {
        onSelectElement({
          type: 'action',
          stateIdx: edge.data.stateIdx,
          actionIdx: edge.data.actionIdx,
        })
      }
    },
    [onSelectElement]
  )

  const onConnect = useCallback(
    (params) => {
      const sourceState = workflow.states.find((s) => s.state_id === params.source)
      if (!sourceState) return
      const stateIdx = workflow.states.indexOf(sourceState)
      const newAction = { ...EMPTY_ACTION, next_state_id: params.target }
      const newStates = [...workflow.states]
      newStates[stateIdx] = {
        ...newStates[stateIdx],
        actions: [...(newStates[stateIdx].actions || []), newAction],
      }
      onChange({ ...workflow, states: newStates })
      onSelectElement({
        type: 'action',
        stateIdx,
        actionIdx: newStates[stateIdx].actions.length - 1,
      })
    },
    [workflow, onChange, onSelectElement]
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/reactflow')

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      if (type === 'stateNode') {
        const newState = {
          ...EMPTY_STATE,
          state_id: `new_state_${Date.now()}`,
          title: 'New State',
        }
        onChange({ ...workflow, states: [...workflow.states, newState] })
      } else if (type === 'actionNode') {
        const currentNodes = reactFlowInstance.getNodes()
        if (currentNodes.length === 0) return

        let nearestNode = null
        let nearestDist = Infinity
        for (const node of currentNodes) {
          const cx = node.position.x + 100
          const cy = node.position.y + 50
          const dist = Math.sqrt((position.x - cx) ** 2 + (position.y - cy) ** 2)
          if (dist < nearestDist) {
            nearestDist = dist
            nearestNode = node
          }
        }

        if (!nearestNode) return
        const stateIdx = nearestNode.data.stateIdx
        const newAction = { ...EMPTY_ACTION }
        const newStates = [...workflow.states]
        newStates[stateIdx] = {
          ...newStates[stateIdx],
          actions: [...(newStates[stateIdx].actions || []), newAction],
        }
        onChange({ ...workflow, states: newStates })
        onSelectElement({
          type: 'action',
          stateIdx,
          actionIdx: newStates[stateIdx].actions.length - 1,
        })
      }
    },
    [reactFlowInstance, workflow, onChange, onSelectElement]
  )

  const onPaneClick = useCallback(() => {
    setContextMenu(null)
    onSelectElement(null)
  }, [onSelectElement])

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault()
      setContextMenu({ x: event.clientX, y: event.clientY, type: 'node', node })
    },
    []
  )

  const onEdgeContextMenu = useCallback(
    (event, edge) => {
      event.preventDefault()
      setContextMenu({ x: event.clientX, y: event.clientY, type: 'edge', edge })
    },
    []
  )

  const onPaneContextMenu = useCallback(
    (event) => {
      event.preventDefault()
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        type: 'pane',
        position: reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY }),
      })
    },
    [reactFlowInstance]
  )

  const handleContextAction = useCallback(
    (action, data) => {
      setContextMenu(null)
      if (action === 'edit-state') {
        onSelectElement({ type: 'state', stateIdx: data.stateIdx })
      } else if (action === 'delete-state') {
        const newStates = workflow.states.filter((_, i) => i !== data.stateIdx)
        onChange({ ...workflow, states: newStates })
        onSelectElement(null)
      } else if (action === 'set-start') {
        onChange({ ...workflow, start_state_id: data.stateId })
      } else if (action === 'edit-action') {
        onSelectElement({ type: 'action', stateIdx: data.stateIdx, actionIdx: data.actionIdx })
      } else if (action === 'delete-action') {
        const newStates = [...workflow.states]
        newStates[data.stateIdx] = {
          ...newStates[data.stateIdx],
          actions: (newStates[data.stateIdx].actions || []).filter((_, i) => i !== data.actionIdx),
        }
        onChange({ ...workflow, states: newStates })
        onSelectElement(null)
      } else if (action === 'add-state') {
        const newState = { ...EMPTY_STATE, state_id: `new_state_${Date.now()}`, title: 'New State' }
        onChange({ ...workflow, states: [...workflow.states, newState] })
      } else if (action === 'fit-view') {
        reactFlowInstance.fitView({ padding: 0.2 })
      } else if (action === 'view-source-state') {
        onSelectElement({ type: 'state', stateIdx: data.stateIdx })
      } else if (action === 'duplicate-state') {
        const srcState = workflow.states[data.stateIdx]
        const newState = {
          ...JSON.parse(JSON.stringify(srcState)),
          state_id: `${srcState.state_id}_copy`,
          title: `${srcState.title || 'State'} (Copy)`,
        }
        const newStates = [...workflow.states, newState]
        onChange({ ...workflow, states: newStates })
        onSelectElement({ type: 'state', stateIdx: newStates.length - 1 })
      } else if (action === 'add-action-to-state') {
        const newAction = { ...EMPTY_ACTION }
        const newStates = [...workflow.states]
        newStates[data.stateIdx] = {
          ...newStates[data.stateIdx],
          actions: [...(newStates[data.stateIdx].actions || []), newAction],
        }
        onChange({ ...workflow, states: newStates })
        onSelectElement({
          type: 'action',
          stateIdx: data.stateIdx,
          actionIdx: newStates[data.stateIdx].actions.length - 1,
        })
      } else if (action === 'insert-state-on-edge') {
        onInsertStateOnEdge(data.stateIdx, data.actionIdx)
      } else if (action === 'add-action-on-edge') {
        onAddActionOnEdge(data.stateIdx, data.targetStateId)
      } else if (action === 'add-conditions') {
        const newStates = [...workflow.states]
        newStates[data.stateIdx] = {
          ...newStates[data.stateIdx],
          enable_field_criterion: true,
          field_criterion: newStates[data.stateIdx].field_criterion || [],
        }
        onChange({ ...workflow, states: newStates })
        onSelectElement({ type: 'state', stateIdx: data.stateIdx })
      }
    },
    [workflow, onChange, onSelectElement, reactFlowInstance, onInsertStateOnEdge, onAddActionOnEdge]
  )

  // Highlight selected
  const styledNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        selected: selectedElement?.type === 'state' && node.data.stateIdx === selectedElement.stateIdx,
      })),
    [nodes, selectedElement]
  )

  const styledEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        selected: edge.data?.isDirectModeEdge
          ? false
          : selectedElement?.type === 'action' &&
            edge.data.stateIdx === selectedElement.stateIdx &&
            edge.data.actionIdx === selectedElement.actionIdx,
      })),
    [edges, selectedElement]
  )

  return (
    <div className="flex-1 relative bg-white">
      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        snapToGrid
        snapGrid={[20, 20]}
        defaultEdgeOptions={{
          type: 'actionEdge',
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
        }}
      >
        <Background variant="dots" gap={24} size={1.5} color="#d4d4d8" />
        <Controls className="!shadow-md !border-gray-200 !rounded-lg" />
        <MiniMap
          nodeStrokeColor={(n) => (n.data?.isStartState ? '#16a34a' : n.data?.state?.color_code || '#171717')}
          nodeColor={(n) => (n.data?.isStartState ? '#dcfce7' : '#f5f5f5')}
          maskColor="rgba(0,0,0,0.06)"
          className="!shadow-md !border-gray-200 !rounded-lg"
        />
      </ReactFlow>
      {contextMenu && (
        <ContextMenu
          {...contextMenu}
          onAction={handleContextAction}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  )
}
