import Link from "next/link";
import { AssetMedia } from "@/components/media/AssetMedia";
import type { EntityGridModule } from "@/types/modules";

export function EntityGrid({ guideModule }: { guideModule: EntityGridModule }) {
  return (
    <section id={guideModule.id} className="content-module">
      <h2>{guideModule.heading}</h2>
      <div className="entity-grid">
        {guideModule.items.map((item, index) => {
          const content = (
            <>
              {item.assetId ? <AssetMedia assetId={item.assetId} /> : null}
              {item.badge ? <span className="module-badge">{item.badge}</span> : null}
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </>
          );
          const key = `${item.title}-${index}`;

          return item.href ? (
            <Link key={key} href={item.href} className="entity-card">
              {content}
            </Link>
          ) : (
            <article key={key} className="entity-card">
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}
