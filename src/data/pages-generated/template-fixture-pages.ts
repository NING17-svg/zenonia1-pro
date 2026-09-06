import type { PageContent } from "@/types/content";

const FIXTURE_MODULE = {
  id: "fixture",
  type: "prose" as const,
  heading: "Fixture",
  body: "Internal fixture page; not part of the public site.",
};

const FIXTURE_KEY_FACTS = [{ label: "Type", value: "Internal fixture" }];

export const wikiFixturePage: PageContent = {
  id: "wiki",
  translationKey: "wiki",
  locale: "en-US",
  routeKind: "fixed",
  slug: "__wiki_fixture",
  url: "/__wiki_fixture",
  pageType: "wiki",
  presentation: { shell: "hub" },
  h1: "Wiki fixture",
  seoTitle: "Wiki fixture",
  metaDescription: "Internal fixture page; not part of the public site.",
  summary: "Internal fixture page used by the template validator.",
  hero: {
    eyebrow: "Fixture",
    subtitle: "Internal fixture page; not part of the public site.",
    ctas: [],
  },
  quickAnswer: "Internal fixture page used by the template validator.",
  keyFacts: FIXTURE_KEY_FACTS,
  modules: [FIXTURE_MODULE],
  faqIds: [],
  relatedPageIds: [],
  schemaTypes: [],
  sourceStatus: "internal",
  lastReviewed: "2026-09-06",
};

export const aboutFixturePage: PageContent = {
  id: "about",
  translationKey: "about",
  locale: "en-US",
  routeKind: "fixed",
  slug: "__about_fixture",
  url: "/__about_fixture",
  pageType: "site",
  presentation: { shell: "content", variant: "reading-full" },
  h1: "About fixture",
  seoTitle: "About fixture",
  metaDescription: "Internal fixture page; not part of the public site.",
  summary: "Internal fixture page used by the template validator.",
  hero: {
    eyebrow: "Fixture",
    subtitle: "Internal fixture page; not part of the public site.",
    ctas: [],
  },
  quickAnswer: "Internal fixture page used by the template validator.",
  keyFacts: FIXTURE_KEY_FACTS,
  modules: [FIXTURE_MODULE],
  faqIds: [],
  relatedPageIds: [],
  schemaTypes: [],
  sourceStatus: "internal",
  lastReviewed: "2026-09-06",
};