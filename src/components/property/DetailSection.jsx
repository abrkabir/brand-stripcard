/**
 * One titled block on the detail page.
 *
 * Every block on the page goes through this, so the heading size, the rule
 * under it and the vertical rhythm are set once. Changing the page's cadence is
 * a change here rather than in five separate components.
 *
 * `h2` because the property's name is the page's `h1` — these are its
 * sections, not siblings of it.
 */
export function DetailSection({ id, title, children }) {
  return (
    <section id={id} className="border-t border-line pt-10">
      <h2 className="font-heading text-[1.375rem] font-medium text-headline">
        {title}
      </h2>

      <div className="mt-7">{children}</div>
    </section>
  );
}
