"use client";

import { useId, useState } from "react";
import { PlusIcon } from "@/components/icons";
import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { faqCategories, faqHeading, faqs } from "@/data/faq";
import { cn } from "@/lib/cn";

/**
 * Frequently asked questions, stacked: the heading across the top (the title
 * with a word or two in the italic accent serif, then the category pills),
 * and the questions below as a
 * numbered accordion. Each question sits beside its number; opening one
 * draws an orange line down beside the answer, from the number to the foot.
 *
 * One question is open at a time, the first by default. Picking a category
 * shows only its questions and opens the first. Each question is a real
 * button with `aria-expanded`, tied to its answer region. The answers open
 * by animating the grid row from 0fr to 1fr, so no height is measured.
 */
export function Faq() {
  const { eyebrow, title } = faqHeading;
  const [category, setCategory] = useState("all");
  const list = category === "all" ? faqs : faqs.filter((item) => item.category === category);
  const [open, setOpen] = useState(0);
  const id = useId();

  const choose = (next) => {
    setCategory(next);
    setOpen(0);
  };

  return (
    <section aria-labelledby="faq-title" className="bg-page py-20 lg:py-28">
      <Container>
        {/* ── The heading ─────────────────────────────────────────────── */}
        <Reveal className="translate-y-6 opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:opacity-100">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2
              id="faq-title"
              className="mt-6 max-w-6xl font-heading text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.02] font-medium tracking-[-0.02em] text-pretty text-headline"
            >
              {title.map((piece, i) =>
                typeof piece === "string" ? (
                  <span key={i}>{piece}</span>
                ) : (
                  <span key={i} className="font-accent font-normal tracking-normal text-brand italic">
                    {piece.em}
                  </span>
                ),
              )}
            </h2>

            {/* Category pills: the active one filled, the rest outlined. */}
            <div role="group" aria-label="Filter questions by topic" className="mt-10 flex flex-wrap gap-2.5">
              {faqCategories.map((item) => {
                const active = item.id === category;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => choose(item.id)}
                    aria-pressed={active}
                    className={cn(
                      "cursor-pointer rounded-full px-5 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                      active
                        ? "bg-headline text-page"
                        : "text-content ring-1 ring-line hover:text-headline hover:ring-headline/40",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* ── The questions ───────────────────────────────────────────── */}
        <ol key={category} className="animate-fade-up mt-10 border-t border-line lg:mt-12">
          {list.map((item, i) => {
            const expanded = open === i;
            const number = String(i + 1).padStart(2, "0");
            return (
              <li key={item.question} className="grid grid-cols-[3.75rem_1fr] gap-x-5 sm:grid-cols-[4.5rem_1fr] sm:gap-x-8">
                {/* The number, and the line that runs down beside the answer. */}
                <div className="relative flex flex-col items-center">
                  <span
                    className={cn(
                      "relative z-10 mt-6 rounded-full px-3.5 py-1.5 font-mono text-sm tabular-nums ring-1 transition-colors duration-500",
                      expanded ? "bg-brand text-white ring-brand" : "text-muted ring-line",
                    )}
                  >
                    {number}
                  </span>
                  <span aria-hidden="true" className="relative mt-3 w-px flex-1 bg-line">
                    <span
                      className={cn(
                        "absolute inset-0 origin-top bg-brand transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        expanded ? "scale-y-100" : "scale-y-0",
                      )}
                    />
                    <span
                      className={cn(
                        "absolute top-0 left-1/2 h-px w-3 -translate-x-1/2 bg-brand transition-opacity duration-500",
                        expanded ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </span>
                </div>

                <div className="border-b border-line py-6">
                  <h3>
                    <button
                      type="button"
                      id={`${id}-q${i}`}
                      aria-expanded={expanded}
                      aria-controls={`${id}-a${i}`}
                      onClick={() => setOpen(expanded ? -1 : i)}
                      className="group flex w-full cursor-pointer items-start justify-between gap-6 text-left focus-visible:outline-none"
                    >
                      <span
                        className={cn(
                          "pt-0.5 font-heading text-[clamp(1.25rem,2vw,1.75rem)] leading-snug font-medium tracking-[-0.01em] transition-colors group-focus-visible:underline group-focus-visible:decoration-brand group-focus-visible:underline-offset-4",
                          expanded ? "text-headline" : "text-content group-hover:text-headline",
                        )}
                      >
                        {item.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-1 grid size-9 shrink-0 place-items-center rounded-full ring-1 transition-[background-color,color,rotate,box-shadow] duration-500",
                          expanded
                            ? "rotate-45 bg-brand text-white ring-brand"
                            : "text-content ring-line group-hover:text-headline group-hover:ring-headline/40",
                        )}
                      >
                        <PlusIcon className="size-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`${id}-a${i}`}
                    role="region"
                    aria-labelledby={`${id}-q${i}`}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-3xl pt-4 pr-12 text-[0.9375rem] leading-relaxed text-pretty text-content sm:text-base">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
