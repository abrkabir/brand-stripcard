import { PlusIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * A grid of brand marks — two across on a phone, four from `md` — ruled top
 * and bottom (open at the sides), with a hairline between every cell,
 * alternate cells shaded, and a small plus where some of the lines cross.
 *
 * `logos` is a list of `{ title, path, color }`: an SVG path drawn in a
 * 24 × 24 box (the simple-icons format) and the brand's own colour. Marks rest
 * in the muted text colour, so they read as one calm set in either theme, and
 * take their brand colour on hover. A brand colour too dark to see on the
 * dark theme's black ground (Apple, Steam: pure black) turns to the headline
 * ink there instead. Keep it to eight: the shading and the
 * plus marks are placed for two rows of four (or four rows of two).
 *
 * `named` sets each brand's name beside its mark from `xl`, where the cells
 * are wide enough for it, as a full logo, and makes the cells shorter.
 * `tinted` gives the unshaded cells the faintest wash of the brand colour
 * instead of the page's own (`--cell`).
 *
 * Adapted from the "logo cloud" pattern for this codebase: the project's
 * tokens instead of shadcn's, its own icon set instead of lucide-react, and
 * the full-bleed rules left out so it can sit inside a column.
 */
export function LogoCloud({ logos, named, tinted, className, ...props }) {
  return (
    <div
      className={cn(
        "relative grid grid-cols-2 border-y border-line md:grid-cols-4",
        tinted
          ? "[--cell:color-mix(in_srgb,var(--color-brand)_3%,var(--color-page))] dark:[--cell:color-mix(in_srgb,var(--color-brand)_6%,var(--color-page))]"
          : "[--cell:var(--color-page)]",
        className,
      )}
      {...props}
    >
      {logos.slice(0, 8).map((logo, i) => (
        <LogoCard key={logo.title} logo={logo} named={named} className={CELLS[i]}>
          {PLUSES[i]}
        </LogoCard>
      ))}
    </div>
  );
}

/** A plus mark centred on a cell's corner. */
const plus = (corner, className) => (
  <PlusIcon
    aria-hidden="true"
    strokeWidth={1}
    className={cn("absolute z-10 size-6 text-subtle", corner, className)}
  />
);
const BOTTOM_RIGHT = "-right-[12.5px] -bottom-[12.5px]";
const BOTTOM_LEFT = "-bottom-[12.5px] -left-[12.5px]";

/** Borders and shading per cell, for the 2-up and 4-up layouts. */
const CELLS = [
  "border-r border-b bg-surface",
  "border-b md:border-r",
  "border-r border-b md:bg-surface",
  "border-b bg-surface md:bg-(--cell)",
  "border-r border-b bg-surface md:border-b-0 md:bg-(--cell)",
  "border-b md:border-r md:border-b-0 md:bg-surface",
  "border-r",
  "bg-surface",
];

const PLUSES = [
  plus(BOTTOM_RIGHT),
  null,
  <>
    {plus(BOTTOM_RIGHT)}
    {plus(BOTTOM_LEFT, "hidden md:block")}
  </>,
  null,
  plus(BOTTOM_RIGHT, "md:hidden"),
  null,
  null,
  null,
];

/** Relative luminance of a #rrggbb colour, 0 (black) to 1 (white). */
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function LogoCard({ logo, named, className, children }) {
  const tooDarkForDark = logo.color && luminance(logo.color) < 0.05;

  return (
    <div
      className={cn(
        "group relative flex items-center justify-center border-line bg-(--cell)",
        named ? "gap-2.5 px-3 py-4 lg:py-3.5" : "px-4 py-8 md:p-8",
        className,
      )}
      style={logo.color ? { "--logo": logo.color } : undefined}
    >
      <svg
        role="img"
        aria-label={logo.title}
        viewBox="0 0 24 24"
        className={cn(
          "pointer-events-none h-7 w-auto shrink-0 fill-muted transition-colors duration-300 select-none group-hover:fill-[var(--logo,var(--color-headline))]",
          named ? "lg:h-6" : "md:h-9",
          tooDarkForDark && "dark:group-hover:fill-headline",
        )}
      >
        <path d={logo.path} />
      </svg>
      {named && (
        <span
          aria-hidden="true"
          className="hidden truncate text-[15px] font-semibold tracking-[-0.01em] text-muted transition-colors duration-300 group-hover:text-headline xl:inline"
        >
          {logo.title}
        </span>
      )}
      {children}
    </div>
  );
}
