import type { PageContent } from "@/types/content";

export const guidesHubPage: PageContent = {
  id: "guides",
  translationKey: "guides",
  locale: "en-US",
  routeKind: "fixed",
  slug: "guides",
  url: "/guides",
  pageType: "guides",
  presentation: { shell: "hub" },
  h1: "ZENONIA 1 Guides — beginner, walkthrough, stats, and endings",
  seoTitle: "ZENONIA 1 Guides | Beginner, Walkthrough, Stats, and Endings",
  metaDescription:
    "Browse the ZENONIA 1 guides: beginner day-one playbook, full walkthrough, stats and growth, good or evil paths, final boss, achievements, and how long to beat.",
  summary:
    "A guide hub for the 2026-08-31 Steam build of ZENONIA 1, pointing to the beginner guide, walkthrough, stats, good and evil paths, final boss, achievements, and game length pages.",
  hero: {
    eyebrow: "Guides",
    subtitle:
      "Pick the guide that matches where you are in your ZENONIA 1 run on the current Steam build.",
    ctas: [
      { label: "Beginner guide", href: "/beginner-guide/" },
      { label: "Walkthrough", href: "/walkthrough/" },
    ],
  },
  quickAnswer:
    "The ZENONIA 1 guides hub covers the beginner day-one playbook, the chapter-by-chapter walkthrough, stat allocation, the good and evil paths, the final boss, the full achievements list, and a how-long-to-beat reference.",
  keyFacts: [
    { label: "Guide set", value: "Beginner, walkthrough, stats, endings" },
    { label: "Class support", value: "Warrior, Paladin, Assassin" },
    { label: "Reviewed", value: "2026-09-06" },
  ],
  modules: [
    {
      id: "beginner-guide",
      type: "entity-grid",
      heading: "Beginner and progression",
      items: [
        { title: "Beginner guide", summary: "First-day playbook after buying ZENONIA 1 on Steam.", href: "/beginner-guide/" },
        { title: "Walkthrough", summary: "Chapter order and where to go next.", href: "/walkthrough/" },
        { title: "Stats and growth", summary: "Stat allocation and growth mechanics across classes.", href: "/stats/" },
        { title: "How long to beat", summary: "Reference for time-to-beat on the Steam build.", href: "/how-long-to-beat/" },
      ],
    },
    {
      id: "endings-and-combat",
      type: "entity-grid",
      heading: "Endings and combat",
      items: [
        { title: "Good and evil paths", summary: "How the morality system shapes endings.", href: "/good-evil-paths/" },
        { title: "Final boss", summary: "Phases, mechanics, and counter-play for the final boss.", href: "/final-boss/" },
        { title: "Achievements", summary: "The full Steam achievement list and unlock conditions.", href: "/achievements/" },
        { title: "Classes hub", summary: "Warrior, Paladin, and Assassin detail pages.", href: "/classes/" },
      ],
    },
  ],
  faqIds: [],
  relatedPageIds: ["beginner-guide", "walkthrough", "stats-and-growth", "good-evil-paths", "final-boss", "achievements", "game-length", "entity-family-classes-en-us"],
  schemaTypes: ["CollectionPage", "BreadcrumbList"],
  sourceStatus: "official",
  lastReviewed: "2026-09-06",
};