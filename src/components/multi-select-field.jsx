import { useState, useMemo } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * MultiSelectField — dropdown with checkboxes, search, and select-all.
 *
 * Props:
 *  - label:       field label text
 *  - description: helper text below the field
 *  - value:       array of selected values (accessor strings)
 *  - onChange:     called with updated array
 *  - options:     array of { value, label } — friendly display labels
 *  - placeholder: trigger placeholder text
 *  - disabled:    boolean
 */
export function MultiSelectField({
  label,
  description,
  value = [],
  onChange,
  options = [],
  placeholder = 'Select fields...',
  disabled = false,
  className,
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return options
    const q = search.toLowerCase()
    return options.filter(
      (opt) => opt.label.toLowerCase().includes(q) || opt.value.toLowerCase().includes(q)
    )
  }, [options, search])

  const allFilteredSelected = filtered.length > 0 && filtered.every((opt) => value.includes(opt.value))

  const toggleValue = (val) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val))
    } else {
      onChange([...value, val])
    }
  }

  const toggleAll = () => {
    if (allFilteredSelected) {
      // Deselect all filtered
      const filteredVals = new Set(filtered.map((o) => o.value))
      onChange(value.filter((v) => !filteredVals.has(v)))
    } else {
      // Select all filtered
      const existing = new Set(value)
      const toAdd = filtered.map((o) => o.value).filter((v) => !existing.has(v))
      onChange([...value, ...toAdd])
    }
  }

  const removeValue = (val) => {
    onChange(value.filter((v) => v !== val))
  }

  // Build a lookup for friendly labels
  const labelMap = useMemo(() => {
    const map = {}
    for (const opt of options) {
      map[opt.value] = opt.label
    }
    return map
  }, [options])

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && <span className="text-xs font-medium text-muted-foreground">{label}</span>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            type="button"
            className={cn(
              'flex items-center justify-between w-full h-9 px-3 rounded-md border border-input bg-white text-sm',
              'hover:bg-gray-50 transition-colors',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span className={cn('truncate', value.length === 0 && 'text-muted-foreground')}>
              {value.length === 0 ? placeholder : `${value.length} field${value.length !== 1 ? 's' : ''} selected`}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
          </button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0" sideOffset={4}>
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type to search..."
              className="h-8 text-sm"
              autoFocus
            />
          </div>

          {/* Select all */}
          <div
            className="flex items-center gap-2.5 px-3 py-2 border-b border-gray-100 bg-gray-50/50 hover:bg-gray-100/50 cursor-pointer transition-colors"
            onClick={toggleAll}
          >
            <Checkbox
              checked={allFilteredSelected}
              onCheckedChange={toggleAll}
              className="shrink-0"
            />
            <span className="text-sm text-muted-foreground">
              {allFilteredSelected ? 'Deselect all' : 'Select all'}
            </span>
          </div>

          {/* Options list */}
          <div className="max-h-56 overflow-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-sm text-muted-foreground text-center">No fields found</div>
            ) : (
              filtered.map((opt) => {
                const isChecked = value.includes(opt.value)
                return (
                  <div
                    key={opt.value}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors',
                      isChecked ? 'bg-primary/5' : 'hover:bg-gray-50'
                    )}
                    onClick={() => toggleValue(opt.value)}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleValue(opt.value)}
                      className="shrink-0"
                    />
                    <span className="text-sm truncate">{opt.label}</span>
                  </div>
                )
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {value.map((v) => (
            <Badge
              key={v}
              variant="secondary"
              className="gap-1 pr-1 text-xs font-normal bg-gray-100 text-foreground hover:bg-gray-200"
            >
              {labelMap[v] || v}
              <button
                type="button"
                onClick={() => removeValue(v)}
                className="ml-0.5 rounded-full hover:bg-gray-300 p-0.5 cursor-pointer transition-colors"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}
