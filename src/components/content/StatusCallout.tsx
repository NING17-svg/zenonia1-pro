import type { CalloutModule } from "@/types/modules";

export function StatusCallout({ guideModule }: { guideModule: CalloutModule }) {
  return (
    <aside
      id={guideModule.id}
      className="status-callout"
      data-tone={guideModule.tone}
      aria-labelledby={`${guideModule.id}-title`}
    >
      <h2 id={`${guideModule.id}-title`}>{guideModule.title}</h2>
      <p>{guideModule.body}</p>
    </aside>
  );
}
