import { Field } from "@/components/ui/Field";
import { cn } from "@/lib/cn";

/**
 * A native `<select>`, restyled.
 *
 * Native on purpose: it gets the platform's own picker on mobile, full
 * keyboard support and search-by-typing for free. The chevron is drawn on the
 * wrapper with borders rather than an SVG background, so it takes a theme
 * token and needs no light/dark pair.
 *
 * Takes `Field`'s props plus:
 *   options          [{ label, value }]
 *   placeholder      prepends a disabled, empty-valued first option
 *   selectClassName  classes for the <select> itself
 */
export function Select({
  label,
  hint,
  error,
  required,
  className,
  options,
  placeholder,
  selectClassName,
  ...rest
}) {
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <span className="select-field">
        <select
          {...rest}
          required={required}
          aria-invalid={error ? true : undefined}
          className={cn("select", selectClassName)}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </span>
    </Field>
  );
}
