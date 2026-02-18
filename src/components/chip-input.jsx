import { useState, useCallback, useMemo } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * ChipInput — for arrays of strings.
 * Press Enter or comma to add, Backspace to remove last.
 */
export function ChipInput({
  label,
  description,
  value = [],
  onChange,
  placeholder = 'Type and press Enter to add...',
  className,
  disabled = false,
  suggestions = [],
}) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const addChip = useCallback(
    (chip) => {
      const trimmed = chip.trim()
      if (trimmed && !value.includes(trimmed)) {
        onChange([...value, trimmed])
      }
      setInputValue('')
      setShowSuggestions(false)
    },
    [value, onChange]
  )

  const removeChip = useCallback(
    (index) => {
      const next = [...value]
      next.splice(index, 1)
      onChange(next)
    },
    [value, onChange]
  )

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault()
        addChip(inputValue)
      } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
        removeChip(value.length - 1)
      }
    },
    [inputValue, value.length, addChip, removeChip]
  )

  const handleBlur = useCallback(() => {
    if (inputValue.trim()) addChip(inputValue)
    setTimeout(() => setShowSuggestions(false), 150)
  }, [inputValue, addChip])

  const filtered = useMemo(
    () => suggestions.filter(
      (s) => !value.includes(s) && s.toLowerCase().includes(inputValue.toLowerCase())
    ),
    [suggestions, value, inputValue]
  )

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
      <div className="relative">
        <div
          className={cn(
            'flex flex-wrap gap-1.5 p-2 min-h-[38px] rounded-md border border-input bg-white',
            'focus-within:ring-1 focus-within:ring-ring',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {value.map((chip, index) => (
            <Badge
              key={`${chip}-${index}`}
              variant="secondary"
              className="gap-1 pr-1 text-xs font-normal bg-gray-100 text-foreground hover:bg-gray-200"
            >
              {chip}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeChip(index)}
                  className="ml-0.5 rounded-full hover:bg-gray-300 p-0.5 cursor-pointer transition-colors"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </Badge>
          ))}
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              if (suggestions.length) setShowSuggestions(true)
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={() => {
              if (suggestions.length) setShowSuggestions(true)
            }}
            placeholder={value.length === 0 ? placeholder : ''}
            disabled={disabled}
            className="flex-1 min-w-[120px] border-0 shadow-none rounded-none p-0 h-6 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Suggestions dropdown — flat list */}
        {showSuggestions && filtered.length > 0 && (
          <div className="absolute z-50 mt-1 w-full max-h-48 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {filtered.slice(0, 20).map((s) => (
              <button
                key={s}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault()
                  addChip(s)
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}
