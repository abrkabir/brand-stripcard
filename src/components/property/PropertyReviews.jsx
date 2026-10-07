import { DetailSection } from "@/components/property/DetailSection";
import { StarRating } from "@/components/property/StarRating";

/**
 * Reviews and ratings.
 *
 * The summary on the left is the average and the count; the bars beside it are
 * the spread. The spread matters more than the average does — a 4.5 made of
 * fives and fours is a different listing from a 4.5 made of fives and ones, and
 * the average alone cannot tell you which you are reading.
 *
 * Both are computed from the reviews themselves in `summariseReviews`, so
 * nothing here can disagree with the list underneath it.
 */
export function PropertyReviews({ reviews, summary }) {
  if (!summary) return null;

  return (
    <DetailSection id="reviews" title="Reviews and ratings">
      <div className="grid gap-10 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-12 sm:p-8">
        <div className="text-center sm:text-left">
          <p className="font-heading text-[3rem] leading-none font-semibold text-headline">
            {summary.average.toFixed(1)}
          </p>

          <StarRating value={summary.average} size="lg" className="mt-3" />

          <p className="mt-2 text-[13px] text-muted">
            {summary.count} {summary.count === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* The distribution. `role="img"` with a label rather than a table: read
            out row by row it is noise, but as one summary it is useful. */}
        <ul
          role="img"
          aria-label={`Ratings spread: ${summary.distribution
            .filter((row) => row.count > 0)
            .map((row) => `${row.count} at ${row.stars} stars`)
            .join(", ")}`}
          className="space-y-2.5"
        >
          {summary.distribution.map((row) => (
            <li key={row.stars} className="flex items-center gap-3">
              <span className="w-3 shrink-0 text-right text-[13px] text-muted tabular-nums">
                {row.stars}
              </span>

              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                <span
                  className="block h-full rounded-full bg-gold"
                  style={{ width: `${row.share * 100}%` }}
                />
              </span>

              <span className="w-6 shrink-0 text-right text-[13px] text-subtle tabular-nums">
                {row.count}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="mt-8 space-y-8">
        {reviews.map((review) => (
          <li key={review.id} className="border-b border-line pb-8 last:border-0 last:pb-0">
            <article>
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                <div>
                  <h3 className="font-heading text-[15px] font-semibold text-headline">
                    {review.author}
                  </h3>
                  <p className="mt-0.5 text-[12px] text-muted">
                    {review.context}
                  </p>
                </div>

                <StarRating value={review.rating} />
              </div>

              <p className="mt-4 text-[15px] leading-[1.8] text-content">
                {review.body}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </DetailSection>
  );
}
