import { cn } from "@/lib/cn";

/**
 * Same body as `Checkbox` — round, with a dot instead of a tick. Group them by
 * giving every option in the set the same `name`.
 *
 * `className` styles the row; `inputClassName` targets the control itself.
 */
export function Radio({ label, className, inputClassName, ...rest }) {
  const control = (
    <input {...rest} type="radio" className={cn("radio", inputClassName)} />
  );

  if (!label) return control;

  return (
    <label className={cn("check-row", className)}>
      {control}
      <span>{label}</span>
    </label>
  );
}
