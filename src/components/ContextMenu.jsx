import { useEffect, useRef } from 'react'
import { Edit3, Trash2, Plus, Play, Maximize, MousePointer, Copy, ArrowRight, Circle, Filter } from 'lucide-react'

export default function ContextMenu({ x, y, type, node, edge, onAction, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const style = {
    position: 'fixed',
    top: y,
    left: x,
    zIndex: 100,
  }

  const items = []

  if (type === 'node') {
    const { stateIdx, state } = node.data
    items.push(
      { label: 'Edit State', icon: Edit3, action: () => onAction('edit-state', { stateIdx }) },
      { label: 'Set as Start State', icon: Play, action: () => onAction('set-start', { stateId: state.state_id }) },
      { label: 'Add Action to State', icon: ArrowRight, action: () => onAction('add-action-to-state', { stateIdx }) },
      { label: 'Add Conditions', icon: Filter, action: () => onAction('add-conditions', { stateIdx }) },
      { label: 'Duplicate State', icon: Copy, action: () => onAction('duplicate-state', { stateIdx }) },
      { type: 'separator' },
      { label: 'Delete State', icon: Trash2, action: () => onAction('delete-state', { stateIdx }), destructive: true },
    )
  } else if (type === 'edge') {
    if (edge.data?.isDirectModeEdge) {
      items.push(
        { label: 'View Source State', icon: MousePointer, action: () => onAction('view-source-state', { stateIdx: edge.data.stateIdx }) },
        { label: 'Insert State Between', icon: Circle, action: () => onAction('insert-state-on-edge', { stateIdx: edge.data.stateIdx, actionIdx: null }) },
      )
    } else {
      const { stateIdx, actionIdx, action } = edge.data
      items.push(
        { label: 'Edit Action', icon: Edit3, action: () => onAction('edit-action', { stateIdx, actionIdx }) },
        { label: 'Add Action', icon: ArrowRight, action: () => onAction('add-action-on-edge', { stateIdx, targetStateId: action?.next_state_id }) },
        { label: 'Insert State', icon: Circle, action: () => onAction('insert-state-on-edge', { stateIdx, actionIdx }) },
        { type: 'separator' },
        { label: 'Delete Action', icon: Trash2, action: () => onAction('delete-action', { stateIdx, actionIdx }), destructive: true },
      )
    }
  } else if (type === 'pane') {
    items.push(
      { label: 'Add State Here', icon: Plus, action: () => onAction('add-state') },
      { label: 'Fit View', icon: Maximize, action: () => onAction('fit-view') },
    )
  }

  return (
    <div ref={ref} style={style} className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[180px] animate-in fade-in zoom-in-95 duration-100">
      {items.map((item, i) => {
        if (item.type === 'separator') {
          return <div key={i} className="h-px bg-gray-100 my-1" />
        }
        const Icon = item.icon
        return (
          <button
            key={i}
            onClick={item.action}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs transition-colors cursor-pointer ${
              item.destructive
                ? 'text-red-600 hover:bg-red-50'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
