import { site } from "@/data/site";
import { localizePath } from "@/lib/localization";
import { absoluteUrl } from "@/lib/urls";
import type { FAQItem, PageContent } from "@/types/content";

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.baseUrl,
    description: site.description,
  };
}

export function breadcrumbSchema(page: PageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl(localizePath("/", page.locale)),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.h1,
        item: absoluteUrl(page.url),
      },
    ],
  };
}

export function faqSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((faq) => faq.schemaEligible)
      .map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
  };
}

export function collectionPageSchema(page: PageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.h1,
    url: absoluteUrl(page.url),
    description: page.summary,
  };
}

export function articleSchema(page: PageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.summary,
    url: absoluteUrl(page.url),
    author: {
      "@type": "Organization",
      name: site.author,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
    },
  };
}

