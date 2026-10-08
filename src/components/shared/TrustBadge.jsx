import Image from "next/image";
import { StarIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/** Colours per surface: white on the banner photo, theme ink on the page. */
const TONES = {
  onDark: { stars: "text-white", label: "text-white/80", ring: "border-white" },
  onLight: { stars: "text-brand", label: "text-content", ring: "border-page" },
};

/**
 * Overlapping country flags beside a five-star line — the markets StripCard
 * serves. `countries` is a list of `{ code, name }`, each with a square flag
 * at /images/flags/{code}.svg. `tone` picks the colours for the surface it
 * sits on: `onDark` (the banner) or `onLight` (the page).
 *
 * `more` adds a brand bubble after the last flag counting the countries not
 * shown ("+32"). Leave `label` out to drop the stars and the line beside it.
 */
export function TrustBadge({ label, countries, more, tone = "onDark", className }) {
  const t = TONES[tone];

  return (
    <div className={cn("flex items-center gap-3.5", className)}>
      <ul aria-label="Countries we serve" className="flex -space-x-3">
        {countries.map((country) => (
          <li
            key={country.code}
            title={country.name}
            className={cn(
              "relative size-10 overflow-hidden rounded-full border-2 bg-white shadow-soft transition-transform duration-300 hover:z-10 hover:-translate-y-1 sm:size-12",
              t.ring,
            )}
          >
            <Image
              src={`/images/flags/${country.code}.svg`}
              alt={country.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </li>
        ))}
        {more > 0 && (
          <li
            className={cn(
              "relative grid size-10 place-items-center rounded-full border-2 bg-brand text-sm font-semibold text-white shadow-soft sm:size-12",
              t.ring,
            )}
          >
            <span aria-hidden="true">+{more}</span>
            <span className="sr-only">and {more} more countries</span>
          </li>
        )}
      </ul>

      {label && (
        <div>
          <div aria-hidden="true" className={cn("flex gap-0.5", t.stars)}>
            {Array.from({ length: 5 }, (_, i) => (
              <StarIcon key={i} className="size-4.5" />
            ))}
          </div>
          <p className={cn("mt-1 text-[15px] leading-snug whitespace-nowrap", t.label)}>
            {label}
          </p>
        </div>
      )}
    </div>
  );
}
