import { site } from "@/data/site";
import type { PageContent } from "@/types/content";

export const wikiPages: PageContent[] = [
  {
    id: "wiki",
    translationKey: "wiki",
    locale: "en-US",
    routeKind: "fixed",
    slug: "wiki",
    url: "/wiki",
    pageType: "wiki",
    presentation: { shell: "hub" },
    h1: `${site.gameName} Wiki`,
    seoTitle: `${site.gameName} Wiki | Facts, Systems, and Starter Notes`,
    metaDescription:
      "A neutral wiki page template for official facts, game overview notes, systems, platforms, and starter references.",
    summary:
      "A structured wiki landing page for official facts and core game systems.",
    hero: {
      eyebrow: "Wiki",
      subtitle:
        "Collect official facts, systems, platforms, and starter references in one stable page.",
      ctas: [
        { label: "Read Guides", href: "/guides" },
        { label: "Check FAQ", href: "/faq" },
      ],
    },
    quickAnswer:
      "Use this wiki page as the verified fact hub for the game. Do not add unconfirmed mechanics, maps, characters, items, or dates.",
    keyFacts: [
      { label: "Fact source", value: "Official sources only" },
      { label: "Content depth", value: "Starter wiki notes" },
      { label: "Update rule", value: "Expand after launch signals appear" },
    ],
    modules: [
      {
        id: "overview",
        type: "prose",
        heading: "Game overview",
        body:
          "Replace this overview with confirmed information from official store pages, press kits, developer posts, or publisher pages. Keep uncertain details out of the page.",
      },
      {
        id: "systems",
        type: "prose",
        heading: "Systems to document",
        body:
          "Use this section for confirmed systems such as combat, progression, exploration, multiplayer, crafting, quests, or modes. If official sources do not confirm a system, leave it out.",
      },
      {
        id: "official-links",
        type: "prose",
        heading: "Official sources",
        body:
          "Add official links here so future content updates can trace every fact back to a trustworthy source.",
        links: site.officialSources,
      },
      {
        id: "reference-coverage",
        type: "data-table",
        heading: "Reference Coverage",
        columns: [
          { key: "category", label: "Category" },
          { key: "status", label: "Status" },
          { key: "source", label: "Source Rule" },
        ],
        rows: [
          { category: "Core systems", status: "Starter coverage", source: "Official sources" },
          { category: "Guides", status: "Expand with evidence", source: "Verified play research" },
        ],
      },
    ],
    faqIds: ["platforms-known"],
    relatedPageIds: ["guides", "release-date", "faq"],
    schemaTypes: ["CollectionPage", "BreadcrumbList"],
    sourceStatus: "placeholder",
    lastReviewed: "2026-06-18",
  },
];
