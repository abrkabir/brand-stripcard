import { Field } from "@/components/ui/Field";
import { cn } from "@/lib/cn";

/**
 * Multi-line input. Resizes vertically only.
 *
 * Takes `Field`'s props (label, hint, error, required) plus `textareaClassName`
 * for the control itself — `className` styles the field around it.
 */
export function Textarea({
  label,
  hint,
  error,
  required,
  className,
  textareaClassName,
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
      <textarea
        {...rest}
        required={required}
        aria-invalid={error ? true : undefined}
        className={cn("textarea", textareaClassName)}
      />
    </Field>
  );
}
