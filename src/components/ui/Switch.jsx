"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * On/off toggle. A real `<button role="switch">`, so it is reachable by Tab,
 * flips with Space or Enter, and announces its state — the label is bound to
 * it rather than drawn beside it.
 *
 * Uncontrolled by default (`defaultChecked`); pass `checked` and
 * `onCheckedChange` to control it. The track takes the brand colour when on;
 * `className` sizes or repositions the whole row.
 */
export function Switch({
  label,
  checked,
  defaultChecked = false,
  onCheckedChange,
  className,
  labelClassName,
}) {
  const id = useId();
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;

  const toggle = () => {
    if (checked === undefined) setInner(!on);
    onCheckedChange?.(!on);
  };

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        onClick={toggle}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300",
          on ? "bg-brand" : "bg-white/20",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "block size-5 rounded-full bg-white shadow-soft transition-transform duration-300",
            on ? "translate-x-[1.375rem]" : "translate-x-0.5",
          )}
        />
      </button>
      {label && (
        <label htmlFor={id} className={cn("cursor-pointer text-sm", labelClassName)}>
          {label}
        </label>
      )}
    </span>
  );
}
