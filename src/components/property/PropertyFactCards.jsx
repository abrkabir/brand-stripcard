import { BathIcon, BedIcon, RulerIcon, getIcon } from "@/components/icons";

/**
 * Facts and features, in the right-hand column.
 *
 * Rows, not a grid of cards. Two cards across a 22rem column leaves about
 * 8rem of text width, which is not enough for "Semi-detached house" or even
 * "3,200 sqft" — they wrapped two and three lines deep and every card came out
 * a different height. A row gives the value the full width of the column and
 * puts every label on the same left edge.
 *
 * One border, not three. The panel is bordered, the rows are divided by a
 * hairline, and the icon tiles are a fill rather than a box — a card inside a
 * card inside a card is what made the boxed version read as busy.
 *
 * The three counts the listing carries at its top level — bedrooms, bathrooms,
 * floor area — are folded in ahead of the `facts` rows, so this is the one
 * place on the page those numbers appear. Printing them here and again in a
 * separate strip only invites the two to disagree.
 *
 * Icons come from the registry by name, the way `navigation.js` and
 * `whyChooseUs.js` reference theirs, which keeps the data file plain and
 * serialisable with no component imports in it.
 */
export function PropertyFactCards({ property }) {
  const rows = [
    { icon: BedIcon, label: "Bedrooms", value: property.beds },
    { icon: BathIcon, label: "Bathrooms", value: property.baths },
    { icon: RulerIcon, label: "Floor area", value: property.area },
    ...(property.facts ?? []).map((fact) => ({
      icon: getIcon(fact.icon),
      label: fact.label,
      value: fact.value,
    })),
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <h2 className="border-b border-line px-5 py-4 font-heading text-[13px] font-semibold tracking-[0.12em] text-headline uppercase">
        Facts and features
      </h2>

      {/* A description list, because that is what a label/value pair is —
          `dt`/`dd` gives a screen reader the pairing for free, where a table
          would imply rows and columns that are not there. */}
      <dl className="divide-y divide-line">
        {rows.map((row) => {
          const Icon = row.icon;

          return (
            <div key={row.label} className="flex items-center gap-3 px-5 py-3">
              {Icon && (
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-page text-brand">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
              )}

              <dt className="text-[13px] text-muted">{row.label}</dt>

              {/* `ml-auto` rather than a flex-1 label: the value takes the room
                  it needs and the label gives way, which is the right way round
                  when the value is the part being looked up. */}
              <dd className="ml-auto text-right font-heading text-[14px] leading-snug font-semibold text-headline">
                {row.value}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
