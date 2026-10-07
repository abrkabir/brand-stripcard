import { AgentCard } from "@/components/agent/AgentCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/ui/Container";
import { agents, agentsHeading } from "@/data/agents";

/**
 * The agent list.
 *
 * Entirely a Server Component — the cards are links and nothing on them has
 * state, so this section ships no JavaScript.
 */
export function Agents() {
  return (
    <section className="bg-page py-24 lg:py-32">
      <Container>
        <SectionHeading
          align="center"
          title={agentsHeading.title}
          description={agentsHeading.description}
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {agents.map((agent, index) => (
            <li key={agent.id}>
              <AgentCard agent={agent} index={index} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
