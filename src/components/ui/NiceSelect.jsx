"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * A styled dropdown with optional option search.
 *
 * `Select` in the kit is still the default and should stay that way — it is a
 * native `<select>`, which means the platform's own picker on a phone and
 * type-to-search for free. Use this one only where the panel has to be designed
 * or the list is long enough to need filtering, because it costs JavaScript and
 * gives both of those up.
 *
 * The value rides in a real hidden `<input name>`, which is what keeps this
 * usable inside a plain GET form: the form still submits without JavaScript,
 * carrying whatever the server rendered. Only *changing* the value needs the
 * client. Nothing about the form's markup or method changes.
 *
 * Accessibility follows the APG editable-combobox shape when `searchable`: the
 * search field is the combobox, it owns `aria-expanded`, `aria-controls` and
 * `aria-activedescendant`, and the options are `role="option"` inside a
 * `role="listbox"`. Options are never focused; the cursor is moved by
 * `aria-activedescendant` instead, so typing and arrowing do not fight.
 *
 * Two states, deliberately distinct: `data-active` is the keyboard cursor and
 * `aria-selected` is the chosen value. Conflating them means you cannot see
 * where you are while browsing away from what you picked.
 */
export function NiceSelect({
  name,
  label,
  options,
  defaultValue = "",
  placeholder = "Select",
  searchable = false,
  align = "start",
  className,
  buttonClassName,
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const buttonRef = useRef(null);
  const listId = `${useId()}-list`;

  const selected = options.find((option) => option.value === value);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(needle),
    );
  }, [options, query]);

  // Escape and outside-clicks both close it — the same pair the header and the
  // language switcher use, so every popup on the site behaves alike.
  useEffect(() => {
    if (!open) return;

    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // Moving focus into the search field is the one thing here that genuinely
  // belongs in an effect: it is an imperative call on the DOM after paint, not
  // state being derived.
  useEffect(() => {
    if (open && searchable) searchRef.current?.focus();
  }, [open, searchable]);

  /**
   * Opening resets the filter and puts the cursor on whatever is already
   * chosen rather than at the top of the list.
   *
   * Done here rather than in an effect keyed on `open`. Setting state inside an
   * effect body renders twice for every open — React's own guidance is to
   * handle what happens *because of an event* in the handler for that event.
   */
  const openPanel = () => {
    setQuery("");
    const at = options.findIndex((option) => option.value === value);
    setActive(at < 0 ? 0 : at);
    setOpen(true);
  };

  const choose = (option) => {
    setValue(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!open) {
        openPanel();
        return;
      }

      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((i) => {
        if (visible.length === 0) return 0;
        return (i + step + visible.length) % visible.length;
      });
      return;
    }

    if (event.key === "Enter" && open) {
      event.preventDefault();
      const option = visible[active];
      if (option) choose(option);
      return;
    }

    if (event.key === "Home" && open) {
      event.preventDefault();
      setActive(0);
      return;
    }

    if (event.key === "End" && open) {
      event.preventDefault();
      setActive(Math.max(0, visible.length - 1));
    }
  };

  const comboProps = {
    role: "combobox",
    "aria-expanded": open,
    "aria-controls": listId,
    "aria-activedescendant":
      open && visible[active] ? `${listId}-${active}` : undefined,
  };

  return (
    <div ref={rootRef} className={cn("nice-select", className)}>
      {/* The value the form actually submits. */}
      <input type="hidden" name={name} value={value} />

      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-label={`${label}: ${selected?.label ?? placeholder}`}
        onClick={() => (open ? setOpen(false) : openPanel())}
        onKeyDown={onKeyDown}
        className={cn("nice-select__button", buttonClassName)}
        // Without a search field this button is the combobox itself.
        {...(searchable ? { "aria-expanded": open, "aria-controls": listId } : comboProps)}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDownIcon aria-hidden="true" className="nice-select__chevron size-4" />
      </button>

      {open && (
        <div
          className={cn(
            "nice-select__panel",
            align === "end" && "nice-select__panel--end",
          )}
        >
          {searchable && (
            <div className="relative">
              <SearchIcon
                aria-hidden="true"
                className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle"
              />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder={`Search ${label.toLowerCase()}`}
                aria-label={`Search ${label}`}
                // Browsers autofill anything they recognise as a search box on
                // a page with other fields; this one filters a list.
                autoComplete="off"
                className="nice-select__search pl-10"
                {...comboProps}
              />
            </div>
          )}

          <ul id={listId} role="listbox" aria-label={label} className="nice-select__list">
            {visible.map((option, i) => (
              <li
                key={option.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={option.value === value}
                data-active={i === active}
                // `onMouseDown` rather than `onClick`: the outside-click handler
                // listens on `pointerdown`, which would otherwise close the
                // panel before the click ever lands.
                onMouseDown={(event) => {
                  event.preventDefault();
                  choose(option);
                }}
                onMouseEnter={() => setActive(i)}
                className="nice-select__option"
              >
                {option.label}
                {option.value === value && (
                  <CheckIcon aria-hidden="true" className="size-4 shrink-0" />
                )}
              </li>
            ))}

            {visible.length === 0 && (
              <li className="nice-select__empty">No matches</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
