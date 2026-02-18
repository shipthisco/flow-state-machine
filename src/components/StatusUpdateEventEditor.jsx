import { TextField, TextAreaField, CheckboxField } from './form-fields'
import TagInput from './TagInput'

export default function StatusUpdateEventEditor({ statusUpdate, onChange }) {
  const data = statusUpdate || {}
  const update = (key, value) => onChange({ ...data, [key]: value })

  return (
    <div className="space-y-3">
      <TextField
        label="Title"
        value={data.title}
        onChange={(v) => update('title', v)}
        placeholder="Status update title (use @@ for dynamic values)"
        inputClassName="h-7 text-xs"
      />
      <TextAreaField
        label="Content"
        value={data.content}
        onChange={(v) => update('content', v)}
        placeholder="Status message content (use @@ for dynamic values)"
        inputClassName="px-2 py-1 text-xs h-20 bg-transparent resize-y"
      />
      <CheckboxField
        label="Enable Push Notification"
        checked={!!data.enable_push_notification}
        onChange={(c) => update('enable_push_notification', c)}
      />
      <CheckboxField
        label="Private Note (internal only)"
        checked={!!data.is_private_note}
        onChange={(c) => update('is_private_note', c)}
      />

      <TagInput
        label="Status Reference Tos"
        values={data.status_reference_tos || []}
        onChange={(vals) => update('status_reference_tos', vals)}
        placeholder="Add reference..."
      />

      {data.enable_push_notification && (
        <>
          <TagInput
            label="Status Role Tos"
            values={data.status_role_tos || []}
            onChange={(vals) => update('status_role_tos', vals)}
            placeholder="Add role..."
          />
          <TagInput
            label="Status Static Tos"
            values={data.status_static_tos || []}
            onChange={(vals) => update('status_static_tos', vals)}
            placeholder="Add static recipient..."
          />
        </>
      )}
    </div>
  )
}
