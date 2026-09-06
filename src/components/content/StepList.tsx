import type { StepsModule } from "@/types/modules";

export function StepList({ guideModule }: { guideModule: StepsModule }) {
  return (
    <section id={guideModule.id} className="content-module">
      <h2>{guideModule.heading}</h2>
      <ol className="step-list">
        {guideModule.items.map((item, index) => (
          <li key={`${item.title}-${index}`} className="step-item">
            <span className="step-number" aria-hidden="true">
              {index + 1}
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              {item.doneCondition ? (
                <p className="module-note">
                  <strong>Done when:</strong> {item.doneCondition}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
