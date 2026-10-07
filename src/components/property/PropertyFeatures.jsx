import { CheckIcon } from "@/components/icons";
import { DetailSection } from "@/components/property/DetailSection";

/**
 * The amenities list.
 *
 * Split from the facts, which are now icon cards in the right-hand column: the
 * facts are short label/value pairs and read well two across, this is a long
 * run of phrases and reads well three across in the wide column. One block
 * trying to do both did neither well.
 *
 * Everything listed is present — there is no "not included" state — so the tick
 * carries no information and is marked decorative.
 */
export function PropertyFeatures({ features }) {
  if (!features?.length) return null;

  return (
    <DetailSection id="features" title="Features and amenities">
      <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-[15px] text-content"
          >
            <CheckIcon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-success"
            />
            {feature}
          </li>
        ))}
      </ul>
    </DetailSection>
  );
}
