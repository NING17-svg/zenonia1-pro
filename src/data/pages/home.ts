import { site } from "@/data/site";
import type { PageContent } from "@/types/content";

export const homePage: PageContent = {
  id: "home",
  translationKey: "home",
  locale: "en-US",
  routeKind: "home",
  slug: "",
  url: "/",
  pageType: "home",
  presentation: { shell: "home" },
  h1: `${site.gameName} Guide Hub`,
  seoTitle: `${site.gameName} Guide Hub | Wiki, Guides, Release Date, FAQ`,
  metaDescription:
    "A clean guide hub template with wiki notes, starter guides, release information, FAQs, and trust pages for a game攻略站 launch.",
  summary:
    "Start here for the wiki index, guide categories, launch information, and frequently asked questions.",
  hero: {
    eyebrow: "Unofficial guide hub",
    subtitle: site.tagline,
    ctas: [
      { label: "Open Wiki", href: "/wiki" },
      { label: "Browse Guides", href: "/guides" },
    ],
  },
  quickAnswer:
    "This homepage acts as the central guide hub for the selected game, linking users to wiki notes, guides, release information, and FAQs.",
  keyFacts: [
    { label: "Site type", value: "Unofficial guide hub" },
    { label: "V1 page set", value: "5 content pages + 4 trust pages" },
    { label: "Source rule", value: "Official facts only before launch" },
  ],
  modules: [
    {
      id: "start-here",
      type: "prose",
      heading: "Start here",
      body:
        "Use the wiki page for core game facts, the guides page for player-facing help, and the release page for official launch timing. Replace each placeholder with verified information before publishing.",
      links: [
        { label: "Wiki", href: "/wiki", description: "Core facts and game systems." },
        { label: "Guides", href: "/guides", description: "Starter guide categories." },
        { label: "Release Date", href: "/release-date", description: "Official launch timing." },
      ],
    },
    {
      id: "safe-launch",
      type: "prose",
      heading: "Safe launch baseline",
      body:
        "The template keeps the first version small so the launch workflow can verify routing, metadata, sitemap, robots, analytics, and Search Console submission before deeper content work begins.",
    },
    {
      id: "example-entries",
      type: "entity-grid",
      heading: "Guide Entry Points",
      items: [
        { title: "Wiki", summary: "Core facts and game systems.", href: "/wiki" },
        { title: "Guides", summary: "Starter guide categories.", href: "/guides" },
        { title: "Release Date", summary: "Official launch timing.", href: "/release-date" },
        { title: "FAQ", summary: "Short answers and source context.", href: "/faq" },
      ],
    },
  ],
  faqIds: ["what-is-this-site", "is-official"],
  relatedPageIds: ["wiki", "guides", "release-date", "faq"],
  schemaTypes: ["WebSite", "CollectionPage", "FAQPage"],
  sourceStatus: "internal",
  lastReviewed: "2026-06-18",
};
