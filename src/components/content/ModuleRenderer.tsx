import Link from "next/link";
import { ComparisonBlock } from "@/components/content/ComparisonBlock";
import { DataTableBlock } from "@/components/content/DataTableBlock";
import { EntityGrid } from "@/components/content/EntityGrid";
import { MediaGallery } from "@/components/content/MediaGallery";
import { RecipeList } from "@/components/content/RecipeList";
import { ScheduleBlock } from "@/components/content/ScheduleBlock";
import { StatusCallout } from "@/components/content/StatusCallout";
import { StepList } from "@/components/content/StepList";
import type { GuideModule } from "@/types/modules";

function assertNever(value: never): never {
  throw new Error(`Unsupported guide module: ${JSON.stringify(value)}`);
}

export function ModuleRenderer({ modules }: { modules: GuideModule[] }) {
  return (
    <div className="guide-modules">
      {modules.map((guideModule) => {
        switch (guideModule.type) {
          case "prose":
            return (
              <section
                key={guideModule.id}
                id={guideModule.id}
                className="content-module prose-module"
              >
                <h2>{guideModule.heading}</h2>
                <p>{guideModule.body}</p>
                {guideModule.links?.length ? (
                  <div className="inline-link-list">
                    {guideModule.links.map((link) => (
                      <Link key={link.href} href={link.href} className="inline-link">
                        <strong>{link.label}</strong>
                        {link.description ? <span>{link.description}</span> : null}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </section>
            );
          case "entity-grid":
            return <EntityGrid key={guideModule.id} guideModule={guideModule} />;
          case "data-table":
            return <DataTableBlock key={guideModule.id} guideModule={guideModule} />;
          case "steps":
            return <StepList key={guideModule.id} guideModule={guideModule} />;
          case "recipes":
            return <RecipeList key={guideModule.id} guideModule={guideModule} />;
          case "schedule":
            return <ScheduleBlock key={guideModule.id} guideModule={guideModule} />;
          case "comparison":
            return <ComparisonBlock key={guideModule.id} guideModule={guideModule} />;
          case "media-gallery":
            return <MediaGallery key={guideModule.id} guideModule={guideModule} />;
          case "callout":
            return <StatusCallout key={guideModule.id} guideModule={guideModule} />;
          default:
            return assertNever(guideModule);
        }
      })}
    </div>
  );
}
