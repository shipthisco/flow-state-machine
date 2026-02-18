import { TextField, TextAreaField } from './form-fields'
import TagInput from './TagInput'

export default function NotificationEventEditor({ notification, onChange }) {
  const data = notification || {}
  const update = (key, value) => onChange({ ...data, [key]: value })

  return (
    <div className="space-y-3">
      <TextField
        label="Title"
        value={data.title}
        onChange={(v) => update('title', v)}
        placeholder="Notification title (use @@ for dynamic values)"
        inputClassName="h-7 text-xs"
      />
      <TextAreaField
        label="Message"
        value={data.message}
        onChange={(v) => update('message', v)}
        placeholder="Notification message (use @@ for dynamic values)"
        inputClassName="px-2 py-1 text-xs h-20 bg-transparent resize-y"
      />
      <TagInput
        label="Subscribers"
        values={data.subscribers || []}
        onChange={(vals) => update('subscribers', vals)}
        placeholder="Add subscriber..."
      />
    </div>
  )
}
