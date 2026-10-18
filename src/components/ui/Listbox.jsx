"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * A select whose options can carry more than text: a logo, a line of detail,
 * a badge. A button shows the chosen option; it opens a list under it. (For
 * plain text options, the native `Select` is the better choice: it brings the
 * platform's own picker on phones.)
 *
 *   options       [{ value, label, ...anything renderOption needs }]; `label`
 *                 is the option's plain name, for type-ahead
 *   renderOption  (option) => what a row of the list shows
 *   renderValue   (option) => what the button shows (renderOption if not given)
 *   label         its name; `labelClassName` styles it ("sr-only" to hide it)
 *   align         "left" or "right": which edge of the button the list keeps to
 *
 * Works as a listbox: arrow keys, Home and End move through the list, Enter
 * or Space picks, a letter jumps to the next option starting with it, and
 * Escape closes it and hands focus back to the button. A click anywhere
 * outside closes it too.
 */
export function Listbox({
  value,
  onChange,
  options,
  renderOption,
  renderValue,
  label,
  labelClassName,
  align = "left",
  className,
  buttonClassName,
  listClassName,
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef(null);
  const button = useRef(null);
  const list = useRef(null);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const selected = options[selectedIndex];
  const optionId = (i) => `${id}-option-${i}`;

  const show = (at) => {
    setActive(at);
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
    button.current?.focus();
  };
  const choose = (i) => {
    onChange(options[i].value);
    hide();
  };

  // While open: the list takes focus, and a click outside closes it.
  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const onPointer = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, [open]);

  // The option being pointed at stays in view as the keys move through the list.
  useEffect(() => {
    if (open) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, id]);

  const onButtonKey = (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    show(selectedIndex);
  };

  const onListKey = (event) => {
    const last = options.length - 1;
    const moves = { ArrowDown: Math.min(active + 1, last), ArrowUp: Math.max(active - 1, 0), Home: 0, End: last };
    if (event.key in moves) {
      event.preventDefault();
      setActive(moves[event.key]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(active);
    } else if (event.key === "Escape") {
      event.preventDefault();
      hide();
    } else if (event.key === "Tab") {
      setOpen(false);
    } else if (event.key.length === 1 && /\S/.test(event.key)) {
      // Type-ahead: the next option, after this one, whose name starts with the letter.
      const letter = event.key.toLowerCase();
      const next = options
        .map((_, i) => (active + 1 + i) % options.length)
        .find((i) => options[i].label.toLowerCase().startsWith(letter));
      if (next !== undefined) setActive(next);
    }
  };

  const labelId = label ? `${id}-label` : undefined;

  return (
    <div ref={root} className={cn("relative", className)}>
      {label && (
        <span id={labelId} className={labelClassName}>
          {label}
        </span>
      )}
      <button
        ref={button}
        id={`${id}-button`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={labelId ? `${labelId} ${id}-button` : undefined}
        onClick={() => (open ? hide() : show(selectedIndex))}
        onKeyDown={onButtonKey}
        className={cn(
          "flex w-full cursor-pointer items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          buttonClassName,
        )}
      >
        {(renderValue ?? renderOption)(selected)}
        <ChevronDownIcon
          aria-hidden="true"
          className={cn("ml-auto size-4 shrink-0 text-muted transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          ref={list}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          aria-activedescendant={optionId(active)}
          onKeyDown={onListKey}
          className={cn(
            "absolute top-[calc(100%+0.5rem)] z-40 max-h-80 min-w-full overflow-y-auto rounded-2xl border border-line bg-card p-1.5 shadow-lift outline-none [scrollbar-width:thin] motion-safe:animate-pop-in",
            align === "right" ? "right-0" : "left-0",
            listClassName,
          )}
        >
          {options.map((option, i) => (
            <li
              key={option.value}
              id={optionId(i)}
              role="option"
              aria-selected={i === selectedIndex}
              onClick={() => choose(i)}
              onMouseMove={() => setActive(i)}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 transition-colors",
                i === active && "bg-canvas",
              )}
            >
              {renderOption(option)}
              <CheckIcon
                aria-hidden="true"
                className={cn("ml-auto size-4 shrink-0 text-brand", i !== selectedIndex && "invisible")}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
