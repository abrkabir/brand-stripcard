import { useId, useState } from "react";
import { CheckIcon, CloseIcon, EyeIcon, SearchIcon } from "@/components/icons";
import { Flag } from "@/components/shared/Flag";
import { Listbox } from "@/components/ui/Listbox";
import { profileCountries } from "@/data/dashboard";
import { cn } from "@/lib/cn";

/**
 * The fields the dashboard's settings pages share (the profile, identity
 * checks, two-factor sign-in), so a field looks and behaves the same on
 * every one of them.
 */

export const FIELD_LABEL = "block text-sm font-medium text-headline";

/** The box every field draws: soft grey at rest, white with a brand ring while it is being typed in. */
export const FIELD_BOX =
  "mt-1.5 flex h-11 items-center rounded-xl border border-line bg-canvas/60 transition-[border-color,background-color,box-shadow] hover:border-headline/25 focus-within:border-brand focus-within:bg-card focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-brand)_14%,transparent)]";

/** The red star after a required field's label. */
export function Required() {
  return (
    <span aria-hidden="true" className="ml-0.5 text-danger">
      *
    </span>
  );
}

/**
 * A labelled text field. `prefix` and `suffix` sit inside the box (a dialling
 * code, a show/hide toggle); `hint` or `error` sit under it, tied to the input
 * with `aria-describedby`, and an error rings the box in red.
 */
export function TextField({
  label,
  required,
  hint,
  error,
  prefix,
  suffix,
  className,
  inputClassName,
  ...rest
}) {
  const id = useId();
  const note = error || hint;

  return (
    <div className={className}>
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
        {required && <Required />}
      </label>
      <div
        className={cn(
          FIELD_BOX,
          error &&
            "border-danger hover:border-danger focus-within:border-danger",
          rest.readOnly && "bg-canvas hover:border-line",
        )}
      >
        {prefix}
        <input
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={note ? `${id}-note` : undefined}
          className={cn(
            "h-full min-w-0 flex-1 rounded-xl bg-transparent px-3.5 text-[0.9375rem] text-headline outline-none placeholder:text-subtle read-only:cursor-default read-only:text-muted",
            prefix && "pl-3",
            suffix && "pr-1",
            inputClassName,
          )}
          {...rest}
        />
        {suffix}
      </div>
      {note && (
        <p
          id={`${id}-note`}
          className={cn(
            "mt-1.5 text-xs",
            error ? "font-medium text-danger" : "text-muted",
          )}
        >
          {note}
        </p>
      )}
    </div>
  );
}

/**
 * A labelled multi-line field, drawn like the text fields, with a count of
 * the characters left under it when it has a `maxLength`.
 */
export function TextAreaField({
  label,
  required,
  hint,
  error,
  className,
  rows = 4,
  ...rest
}) {
  const id = useId();
  const left =
    rest.maxLength && typeof rest.value === "string"
      ? rest.maxLength - rest.value.length
      : null;
  const note = error || hint;

  return (
    <div className={className}>
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
        {required && <Required />}
      </label>
      <textarea
        id={id}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={note ? `${id}-note` : undefined}
        className={cn(
          "mt-1.5 block w-full resize-y rounded-xl border border-line bg-canvas/60 px-3.5 py-3 text-[0.9375rem] leading-relaxed text-headline transition-[border-color,background-color,box-shadow] outline-none placeholder:text-subtle hover:border-headline/25 focus:border-brand focus:bg-card focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-brand)_14%,transparent)]",
          error && "border-danger hover:border-danger focus:border-danger",
        )}
        {...rest}
      />
      {(note || left !== null) && (
        <p className="mt-1.5 flex justify-between gap-3 text-xs">
          <span
            id={`${id}-note`}
            className={error ? "font-medium text-danger" : "text-muted"}
          >
            {note}
          </span>
          {left !== null && (
            <span className="shrink-0 text-subtle tabular-nums">
              {left} left
            </span>
          )}
        </p>
      )}
    </div>
  );
}

/** A password field with a show/hide toggle. */
export function PasswordField(props) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      type={visible ? "text" : "password"}
      autoComplete="off"
      suffix={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="mr-1.5 grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-subtle transition-colors hover:bg-canvas hover:text-headline focus-visible:outline-2 focus-visible:outline-brand"
        >
          <EyeIcon off={visible} className="size-[17px]" />
        </button>
      }
      {...props}
    />
  );
}

/** The country with this code (the first one if there is none). */
export const countryOf = (code) =>
  profileCountries.find((c) => c.code === code) ?? profileCountries[0];

const SELECT_BUTTON =
  "mt-1.5 h-11 rounded-xl border border-line bg-canvas/60 pr-3.5 pl-3 transition-colors hover:border-headline/25 aria-expanded:border-brand aria-expanded:bg-card";

/**
 * A labelled select, drawn like the text fields. `options` are { value,
 * label }, shown by their label unless `renderValue` and `renderOption` say
 * otherwise (see Listbox).
 */
export function SelectField({ label, required, ...rest }) {
  return (
    <Listbox
      label={
        <>
          {label}
          {required && <Required />}
        </>
      }
      labelClassName={FIELD_LABEL}
      buttonClassName={SELECT_BUTTON}
      listClassName="w-full max-h-72"
      renderValue={(option) => (
        <span className="truncate text-[0.9375rem] text-headline">
          {option.label}
        </span>
      )}
      renderOption={(option) => (
        <span className="min-w-0 flex-1 truncate text-sm text-headline">
          {option.label}
        </span>
      )}
      {...rest}
    />
  );
}

const FLAG = "shrink-0 overflow-hidden rounded-full ring-1 ring-line";
const COUNTRIES = profileCountries.map((c) => ({
  ...c,
  value: c.code,
  label: c.name,
}));

/** A country select, each country with its flag; `dial` adds the dialling codes to the list. */
export function CountrySelect({ dial, ...rest }) {
  return (
    <SelectField
      options={COUNTRIES}
      renderValue={(c) => (
        <>
          <Flag code={c.code} className={cn("size-5", FLAG)} />
          <span className="truncate text-[0.9375rem] text-headline">
            {c.name}
          </span>
        </>
      )}
      renderOption={(c) => (
        <>
          <Flag code={c.code} className={cn("size-6", FLAG)} />
          <span className="min-w-0 flex-1 truncate text-sm text-headline">
            {c.name}
          </span>
          {dial && (
            <span className="text-xs text-muted tabular-nums">{c.dial}</span>
          )}
        </>
      )}
      {...rest}
    />
  );
}

/** A phone number field, with the `country`'s flag and dialling code inside it. */
export function PhoneField({ country, ...rest }) {
  const c = countryOf(country);
  return (
    <TextField
      type="tel"
      inputMode="tel"
      autoComplete="tel-national"
      prefix={
        <span className="flex h-full shrink-0 items-center gap-2 border-r border-line pr-3 pl-3">
          <Flag code={c.code} className={cn("size-5", FLAG)} />
          <span className="text-[0.9375rem] font-medium text-headline tabular-nums">
            {c.dial}
          </span>
        </span>
      }
      {...rest}
    />
  );
}

/**
 * A search box for a list, as a pill: a magnifier, the field, and a way to
 * clear it once something is typed. Its name (`label`) is for screen
 * readers; the placeholder says what it searches.
 */
export function SearchInput({
  label,
  value,
  onChange,
  placeholder,
  className,
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="flex h-10 items-center rounded-full border border-line bg-canvas/60 transition-[border-color,background-color,box-shadow] hover:border-headline/25 focus-within:border-brand focus-within:bg-card focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-brand)_14%,transparent)]">
        <SearchIcon
          aria-hidden="true"
          className="ml-3.5 size-[18px] shrink-0 text-muted"
        />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-[0.9375rem] text-headline outline-none placeholder:text-subtle [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={`Clear ${label.toLowerCase()}`}
            className="mr-1.5 grid size-7 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-headline focus-visible:outline-2 focus-visible:outline-brand"
          >
            <CloseIcon className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * A filter for a list, as a pill: a select whose options are { value,
 * label }, drawn like SearchInput beside it. `label` names it for screen
 * readers.
 */
export function FilterSelect({ label, value, onChange, options, className }) {
  return (
    <Listbox
      label={label}
      labelClassName="sr-only"
      value={value}
      onChange={onChange}
      options={options}
      align="right"
      className={className}
      buttonClassName="h-10 rounded-full border border-line bg-canvas/60 pr-3.5 pl-4 transition-colors hover:border-headline/25 aria-expanded:border-brand aria-expanded:bg-card"
      listClassName="w-full min-w-48"
      renderValue={(option) => (
        <span className="truncate text-[0.9375rem] text-headline">
          {option.label}
        </span>
      )}
      renderOption={(option) => (
        <span className="min-w-0 flex-1 truncate text-sm text-headline">
          {option.label}
        </span>
      )}
    />
  );
}

/** A short message that says how something went; read out when it changes. */
export function Status({ tone = "muted", className, children }) {
  return (
    <p
      role="status"
      className={cn(
        "flex items-center gap-1.5 text-sm",
        tone === "success"
          ? "font-medium text-success"
          : tone === "danger"
            ? "font-medium text-danger"
            : "text-muted",
        className,
      )}
    >
      {tone === "success" && (
        <CheckIcon aria-hidden="true" className="size-4 shrink-0" />
      )}
      {children}
    </p>
  );
}
