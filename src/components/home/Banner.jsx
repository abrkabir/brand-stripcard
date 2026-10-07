import { BannerCard } from "@/components/home/BannerCard";
import { HeroSlider } from "@/components/home/HeroSlider";

/**
 * Homepage banner.
 *
 * A thin composition point: the slider owns all the state, and the card and
 * scroll cue below are static markup that stay on the server. The header is transparent
 * over this section, so the slider runs the full height of the viewport and
 * carries its own top padding to clear the header.
 */
export function Banner() {
  return (
    <div className="relative">
      <HeroSlider />
      <BannerCard />
      <ScrollCue />
    </div>
  );
}

/** Vertical "scroll" marker with a light travelling down the rule. */
function ScrollCue() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-4 lg:flex"
    >
      <span className="rotate-180 text-[10px] tracking-[0.35em] text-white/55 [writing-mode:vertical-rl]">
        scroll
      </span>
      <span className="relative block h-24 w-px overflow-hidden bg-white/20">
        <span className="animate-scroll-cue absolute inset-x-0 top-0 block h-1/3 bg-white" />
      </span>
    </div>
  );
}
