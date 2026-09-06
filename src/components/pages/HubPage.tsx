import { AdSlot } from "@/components/ads/AdSlot";
import { FAQBlock } from "@/components/content/FAQBlock";
import { KeyFacts } from "@/components/content/KeyFacts";
import { ModuleRenderer } from "@/components/content/ModuleRenderer";
import { RelatedLinks } from "@/components/content/RelatedLinks";
import { PageHero } from "@/components/pages/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { theme } from "@/data/theme";
import { getFaqsForPage, getRelatedPages } from "@/lib/content";
import {
  breadcrumbSchema,
  collectionPageSchema,
  faqSchema,
} from "@/lib/schema";
import type { PageContent } from "@/types/content";

export function HubPage({ page }: { page: PageContent }) {
  const faqs = getFaqsForPage(page);
  const related = getRelatedPages(page);
  const variant =
    page.presentation.shell === "hub"
      ? (page.presentation.variant ?? theme.variants.hub)
      : theme.variants.hub;

  return (
    <article className="hub-page" data-variant={variant}>
      <JsonLd data={breadcrumbSchema(page)} />
      <JsonLd data={collectionPageSchema(page)} />
      {faqs.length ? <JsonLd data={faqSchema(faqs)} /> : null}
      <PageHero page={page} />
      <section className="hub-summary">
        <p className="quick-answer">{page.quickAnswer}</p>
        <KeyFacts facts={page.keyFacts} />
      </section>
      <AdSlot placement="responsive-banner" />
      <ModuleRenderer modules={page.modules} />
      <RelatedLinks pages={related} />
      <FAQBlock faqs={faqs} />
    </article>
  );
}
