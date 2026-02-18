import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import { SelectField, TextField, TextAreaField, SwitchField } from './form-fields'
import { SheetArrayField } from './sheet-array-field'
import EmailEventEditor from './EmailEventEditor'
import WebhookEventEditor from './WebhookEventEditor'
import StatusUpdateEventEditor from './StatusUpdateEventEditor'
import NotificationEventEditor from './NotificationEventEditor'
import SftpUploadEventEditor from './SftpUploadEventEditor'
import CallbackEventEditor from './CallbackEventEditor'
import FieldCriterion from './FieldCriterion'
import RoleCriterion from './RoleCriterion'
import WorkflowUpdates from './WorkflowUpdates'
import TagInput from './TagInput'

const EMPTY_EVENTS = {
  email: {
    event_type: 'email',
    email_update_event: {
      body: '', subject: '', self_cc_copy: false, self_bcc_copy: false,
      static_tos: [], static_ccs: [], static_bccs: [],
      reference_tos: [], reference_ccs: [], reference_bccs: [], role_tos: [],
      enable_customer_link: false, enable_vendor_link: false, enable_action_link: false,
      enable_pre_code: false, static_from: { email: '', self_reply_to: false },
      enable_static_file_attachment: false, report_attachments: [],
    },
    user_references: [], enable_advanced_criterion: false,
  },
  field_update: {
    event_type: 'field_update',
    field_update_event: {},
    enable_advanced_criterion: false,
  },
  status_update: {
    event_type: 'status_update',
    status_update_event: {
      title: '', content: '', enable_push_notification: false, is_private_note: false,
    },
    enable_advanced_criterion: false,
  },
  webhook: {
    event_type: 'webhook',
    webhook_event: {
      enabled: true, webhook_url: '', webhook_method: 'POST', delay: 0,
      has_headers: false, headers: {}, expand_fields: [],
      process_response: false, enable_pre_process_code: false,
      hide_webhook_audit_log: false,
    },
    enable_advanced_criterion: false,
  },
  callback: {
    event_type: 'callback',
    callback_event: {},
    enable_advanced_criterion: false,
  },
  notification: {
    event_type: 'notification',
    notification: { title: '', message: '', subscribers: [] },
    enable_advanced_criterion: false,
  },
  sftp_upload: {
    event_type: 'sftp_upload',
    sftp_upload_event: {
      host: '', port: 22, timeout: 30, username: '', password: '',
      directory: '', data_format: 'json', data_accessor: '', delay: 0,
      target_subdirectory: '', target_filename: '', expand_fields: [],
      retry_on_failure: false, enable_pre_process_code: false,
    },
    enable_advanced_criterion: false,
  },
}

const EVENT_TYPES = [
  { value: 'email', label: 'Email' },
  { value: 'field_update', label: 'Field Update' },
  { value: 'status_update', label: 'Status Update' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'callback', label: 'Callback' },
  { value: 'notification', label: 'Notification' },
  { value: 'sftp_upload', label: 'SFTP Upload' },
]

const EVENT_TYPE_COLORS = {
  email: 'bg-blue-50 text-blue-700 border-blue-200',
  field_update: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  status_update: 'bg-amber-50 text-amber-700 border-amber-200',
  webhook: 'bg-violet-50 text-violet-700 border-violet-200',
  callback: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  notification: 'bg-pink-50 text-pink-700 border-pink-200',
  sftp_upload: 'bg-orange-50 text-orange-700 border-orange-200',
}

function getEventLabel(event) {
  const type = EVENT_TYPES.find((t) => t.value === event.event_type)
  return type ? type.label : 'Event'
}

function getEventDescription(event) {
  if (event.event_type === 'email') return event.email_update_event?.subject || ''
  if (event.event_type === 'status_update') return event.status_update_event?.title || ''
  if (event.event_type === 'webhook') return event.webhook_event?.webhook_url || ''
  if (event.event_type === 'notification') return event.notification?.title || ''
  return ''
}

function getEventBadges(event) {
  const badges = []
  const colorClass = EVENT_TYPE_COLORS[event.event_type] || ''
  badges.push({ label: event.event_type || 'email', variant: 'outline', className: colorClass })
  return badges
}

export default function EventEditor({ events, onChange }) {
  return (
    <SheetArrayField
      label="Events"
      items={events}
      onChange={onChange}
      maxItems={0}
      createNew={() => ({})}
      getItemLabel={(event, index) => getEventLabel(event)}
      getItemDescription={(event) => getEventDescription(event)}
      getItemBadges={(event) => getEventBadges(event)}
      sheetTitle={(event, index) => `Edit ${getEventLabel(event)}`}
      renderEditor={(event, index, onItemChange) => (
        <EventDetailEditor event={event} onChange={onItemChange} />
      )}
    />
  )
}

function EventDetailEditor({ event, onChange }) {
  return (
    <div className="space-y-4">
      {/* Event Type */}
      <SelectField
        label="Event Type"
        value={event.event_type || 'email'}
        onChange={(v) => onChange({ ...event, event_type: v })}
        options={EVENT_TYPES}
        placeholder="Select..."
      />

      {/* Type-specific editors */}
      {event.event_type === 'email' && (
        <EmailEventEditor
          email={event.email_update_event || {}}
          onChange={(emailData) => onChange({ ...event, email_update_event: emailData })}
        />
      )}

      {event.event_type === 'webhook' && (
        <WebhookEventEditor
          webhook={event.webhook_event || {}}
          onChange={(data) => onChange({ ...event, webhook_event: data })}
        />
      )}

      {event.event_type === 'status_update' && (
        <StatusUpdateEventEditor
          statusUpdate={event.status_update_event || {}}
          onChange={(data) => onChange({ ...event, status_update_event: data })}
        />
      )}

      {event.event_type === 'notification' && (
        <NotificationEventEditor
          notification={event.notification || {}}
          onChange={(data) => onChange({ ...event, notification: data })}
        />
      )}

      {event.event_type === 'sftp_upload' && (
        <SftpUploadEventEditor
          sftpUpload={event.sftp_upload_event || {}}
          onChange={(data) => onChange({ ...event, sftp_upload_event: data })}
        />
      )}

      {event.event_type === 'callback' && (
        <CallbackEventEditor
          callbackEvent={event.callback_event || {}}
          onChange={(data) => onChange({ ...event, callback_event: data })}
        />
      )}

      {event.event_type === 'field_update' && (
        <TextAreaField
          label="Field Update Data (JSON)"
          value={JSON.stringify(event.field_update_event || {}, null, 2)}
          onChange={(v) => {
            try { onChange({ ...event, field_update_event: JSON.parse(v) }) } catch {}
          }}
          inputClassName="px-3 py-2.5 font-mono h-28 bg-white resize-y"
        />
      )}

      {/* References */}
      <TagInput
        label="User References"
        values={event.user_references || []}
        onChange={(v) => onChange({ ...event, user_references: v })}
        placeholder="user_reference"
      />
      <TagInput
        label="Document References"
        values={event.document_references || []}
        onChange={(v) => onChange({ ...event, document_references: v })}
        placeholder="document_reference"
      />

      <Separator />

      {/* Advanced Criterion */}
      <AdvancedCriterion
        event={event}
        onChange={onChange}
      />

      {/* Aggregate Data */}
      <Separator />
      <SwitchField
        label="Aggregate Data"
        description="Aggregate data before event execution"
        checked={!!event.enable_aggregate_data}
        onChange={(c) => onChange({ ...event, enable_aggregate_data: c })}
      />
      {event.enable_aggregate_data && (
        <TextAreaField
          label="Aggregate Config (JSON)"
          value={JSON.stringify(event.aggregate || {}, null, 2)}
          onChange={(v) => {
            try { onChange({ ...event, aggregate: JSON.parse(v) }) } catch {}
          }}
          inputClassName="px-3 py-2 font-mono h-20 bg-white resize-y"
        />
      )}

      {/* Workflow Update */}
      <Separator />
      <SwitchField
        label="Workflow Update"
        description="Trigger workflow state changes on event"
        checked={!!event.enable_workflow_update}
        onChange={(c) => onChange({ ...event, enable_workflow_update: c })}
      />
      {event.enable_workflow_update && (
        <WorkflowUpdates
          updates={event.workflow_updates || []}
          onChange={(wu) => onChange({ ...event, workflow_updates: wu })}
        />
      )}
    </div>
  )
}

function AdvancedCriterion({ event, onChange }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-3">
      <SwitchField
        label="Advanced Criterion"
        description="Configure role, field, and code-based conditions"
        checked={!!event.enable_advanced_criterion}
        onChange={(c) => {
          onChange({ ...event, enable_advanced_criterion: c })
          if (c) setOpen(true)
        }}
      />

      {event.enable_advanced_criterion && (
        <Collapsible open={open} onOpenChange={setOpen}>
          <div className="rounded-lg border border-gray-200">
            <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-2.5 text-left cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-xs font-semibold text-muted-foreground">Criterion Settings</span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 pt-1 space-y-4 border-t border-gray-100">
                {/* Role Criterion */}
                <SwitchField
                  label="Role Criterion"
                  description="Restrict by user roles"
                  checked={!!event.enable_role_criterion}
                  onChange={(c) => onChange({ ...event, enable_role_criterion: c })}
                />
                {event.enable_role_criterion && (
                  <RoleCriterion
                    roles={event.roles_criterion || []}
                    onChange={(roles) => onChange({ ...event, roles_criterion: roles })}
                  />
                )}

                {/* Branch Criterion */}
                <SwitchField
                  label="Branch Criterion"
                  description="Restrict by branch"
                  checked={!!event.enable_branch_criterion}
                  onChange={(c) => onChange({ ...event, enable_branch_criterion: c })}
                />
                {event.enable_branch_criterion && (
                  <TextField
                    label="Branch"
                    value={event.branch || ''}
                    onChange={(v) => onChange({ ...event, branch: v })}
                    placeholder="Branch identifier"
                    inputClassName="h-8"
                  />
                )}

                {/* Field Criterion */}
                <SwitchField
                  label="Field Criterion"
                  description="Restrict by field conditions"
                  checked={!!event.enable_field_criterion}
                  onChange={(c) => onChange({ ...event, enable_field_criterion: c })}
                />
                {event.enable_field_criterion && (
                  <FieldCriterion
                    criteria={event.field_criterion || []}
                    onChange={(fc) => onChange({ ...event, field_criterion: fc })}
                  />
                )}

                {/* Flagged Condition */}
                <SwitchField
                  label="Flagged Condition"
                  description="Restrict by flagged state"
                  checked={!!event.enable_flagged_condition}
                  onChange={(c) => onChange({ ...event, enable_flagged_condition: c })}
                />
                {event.enable_flagged_condition && (
                  <TextAreaField
                    label="Flags (JSON array)"
                    value={JSON.stringify(event.flags || [], null, 2)}
                    onChange={(v) => {
                      try { onChange({ ...event, flags: JSON.parse(v) }) } catch {}
                    }}
                    inputClassName="px-3 py-2 font-mono h-20 bg-white resize-y"
                    placeholder='["flag_1", "flag_2"]'
                  />
                )}

                {/* Only User Type */}
                <SwitchField
                  label="Only User Type"
                  description="Restrict to specific user types"
                  checked={!!event.enable_only_user_type}
                  onChange={(c) => onChange({ ...event, enable_only_user_type: c })}
                />
                {event.enable_only_user_type && (
                  <TextField
                    label="User Type"
                    value={event.only_user_type || ''}
                    onChange={(v) => onChange({ ...event, only_user_type: v })}
                    placeholder="User type"
                    inputClassName="h-8"
                  />
                )}

                {/* On Field Change */}
                <SwitchField
                  label="On Field Change"
                  description="Trigger only on specific field changes"
                  checked={!!event.enable_on_field_change}
                  onChange={(c) => onChange({ ...event, enable_on_field_change: c })}
                />
                {event.enable_on_field_change && (
                  <TextAreaField
                    label="Field Change Trigger Fields (JSON array)"
                    value={JSON.stringify(event.field_change_trigger_fields || [], null, 2)}
                    onChange={(v) => {
                      try { onChange({ ...event, field_change_trigger_fields: JSON.parse(v) }) } catch {}
                    }}
                    inputClassName="px-3 py-2 font-mono h-20 bg-white resize-y"
                    placeholder='["field_1", "field_2"]'
                  />
                )}

                <Separator />

                {/* Code Condition */}
                <SwitchField
                  label="Code Condition"
                  description="Custom code validation for event execution"
                  checked={!!event.enable_code_condition}
                  onChange={(c) => onChange({ ...event, enable_code_condition: c })}
                />
                {event.enable_code_condition && (
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">
                      Entry point: "document". Return true/false to control event execution.
                    </p>
                    <TextAreaField
                      value={event.code_condition || ''}
                      onChange={(v) => onChange({ ...event, code_condition: v })}
                      placeholder={"if (document && document['sample']) {\n  return true;\n} else {\n  return false;\n}"}
                      inputClassName="px-3 py-2.5 font-mono h-32 bg-white resize-y"
                    />
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      )}
    </div>
  )
}
