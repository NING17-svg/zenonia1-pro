import { AdSlot } from "@/components/ads/AdSlot";
import { FAQBlock } from "@/components/content/FAQBlock";
import { ModuleRenderer } from "@/components/content/ModuleRenderer";
import { RelatedLinks } from "@/components/content/RelatedLinks";
import { PageHero } from "@/components/pages/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { theme } from "@/data/theme";
import { getFaqsForPage, getRelatedPages } from "@/lib/content";
import {
  articleSchema,
  breadcrumbSchema,
  collectionPageSchema,
  faqSchema,
} from "@/lib/schema";
import type { PageContent } from "@/types/content";

export function WorkspacePage({
  page,
  workspace,
}: {
  page: PageContent;
  workspace?: React.ReactNode;
}) {
  const faqs = getFaqsForPage(page);
  const related = getRelatedPages(page);
  const primarySchema =
    page.pageType === "wiki" || page.pageType === "guides"
      ? collectionPageSchema(page)
      : articleSchema(page);
  const variant =
    page.presentation.shell === "workspace"
      ? (page.presentation.variant ?? theme.variants.workspace)
      : theme.variants.workspace;

  return (
    <article className="workspace-page" data-variant={variant}>
      <JsonLd data={breadcrumbSchema(page)} />
      <JsonLd data={primarySchema} />
      {faqs.length ? <JsonLd data={faqSchema(faqs)} /> : null}
      <PageHero page={page} />
      <AdSlot placement="responsive-banner" />
      <div className="workspace-region" data-variant={variant}>
        {workspace ?? (
          <section className="workspace-fallback" aria-label="Tool workspace">
            <p>{page.quickAnswer}</p>
          </section>
        )}
      </div>
      <ModuleRenderer modules={page.modules} />
      <RelatedLinks pages={related} />
      <FAQBlock faqs={faqs} />
    </article>
  );
}
