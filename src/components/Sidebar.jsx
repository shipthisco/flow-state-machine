import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { ArrowRight } from 'lucide-react'
import { SHEET_SIDE, SHEET_BASE_WIDTH } from '@/lib/constants'
import StatePanel from './StatePanel'
import ActionPanel from './ActionPanel'

export default function Sidebar({ workflow, selectedElement, onChange, onClose, onSelectElement }) {
  const { type, stateIdx, actionIdx } = selectedElement || {}

  const state = workflow.states?.[stateIdx]
  const open = !!selectedElement && !!state

  const allStateIds = (workflow.states || []).map((s) => s.state_id).filter(Boolean)

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
      onSelectElement({ type: 'action', stateIdx, actionIdx: newActions.length - 1 })
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
                <div className="min-w-0">
                  <SheetTitle className="text-lg font-semibold text-foreground">
                    {title}
                  </SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground mt-0.5">
                    {subtitle}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

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
                  />
                ) : (
                  <ActionPanel
                    action={action}
                    onChange={updateAction}
                    onDelete={deleteAction}
                    allStateIds={allStateIds}
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
