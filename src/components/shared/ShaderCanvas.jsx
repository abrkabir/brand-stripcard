"use client";

import { ChromaFlow, FilmGrain, FlutedGlass, Shader, Swirl } from "shaders/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * A cursor-following bloom seen through fluted glass, on one WebGPU canvas.
 *
 * Shared: the footer stands on it and so does the aside on the auth pages. It
 * fills whatever positioned box it is dropped into.
 *
 * Four layers in one WebGPU canvas, and the order is the effect — each one
 * reads the one below it:
 *
 *   1. Swirl        the ground the rest sits on.
 *   2. ChromaFlow   a bloom that drifts after the pointer with momentum,
 *                   tinted by the direction of travel.
 *   3. FlutedGlass  diagonal ribs that refract everything underneath and
 *                   throw chromatic fringes at each rib edge.
 *   4. FilmGrain    a whisper of noise over the whole thing.
 *
 * Cursor reactivity is declarative — `momentum` and `radius` are the bloom's
 * follow physics, and the library owns the pointer. There is nothing to wire
 * up, and no listener to clean up.
 *
 * On a device without WebGPU the canvas simply stays empty. The footer's own
 * `bg-shader-ink` shows through and every word on top of it still reads, which
 * is why the ground is painted in CSS rather than left to the shader.
 */

/**
 * The shader runs on the GPU and cannot resolve `var(--color-…)`, so the
 * palette is read out of the stylesheet once and handed over as literals.
 * Doing it this way rather than hardcoding hexes keeps variables.css the only
 * place a colour is defined — a rebrand still moves this with it.
 *
 * Falls back to the token's own value if the property is missing, so a
 * stylesheet that has not applied yet degrades to the right colour anyway.
 */
function readPalette() {
  const fallback = {
    ink: "#04060e",
    deep: "#401507",
    brand: "#f26a1b",
    lift: "#f26a1b",
    high: "#fd8645",
    pale: "#ffaa75",
  };

  if (typeof document === "undefined") return fallback;

  const styles = getComputedStyle(document.documentElement);
  const token = (name, value) =>
    styles.getPropertyValue(name).trim() || value;

  return {
    ink: token("--color-shader-ink", fallback.ink),
    deep: token("--color-brand-950", fallback.deep),
    brand: token("--color-brand", fallback.brand),
    lift: token("--color-brand-500", fallback.lift),
    high: token("--color-brand-400", fallback.high),
    pale: token("--color-brand-300", fallback.pale),
  };
}

export default function ShaderCanvas() {
  const reduced = usePrefersReducedMotion();
  const palette = readPalette();

  return (
    <Shader style={{ width: "100%", height: "100%", display: "block" }}>
      <Swirl colorA={palette.ink} colorB={palette.deep} detail={1.7} />

      {/* The bloom. `momentum` is how heavily it lags the pointer, `radius`
          how far it spreads. Direction colours walk the brand scale, so the
          tint shifts as the cursor changes heading. */}
      <ChromaFlow
        baseColor={palette.ink}
        downColor={palette.brand}
        leftColor={palette.high}
        rightColor={palette.lift}
        upColor={palette.pale}
        momentum={13}
        radius={3.5}
      />

      {/* The ribs. `angle` and `frequency` set the fluting, `refraction` how
          hard it bends the bloom behind it, and `aberration` is what splits
          the fringe into colour at each edge. `speed` is the only thing that
          moves on its own — stopped outright when the visitor has asked for
          less motion, which a CSS media query could not do for a shader. */}
      <FlutedGlass
        aberration={0.61}
        angle={31}
        frequency={8}
        highlight={0.12}
        highlightSoftness={0}
        lightAngle={-90}
        refraction={4}
        shape="rounded"
        softness={1}
        speed={reduced ? 0 : 0.15}
      />

      <FilmGrain strength={0.05} />
    </Shader>
  );
}
