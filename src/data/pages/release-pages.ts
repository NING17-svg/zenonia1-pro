import { site } from "@/data/site";
import type { PageContent } from "@/types/content";

export const releasePages: PageContent[] = [
  {
    id: "release-date",
    translationKey: "release-date",
    locale: "en-US",
    routeKind: "fixed",
    slug: "release-date",
    url: "/release-date",
    pageType: "release",
    presentation: { shell: "content", variant: "reading-right-rail" },
    h1: `${site.gameName} Release Date`,
    seoTitle: `${site.gameName} Release Date | Platforms and Launch Info`,
    metaDescription:
      "A release date page template for official launch timing, platforms, editions, and store links.",
    summary:
      "A single page for official release timing, platforms, editions, and launch status.",
    hero: {
      eyebrow: "Release info",
      subtitle:
        "Track release timing from official store pages, publisher announcements, and developer updates.",
      ctas: [
        { label: "Read FAQ", href: "/faq" },
        { label: "Open Wiki", href: "/wiki" },
      ],
    },
    quickAnswer:
      "Replace this answer with the official release timing. If no date is confirmed, say that the release date is not officially confirmed yet.",
    keyFacts: [
      { label: "Release timing", value: "Replace with official date or window" },
      { label: "Platforms", value: "Replace with confirmed platforms" },
      { label: "Source rule", value: "Official pages only" },
    ],
    modules: [
      {
        id: "date",
        type: "prose",
        heading: "Release date status",
        body:
          "Use the official date, release window, or pending status. Do not infer a date from retailer placeholders, rumors, or search snippets.",
      },
      {
        id: "platforms",
        type: "prose",
        heading: "Platforms",
        body:
          "List only confirmed platforms. If platforms are not confirmed, state that platform information is pending official confirmation.",
      },
      {
        id: "stores",
        type: "prose",
        heading: "Store and official links",
        body:
          "Add official store links or publisher pages after the one-click builder collects verified source URLs.",
        links: site.officialSources,
      },
    ],
    faqIds: ["release-date-known", "platforms-known"],
    relatedPageIds: ["wiki", "guides", "faq"],
    schemaTypes: ["Article", "BreadcrumbList", "FAQPage"],
    sourceStatus: "placeholder",
    lastReviewed: "2026-06-18",
  },
];
