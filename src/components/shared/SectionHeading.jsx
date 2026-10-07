import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * The standard heading block for every page section — eyebrow, title,
 * description and an optional "view all" link. Use it instead of hand-rolling
 * an `<h2>` so vertical rhythm and type scale stay identical site-wide.
 */
/*
 * `title` takes a node, not just a string, so a caller can tone part of it
 * down. `action` is `{ label, href }`; `align` is "left" or "center".
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        centered
          ? "items-center text-center"
          : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      {/* Only the paragraph is width-constrained. A heading that has to wrap at
          576px is a heading fighting its own layout. */}
      <div className={cn(centered && "max-w-3xl")}>
        {eyebrow && <Badge>{eyebrow}</Badge>}

        {/* Normal weight, not semibold: at display size the heading carries by
            scale, and the lighter cut keeps a section from shouting over the
            hero above it. */}
        <h2
          className={cn(
            "font-heading text-[2rem] leading-[1.15] font-normal sm:text-[2.6rem]",
            eyebrow && "mt-4",
          )}
        >
          {title}
        </h2>

        {description && (
          <p
            className={cn(
              "mt-5 text-[15px] leading-[1.8] text-content",
              // A long centred line is hard to track back to; a long left-aligned
              // one is hard to read. Both get a cap, just different ones.
              centered ? "mx-auto max-w-[34rem]" : "max-w-xl",
            )}
          >
            {description}
          </p>
        )}
      </div>

      {/* The kit's button rather than a bare link: it brings the split-arrow
          hover with it, so a section's "view all" reads as the same control as
          every other action on the site. */}
      {action && (
        <Button href={action.href} variant="outline" size="sm" className="shrink-0">
          {action.label}
        </Button>
      )}
    </div>
  );
}
