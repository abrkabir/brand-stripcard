import { cn } from "@/lib/cn";

/**
 * A real `<input type="checkbox">` with `appearance: none` and a CSS-drawn
 * tick — no icon font, no SVG, and `:checked` does the work, so it stays a
 * Server Component and keeps native keyboard and form behaviour.
 *
 * The label wraps the control, so no id is needed for the association.
 *
 * `className` styles the row; `inputClassName` targets the box itself.
 */
export function Checkbox({ label, className, inputClassName, ...rest }) {
  const control = (
    <input {...rest} type="checkbox" className={cn("checkbox", inputClassName)} />
  );

  if (!label) return control;

  return (
    <label className={cn("check-row", className)}>
      {control}
      <span>{label}</span>
    </label>
  );
}
