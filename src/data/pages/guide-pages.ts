import { site } from "@/data/site";
import type { PageContent } from "@/types/content";

export const guidePages: PageContent[] = [
  {
    id: "guides",
    translationKey: "guides",
    locale: "en-US",
    routeKind: "fixed",
    slug: "guides",
    url: "/guides",
    pageType: "guides",
    presentation: { shell: "hub" },
    h1: `${site.gameName} Guides`,
    seoTitle: `${site.gameName} Guides | Beginner Tips and Starter Help`,
    metaDescription:
      "A starter guides page template for beginner help, early decisions, systems, and future walkthrough categories.",
    summary:
      "A guide index for beginner help and future walkthrough expansion.",
    hero: {
      eyebrow: "Guides",
      subtitle:
        "Start with safe, general guide categories, then expand into detailed walkthroughs after verified demand appears.",
      ctas: [
        { label: "Open Wiki", href: "/wiki" },
        { label: "Release Info", href: "/release-date" },
      ],
    },
    quickAnswer:
      "V1 guides should organize the future help structure without inventing unverified walkthrough details.",
    keyFacts: [
      { label: "Guide depth", value: "Starter structure" },
      { label: "Avoid", value: "Unverified builds, loot, maps, or quest steps" },
      { label: "Next upgrade", value: "Full guide pages after content research" },
    ],
    modules: [
      {
        id: "beginner",
        type: "prose",
        heading: "Beginner guide",
        body:
          "Use this section for safe onboarding advice grounded in official descriptions. Avoid specific tactics unless they are verified by official material or later play research.",
      },
      {
        id: "systems",
        type: "prose",
        heading: "Systems guide categories",
        body:
          "Add confirmed categories such as combat, crafting, classes, exploration, quests, equipment, difficulty, or co-op only after official sources support them.",
      },
      {
        id: "future-guides",
        type: "prose",
        heading: "Future guide expansion",
        body:
          "After launch, split high-demand topics into dedicated pages. V1 keeps this page as a stable guide index so the site is useful without pretending to be complete.",
      },
    ],
    faqIds: ["guide-depth"],
    relatedPageIds: ["wiki", "release-date", "faq"],
    schemaTypes: ["CollectionPage", "BreadcrumbList", "FAQPage"],
    sourceStatus: "placeholder",
    lastReviewed: "2026-06-18",
  },
];
