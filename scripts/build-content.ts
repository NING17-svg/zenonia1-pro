#!/usr/bin/env tsx
/**
 * Build script: reads V3 markdown content files and emits TypeScript page modules.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const CONTENT_DIR = "/Users/ningshiqi/.local/share/game-workflow/worktrees/one-click-builder/site-launch/tasks/zenonia1-pro/content/locales/en-US";
const OUT_DIR = "/Users/ningshiqi/project/zenonia1-pro/src/data/pages-generated";

interface Frontmatter {
  page_id: string;
  locale: string;
  route_kind: string;
  route: string;
  page_type: string;
  title: string;
  meta_description: string;
  h1: string;
  research_date: string;
  content_status: string;
  primary_keyword?: string;
}

function parseFrontmatter(text: string): { fm: Frontmatter; body: string } {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("Missing frontmatter");
  const yamlText = match[1];
  const body = match[2];
  const fm: Record<string, string> = {};
  for (const line of yamlText.split("\n")) {
    const m = line.match(/^(\w+):\s*"?(.+?)"?$/);
    if (m) fm[m[1]] = m[2];
  }
  return { fm: fm as unknown as Frontmatter, body };
}

interface Section {
  heading: string;
  body: string;
  faqs: Array<{ question: string; answer: string }>;
  links: Array<{ label: string; href: string }>;
}

function parseSections(md: string): Section[] {
  const lines = md.split("\n");
  const sections: Section[] = [];
  let current: Section | null = null;
  let inFaq = false;
  let inLinks = false;
  let inSources = false;
  let inFactBoundaries = false;
  let currentFaq: { question: string; answer: string } | null = null;

  for (const line of lines) {
    const h2 = line.match(/^## (.+)$/);
    const h3 = line.match(/^### (.+)$/);

    if (h2) {
      if (current) sections.push(current);
      const heading = h2[1];
      inFaq = heading.toLowerCase().includes("frequently asked");
      inLinks = heading.toLowerCase().includes("internal link");
      inSources = heading.toLowerCase().startsWith("sources");
      inFactBoundaries = heading.toLowerCase().includes("fact boundar");
      current = { heading, body: "", faqs: [], links: [] };
      currentFaq = null;
      continue;
    }

    if (h3 && current && inFaq) {
      if (currentFaq) {
        current.faqs.push(currentFaq);
      }
      currentFaq = { question: h3[1], answer: "" };
      continue;
    }

    if (!current) continue;

    if (h3) {
      continue;
    }

    const linkMatch = line.match(/^- `(.+?)` -> `(.+?)`(.*)$/);
    if (inLinks && linkMatch) {
      current.links.push({ label: linkMatch[1], href: linkMatch[2] });
      continue;
    }

    const listItem = line.match(/^- (.+)$/);
    if (listItem) {
      if (inSources || inFactBoundaries) {
        // skip sources/fact boundary bullets in body
        continue;
      }
      if (currentFaq) {
        currentFaq.answer += (currentFaq.answer ? "\n" : "") + listItem[1];
        continue;
      }
      current.body += (current.body ? "\n" : "") + listItem[1];
      continue;
    }

    // Strip markdown comments
    if (/^<!--/.test(line.trim())) continue;
    if (/^-->/.test(line.trim())) continue;

    if (line.trim().length === 0) continue;
    if (line.startsWith("# ")) continue; // h1 already used as page h1

    if (currentFaq) {
      currentFaq.answer += (currentFaq.answer ? "\n" : "") + line;
    } else {
      current.body += (current.body ? "\n" : "") + line;
    }
  }
  if (currentFaq && current) current.faqs.push(currentFaq);
  if (current) sections.push(current);

  return sections;
}

function slugToUrl(route: string): string {
  return route.replace(/\/+$/, "");
}

// Map slug strings back to page ids. Built from the Site Plan and content
// package.
const SLUG_TO_PAGE_ID: Record<string, string> = {
  "": "home",
  "release-date": "release-date",
  "switch-release": "switch-and-mobile-ports",
  "demo": "steam-demo",
  "remaster-vs-original": "remaster-vs-original",
  "system-requirements": "system-requirements",
  "beginner-guide": "beginner-guide",
  "walkthrough": "walkthrough",
  "stats": "stats-and-growth",
  "good-evil-paths": "good-evil-paths",
  "final-boss": "final-boss",
  "achievements": "achievements",
  "how-long-to-beat": "game-length",
  "is-it-worth-playing": "is-it-worth-playing",
  "zenonia-series-order": "series-and-remaster-plans",
  "classes": "entity-family-classes-en-us",
  "classes/warrior": "entity-classes-warrior-en-us",
  "classes/paladin": "entity-classes-paladin-en-us",
  "classes/assassin": "entity-classes-assassin-en-us",
};

function makePage(record: { fm: Frontmatter; sections: Section[] }, faqItems: Array<{id: string; question: string}>) {
  const { fm, sections } = record;
  const url = slugToUrl(fm.route);

  // Pull sections by purpose
  const quickAnswer = sections.find((s) => /quick answer/i.test(s.heading));
  const faqSection = sections.find((s) => /frequently asked/i.test(s.heading));
  const internalLinks = sections.find((s) => /internal link/i.test(s.heading));

  // Build a FAQ bank for the site (collected across all pages)
  const pageFaqs: Array<{ id: string; question: string; answer: string }> = [];
  if (faqSection) {
    for (const f of faqSection.faqs) {
      const id = `${fm.page_id}--${f.question.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60)}`;
      pageFaqs.push({ id, question: f.question, answer: f.answer });
    }
  }

  // Build modules: one prose module per non-meta section
  const modules: Array<Record<string, unknown>> = [];
  for (const s of sections) {
    const isMeta = /quick answer|frequently asked|sources|fact boundar|internal link/i.test(s.heading);
    if (isMeta) continue;
    modules.push({
      id: s.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60),
      type: "prose",
      heading: s.heading,
      body: s.body,
    });
  }

  // Map page_type to PageType
  const pageTypeMap: Record<string, string> = {
    homepage: "home",
    status: "release",
    guide: "guides",
    comparison: "guides",
    reference: "guides",
    explanation: "guides",
    list: "guides",
  };
  const pageType = pageTypeMap[fm.page_type] || "guides";

  // Map route_kind to RouteKind
  const routeKind = fm.route_kind === "home" ? "home" : fm.route_kind === "tool" ? "tool" : fm.route_kind === "entity" ? "fixed" : "fixed";

  // Map pageType to presentation shell
  const presentation = fm.route_kind === "home"
    ? { shell: "home" as const }
    : pageType === "guides" && modules.length >= 4
      ? { shell: "hub" as const }
      : { shell: "content" as const, variant: "reading-right-rail" as const };

  const summary = quickAnswer?.body.split("\n")[0] ?? fm.h1;

  const ctas: Array<{label: string; href: string}> = [];
  if (internalLinks) {
    for (const l of internalLinks.links.slice(0, 2)) {
      ctas.push({ label: l.label, href: l.href });
    }
  }

  const keyFacts: Array<{label: string; value: string}> = [];
  if (quickAnswer) {
    const facts = quickAnswer.body.split(/\.\s+/).slice(0, 3);
    for (const f of facts) {
      if (f.trim().length > 10) {
        keyFacts.push({ label: fm.primary_keyword || "Key fact", value: f.trim() });
      }
    }
  }

  const slug = fm.page_id === "home" ? "" : url.replace(/^\//, "").replace(/\/$/, "");
  const finalUrl = fm.page_id === "home" ? "/" : url;

  // Map slug for cross-reference (used in related page IDs).
  void slug;

  // Determine related page ids from internal links
  const relatedPageIds: string[] = [];
  if (internalLinks) {
    for (const l of internalLinks.links) {
      const path = l.href.replace(/\/+$/, "");
      if (path === "/") {
        relatedPageIds.push("home");
      } else {
        const slug = path.replace(/^\//, "").replace(/\/$/, "");
        const id = SLUG_TO_PAGE_ID[slug] ?? slug;
        if (!relatedPageIds.includes(id)) relatedPageIds.push(id);
      }
    }
  }

  return {
    page: {
      id: fm.page_id,
      translationKey: fm.page_id,
      locale: fm.locale,
      routeKind,
      slug,
      url: finalUrl,
      pageType,
      presentation,
      h1: fm.h1,
      seoTitle: fm.title,
      metaDescription: fm.meta_description,
      summary,
      hero: {
        eyebrow: fm.page_id === "home" ? "Guide hub" : fm.page_id.replace(/-/g, " "),
        subtitle: fm.h1,
        ctas,
      },
      quickAnswer: quickAnswer?.body ?? "",
      keyFacts,
      modules,
      faqIds: pageFaqs.map((f) => f.id),
      relatedPageIds,
      schemaTypes: ["Article", "BreadcrumbList", "FAQPage"],
      sourceStatus: "official",
      lastReviewed: fm.research_date,
    },
    pageFaqs,
  };
}

function main() {
  // Only clean generated markdown-derived files; preserve hand-authored fixture pages.
  for (const file of ["generated-pages.ts", "generated-faqs.ts"]) {
    try {
      rmSync(join(OUT_DIR, file), { force: true });
    } catch {
      // ignore
    }
  }
  mkdirSync(OUT_DIR, { recursive: true });

  const pagesDir = join(CONTENT_DIR, "pages");
  const homeFile = join(CONTENT_DIR, "homepage.md");
  const allFaqs: Array<{id: string; question: string; answer: string; pageId: string}> = [];

  const pages: unknown[] = [];
  const faqFileMap: Record<string, string> = {};

  // homepage
  const homeText = readFileSync(homeFile, "utf8");
  const homeParsed = parseFrontmatter(homeText);
  const homeSections = parseSections(homeParsed.body);
  const homeResult = makePage({ fm: homeParsed.fm, sections: homeSections }, []);
  pages.push(homeResult.page);
  for (const f of homeResult.pageFaqs) {
    allFaqs.push({ ...f, pageId: homeParsed.fm.page_id });
  }

  for (const fname of readdirSync(pagesDir).sort()) {
    if (!fname.endsWith(".md")) continue;
    const text = readFileSync(join(pagesDir, fname), "utf8");
    const parsed = parseFrontmatter(text);
    const sections = parseSections(parsed.body);
    const result = makePage({ fm: parsed.fm, sections }, []);
    pages.push(result.page);
    for (const f of result.pageFaqs) {
      allFaqs.push({ ...f, pageId: parsed.fm.page_id });
    }
  }

  // Write all pages into a single file
  const pageLines: string[] = [];
  for (const p of pages) {
    pageLines.push(JSON.stringify(p, null, 2));
  }

  // Each page must export a unique constant. Generate variable names.
  const pageVarNames: Record<string, string> = {};
  const seenNames = new Set<string>();
  for (const p of pages as Array<{id: string}>) {
    let name = p.id.replace(/[^a-zA-Z0-9_]/g, "_");
    if (/^\d/.test(name)) name = "p_" + name;
    let unique = name;
    let i = 1;
    while (seenNames.has(unique)) {
      unique = `${name}_${i++}`;
    }
    seenNames.add(unique);
    pageVarNames[p.id] = unique;
  }

  let pagesTs = "import type { PageContent } from \"@/types/content\";\n\n";
  pagesTs += "export const generatedPages: PageContent[] = [\n";
  pagesTs += pages.map((p) => JSON.stringify(p)).join(",\n");
  pagesTs += "\n];\n";

  writeFileSync(join(OUT_DIR, "generated-pages.ts"), pagesTs);

  // Write FAQ bank
  let faqTs = "import type { FAQItem } from \"@/types/content\";\n\n";
  faqTs += "export const generatedFaqs: FAQItem[] = [\n";
  faqTs += allFaqs.map((f) => JSON.stringify({
    id: f.id,
    question: f.question,
    answer: f.answer,
    pageIds: [f.pageId],
    category: "gameplay",
    schemaEligible: true,
    sourceStatus: "official",
  })).join(",\n");
  faqTs += "\n];\n";
  writeFileSync(join(OUT_DIR, "generated-faqs.ts"), faqTs);

  console.log(`Generated ${pages.length} pages and ${allFaqs.length} FAQs`);
}

main();