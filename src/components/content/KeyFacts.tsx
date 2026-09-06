import type { KeyFact } from "@/types/content";

export function KeyFacts({ facts }: { facts: KeyFact[] }) {
  if (!facts.length) {
    return null;
  }

  return (
    <dl className="key-facts">
      {facts.map((fact) => (
        <div key={fact.label} className="key-fact">
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

