import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { TextField, SelectField, SwitchField, FieldGrid, FeatureToggle, TextAreaField } from './form-fields'
import { ChipInput } from './chip-input'
import { MultiSelectField } from './multi-select-field'
import EventEditor from './EventEditor'
import EventRefEditor from './EventRefEditor'
import RoleCriterion from './RoleCriterion'
import FieldCriterion from './FieldCriterion'
import TaskUpdates from './TaskUpdates'
import WorkflowUpdates from './WorkflowUpdates'
import UpdateFieldEditor from './UpdateFieldEditor'
import Section from './Section'
import { useApi } from '@/lib/api-context'

export default function ActionPanel({ action, onChange, onDelete, allStateIds }) {
  const { fieldAccessors, fieldOptions } = useApi()

  if (!action) return null

  const update = (key, value) => onChange({ ...action, [key]: value })

  const stateOptions = allStateIds.map((sid) => ({ value: sid, label: sid }))

  return (
    <div className="space-y-6">
      {/* Basic fields */}
      <FieldGrid columns={2}>
        <TextField
          label="Title"
          value={action.title || ''}
          onChange={(v) => update('title', v)}
          placeholder="e.g. Approve"
          required
        />
        <TextField
          label="Action ID"
          value={action.action_id || ''}
          onChange={(v) => update('action_id', v)}
          placeholder="e.g. approve"
          required
        />
      </FieldGrid>

      <FieldGrid columns={2}>
        <SelectField
          label="Next State"
          value={action.next_state_id || ''}
          onChange={(v) => update('next_state_id', v)}
          options={stateOptions}
          placeholder="Select target state..."
          required
          description="State to transition to when this action is executed"
        />
      </FieldGrid>

      {/* Visibility & Access */}
      <Section title="Visibility & Access">
        <div className="space-y-3">
          <FeatureToggle
            label="Primary Action"
            fieldName="is_primary_action"
            description="Highlight and show prominently to users"
            enabled={!!action.is_primary_action}
            onToggle={(v) => update('is_primary_action', v)}
          />
          <FeatureToggle
            label="Customer Action"
            fieldName="enable_customer_action"
            description="Allow customers to trigger through portal"
            enabled={!!action.enable_customer_action}
            onToggle={(v) => update('enable_customer_action', v)}
          />
          <FeatureToggle
            label="Show When Disabled"
            fieldName="enable_show_action_on_failed_condition"
            description="Show action in disabled state when conditions fail"
            enabled={!!action.enable_show_action_on_failed_condition}
            onToggle={(v) => update('enable_show_action_on_failed_condition', v)}
          >
            <TextField
              label="Error Message"
              value={action.error_message || ''}
              onChange={(v) => update('error_message', v)}
              placeholder="Action cannot be performed"
              description="Shown when conditions fail"
            />
          </FeatureToggle>
        </div>
      </Section>

      {/* Validation & Conditions */}
      <Section title="Validation & Conditions">
        <div className="space-y-3">
          <FeatureToggle
            label="Role Restriction"
            fieldName="enable_role_criterion"
            description="Restrict this action to specific user roles"
            enabled={!!action.enable_role_criterion}
            onToggle={(v) => update('enable_role_criterion', v)}
          >
            <RoleCriterion
              roles={action.roles_criterion || []}
              onChange={(roles) => update('roles_criterion', roles)}
            />
          </FeatureToggle>
          <FeatureToggle
            label="Field Conditions"
            fieldName="enable_field_criterion"
            description="Show only when specific field conditions are met"
            enabled={!!action.enable_field_criterion}
            onToggle={(v) => update('enable_field_criterion', v)}
          >
            <FieldCriterion
              criteria={action.field_criterion || []}
              onChange={(fc) => update('field_criterion', fc)}
            />
          </FeatureToggle>
          <FeatureToggle
            label="Custom Code Check"
            fieldName="enable_code_check"
            description="Execute custom validation before allowing action"
            enabled={!!action.enable_code_check}
            onToggle={(v) => update('enable_code_check', v)}
          >
            <div className="space-y-3">
              <TextAreaField
                value={action.check_code}
                onChange={(v) => update('check_code', v)}
                placeholder="// Return true to allow, false to block"
                inputClassName="px-3 py-2.5 font-mono h-36 bg-white resize-y"
              />
              <TextField
                label="Error Message"
                value={action.error_message || ''}
                onChange={(v) => update('error_message', v)}
                placeholder="Action cannot be performed"
                description="Shown when the code check fails"
              />
            </div>
          </FeatureToggle>
          <FeatureToggle
            label="All Tasks Must Complete"
            fieldName="enable_all_task_completed_check"
            description="Require all tasks to be completed first"
            enabled={!!action.enable_all_task_completed_check}
            onToggle={(v) => update('enable_all_task_completed_check', v)}
          />
          <FeatureToggle
            label="Required Fields"
            fieldName="enable_required_fields"
            description="Fields that must be filled before execution"
            enabled={!!action.enable_required_fields}
            onToggle={(v) => update('enable_required_fields', v)}
          >
            <MultiSelectField
              value={action.required_fields || []}
              onChange={(vals) => update('required_fields', vals)}
              options={fieldOptions}
              placeholder="Required Fields"
            />
          </FeatureToggle>
          <FeatureToggle
            label="Confirm Fields"
            fieldName="enable_confirm_fields"
            description="Confirm fields before task completion"
            enabled={!!action.enable_confirm_fields}
            onToggle={(v) => update('enable_confirm_fields', v)}
          >
            <MultiSelectField
              value={action.confirm_fields || []}
              onChange={(vals) => update('confirm_fields', vals)}
              options={fieldOptions}
              placeholder="Confirm Fields"
            />
          </FeatureToggle>
        </div>
      </Section>

      {/* Confirmation */}
      <Section title="Confirmation">
        <div className="space-y-3">
          <FeatureToggle
            label="User Confirmation"
            fieldName="enable_confirmation"
            description="Require user confirmation before executing"
            enabled={!!action.enable_confirmation}
            onToggle={(v) => update('enable_confirmation', v)}
          >
            <div className="space-y-4">
              <TextField
                label="Confirmation Message"
                value={action.confirmation_message || ''}
                onChange={(v) => update('confirmation_message', v)}
                placeholder="Are you sure you want to proceed?"
              />
              <FieldGrid columns={2}>
                <SwitchField
                  label="Require Reason"
                  description="User must provide a reason when confirming"
                  checked={!!action.enable_confirmation_reason}
                  onChange={(v) => update('enable_confirmation_reason', v)}
                />
                <SwitchField
                  label="Validate Choice Selection"
                  description="Validate user selection before proceeding"
                  checked={!!action.confirmation_choice_validation}
                  onChange={(v) => update('confirmation_choice_validation', v)}
                />
              </FieldGrid>
              {action.enable_confirmation_reason && (
                <FieldGrid columns={2}>
                  <TextField
                    label="Reason Accessor"
                    value={action.confirmation_reason_accessor || ''}
                    onChange={(v) => update('confirmation_reason_accessor', v)}
                    placeholder="e.g. rejection_reason"
                  />
                </FieldGrid>
              )}
              <ChipInput
                label="Confirmation Choices"
                value={action.confirmation_choices || []}
                onChange={(vals) => update('confirmation_choices', vals)}
                placeholder="Type choice and press Enter..."
                description="Multiple choice options for the confirmation dialog"
              />
              <FieldGrid columns={2}>
                <TextField
                  label="Choice Title"
                  value={action.confirmation_choice_title || ''}
                  onChange={(v) => update('confirmation_choice_title', v)}
                  placeholder="Select an option"
                />
                <TextField
                  label="Choice Accessor"
                  value={action.confirmation_choice_accessor || ''}
                  onChange={(v) => update('confirmation_choice_accessor', v)}
                  placeholder="e.g. selected_choice"
                />
              </FieldGrid>
            </div>
          </FeatureToggle>
        </div>
      </Section>

      {/* Execution Effects */}
      <Section title="Execution Effects">
        <div className="space-y-3">
          <FeatureToggle
            label="Events & Notifications"
            fieldName="enable_events"
            description="Trigger emails, notifications, webhooks on execution"
            enabled={!!action.enable_events}
            onToggle={(v) => update('enable_events', v)}
          >
            <div className="space-y-4">
              <SwitchField
                label="Email Confirmation"
                description="Send confirmation email after action is executed"
                checked={!!action.enable_email_confirmation}
                onChange={(v) => update('enable_email_confirmation', v)}
              />
              <EventEditor events={action.events || []} onChange={(events) => update('events', events)} />
              <div className="border-t border-gray-100 pt-4">
                <EventRefEditor
                  eventRefs={action.event_refs || []}
                  onChange={(refs) => update('event_refs', refs)}
                />
              </div>
            </div>
          </FeatureToggle>
          <FeatureToggle
            label="Task Updates"
            fieldName="enable_tasks_update"
            description="Automatically update task statuses on execution"
            enabled={!!action.enable_tasks_update}
            onToggle={(v) => update('enable_tasks_update', v)}
          >
            <div className="space-y-4">
              <ChipInput
                label="Tasks to Complete"
                value={action.tasks_to_complete || []}
                onChange={(vals) => update('tasks_to_complete', vals)}
                placeholder="Add task ID..."
              />
              <ChipInput
                label="Tasks to Open"
                value={action.tasks_to_open || []}
                onChange={(vals) => update('tasks_to_open', vals)}
                placeholder="Add task ID..."
              />
              <TaskUpdates
                updates={action.task_updates || []}
                onChange={(tu) => update('task_updates', tu)}
              />
            </div>
          </FeatureToggle>
          <FeatureToggle
            label="Input Fields"
            fieldName="enable_update_fields"
            description="Show custom input fields when action is triggered"
            enabled={!!action.enable_update_fields}
            onToggle={(v) => update('enable_update_fields', v)}
          >
            <UpdateFieldEditor
              fields={action.update_fields || []}
              onChange={(fields) => update('update_fields', fields)}
            />
          </FeatureToggle>
          <FeatureToggle
            label="Workflow Updates"
            fieldName="enable_workflow_update"
            description="Trigger workflow changes in related documents"
            enabled={!!action.enable_workflow_update}
            onToggle={(v) => update('enable_workflow_update', v)}
          >
            <WorkflowUpdates
              updates={action.workflow_updates || []}
              onChange={(wu) => update('workflow_updates', wu)}
            />
          </FeatureToggle>
          <FeatureToggle
            label="Data Patch"
            fieldName="enable_data_patch"
            description="Apply JSON data patch when action is executed"
            enabled={!!action.enable_data_patch}
            onToggle={(v) => update('enable_data_patch', v)}
          >
            <TextAreaField
              value={typeof action.data_patch === 'string' ? action.data_patch : JSON.stringify(action.data_patch || {}, null, 2)}
              onChange={(v) => {
                try { update('data_patch', JSON.parse(v)) }
                catch { update('data_patch', v) }
              }}
              placeholder='{"field": "value"}'
              inputClassName="px-3 py-2.5 font-mono h-28 bg-white resize-y"
            />
          </FeatureToggle>
          <FeatureToggle
            label="External Action"
            fieldName="is_external_action"
            description="Execute external API or webhook on trigger"
            enabled={!!action.is_external_action}
            onToggle={(v) => update('is_external_action', v)}
          >
            <TextAreaField
              value={typeof action.external_action_meta === 'string' ? action.external_action_meta : JSON.stringify(action.external_action_meta || {}, null, 2)}
              onChange={(v) => {
                try { update('external_action_meta', JSON.parse(v)) }
                catch { update('external_action_meta', v) }
              }}
              placeholder='{"url": "", "method": "POST"}'
              inputClassName="px-3 py-2.5 font-mono h-28 bg-white resize-y"
            />
          </FeatureToggle>
          <FeatureToggle
            label="Remark Field"
            fieldName="enable_remark_field"
            description="Prompt for remarks when action is performed"
            enabled={!!action.enable_remark_field}
            onToggle={(v) => update('enable_remark_field', v)}
          />
        </div>
      </Section>

      {/* Attachment Accessors */}
      <Section title="Attachment Accessors" description="Fields containing attachments to include">
        <MultiSelectField
          value={action.attachment_accessors || []}
          onChange={(vals) => update('attachment_accessors', vals)}
          options={fieldOptions}
          placeholder="Attachment Accessors"
        />
      </Section>

      {/* Footer */}
      <div className="flex items-center gap-3 pt-2">
        <div className="flex-1" />
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
          Delete Action
        </Button>
      </div>
    </div>
  )
}
