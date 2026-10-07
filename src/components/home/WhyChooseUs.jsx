import { getIcon } from "@/components/icons";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/ui/Container";
import { whyChooseUs, whyChooseUsHeading } from "@/data/whyChooseUs";
import { cn } from "@/lib/cn";

/**
 * How far each column is pushed down, building the staircase. Written out as
 * literal class names because Tailwind scans source text — a composed
 * `lg:pt-${n}` would never be generated. Only applies from `lg`: below that
 * the columns stack and a stagger would just be dead space.
 */
const STEP_OFFSET = ["lg:pt-0", "lg:pt-24", "lg:pt-48", "lg:pt-72"];

export function WhyChooseUs() {
  const total = whyChooseUs.length;

  return (
    <section className="bg-page py-24 lg:py-32">
      <Container>
        <SectionHeading
          align="center"
          title={whyChooseUsHeading.title}
          description={whyChooseUsHeading.description}
        />

        {/* One observer for the whole row; each column staggers off its own
            --step-delay. See the `.step` block in styles/components.css. */}
        <Reveal
          as="ul"
          className="mt-16 grid gap-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-0 lg:border-r lg:border-line"
        >
          {whyChooseUs.map((item, index) => {
            const Icon = getIcon(item.icon);

            return (
              <li
                key={item.title}
                className="lg:border-l lg:border-line lg:px-8"
                style={{
                  "--step-delay": `${index * 130}ms`,
                  // The rule grows a quarter longer per column, so the bars
                  // read as a progression down the staircase.
                  "--step-fill": `${((index + 1) / total) * 100}%`,
                }}
              >
                <div className={cn("step__body", STEP_OFFSET[index])}>
                  {Icon && (
                    <span className="step__icon block">
                      <Icon
                        className="size-10 text-content"
                        strokeWidth={1.1}
                        aria-hidden="true"
                      />
                    </span>
                  )}

                  <h3 className="mt-8 font-heading text-xl font-bold tracking-[0.02em] text-headline uppercase">
                    {item.title}
                  </h3>

                  <p className="mt-4 max-w-[22rem] text-[15px] leading-[1.7] text-muted">
                    {item.description}
                  </p>

                  <div className="mt-14 lg:mt-20">
                    <span className="block text-[13px] font-medium text-headline tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="step__bar mt-2.5" />
                  </div>
                </div>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
