import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { KeyFacts } from "@/components/content/KeyFacts";
import { getRelatedPages } from "@/lib/content";
import type { PageContent } from "@/types/content";

export function RightRail({ page }: { page: PageContent }) {
  const related = getRelatedPages(page);

  return (
    <aside className="right-rail" aria-label="Page summary">
      <section>
        <h2>Key Facts</h2>
        <KeyFacts facts={page.keyFacts} />
      </section>
      <section>
        <h2>On This Page</h2>
        <nav className="rail-links" aria-label="Section navigation">
          {page.modules
            .filter(
              (guideModule) => guideModule.heading || guideModule.type === "callout",
            )
            .map((guideModule) => {
              const label =
                guideModule.type === "callout"
                  ? guideModule.title
                  : guideModule.heading;

              return (
                <a key={guideModule.id} href={`#${guideModule.id}`}>
                  {label}
                </a>
              );
            })}
        </nav>
      </section>
      {related.length ? (
        <section>
          <h2>Next Pages</h2>
          <nav className="rail-links" aria-label="Related pages">
            {related.map((relatedPage) => (
              <Link key={relatedPage.id} href={relatedPage.url}>
                {relatedPage.h1}
              </Link>
            ))}
          </nav>
        </section>
      ) : null}
      <AdSlot placement="right-rail" />
    </aside>
  );
}
