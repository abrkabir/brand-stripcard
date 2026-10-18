import { Cta } from "@/components/home/Cta";
import { Features } from "@/components/home/Features";
import { UserControlMarketing } from "@/components/home/UserControlMarketing";
import { PageHero } from "@/components/shared/PageHero";
import { pageHeroes } from "@/data/pages";

const hero = pageHeroes.control;

export const metadata = {
  title: hero.title,
  description: hero.description,
};

/** Control: the page banner, then your cards and balance in your hands, the
    controls behind them and the call to action. */
export default function ControlPage() {
  return (
    <>
      <PageHero {...hero} crumbs={[{ label: "Control", href: "/control" }]} />
      <UserControlMarketing />
      <Features />
      <Cta />
    </>
  );
}
