"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { ChevronDownIcon, MapPinIcon, SearchIcon, getIcon } from "@/components/icons";
import {
  budgetOptions,
  intentTabs,
  propertyTypeOptions,
} from "@/data/search";
import { cn } from "@/lib/cn";

/**
 * The property search control. Lives in `components/property/` rather than
 * `components/home/` because the same panel is meant to sit on the results and
 * landing pages too — the banner is only its first caller.
 *
 * It navigates with query params (`/buy?location=…`), so a search is a real,
 * shareable URL and the results page can read it server-side from `searchParams`.
 */
export function SearchPanel({ className }) {
  const router = useRouter();
  const fieldId = useId();

  const [intent, setIntent] = useState("buy");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  // Switching tab invalidates the budget bands (sale prices vs monthly rent).
  const changeIntent = (next) => {
    setIntent(next);
    setBudget("");
  };

  const submit = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (type) params.set("type", type);

    if (budget) {
      const [min, max] = budget.split("-");
      if (min) params.set("min", min);
      if (max) params.set("max", max);
    }

    const query = params.toString();
    router.push(`/${intent}${query ? `?${query}` : ""}`);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Tabs sit on top of the panel and share its rounded corner. */}
      <div
        role="tablist"
        aria-label="What are you looking to do?"
        className="flex w-fit gap-1 rounded-t-2xl border border-b-0 border-line bg-elevated p-1.5"
      >
        {intentTabs.map((tab) => {
          const Icon = getIcon(tab.icon);
          const selected = intent === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => changeIntent(tab.value)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                selected
                  ? "bg-brand text-white shadow-soft"
                  : "text-muted hover:bg-surface hover:text-headline",
              )}
            >
              {Icon && <Icon className="size-4" />}
              {tab.label}
            </button>
          );
        })}
      </div>

      <form
        onSubmit={submit}
        className={cn(
          "rounded-2xl rounded-tl-none border border-line bg-elevated p-2",
          "shadow-lift",
          "flex flex-col gap-2 lg:flex-row lg:items-center",
        )}
      >
        {/* Location */}
        <div className="flex flex-1 items-center gap-3 px-3 py-2">
          <MapPinIcon className="size-5 shrink-0 text-brand" />
          <div className="min-w-0 flex-1">
            <label
              htmlFor={`${fieldId}-location`}
              className="block text-[11px] font-semibold tracking-[0.08em] text-subtle uppercase"
            >
              Location
            </label>
            <input
              id={`${fieldId}-location`}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Area, city or landmark"
              autoComplete="off"
              className="w-full bg-transparent text-sm text-headline outline-none placeholder:text-subtle"
            />
          </div>
        </div>

        <span className="hidden h-9 w-px bg-line lg:block" />

        {/* Property type */}
        <SelectField
          id={`${fieldId}-type`}
          label="Property type"
          value={type}
          onChange={setType}
          options={propertyTypeOptions}
        />

        <span className="hidden h-9 w-px bg-line lg:block" />

        {/* Budget — options depend on the selected tab. */}
        <SelectField
          id={`${fieldId}-budget`}
          label={intent === "rent" ? "Monthly rent" : "Budget"}
          value={budget}
          onChange={setBudget}
          options={budgetOptions[intent]}
        />

        <button
          type="submit"
          className={cn(
            "flex h-13 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-7",
            "text-sm font-semibold text-white shadow-soft transition-all duration-200",
            "hover:bg-brand-700 hover:shadow-lift active:scale-[0.98]",
            "dark:hover:bg-brand-400 dark:hover:text-brand-950",
          )}
        >
          <SearchIcon className="size-[18px]" />
          Search
        </button>
      </form>
    </div>
  );
}

/** Native <select> styled to match the panel — keyboard and mobile behaviour for free. */
function SelectField({ id, label, value, onChange, options }) {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col px-3 py-2 lg:max-w-52">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold tracking-[0.08em] text-subtle uppercase"
      >
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-sm text-headline outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-elevated">
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDownIcon className="pointer-events-none absolute right-3 bottom-3 size-4 text-muted" />
    </div>
  );
}
