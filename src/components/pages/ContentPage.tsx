import { AdSlot } from "@/components/ads/AdSlot";
import { FAQBlock } from "@/components/content/FAQBlock";
import { ModuleRenderer } from "@/components/content/ModuleRenderer";
import { RelatedLinks } from "@/components/content/RelatedLinks";
import { RightRail } from "@/components/layout/RightRail";
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

export function ContentPage({ page }: { page: PageContent }) {
  const faqs = getFaqsForPage(page);
  const related = getRelatedPages(page);
  const primarySchema =
    page.pageType === "wiki" || page.pageType === "guides"
      ? collectionPageSchema(page)
      : articleSchema(page);
  const variant =
    page.presentation.shell === "content"
      ? (page.presentation.variant ?? theme.variants.content)
      : theme.variants.content;
  const leadingModules = page.modules.slice(0, 2);
  const remainingModules = page.modules.slice(2);

  return (
    <article className="content-page" data-variant={variant}>
      <JsonLd data={breadcrumbSchema(page)} />
      <JsonLd data={primarySchema} />
      {faqs.length ? <JsonLd data={faqSchema(faqs)} /> : null}
      <PageHero page={page} />
      <AdSlot placement="responsive-banner" />
      <div className="content-layout" data-variant={variant}>
        <div className="article-body">
          <p className="quick-answer">{page.quickAnswer}</p>
          <ModuleRenderer modules={leadingModules} />
          <AdSlot placement="native-banner" />
          {remainingModules.length ? (
            <ModuleRenderer modules={remainingModules} />
          ) : null}
          <FAQBlock faqs={faqs} />
          <RelatedLinks pages={related} />
        </div>
        {variant === "reading-right-rail" ? <RightRail page={page} /> : null}
      </div>
    </article>
  );
}
