"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * The three places a phone can stand. Each step moves every phone one place
 * along: the back-right phone comes to the front, the front one goes back
 * left, the back-left one goes back right. `x` is a share of the phone's own
 * width; `y` is in pixels.
 */
const SLOTS = [
  { x: "0%", y: 0, rotate: 0, scale: 1, zIndex: 3, opacity: 1 }, // front
  { x: "46%", y: 18, rotate: 8, scale: 0.9, zIndex: 2, opacity: 0.5 }, // back right
  { x: "-46%", y: 18, rotate: -8, scale: 0.9, zIndex: 1, opacity: 0.5 }, // back left
];

/** Milliseconds between steps. */
const INTERVAL = 3800;

/**
 * The app, three ways (Home, Card controls and Spending), on three phones
 * standing in a fan. Every few seconds each phone moves one place along
 * (see SLOTS), gliding there on a fast-out, soft-landing curve while its
 * layer changes at once, as in a card stack.
 *
 * The motion is plain CSS transitions on transform and opacity, so it runs on
 * the compositor. The steps only tick while the panel is on screen. Visitors
 * who ask for less motion see the phones change places with a fade instead.
 *
 * The phones are images (public/images/assets/app/phone-*.webp) and size off
 * the panel, a size container: 40% of its width or 38% of its height,
 * whichever is smaller.
 */
export function AppPhones({ label, phones }) {
  const root = useRef(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let id = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        clearInterval(id);
        if (entry.isIntersecting) {
          id = setInterval(() => setStep((s) => (s + 1) % SLOTS.length), INTERVAL);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(root.current);
    return () => {
      observer.disconnect();
      clearInterval(id);
    };
  }, []);

  return (
    <div
      ref={root}
      role="img"
      aria-label={label}
      className="absolute inset-0 grid place-items-center [container-type:size] [--pw:min(40cqw,38cqh)]"
    >
      {/* A warm glow behind the fan, stronger on the dark backdrop. */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 size-[80cqmin] -translate-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(242,106,27,0.22),rgba(242,106,27,0.06)_55%,rgba(242,106,27,0))] dark:bg-[radial-gradient(closest-side,rgba(242,106,27,0.38),rgba(242,106,27,0.1)_55%,rgba(0,0,0,0))]"
      />
      {phones.map((phone, i) => {
        const slot = SLOTS[(i - step + SLOTS.length) % SLOTS.length];
        return (
          <div
            key={phone.screen}
            aria-hidden="true"
            className="relative w-(--pw) transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform [grid-area:1/1] motion-reduce:transition-opacity"
            style={{
              zIndex: slot.zIndex,
              opacity: slot.opacity,
              transform: `translate(${slot.x}, ${slot.y}px) rotate(${slot.rotate}deg) scale(${slot.scale})`,
            }}
          >
            {/* The shadow sits under the image's rounded frame. */}
            <div className="absolute inset-[1%] rounded-[calc(var(--pw)*0.15)] shadow-[0_calc(var(--pw)*0.13)_calc(var(--pw)*0.2)_calc(var(--pw)*-0.07)_rgb(120_45_8/0.4),0_calc(var(--pw)*0.03)_calc(var(--pw)*0.06)_calc(var(--pw)*-0.02)_rgb(0_0_0/0.25)]" />
            <Image
              src={phone.src}
              alt=""
              sizes="(min-width: 1024px) 240px, 160px"
              className="relative block h-auto w-full"
            />
          </div>
        );
      })}
    </div>
  );
}
