import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { HelpCircle, Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function FormField({ label, description, required, error, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <div className="flex items-center gap-1.5">
          <Label className={cn('text-sm font-medium text-gray-700', required && "after:content-['*'] after:text-red-500 after:ml-0.5")}>
            {label}
          </Label>
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 text-gray-400 cursor-help shrink-0" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  description,
  required,
  error,
  disabled,
  className,
  type,
  inputClassName,
  ...rest
}) {
  return (
    <FormField label={label} description={description} required={required} error={error} className={className}>
      <Input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn('h-9 text-sm', error && 'border-red-500', inputClassName)}
        {...rest}
      />
    </FormField>
  )
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  description,
  required,
  error,
  disabled,
  rows = 3,
  className,
  inputClassName,
  ...rest
}) {
  return (
    <FormField label={label} description={description} required={required} error={error} className={className}>
      <Textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={cn('text-sm', error && 'border-red-500', inputClassName)}
        {...rest}
      />
    </FormField>
  )
}

export function SwitchField({ label, checked, onChange, description, disabled, className }) {
  return (
    <div className={cn('flex items-start gap-3 py-1', className)}>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} className="mt-0.5 shrink-0" />
      <div className="space-y-0.5 min-w-0">
        <Label className="text-sm font-medium leading-none cursor-pointer" onClick={() => !disabled && onChange(!checked)}>
          {label}
        </Label>
        {description && <p className="text-xs text-muted-foreground leading-snug">{description}</p>}
      </div>
    </div>
  )
}

export function CheckboxField({ label, checked, onChange, description, disabled, className }) {
  return (
    <div className={cn('flex items-start gap-2.5', className)}>
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="mt-0.5"
      />
      <div className="space-y-0.5">
        <Label className="cursor-pointer text-sm">{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  description,
  required,
  error,
  disabled,
  className,
}) {
  return (
    <FormField label={label} description={description} required={required} error={error} className={className}>
      <Select value={value || ''} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={cn('h-9 text-sm', error && 'border-red-500')}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}

export function FeatureToggle({ label, fieldName, description, enabled, onToggle, children }) {
  return (
    <div className="rounded-lg border border-gray-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Switch checked={enabled} onCheckedChange={onToggle} className="shrink-0" />
          <div className="min-w-0">
            <Label
              className="text-sm font-medium leading-none cursor-pointer"
              onClick={() => onToggle(!enabled)}
            >
              {label}
            </Label>
            {description && (
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {fieldName && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-gray-400 cursor-help shrink-0 ml-2" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs font-mono">Field: {fieldName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {enabled && children && (
        <div className="px-4 pb-4 pt-3 border-t border-gray-100 bg-gray-50/30">
          {children}
        </div>
      )}
    </div>
  )
}

export function FieldGrid({ children, columns = 2, className }) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-x-6 gap-y-4', gridCols[columns], className)}>
      {children}
    </div>
  )
}
