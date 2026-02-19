import { Button } from '@/components/ui/button'
import { Trash2, Plus, ArrowRight, ChevronRight } from 'lucide-react'
import { TextField, SelectField, FieldGrid, FeatureToggle, TextAreaField } from './form-fields'
import { MultiSelectField } from './multi-select-field'
import FieldCriterion from './FieldCriterion'
import WorkflowUpdates from './WorkflowUpdates'
import EventEditor from './EventEditor'
import EventRefEditor from './EventRefEditor'
import Section from './Section'
import { useApi } from '@/lib/api-context'

const SHIPTHIS_STATUSES = [
  { value: '_none', label: 'None' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'pending', label: 'Pending' },
  { value: 'on_hold', label: 'On Hold' },
]

export default function StatePanel({ state, onChange, onDelete, isDirectMode, onAddAction, onSelectAction }) {
  const { fieldOptions } = useApi()
  const update = (key, value) => onChange({ ...state, [key]: value })

  return (
    <div className="space-y-6">
      {/* Basic fields */}
      <FieldGrid columns={2}>
        <TextField
          label="State ID"
          value={state.state_id || ''}
          onChange={(v) => update('state_id', v)}
          placeholder="e.g. draft"
          required
        />
        <TextField
          label="Title"
          value={state.title || ''}
          onChange={(v) => update('title', v)}
          placeholder="e.g. Draft"
          required
        />
      </FieldGrid>

      <FieldGrid columns={2}>
        <div className="space-y-1.5">
          <TextField
            label="Color Code"
            value={state.color_code || ''}
            onChange={(v) => update('color_code', v)}
            placeholder="#171717"
          />
          <input
            type="color"
            value={state.color_code || '#171717'}
            onChange={(e) => update('color_code', e.target.value)}
            className="w-full h-8 border border-gray-200 rounded-md cursor-pointer"
          />
        </div>
        <SelectField
          label="State Mapping"
          value={state.shipthis_id || state.shipthis_status_id || '_none'}
          onChange={(v) => update('shipthis_id', v === '_none' ? undefined : v)}
          options={SHIPTHIS_STATUSES}
          placeholder="Select status..."
          description="Map this state to an internal system status"
        />
      </FieldGrid>

      {/* Actions */}
      {!isDirectMode && (
        <Section
          title="Actions"
          description="Transitions available from this state"
          headerAction={
            onAddAction && (
              <Button variant="outline" size="sm" onClick={onAddAction}>
                <Plus className="h-3.5 w-3.5" />
                Add Action
              </Button>
            )
          }
        >
          {(state.actions || []).length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">No actions yet. Add one to create transitions from this state.</p>
          ) : (
            <div className="space-y-1.5">
              {(state.actions || []).map((action, idx) => (
                <button
                  key={action.action_id || idx}
                  onClick={() => onSelectAction?.(idx)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors text-left group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground truncate">
                        {action.title || action.action_id || 'Untitled Action'}
                      </span>
                      {action.is_primary_action && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5 shrink-0">Primary</span>
                      )}
                    </div>
                    {action.next_state_id && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">{action.next_state_id}</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
                </button>
              ))}
            </div>
          )}
        </Section>
      )}


      {/* Display Settings */}
      <Section title="Display Settings">
        <div className="space-y-3">
          <FeatureToggle
            label="Timeline Visibility"
            fieldName="include_in_timeline"
            description="Show this state in the document timeline"
            enabled={!!state.include_in_timeline}
            onToggle={(v) => update('include_in_timeline', v)}
          />
          <FeatureToggle
            label="Events Tab Only"
            fieldName="events_tab_only"
            description="Display only in the events tab"
            enabled={!!state.events_tab_only}
            onToggle={(v) => update('events_tab_only', v)}
          />
          <FeatureToggle
            label="Alternate State"
            fieldName="is_alternate_state"
            description="Mark as an alternate state"
            enabled={!!state.is_alternate_state}
            onToggle={(v) => update('is_alternate_state', v)}
          />
        </div>
      </Section>

      {/* Rules & Conditions */}
      <Section title="Rules & Conditions">
        <div className="space-y-3">
          <FeatureToggle
            label="Entry Conditions"
            fieldName="enable_field_criterion"
            description="Conditions that must be met to enter this state"
            enabled={!!state.enable_field_criterion}
            onToggle={(v) => update('enable_field_criterion', v)}
          >
            <FieldCriterion
              criteria={state.field_criterion || []}
              onChange={(fc) => update('field_criterion', fc)}
            />
          </FeatureToggle>
          <FeatureToggle
            label="Required Fields"
            fieldName="enable_required_fields"
            description="Fields that must be filled before entering"
            enabled={!!state.enable_required_fields}
            onToggle={(v) => update('enable_required_fields', v)}
          >
            <MultiSelectField
              value={state.required_fields || []}
              onChange={(vals) => update('required_fields', vals)}
              options={fieldOptions}
              placeholder="Required Fields"
            />
          </FeatureToggle>
          <FeatureToggle
            label="Grouped State"
            fieldName="enable_grouped_state"
            description="Group multiple documents under this state"
            enabled={!!state.enable_grouped_state}
            onToggle={(v) => update('enable_grouped_state', v)}
          >
            <TextAreaField
              value={typeof state.group_meta === 'string' ? state.group_meta : JSON.stringify(state.group_meta || {}, null, 2)}
              onChange={(v) => {
                try { update('group_meta', JSON.parse(v)) }
                catch { update('group_meta', v) }
              }}
              placeholder='{"filter": {}, "alternate_states": []}'
              inputClassName="px-3 py-2.5 font-mono h-28 bg-white resize-y"
            />
          </FeatureToggle>
        </div>
      </Section>

      {/* Integrations */}
      <Section title="Integrations">
        <div className="space-y-3">
          <FeatureToggle
            label="State Dependency"
            fieldName="enable_dependency_state"
            description="Link to another document's workflow state"
            enabled={!!state.enable_dependency_state}
            onToggle={(v) => update('enable_dependency_state', v)}
          >
            <TextAreaField
              value={typeof state.dependency_state_meta === 'string' ? state.dependency_state_meta : JSON.stringify(state.dependency_state_meta || {}, null, 2)}
              onChange={(v) => {
                try { update('dependency_state_meta', JSON.parse(v)) }
                catch { update('dependency_state_meta', v) }
              }}
              placeholder='{"workflow_id": "", "state_id": "", "accessor": ""}'
              inputClassName="px-3 py-2.5 font-mono h-28 bg-white resize-y"
            />
          </FeatureToggle>
          <FeatureToggle
            label="Workflow Updates"
            fieldName="enable_workflow_update"
            description="Trigger updates in related workflows"
            enabled={!!state.enable_workflow_update}
            onToggle={(v) => update('enable_workflow_update', v)}
          >
            <WorkflowUpdates
              updates={state.workflow_updates || []}
              onChange={(wu) => update('workflow_updates', wu)}
            />
          </FeatureToggle>
        </div>
      </Section>

      {/* Direct Mode: Events & Event Refs */}
      {isDirectMode && (
        <Section title="Direct Mode Events" description="Events triggered when entering this state">
          <div className="space-y-4">
            <EventEditor
              events={state.events || []}
              onChange={(events) => update('events', events)}
            />
            <div className="border-t border-gray-100 pt-4">
              <EventRefEditor
                eventRefs={state.event_refs || []}
                onChange={(refs) => update('event_refs', refs)}
              />
            </div>
          </div>
        </Section>
      )}

      
      {/* Footer actions */}
      <div className="flex items-center gap-3 pt-2">
        <div className="flex-1" />
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
          Delete State
        </Button>
      </div>
    </div>
  )
}
