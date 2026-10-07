import { Logo } from "@/components/layout/Logo";
import { ShaderBackdrop } from "@/components/shared/ShaderBackdrop";

/**
 * The frame both auth screens sit in: one card, shader panel on the left, form
 * on the right.
 *
 * The left panel is the same WebGPU backdrop the footer stands on — see
 * `ShaderCanvas`. Three things it needs, and all three are easy to get wrong:
 *
 *   1. The canvas must be in an **absolutely positioned** box. It renders as a
 *      block at `height: 100%`, and a percentage height against an auto-height
 *      parent resolves to nothing — so in normal flow it collapses to zero and
 *      shows nothing at all while still taking part in the layout.
 *   2. The panel needs a height of its own for that box to fill, which is what
 *      `min-h-[32rem]` is. The grid stretches it further when the form column
 *      is taller.
 *   3. `isolate` keeps the canvas in its own stacking context so it cannot
 *      climb over the copy, and `shader-scrim` pulls the ground back down
 *      before any type goes on it.
 *
 * `on-dark` because that ground is dark in both themes, so anything from the UI
 * kit dropped in there commits to white on its own.
 *
 * Hidden below `lg`. On a phone the panel would either squash the form off the
 * fold or steal half of it, and a WebGPU canvas is not worth a device's battery
 * to decorate a login box.
 *
 * A Server Component. Only the canvas and the form are client islands.
 */
export function AuthShell({ aside, children }) {
  return (
    <div className="w-full max-w-5xl rounded-3xl border border-line bg-surface p-3 shadow-2xl sm:p-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="relative isolate hidden min-h-[32rem] flex-col overflow-hidden rounded-2xl bg-shader-ink lg:flex">
          <div aria-hidden="true" className="absolute inset-0">
            <ShaderBackdrop />
          </div>

          <div
            aria-hidden="true"
            className="shader-scrim pointer-events-none absolute inset-0"
          />

          {/* `flex-1` rather than `h-full`: the panel is the flex container, so
              the child grows to it. `h-full` would be another percentage height
              against an auto-height parent — the same trap as the canvas. */}
          <div className="on-dark relative flex flex-1 items-start p-9">
            <p className="max-w-[16ch] font-heading text-[1.875rem] leading-[1.2] font-medium text-white">
              {aside}
            </p>
          </div>
        </div>

        {/* The form column. `min-w-0` so a long field label cannot push the
            grid track wider than its share. */}
        <div className="flex min-w-0 flex-col justify-center px-2 py-8 sm:px-8 lg:px-10">
          <Logo size="h-8" />

          {children}
        </div>
      </div>
    </div>
  );
}
