"use client";

import { useId, useState } from "react";
import { FilterIcon, PlusIcon } from "@/components/icons";
import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Listbox } from "@/components/ui/Listbox";
import { faqCategories, faqHeading, faqs } from "@/data/faq";
import { cn } from "@/lib/cn";

/** The filter's options: each category, with how many questions it holds. */
const topics = faqCategories.map(({ id, label }) => ({
  value: id,
  label,
  count: id === "all" ? faqs.length : faqs.filter((item) => item.category === id).length,
}));

/**
 * Frequently asked questions, on one centred axis: the eyebrow and the title
 * (with a word or two in the italic accent serif) centred, and under the
 * title a row with the topic filter (a select) at its left-hand end and a
 * short line of description at its right. The questions follow as a centred
 * accordion column, each question and its answer centred too.
 *
 * One question is open at a time, the first by default. Picking a category
 * shows only its questions and opens the first. Each question is a real
 * button with `aria-expanded`, tied to its answer region. The answers open
 * by animating the grid row from 0fr to 1fr, so no height is measured.
 */
export function Faq() {
  const { eyebrow, title, description } = faqHeading;
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
        {/* Raised, so the filter's open list lies over the questions. */}
        <Reveal className="relative z-10 translate-y-6 opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:opacity-100">
          {/* As wide as the title and no wider, so the row below lines up
              with the title's two ends. */}
          <div className="mx-auto flex w-fit max-w-full flex-col items-center text-center">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2
              id="faq-title"
              className="mt-6 font-heading text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.02] font-medium tracking-[-0.02em] text-balance text-headline"
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
            {/* The filter and the description. Measured at no width of its
                own (`w-0 min-w-full`), so the title alone sets how wide the
                block is; from `xl` the filter sits under the title's
                left-hand end and the description under its right. */}
            <div className="mt-6 flex w-0 min-w-full flex-col items-center gap-8 xl:mt-8 xl:flex-row xl:justify-between xl:gap-10 xl:text-left">
              <p className="max-w-xl text-[0.9375rem] leading-relaxed text-pretty text-content sm:text-base xl:order-2">
                {description}
              </p>

              {/* The topic filter: a select, each option with its count. */}
              <Listbox
                label="Filter questions by topic"
                labelClassName="sr-only"
                value={category}
                onChange={choose}
                options={topics}
                className="w-60 shrink-0 xl:order-1"
                buttonClassName="h-12 rounded-full bg-card pr-4 pl-1.5 ring-1 ring-line transition-shadow hover:ring-headline/40 aria-expanded:ring-brand"
                renderValue={(topic) => (
                  <>
                    <span className="flex items-center gap-1.5 rounded-full bg-brand py-2 pr-3.5 pl-3 text-xs font-semibold text-white">
                      <FilterIcon className="size-3.5" />
                      Topic
                    </span>
                    <span className="text-sm font-semibold text-headline">{topic.label}</span>
                  </>
                )}
                renderOption={(topic) => (
                  <span className="flex flex-1 items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-headline">{topic.label}</span>
                    <span className="text-xs text-muted tabular-nums">{topic.count}</span>
                  </span>
                )}
              />
            </div>
          </div>
        </Reveal>

        {/* ── The questions ───────────────────────────────────────────── */}
        <ol key={category} className="animate-fade-up mx-auto mt-6 max-w-4xl lg:mt-8">
          {list.map((item, i) => {
            const expanded = open === i;
            return (
              <li key={item.question} className="border-b border-line py-6 last:border-b-0">
                <h3>
                  <button
                    type="button"
                    id={`${id}-q${i}`}
                    aria-expanded={expanded}
                    aria-controls={`${id}-a${i}`}
                    onClick={() => setOpen(expanded ? -1 : i)}
                    className="group grid w-full cursor-pointer grid-cols-[2.25rem_1fr_2.25rem] items-center gap-4 text-center focus-visible:outline-none sm:gap-6"
                  >
                    {/* As wide as the toggle, so the question centres on the
                        column rather than on the space left of the toggle. */}
                    <span aria-hidden="true" />
                    <span
                      className={cn(
                        // Painted by a gradient clipped to the letters: headline
                        // on the left, muted on the right, with a soft front
                        // between. At rest the muted end shows; pointing at it
                        // slides the gradient across, so the ink washes in
                        // from the left like a wave. Open, it stays inked.
                        "bg-[linear-gradient(to_right,var(--color-headline)_40%,var(--color-muted)_60%)] bg-[length:250%_100%] bg-clip-text font-heading text-[clamp(1.25rem,2vw,1.75rem)] leading-snug font-medium tracking-[-0.01em] text-transparent transition-[background-position] duration-[900ms] ease-[cubic-bezier(0.33,1,0.68,1)] group-focus-visible:underline group-focus-visible:decoration-brand group-focus-visible:underline-offset-4 motion-reduce:transition-none",
                        expanded ? "bg-[position:0_0]" : "bg-[position:100%_0] group-hover:bg-[position:0_0]",
                      )}
                    >
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-full ring-1 transition-[background-color,color,rotate,box-shadow] duration-500",
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
                    <p className="mx-auto max-w-2xl pt-4 text-center text-[0.9375rem] leading-relaxed text-pretty text-content sm:text-base">
                      {item.answer}
                    </p>
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
