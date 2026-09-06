import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { FAQBlock } from "@/components/content/FAQBlock";
import { KeyFacts } from "@/components/content/KeyFacts";
import { ModuleRenderer } from "@/components/content/ModuleRenderer";
import { RelatedLinks } from "@/components/content/RelatedLinks";
import { PageHero } from "@/components/pages/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { theme } from "@/data/theme";
import { getLocaleUiLabels } from "@/lib/localization";
import { getFaqsForPage, getRecentUpdates, getRelatedPages } from "@/lib/content";
import { collectionPageSchema, faqSchema, websiteSchema } from "@/lib/schema";
import type { PageContent } from "@/types/content";

export function HomePage({ page }: { page: PageContent }) {
  const faqs = getFaqsForPage(page);
  const related = getRelatedPages(page);
  const recentUpdates = getRecentUpdates(page.locale);
  const labels = getLocaleUiLabels(page.locale);
  const variant =
    page.presentation.shell === "home"
      ? (page.presentation.variant ?? theme.variants.home)
      : theme.variants.home;

  return (
    <article className="home-page" data-variant={variant}>
      <JsonLd data={websiteSchema()} />
      <JsonLd data={collectionPageSchema(page)} />
      <JsonLd data={faqSchema(faqs)} />
      <PageHero page={page} priority />
      <section className="home-summary">
        <p className="quick-answer">{page.quickAnswer}</p>
        <KeyFacts facts={page.keyFacts} />
      </section>
      <AdSlot placement="responsive-banner" />
      <ModuleRenderer modules={page.modules} />
      {recentUpdates.length ? (
        <section className="recent-updates" aria-labelledby="recent-updates-heading">
          <h2 id="recent-updates-heading">{labels.recentUpdates}</h2>
          <div className="recent-updates-grid">
            {recentUpdates.map((recentPage) => (
              <Link key={recentPage.id} href={recentPage.url} className="recent-update-card">
                <strong>{recentPage.h1}</strong>
                <span>{recentPage.summary}</span>
                <time dateTime={recentPage.lastReviewed}>
                  {labels.lastReviewed}: {recentPage.lastReviewed}
                </time>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      <RelatedLinks pages={related} />
      <FAQBlock faqs={faqs} />
    </article>
  );
}
