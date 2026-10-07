import { StarIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

const STARS = [1, 2, 3, 4, 5];

/**
 * Five stars, filled up to `value`.
 *
 * Rounded to the nearest whole star rather than clipped to a fraction: a
 * half-filled glyph reads as a rendering fault at this size, and the exact
 * figure is always printed beside it anyway.
 *
 * The row is `aria-hidden` and the number is given as text instead, so a
 * screen reader hears "4.7 out of 5" rather than five identical star labels.
 *
 * No `fill` override on the empty ones. `StarIcon` sets `fill="currentColor"
 * stroke="none"` itself, so `fill="none"` left them with neither a fill nor a
 * stroke and every rating below five was drawing blanks where its empty stars
 * should have been. An empty star is a dim solid one.
 */
export function StarRating({ value, size = "sm", className }) {
  const filled = Math.round(value);

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span aria-hidden="true" className="inline-flex items-center gap-0.5">
        {STARS.map((star) => (
          <StarIcon
            key={star}
            className={cn(
              size === "lg" ? "size-5" : "size-3.5",
              star <= filled ? "text-gold" : "text-subtle",
            )}
          />
        ))}
      </span>

      <span className="sr-only">{value.toFixed(1)} out of 5</span>
    </span>
  );
}
