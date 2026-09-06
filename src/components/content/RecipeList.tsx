import type { RecipesModule } from "@/types/modules";

export function RecipeList({ guideModule }: { guideModule: RecipesModule }) {
  return (
    <section id={guideModule.id} className="content-module">
      <h2>{guideModule.heading}</h2>
      <div className="recipe-grid">
        {guideModule.items.map((item, index) => (
          <article key={`${item.name}-${index}`} className="recipe-card">
            <h3>{item.name}</h3>
            <p>
              <strong>Inputs:</strong> {item.inputs.join(", ")}
            </p>
            <p>
              <strong>Output:</strong> {item.output}
            </p>
            {item.note ? <p className="module-note">{item.note}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
