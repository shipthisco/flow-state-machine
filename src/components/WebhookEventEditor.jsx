import { Separator } from '@/components/ui/separator'
import { TextField, TextAreaField, SelectField, CheckboxField } from './form-fields'
import TagInput from './TagInput'

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

export default function WebhookEventEditor({ webhook, onChange }) {
  const data = webhook || {}
  const update = (key, value) => onChange({ ...data, [key]: value })

  return (
    <div className="space-y-3">
      <CheckboxField
        label="Enabled"
        checked={!!data.enabled}
        onChange={(c) => update('enabled', c)}
      />

      <div className="grid grid-cols-2 gap-2">
        <TextField
          label="Webhook URL"
          value={data.webhook_url}
          onChange={(v) => update('webhook_url', v)}
          placeholder="https://api.example.com/webhook"
          inputClassName="h-7 text-xs"
          className="col-span-2"
        />
        <SelectField
          label="Method"
          value={data.webhook_method || 'POST'}
          onChange={(v) => update('webhook_method', v)}
          options={HTTP_METHODS.map(m => ({ value: m, label: m }))}
          placeholder="Select method..."
        />
        <TextField
          label="Delay (minutes)"
          type="number"
          value={data.delay}
          onChange={(v) => update('delay', v ? Number(v) : '')}
          placeholder="0"
          inputClassName="h-7 text-xs"
        />
      </div>

      <CheckboxField
        label="Hide Webhook Audit Log"
        checked={!!data.hide_webhook_audit_log}
        onChange={(c) => update('hide_webhook_audit_log', c)}
      />

      <Separator />

      {/* Headers */}
      <CheckboxField
        label="Custom Headers"
        checked={!!data.has_headers}
        onChange={(c) => update('has_headers', c)}
      />
      {data.has_headers && (
        <TextAreaField
          label="Headers (JSON)"
          value={typeof data.headers === 'string' ? data.headers : JSON.stringify(data.headers || {}, null, 2)}
          onChange={(v) => {
            try { update('headers', JSON.parse(v)) } catch { update('headers', v) }
          }}
          placeholder='{"Authorization": "Bearer token"}'
          inputClassName="px-2 py-1 text-xs font-mono h-16 bg-transparent"
        />
      )}

      {/* Expand Fields */}
      <TagInput
        label="Expand Fields"
        values={data.expand_fields || []}
        onChange={(vals) => update('expand_fields', vals)}
        placeholder="Add field..."
      />

      <Separator />

      {/* Response Processing */}
      <CheckboxField
        label="Process Response"
        checked={!!data.process_response}
        onChange={(c) => update('process_response', c)}
      />
      {data.process_response && (
        <div className="space-y-2">
          <TextField
            label="Response Field"
            value={data.response_field}
            onChange={(v) => update('response_field', v)}
            placeholder="Field to store response"
            inputClassName="h-7 text-xs"
          />
          <CheckboxField
            label="Custom Response Processing Code"
            checked={!!data.enable_process_response_code}
            onChange={(c) => update('enable_process_response_code', c)}
          />
          {data.enable_process_response_code && (
            <div className="space-y-1">
              <TextAreaField
                label="Response Processing Code"
                value={data.process_response_code}
                onChange={(v) => update('process_response_code', v)}
                placeholder="// data['field'] = response.value"
                inputClassName="px-2 py-1 text-xs font-mono h-32 bg-transparent resize-y"
              />
              <p className="text-[9px] text-muted-foreground">
                Variable "data" contains the document. Write JS to process the webhook response.
              </p>
            </div>
          )}
          <CheckboxField
            label="Raise Error on Failure"
            checked={!!data.raise_error_on_failure}
            onChange={(c) => update('raise_error_on_failure', c)}
          />
          {data.raise_error_on_failure && (
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Error Key Accessor"
                value={data.error_key_accessor}
                onChange={(v) => update('error_key_accessor', v)}
                inputClassName="h-7 text-xs"
              />
              <TextField
                label="Error Value"
                value={data.error_value}
                onChange={(v) => update('error_value', v)}
                inputClassName="h-7 text-xs"
              />
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Pre-process Code */}
      <CheckboxField
        label="Pre-process Code"
        checked={!!data.enable_pre_process_code}
        onChange={(c) => update('enable_pre_process_code', c)}
      />
      {data.enable_pre_process_code && (
        <div className="space-y-1">
          <TextAreaField
            label="Pre-process Code"
            value={data.pre_process_code}
            onChange={(v) => update('pre_process_code', v)}
            placeholder="// data['customer_name'] = 'sample'"
            inputClassName="px-2 py-1 text-xs font-mono h-32 bg-transparent resize-y"
          />
          <p className="text-[9px] text-muted-foreground">
            Variable "data" contains the document. Modify data before sending webhook.
          </p>
        </div>
      )}
    </div>
  )
}
