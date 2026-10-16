import { notFound } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SectionIcon } from "@/components/dashboard/SectionIcon";
import { Button } from "@/components/ui/Button";
import { dashboardPages } from "@/data/dashboard";

/** One page per sidebar link, built at export time; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return dashboardPages.map((page) => ({ section: page.slug }));
}

export async function generateMetadata({ params }) {
  const { section } = await params;
  const page = dashboardPages.find((p) => p.slug === section);
  return {
    title: page?.label,
    description: page?.description,
    robots: { index: false, follow: false },
  };
}

/**
 * A dashboard page that is not built yet: the shell's header with its name,
 * then a calm empty state saying what will live here and a way back. Each one
 * gets replaced by the real screen as the backend for it lands.
 */
export default async function DashboardSectionPage({ params }) {
  const { section } = await params;
  const page = dashboardPages.find((p) => p.slug === section);
  if (!page) notFound();

  return (
    <>
      <DashboardHeader title={page.label} />

      <section
        aria-labelledby="section-empty-title"
        className="mt-8 grid min-h-[26rem] place-items-center rounded-3xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center lg:mt-10"
      >
        <div className="max-w-md">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand dark:bg-brand/15">
            <SectionIcon name={page.icon} className="size-7" />
          </span>
          <h2 id="section-empty-title" className="mt-6 font-heading text-2xl font-semibold tracking-[-0.01em] text-headline">
            {page.label} is on its way
          </h2>
          <p className="mt-3 leading-relaxed text-pretty text-content">{page.description}</p>
          <div className="mt-8 flex justify-center">
            <Button href="/dashboard" size="sm" variant="outline">
              Back to dashboard
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
