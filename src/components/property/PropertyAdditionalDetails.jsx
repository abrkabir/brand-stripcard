import { DetailSection } from "@/components/property/DetailSection";

/**
 * Additional details — the paperwork rather than the building. Listing id, when
 * it went up, when we last stood in it, tenure, charges.
 *
 * A description list again, but laid out as rows rather than a grid: these are
 * read down the page as a run of facts about the listing, and several of the
 * values are long enough that two narrow columns would wrap them badly.
 */
export function PropertyAdditionalDetails({ rows }) {
  if (!rows?.length) return null;

  return (
    <DetailSection id="details" title="Additional details">
      <dl className="overflow-hidden rounded-2xl border border-line">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-4 ${
              // Zebra striping off `bg-surface`, so the rows separate without a
              // rule between every one of them.
              i % 2 === 1 ? "bg-surface" : ""
            }`}
          >
            <dt className="text-[13px] text-muted">{row.label}</dt>
            <dd className="text-[15px] text-headline">{row.value}</dd>
          </div>
        ))}
      </dl>
    </DetailSection>
  );
}
