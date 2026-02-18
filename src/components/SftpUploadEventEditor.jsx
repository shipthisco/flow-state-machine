import { Separator } from '@/components/ui/separator'
import { TextField, TextAreaField, SelectField, CheckboxField } from './form-fields'
import TagInput from './TagInput'

const DATA_FORMATS = ['json', 'csv', 'xml', 'txt']

export default function SftpUploadEventEditor({ sftpUpload, onChange }) {
  const data = sftpUpload || {}
  const update = (key, value) => onChange({ ...data, [key]: value })

  return (
    <div className="space-y-3">
      {/* Connection */}
      <span className="text-[10px] font-semibold text-gray-600">Connection</span>
      <div className="grid grid-cols-2 gap-2">
        <TextField
          label="Host"
          value={data.host}
          onChange={(v) => update('host', v)}
          placeholder="sftp.example.com"
          inputClassName="h-7 text-xs"
          className="col-span-2"
        />
        <TextField
          label="Port"
          type="number"
          value={data.port}
          onChange={(v) => update('port', v ? Number(v) : '')}
          placeholder="22"
          inputClassName="h-7 text-xs"
        />
        <TextField
          label="Timeout (seconds)"
          type="number"
          value={data.timeout}
          onChange={(v) => update('timeout', v ? Number(v) : '')}
          placeholder="30"
          inputClassName="h-7 text-xs"
        />
        <TextField
          label="Username"
          value={data.username}
          onChange={(v) => update('username', v)}
          inputClassName="h-7 text-xs"
        />
        <TextField
          label="Password"
          type="password"
          value={data.password}
          onChange={(v) => update('password', v)}
          inputClassName="h-7 text-xs"
        />
        <TextField
          label="Directory"
          value={data.directory}
          onChange={(v) => update('directory', v)}
          placeholder="/incoming/orders"
          inputClassName="h-7 text-xs"
          className="col-span-2"
        />
      </div>

      <Separator />

      {/* File Configuration */}
      <span className="text-[10px] font-semibold text-gray-600">File Configuration</span>
      <div className="grid grid-cols-2 gap-2">
        <SelectField
          label="Data Format"
          value={data.data_format || 'json'}
          onChange={(v) => update('data_format', v)}
          options={DATA_FORMATS.map(f => ({ value: f, label: f.toUpperCase() }))}
          placeholder="Select format..."
        />
        <TextField
          label="Data Accessor"
          value={data.data_accessor}
          onChange={(v) => update('data_accessor', v)}
          placeholder="Leave empty for whole doc"
          inputClassName="h-7 text-xs"
        />
        <TextField
          label="Delay (seconds)"
          type="number"
          value={data.delay}
          onChange={(v) => update('delay', v ? Number(v) : '')}
          placeholder="0"
          inputClassName="h-7 text-xs"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <TextField
          label="Target Subdirectory"
          value={data.target_subdirectory}
          onChange={(v) => update('target_subdirectory', v)}
          placeholder="Use ##field## for dynamic values"
          inputClassName="h-7 text-xs"
        />
        <TextField
          label="Target Filename"
          value={data.target_filename}
          onChange={(v) => update('target_filename', v)}
          placeholder="Use ##field## for dynamic values"
          inputClassName="h-7 text-xs"
        />
      </div>

      <TagInput
        label="Expand Fields"
        values={data.expand_fields || []}
        onChange={(vals) => update('expand_fields', vals)}
        placeholder="Add field..."
      />

      <Separator />

      {/* Retry */}
      <CheckboxField
        label="Retry on Failure"
        checked={!!data.retry_on_failure}
        onChange={(c) => update('retry_on_failure', c)}
      />
      {data.retry_on_failure && (
        <TextField
          label="Max Retries"
          type="number"
          value={data.max_retries}
          onChange={(v) => update('max_retries', v ? Number(v) : '')}
          placeholder="3"
          inputClassName="h-7 text-xs w-24"
        />
      )}

      <Separator />

      {/* Pre-process */}
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
            Variable "data" contains the document. Transform data before upload.
          </p>
        </div>
      )}
    </div>
  )
}
