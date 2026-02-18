import { ChipInput } from './chip-input'

/**
 * TagInput — backward-compatible wrapper around ChipInput.
 * Maps the `values` prop to ChipInput's `value` prop.
 */
export default function TagInput({ label, values, onChange, placeholder, suggestions }) {
  return (
    <ChipInput
      label={label}
      value={values || []}
      onChange={onChange}
      placeholder={placeholder}
      suggestions={suggestions}
    />
  )
}
