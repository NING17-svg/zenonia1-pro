import type { PageContent } from "@/types/content";

export const faqPage: PageContent = {
  id: "faq",
  translationKey: "faq",
  locale: "en-US",
  routeKind: "fixed",
  slug: "faq",
  url: "/faq",
  pageType: "faq",
  presentation: { shell: "content", variant: "reading-full" },
  h1: "ZENONIA 1 FAQ",
  seoTitle: "ZENONIA 1 FAQ | Common Questions",
  metaDescription:
    "Common questions about the 2026-08-31 Steam release of ZENONIA 1: release date, classes, Demo, Switch, remaster, and buying decision.",
  summary:
    "A compact FAQ covering the most common questions about ZENONIA 1's Steam release, classes, Demo, Switch status, and remaster framing.",
  hero: {
    eyebrow: "FAQ",
    subtitle:
      "Common questions about ZENONIA 1's Steam release, classes, Demo, Switch status, and remaster framing.",
    ctas: [
      { label: "Release info", href: "/release-date/" },
      { label: "Classes", href: "/classes/" },
    ],
  },
  quickAnswer:
    "The ZENONIA 1 FAQ answers the most common launch questions: release date, price, classes, Demo availability, Switch status, and remaster framing.",
  keyFacts: [
    { label: "FAQ scope", value: "Steam release, classes, Demo, Switch, remaster" },
    { label: "Source rule", value: "Official Steam and Demo pages only" },
    { label: "Reviewed", value: "2026-09-06" },
  ],
  modules: [
    {
      id: "faq-policy",
      type: "prose",
      heading: "FAQ policy",
      body:
        "Keep answers short and grounded in the official Steam store page and the official ZENONIA Demo page. Anything that the current Steam build does not confirm is dated as Not confirmed for the Steam build as of 2026-09-06.",
    },
  ],
  faqIds: [],
  relatedPageIds: ["release-date", "entity-family-classes-en-us", "is-it-worth-playing"],
  schemaTypes: ["FAQPage", "BreadcrumbList"],
  sourceStatus: "official",
  lastReviewed: "2026-09-06",
};