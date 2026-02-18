import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { useApi } from '@/lib/api-context'
import { TextField, SelectField, FormField } from './form-fields'

const EMPTY_CRITERION = { accessor: '', operator: 'eq', value: '' }

const OPERATORS = [
  { value: 'eq', label: '= Equals' },
  { value: 'ne', label: '!= Not Equals' },
  { value: 'gt', label: '> Greater Than' },
  { value: 'gte', label: '>= Greater or Equal' },
  { value: 'lt', label: '< Less Than' },
  { value: 'lte', label: '<= Less or Equal' },
  { value: 'in', label: 'In' },
  { value: 'nin', label: 'Not In' },
  { value: 'exists', label: 'Exists' },
  { value: 'not_exists', label: 'Not Exists' },
  { value: 'contains', label: 'Contains' },
]

export default function FieldCriterion({ criteria, onChange }) {
  const { fieldMeta } = useApi()

  const fieldSuggestions = useMemo(() => {
    if (!fieldMeta?.meta?.sections) return []
    const accessors = []
    for (const section of fieldMeta.meta.sections) {
      for (const field of section.fields || []) {
        if (field.field_id) accessors.push(field.field_id)
      }
    }
    return accessors
  }, [fieldMeta])

  const update = (idx, updated) => {
    onChange(criteria.map((c, i) => (i === idx ? updated : c)))
  }

  const add = () => onChange([...criteria, { ...EMPTY_CRITERION }])
  const remove = (idx) => onChange(criteria.filter((_, i) => i !== idx))

  return (
    <div className="space-y-3">
      {criteria.length > 0 && (
        <div className="space-y-2">
          {criteria.map((c, idx) => (
            <div key={idx} className="group flex gap-3 items-end p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors">
              <div className="flex-1">
                <FormField label="Field Accessor">
                  <AccessorInput
                    value={c.accessor || c.field || ''}
                    onChange={(v) => update(idx, { ...c, accessor: v, field: v })}
                    suggestions={fieldSuggestions}
                  />
                </FormField>
              </div>
              <SelectField
                label="Operator"
                value={c.operator || 'eq'}
                onChange={(v) => update(idx, { ...c, operator: v })}
                options={OPERATORS}
                className="w-36"
              />
              <TextField
                label="Value"
                value={typeof c.value === 'object' ? JSON.stringify(c.value) : String(c.value ?? '')}
                onChange={(v) => update(idx, { ...c, value: v })}
                placeholder="value"
                className="flex-1"
              />
              <button
                onClick={() => remove(idx)}
                className="mb-0.5 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button variant="outline" size="sm" onClick={add} className="h-8 text-xs">
        <Plus className="h-3.5 w-3.5" />
        Add Condition
      </Button>
    </div>
  )
}

function AccessorInput({ value, onChange, suggestions }) {
  const [focused, setFocused] = useState(false)

  const filtered = useMemo(() => {
    if (!suggestions.length || !focused) return []
    if (!value) return suggestions.slice(0, 10)
    return suggestions
      .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 10)
  }, [suggestions, value, focused])

  return (
    <div className="relative">
      <TextField
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder="field_name"
        inputClassName="h-9 text-sm"
      />
      {filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-40 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer transition-colors"
              onMouseDown={(e) => {
                e.preventDefault()
                onChange(s)
                setFocused(false)
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
