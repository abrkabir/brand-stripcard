"use client";

import { useState } from "react";
import { CheckIcon, StarIcon } from "@/components/icons";
import { DetailSection } from "@/components/property/DetailSection";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/cn";

const STARS = [1, 2, 3, 4, 5];

/**
 * Leave a review: a rating, the words, and the button. Nothing else — no name,
 * no email. Every field in front of someone is a reason not to bother, and a
 * signed-in visitor is already known.
 *
 * The star picker is a real radio group: `role="radiogroup"` with five
 * `role="radio"` buttons, arrow keys moving between them, and `aria-checked`
 * carrying the state. Five independent toggle buttons would each announce on
 * their own and give no sense that picking one unpicks the rest. Only the
 * selected star is a tab stop, which is how a radio group behaves — you tab in,
 * then arrow along.
 *
 * The value also sits in a real hidden input, so it posts with the rest of the
 * form once there is somewhere to post it.
 *
 * TODO: Backend — POST /api/properties/{id}/reviews. The thank-you below is
 * optimistic; surface a real error state once the endpoint exists.
 */
export function PropertyReviewForm({ property }) {
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setSent(true);
  };

  const onStarKeys = (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setRating((r) => Math.min(5, r + 1));
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setRating((r) => Math.max(1, r - 1));
    }
  };

  if (sent) {
    return (
      <DetailSection id="write-review" title="Leave a review">
        <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-6">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-white">
            <CheckIcon className="size-5" />
          </span>
          <p className="text-sm leading-relaxed text-content">
            <span className="font-medium text-headline">Thank you.</span> We read
            every review before it goes up, so yours will appear on this listing
            within a day or so.
          </p>
        </div>
      </DetailSection>
    );
  }

  return (
    <DetailSection id="write-review" title="Leave a review">
      <form
        onSubmit={submit}
        className="rounded-2xl border border-line bg-surface p-6"
      >
        <p className="text-[15px] leading-relaxed text-muted">
          Seen {property.title} in person? Tell the next person what you found.
        </p>

        {/* `field--eyebrow` has to sit on the wrapper, not on the label: the
            rule is `.field--eyebrow > .field-label`. Both classes on one
            element is why this heading did not match the others. */}
        <div className="field field--eyebrow mt-6">
          <span id="rating-label" className="field-label">
            Your rating
          </span>

          <div
            role="radiogroup"
            aria-labelledby="rating-label"
            onKeyDown={onStarKeys}
            className="flex items-center gap-1.5"
          >
            {STARS.map((star) => {
              const chosen = star <= rating;

              return (
                <button
                  key={star}
                  type="button"
                  role="radio"
                  aria-checked={star === rating}
                  aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                  tabIndex={star === rating || (rating === 0 && star === 1) ? 0 : -1}
                  onClick={() => setRating(star)}
                  className="rounded-sm p-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {/* No `fill` override. `StarIcon` is a solid icon — it sets
                      `fill="currentColor" stroke="none"` itself — so passing
                      `fill="none"` for an empty star left it with neither a
                      fill nor a stroke and drew nothing at all. An empty star
                      is a dim solid one, which is how a solid star set is
                      meant to be used. */}
                  <StarIcon
                    className={cn(
                      "size-7 transition-colors",
                      chosen ? "text-gold" : "text-muted hover:text-gold",
                    )}
                  />
                </button>
              );
            })}

            <span className="ml-2 text-[13px] text-muted">
              {rating > 0 ? `${rating} of 5` : "Pick a rating"}
            </span>
          </div>
        </div>

        {/* Carries the rating into the form submission. */}
        <input type="hidden" name="rating" value={rating} />

        <Textarea
          className="field--eyebrow mt-7"
          textareaClassName="textarea--line"
          label="Your review"
          name="body"
          rows={4}
          placeholder="What stood out when you saw it?"
          required
        />

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-sm text-[13px] leading-relaxed text-muted">
            Reviews are checked before they appear, and we publish the
            unflattering ones too.
          </p>

          <Button type="submit" disabled={rating === 0} className="shrink-0">
            Post review
          </Button>
        </div>
      </form>
    </DetailSection>
  );
}
