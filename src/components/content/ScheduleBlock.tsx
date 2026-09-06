import type { ScheduleModule } from "@/types/modules";

export function ScheduleBlock({ guideModule }: { guideModule: ScheduleModule }) {
  return (
    <section id={guideModule.id} className="content-module">
      <h2>{guideModule.heading}</h2>
      <dl className="schedule-list">
        {guideModule.items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="schedule-item"
            data-tone={item.tone ?? "unknown"}
          >
            <dt>{item.label}</dt>
            <dd>
              <strong>{item.timing}</strong>
              <span>{item.detail}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
