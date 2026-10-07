import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Class names are looked up rather than interpolated, so every one of them is
 * greppable from here back to styles/components.css.
 */
const variants = {
  base: "btn--base",
  outline: "btn--outline",
  active: "btn--active",
};

const sizes = {
  sm: "btn--sm",
  md: "",
  lg: "btn--lg",
};

/**
 * Split button: a label beside an arrow in its own compartment. At rest the
 * arrow sits right; on hover the right compartment closes and an identical one
 * opens on the left, pushing the label across.
 *
 * This file owns the *markup*; `.btn` in styles/components.css owns the look,
 * including the whole hover choreography. Restyle every button in the app by
 * editing that one block — nothing here needs to change.
 *
 * `active` is the end state held open. Use it for the current item in a set,
 * not as a hover style.
 *
 * One button, two renderers: pass `href` and it becomes a `<Link>` (or a plain
 * `<a>` for off-site, mail and tel targets), otherwise a real `<button>`.
 *
 * Props beyond the native ones:
 *   variant   base · outline · active
 *   size      sm · md · lg
 *   block     stretch to the parent's width
 *   arrow     false drops the arrow compartments, for a plain rectangular button
 *   external  force a plain <a> — inferred automatically for http, mailto and tel
 */
export function Button({
  variant = "base",
  size = "md",
  block,
  arrow = true,
  className,
  children,
  ...rest
}) {
  const classes = cn(
    "btn",
    variants[variant],
    sizes[size],
    block && "btn--block",
    className,
  );

  const content = (
    <>
      {arrow && (
        <span aria-hidden="true" className="btn__slot btn__slot--left">
          <span>
            <ArrowRightIcon className="btn__icon" />
          </span>
        </span>
      )}

      <span className="btn__label">{children}</span>

      {arrow && (
        <span aria-hidden="true" className="btn__slot btn__slot--right">
          <span>
            <ArrowRightIcon className="btn__icon" />
          </span>
        </span>
      )}
    </>
  );

  if (typeof rest.href === "string") {
    const { href, external, ...anchorProps } = rest;
    const offSite = href.startsWith("http");

    if (external || offSite || /^(mailto:|tel:)/.test(href)) {
      return (
        <a
          {...anchorProps}
          href={href}
          className={classes}
          target={offSite ? "_blank" : undefined}
          rel={offSite ? "noopener noreferrer" : undefined}
        >
          {content}
        </a>
      );
    }

    return (
      <Link {...anchorProps} href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button {...rest} className={classes}>
      {content}
    </button>
  );
}
