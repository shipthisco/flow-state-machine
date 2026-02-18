import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import { TextField, SelectField, TextAreaField } from './form-fields'

const FIELD_TYPES = [
  'text', 'number', 'boolean', 'date', 'drop_down', 'multi_select',
  'textarea', 'email', 'phone', 'url', 'color_picker',
]

const EMPTY_FIELD = {
  field_id: '',
  label: '',
  field_type: 'text',
  attributes: {},
  field_meta: {},
}

export default function UpdateFieldEditor({ fields, onChange }) {
  const [editIdx, setEditIdx] = useState(null)
  const [editField, setEditField] = useState(null)

  const add = () => {
    const newField = { ...EMPTY_FIELD, field_id: `field_${Date.now()}` }
    onChange([...fields, newField])
    setEditIdx(fields.length)
    setEditField(newField)
  }

  const save = () => {
    if (editIdx !== null && editField) {
      onChange(fields.map((f, i) => (i === editIdx ? editField : f)))
    }
    setEditIdx(null)
    setEditField(null)
  }

  const cancel = () => {
    setEditIdx(null)
    setEditField(null)
  }

  const remove = (idx) => {
    onChange(fields.filter((_, i) => i !== idx))
    if (editIdx === idx) {
      setEditIdx(null)
      setEditField(null)
    }
  }

  const startEdit = (idx) => {
    setEditIdx(idx)
    setEditField({ ...fields[idx] })
  }

  return (
    <div className="space-y-3">
      {fields.map((field, idx) => (
        <div key={idx}>
          {editIdx === idx ? (
            <div className="p-4 rounded-lg border border-gray-300 bg-gray-50/50 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Field ID"
                  value={editField.field_id}
                  onChange={(v) => setEditField({ ...editField, field_id: v })}
                  placeholder="field_name"
                />
                <TextField
                  label="Label"
                  value={editField.label}
                  onChange={(v) => setEditField({ ...editField, label: v })}
                  placeholder="Field Label"
                />
              </div>
              <SelectField
                label="Field Type"
                value={editField.field_type || 'text'}
                onChange={(v) => setEditField({ ...editField, field_type: v })}
                options={FIELD_TYPES.map(t => ({ value: t, label: t.replace(/_/g, ' ') }))}
              />
              {(editField.field_type === 'drop_down' || editField.field_type === 'multi_select') && (
                <TextAreaField
                  label="Choices (JSON array)"
                  value={JSON.stringify(editField.field_meta?.choices || [], null, 2)}
                  onChange={(v) => {
                    try {
                      setEditField({
                        ...editField,
                        field_meta: { ...editField.field_meta, choices: JSON.parse(v) },
                      })
                    } catch {}
                  }}
                  placeholder='[{"value": "opt1", "label": "Option 1"}]'
                  inputClassName="px-3 py-2 font-mono h-20 bg-white resize-y"
                />
              )}
              <TextAreaField
                label="Attributes (JSON)"
                value={JSON.stringify(editField.attributes || {}, null, 2)}
                onChange={(v) => {
                  try {
                    setEditField({ ...editField, attributes: JSON.parse(v) })
                  } catch {}
                }}
                placeholder='{}'
                inputClassName="px-3 py-2 font-mono h-16 bg-white resize-y"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={cancel} className="h-8 text-xs">
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </Button>
                <Button size="sm" onClick={save} className="h-8 text-xs">
                  <Check className="h-3.5 w-3.5" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="group flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{field.label || field.field_id || 'Untitled'}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-xs font-mono">
                    {field.field_type}
                  </span>
                  <span className="ml-2 font-mono">{field.field_id}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(idx)} className="p-1.5 rounded-md text-gray-400 hover:text-foreground hover:bg-gray-100 cursor-pointer transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => remove(idx)} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={add} className="h-8 text-xs">
        <Plus className="h-3.5 w-3.5" />
        Add Field
      </Button>
    </div>
  )
}
