import { TextAreaField } from './form-fields'

export default function CallbackEventEditor({ callbackEvent, onChange }) {
  const data = callbackEvent || {}

  return (
    <div className="space-y-3">
      <TextAreaField
        label="Callback Event Data (JSON)"
        value={typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
        onChange={(v) => {
          try { onChange(JSON.parse(v)) } catch { onChange(v) }
        }}
        placeholder='{"callback_id": "", "params": {}}'
        inputClassName="px-2 py-1 text-xs font-mono h-32 bg-transparent resize-y"
      />
    </div>
  )
}
