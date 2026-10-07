import { Field } from "@/components/ui/Field";
import { cn } from "@/lib/cn";

/**
 * Text input with optional label, helper text and inline icons.
 *
 * Takes `Field`'s props (label, hint, error, required) plus:
 *   leading         icon inside the field, on the leading edge
 *   trailing        icon inside the field, on the trailing edge
 *   size            sm · md
 *   inputClassName  classes for the <input> itself; `className` styles the field
 *
 * `size` shadows the native HTML attribute on purpose — that one is a legacy
 * character-count nothing uses.
 */
export function Input({
  label,
  hint,
  error,
  required,
  className,
  leading,
  trailing,
  size = "md",
  inputClassName,
  ...rest
}) {
  const control = (
    <input
      {...rest}
      required={required}
      aria-invalid={error ? true : undefined}
      className={cn(
        "input",
        size === "sm" && "input--sm",
        Boolean(leading) && "input--leading",
        Boolean(trailing) && "input--trailing",
        inputClassName,
      )}
    />
  );

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      {leading || trailing ? (
        <span className="input-wrap">
          {leading && (
            <span className="input-wrap__icon input-wrap__icon--leading">
              {leading}
            </span>
          )}
          {control}
          {trailing && (
            <span className="input-wrap__icon input-wrap__icon--trailing">
              {trailing}
            </span>
          )}
        </span>
      ) : (
        control
      )}
    </Field>
  );
}
