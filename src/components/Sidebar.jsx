import { useState, useEffect, useCallback } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import { SHEET_SIDE, SHEET_BASE_WIDTH } from '@/lib/constants'
import StatePanel from './StatePanel'
import ActionPanel from './ActionPanel'

export default function Sidebar({ workflow, selectedElement, onChange, onClose, onSelectElement }) {
  const { type, stateIdx, actionIdx } = selectedElement || {}

  const state = workflow.states?.[stateIdx]
  const open = !!selectedElement && !!state

  const allStateIds = (workflow.states || []).map((s) => s.state_id).filter(Boolean)

  // Navigation history stack
  const [history, setHistory] = useState([])

  // When selectedElement changes from the outside (canvas click, etc.), reset history
  useEffect(() => {
    setHistory([])
  }, [open])

  const navigateTo = useCallback((element) => {
    setHistory((prev) => [...prev, selectedElement])
    onSelectElement(element)
  }, [selectedElement, onSelectElement])

  const navigateBack = useCallback(() => {
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    onSelectElement(prev)
  }, [history, onSelectElement])

  const canGoBack = history.length > 0

  const updateState = (updated) => {
    const newStates = [...workflow.states]
    newStates[stateIdx] = updated
    onChange({ ...workflow, states: newStates })
  }

  const updateAction = (updated) => {
    const newStates = [...workflow.states]
    const newActions = [...(newStates[stateIdx].actions || [])]
    newActions[actionIdx] = updated
    newStates[stateIdx] = { ...newStates[stateIdx], actions: newActions }
    onChange({ ...workflow, states: newStates })
  }

  const deleteState = () => {
    const newStates = workflow.states.filter((_, i) => i !== stateIdx)
    onChange({ ...workflow, states: newStates })
    onClose()
  }

  const deleteAction = () => {
    const newStates = [...workflow.states]
    newStates[stateIdx] = {
      ...newStates[stateIdx],
      actions: (newStates[stateIdx].actions || []).filter((_, i) => i !== actionIdx),
    }
    onChange({ ...workflow, states: newStates })
    onClose()
  }

  const addAction = () => {
    const newAction = {
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
    const newStates = [...workflow.states]
    const newActions = [...(newStates[stateIdx].actions || []), newAction]
    newStates[stateIdx] = { ...newStates[stateIdx], actions: newActions }
    onChange({ ...workflow, states: newStates })
    onClose()
    setTimeout(() => {
      navigateTo({ type: 'action', stateIdx, actionIdx: newActions.length - 1 })
    }, 0)
  }

  const action = type === 'action' ? state?.actions?.[actionIdx] : null

  const title = type === 'state'
    ? state?.title || state?.state_id || 'Untitled State'
    : action?.title || action?.action_id || 'Untitled Action'

  const subtitle = type === 'state'
    ? 'Configure state properties, behavior, and transitions'
    : 'Configure action properties, criteria, and events'

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <SheetContent
        side={SHEET_SIDE}
        className="p-0 overflow-hidden"
        style={{ width: `${SHEET_BASE_WIDTH}vw`, maxWidth: `${SHEET_BASE_WIDTH}vw` }}
      >
        {state && (
          <div className="flex flex-col h-full">
            <SheetHeader className="px-6 pt-5 pb-4 border-b border-gray-100 bg-white shrink-0">
              {canGoBack && (
                <button
                  onClick={navigateBack}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2 -ml-0.5 w-fit"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Back
                </button>
              )}
              <div className="flex items-center gap-3 pr-8">
                {type === 'state' ? (
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0 ring-2 ring-offset-2"
                    style={{ backgroundColor: state.color_code || '#171717', ringColor: state.color_code || '#171717' }}
                  />
                ) : (
                  <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                    <ArrowRight className="h-4 w-4 text-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <SheetTitle className="text-lg font-semibold text-foreground leading-tight">
                      {title}
                    </SheetTitle>
                    {type === 'state' ? (
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                        State
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                        Action
                      </span>
                    )}
                  </div>
                  <SheetDescription className="text-sm text-muted-foreground">
                    {subtitle}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            {/* Fixed state navigation strip for actions */}
            {type === 'action' && (action?.next_state_id || state) && (
              <div className="flex items-center gap-2 px-6 py-2.5 bg-white border-b border-gray-100 shrink-0">
                <button
                  onClick={() => navigateTo({ type: 'state', stateIdx })}
                  className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-blue-600 transition-colors group"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: state.color_code || '#171717' }}
                  />
                  <span className="group-hover:underline underline-offset-2">
                    {state.title || state.state_id}
                  </span>
                </button>
                {action?.next_state_id && (
                  <>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {(() => {
                      const nextIdx = workflow.states.findIndex((s) => s.state_id === action.next_state_id)
                      const nextState = workflow.states[nextIdx]
                      return nextIdx >= 0 ? (
                        <button
                          onClick={() => navigateTo({ type: 'state', stateIdx: nextIdx })}
                          className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-blue-600 transition-colors group"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: nextState?.color_code || '#171717' }}
                          />
                          <span className="group-hover:underline underline-offset-2">
                            {nextState?.title || action.next_state_id}
                          </span>
                        </button>
                      ) : (
                        <span className="text-sm text-muted-foreground">{action.next_state_id}</span>
                      )
                    })()}
                  </>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto bg-gray-50/50">
              <div className="px-6 py-6">
                {type === 'state' ? (
                  <StatePanel
                    state={state}
                    onChange={updateState}
                    onDelete={deleteState}
                    allStateIds={allStateIds}
                    isDirectMode={!!workflow.enable_direct_mode}
                    onAddAction={addAction}
                    onSelectAction={(actionIdx) => navigateTo({ type: 'action', stateIdx, actionIdx })}
                  />
                ) : (
                  <ActionPanel
                    action={action}
                    onChange={updateAction}
                    onDelete={deleteAction}
                    allStateIds={allStateIds}
                    parentState={state}
                    onSelectState={(stateId) => {
                      const idx = workflow.states.findIndex((s) => s.state_id === stateId)
                      if (idx >= 0) navigateTo({ type: 'state', stateIdx: idx })
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
