import { cn } from "@/lib/cn";

/**
 * Label, control and helper text in one column.
 *
 * A wrapping `<label>` rather than a `htmlFor`/`id` pair: the association is
 * automatic, callers never have to invent an id, and — because there is no
 * `useId` — the whole form kit stays usable from Server Components.
 *
 * Styling lives in `.field*` in styles/components.css.
 *
 * Props:
 *   label     rendered above the control; omit for a bare control
 *   hint      helper text below, hidden while `error` is set
 *   error     replaces `hint` and turns the control's border red
 *   required  appends the asterisk
 */
export function Field({
  label,
  hint,
  error,
  required,
  className,
  children,
}) {
  return (
    <label className={cn("field", className)}>
      {label && (
        <span className="field-label">
          {label}
          {required && (
            <span aria-hidden="true" className="text-danger">
              {" *"}
            </span>
          )}
        </span>
      )}

      {children}

      {error ? (
        <span className="field-error">{error}</span>
      ) : hint ? (
        <span className="field-hint">{hint}</span>
      ) : null}
    </label>
  );
}
