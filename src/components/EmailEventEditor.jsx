import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronRight } from 'lucide-react'
import TagInput from './TagInput'
import { TextField, TextAreaField, CheckboxField } from './form-fields'

const EMAIL_CHECKBOXES = [
  { key: 'self_cc_copy', label: 'Self CC' },
  { key: 'self_bcc_copy', label: 'Self BCC' },
  { key: 'enable_customer_link', label: 'Customer Link' },
  { key: 'enable_vendor_link', label: 'Vendor Link' },
  { key: 'enable_action_link', label: 'Action Link' },
  { key: 'enable_pre_code', label: 'Pre Code' },
  { key: 'is_ejs', label: 'Is EJS' },
  { key: 'enable_static_file_attachment', label: 'Static File Attachment' },
  { key: 'unselected_ccs', label: 'Unselected CCs' },
  { key: 'unselected_bccs', label: 'Unselected BCCs' },
]

export default function EmailEventEditor({ email, onChange }) {
  const [showBody, setShowBody] = useState(false)
  const [openSections, setOpenSections] = useState({})

  const update = (key, value) => onChange({ ...email, [key]: value })

  const updateStaticFrom = (key, value) => {
    onChange({ ...email, static_from: { ...(email.static_from || {}), [key]: value } })
  }

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="space-y-3">
      {/* Subject */}
      <TextField
        label="Subject"
        value={email.subject}
        onChange={(v) => update('subject', v)}
        inputClassName="h-8"
      />

      {/* Body */}
      <TextAreaField
        label="Body (HTML)"
        value={email.body || ''}
        onChange={(v) => update('body', v)}
        inputClassName={`px-3 py-2 text-xs font-mono resize-y ${showBody ? 'h-48' : 'h-16'}`}
      />
      <button onClick={() => setShowBody(!showBody)} className="text-[10px] text-primary hover:underline cursor-pointer">
        {showBody ? 'Collapse Body' : 'Expand Body'}
      </button>

      {/* Delay */}
      <TextField
        label="Delay (minutes)"
        type="number"
        value={email.delay ?? ''}
        onChange={(v) => update('delay', v === '' ? undefined : Number(v))}
        placeholder="0"
        inputClassName="h-8"
        min={0}
      />

      {/* Checkboxes */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {EMAIL_CHECKBOXES.map(({ key, label }) => (
          <CheckboxField
            key={key}
            label={label}
            checked={!!email[key]}
            onChange={(c) => update(key, c)}
          />
        ))}
      </div>

      {/* Pre Code */}
      {email.enable_pre_code && (
        <TextAreaField
          label="Pre-processing Code (JavaScript)"
          value={email.code}
          onChange={(v) => update('code', v)}
          placeholder={"// Pre-processing code\n// Entry point: document"}
          inputClassName="px-3 py-2 text-xs font-mono h-28 resize-y"
        />
      )}

      {/* Action Link Meta */}
      {email.enable_action_link && (
        <div className="space-y-2 p-2 rounded-md border border-gray-200">
          <span className="text-xs font-semibold">Action Link Meta</span>
          <TagInput
            label="Action IDs"
            values={email.action_link_meta?.action_ids || []}
            onChange={(v) => onChange({ ...email, action_link_meta: { ...(email.action_link_meta || {}), action_ids: v } })}
            placeholder="action_id"
          />
          <TextField
            label="Report Name"
            value={email.action_link_meta?.action_report_name}
            onChange={(v) => onChange({ ...email, action_link_meta: { ...(email.action_link_meta || {}), action_report_name: v } })}
            inputClassName="h-8"
            placeholder="Report name"
          />
          <TextField
            label="User Filter"
            value={email.action_link_meta?.action_user_filter}
            onChange={(v) => onChange({ ...email, action_link_meta: { ...(email.action_link_meta || {}), action_user_filter: v } })}
            inputClassName="h-8"
            placeholder="User filter"
          />
          <TextField
            label="As User Type"
            value={email.action_link_meta?.as_user_type}
            onChange={(v) => onChange({ ...email, action_link_meta: { ...(email.action_link_meta || {}), as_user_type: v } })}
            inputClassName="h-8"
            placeholder="User type"
          />
        </div>
      )}

      {/* Customer Link */}
      {email.enable_customer_link && (
        <div className="space-y-2 p-2 rounded-md border border-gray-200">
          <span className="text-xs font-semibold">Customer Link</span>
          <TextField
            label="Customer Link"
            value={email.customer_link}
            onChange={(v) => update('customer_link', v)}
            inputClassName="h-8"
            placeholder="Customer link URL"
          />
          <TextField
            label="Customer Message"
            value={email.customer_message}
            onChange={(v) => update('customer_message', v)}
            inputClassName="h-8"
            placeholder="Message to customer"
          />
          <TextField
            label="Customer Person Accessor"
            value={email.customer_person_accessor}
            onChange={(v) => update('customer_person_accessor', v)}
            inputClassName="h-8"
            placeholder="Field accessor for customer person"
          />
        </div>
      )}

      {/* Recipients - collapsible */}
      <Collapsible open={openSections.recipients} onOpenChange={() => toggleSection('recipients')}>
        <CollapsibleTrigger className="flex items-center gap-1 text-xs font-medium text-gray-700 w-full cursor-pointer hover:text-gray-900">
          <ChevronRight className={`h-3 w-3 transition-transform ${openSections.recipients ? 'rotate-90' : ''}`} />
          Recipients
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <TagInput label="Static To" values={email.static_tos || []} onChange={(v) => update('static_tos', v)} placeholder="email@example.com" />
          <TagInput label="Reference To" values={email.reference_tos || []} onChange={(v) => update('reference_tos', v)} placeholder="field_accessor" />
          <TagInput label="Static CC" values={email.static_ccs || []} onChange={(v) => update('static_ccs', v)} placeholder="email@example.com" />
          <TagInput label="Reference CC" values={email.reference_ccs || []} onChange={(v) => update('reference_ccs', v)} placeholder="field_accessor" />
          <TagInput label="Static BCC" values={email.static_bccs || []} onChange={(v) => update('static_bccs', v)} placeholder="email@example.com" />
          <TagInput label="Reference BCC" values={email.reference_bccs || []} onChange={(v) => update('reference_bccs', v)} placeholder="field_accessor" />
          <TagInput label="Role To" values={email.role_tos || []} onChange={(v) => update('role_tos', v)} placeholder="role_name" />
        </CollapsibleContent>
      </Collapsible>

      {/* Static From - collapsible */}
      <Collapsible open={openSections.staticFrom} onOpenChange={() => toggleSection('staticFrom')}>
        <CollapsibleTrigger className="flex items-center gap-1 text-xs font-medium text-gray-700 w-full cursor-pointer hover:text-gray-900">
          <ChevronRight className={`h-3 w-3 transition-transform ${openSections.staticFrom ? 'rotate-90' : ''}`} />
          Static From
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <TextField
            label="Name"
            value={email.static_from?.name}
            onChange={(v) => updateStaticFrom('name', v)}
            inputClassName="h-8"
          />
          <TextField
            label="Email"
            value={email.static_from?.email}
            onChange={(v) => updateStaticFrom('email', v)}
            inputClassName="h-8"
          />
          <div className="flex gap-3">
            <CheckboxField
              label="Self Reply-To"
              checked={!!email.static_from?.self_reply_to}
              onChange={(c) => updateStaticFrom('self_reply_to', c)}
            />
            <CheckboxField
              label="Skip Sender Email"
              checked={!!email.static_from?.skip_sender_email}
              onChange={(c) => updateStaticFrom('skip_sender_email', c)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Attachments - collapsible */}
      <Collapsible open={openSections.attachments} onOpenChange={() => toggleSection('attachments')}>
        <CollapsibleTrigger className="flex items-center gap-1 text-xs font-medium text-gray-700 w-full cursor-pointer hover:text-gray-900">
          <ChevronRight className={`h-3 w-3 transition-transform ${openSections.attachments ? 'rotate-90' : ''}`} />
          Attachments
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <TagInput label="Report Attachments" values={email.report_attachments || []} onChange={(v) => update('report_attachments', v)} placeholder="report_name" />
          <TagInput label="File Attachments" values={email.file_attachments || []} onChange={(v) => update('file_attachments', v)} placeholder="file_path" />
          <TagInput label="Attachment Accessors" values={email.attachment_accessors || []} onChange={(v) => update('attachment_accessors', v)} placeholder="accessor_path" />
          <TagInput label="Documents Multi Language" values={email.documents_multi_language || []} onChange={(v) => update('documents_multi_language', v)} placeholder="language_code" />
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
