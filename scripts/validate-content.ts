import { assetManifest } from "../src/data/assets";
import { entityFamilies } from "../src/data/entities";
import { faqItems } from "../src/data/faq";
import { site } from "../src/data/site";
import { getAllPages, getPageById } from "../src/lib/content";
import { localizePath, normalizePath } from "../src/lib/localization";
import type { PageContent } from "../src/types/content";
import { guideModuleTypes } from "../src/types/modules";

function fail(message: string): never {
  console.error(`content validation failed: ${message}`);
  process.exit(1);
}

function referencedAssetIds(page: PageContent): string[] {
  const ids = page.hero.assetId ? [page.hero.assetId] : [];
  for (const guideModule of page.modules) {
    if (guideModule.type === "entity-grid") {
      ids.push(...guideModule.items.flatMap((item) => (item.assetId ? [item.assetId] : [])));
    }
    if (guideModule.type === "media-gallery") ids.push(...guideModule.assetIds);
  }
  return ids;
}

const pages = getAllPages();
const supportedModuleTypes = new Set<string>(guideModuleTypes);
const supportedLocales = new Set(site.locales.map((locale) => locale.code));

if (!pages.length) fail("site has no pages");

const ids = new Set<string>();
const urls = new Set<string>();
const localizedTranslationKeys = new Set<string>();

for (const locale of site.locales) {
  const expectedHome = localizePath("/", locale.code);
  const home = pages.find(
    (page) => page.pageType === "home" && page.locale === locale.code && page.url === expectedHome,
  );
  if (!home) fail(`locale ${locale.code} is missing homepage ${expectedHome}`);
}

for (const page of pages) {
  if (
    !page.id ||
    !page.translationKey ||
    !page.locale ||
    !page.routeKind ||
    !page.h1 ||
    !page.seoTitle ||
    !page.metaDescription
  ) {
    fail(`page ${page.id || page.url} is missing required route or metadata fields`);
  }

  if (!supportedLocales.has(page.locale)) {
    fail(`page ${page.id} uses undeclared locale ${page.locale}`);
  }

  if (ids.has(page.id)) fail(`duplicate page id ${page.id}`);
  ids.add(page.id);

  if (urls.has(page.url)) fail(`duplicate page URL ${page.url}`);
  urls.add(page.url);

  const translationLocaleKey = `${page.translationKey}:${page.locale}`;
  if (localizedTranslationKeys.has(translationLocaleKey)) {
    fail(`duplicate translation ${translationLocaleKey}`);
  }
  localizedTranslationKeys.add(translationLocaleKey);

  const expectedUrl = page.slug ? normalizePath(`/${page.slug}`) : "/";
  if (page.url !== expectedUrl) fail(`page ${page.id} has mismatched slug/url`);

  if (!page.hero.subtitle || !page.quickAnswer) {
    fail(`page ${page.id} is missing hero subtitle or quick answer`);
  }

  if (!page.keyFacts.length && page.routeKind !== "entity-hub") {
    fail(`page ${page.id} has no key facts`);
  }

  if (!page.modules.length) fail(`page ${page.id} has no modules`);

  const moduleIds = new Set<string>();
  for (const guideModule of page.modules) {
    if (!guideModule.id.trim()) fail(`page ${page.id} has a module without an id`);
    if (!supportedModuleTypes.has(guideModule.type)) {
      fail(`page ${page.id} has unsupported module type ${guideModule.type}`);
    }
    if (moduleIds.has(guideModule.id)) {
      fail(`page ${page.id} has duplicate module id ${guideModule.id}`);
    }
    moduleIds.add(guideModule.id);
  }

  for (const assetId of referencedAssetIds(page)) {
    if (!Object.prototype.hasOwnProperty.call(assetManifest, assetId)) {
      fail(`page ${page.id} references missing asset ${assetId}`);
    }
  }

  for (const relatedId of page.relatedPageIds) {
    const related = getPageById(relatedId);
    if (!related) fail(`page ${page.id} links to missing related page ${relatedId}`);
    if (related.locale !== page.locale) {
      fail(`page ${page.id} links across locales to ${relatedId}`);
    }
  }

  for (const faqId of page.faqIds) {
    const faq = faqItems.find((item) => item.id === faqId);
    if (!faq) fail(`page ${page.id} references missing FAQ ${faqId}`);
    if (!faq.pageIds.includes(page.id)) {
      fail(`FAQ ${faqId} does not list page ${page.id}`);
    }
  }
}

for (const faq of faqItems) {
  if (!faq.question || !faq.answer) fail(`FAQ ${faq.id} is missing question or answer`);
  for (const pageId of faq.pageIds) {
    if (!getPageById(pageId)) fail(`FAQ ${faq.id} references missing page ${pageId}`);
  }
}

const familyIds = new Set<string>();
for (const family of entityFamilies) {
  if (familyIds.has(family.id)) fail(`duplicate entity family ${family.id}`);
  familyIds.add(family.id);
  const placeholders = family.routePattern.match(/\{[^}]+\}/g) || [];
  const slugCount = placeholders.filter((placeholder) => placeholder === "{slug}").length;
  const hasUnknownPlaceholder = placeholders.some(
    (placeholder) => placeholder !== "{slug}" && placeholder !== "{locale}",
  );
  if (
    slugCount !== 1 ||
    hasUnknownPlaceholder ||
    !/\/?\{slug\}\/?$/.test(family.routePattern)
  ) {
    fail(
      `entity family ${family.id} may use {locale} and must end with exactly one {slug}`,
    );
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(family.lastReviewed)) {
    fail(`entity family ${family.id} has invalid lastReviewed date`);
  }
  const recordSlugs = new Set<string>();
  for (const locale of family.locales) {
    if (!supportedLocales.has(locale)) {
      fail(`entity family ${family.id} uses undeclared locale ${locale}`);
    }
    if (!family.localeContent[locale]) {
      fail(`entity family ${family.id} is missing locale content for ${locale}`);
    }
  }
  for (const record of family.records) {
    if (recordSlugs.has(record.slug)) {
      fail(`entity family ${family.id} has duplicate slug ${record.slug}`);
    }
    recordSlugs.add(record.slug);
    if (!record.sourceUrls.length || record.sourceUrls.some((url) => !url.startsWith("https://"))) {
      fail(`entity ${family.id}/${record.slug} has invalid sources`);
    }
    if (
      record.image?.assetId &&
      !Object.prototype.hasOwnProperty.call(assetManifest, record.image.assetId)
    ) {
      fail(`entity ${family.id}/${record.slug} references missing asset ${record.image.assetId}`);
    }
  }
}

for (const family of entityFamilies) {
  for (const record of family.records) {
    for (const relation of record.relations || []) {
      const targetFamily = entityFamilies.find((candidate) => candidate.id === relation.targetFamily);
      if (!targetFamily) {
        fail(`entity ${family.id}/${record.slug} references missing family ${relation.targetFamily}`);
      }
      for (const slug of relation.slugs) {
        if (!targetFamily.records.some((candidate) => candidate.slug === slug)) {
          fail(`entity ${family.id}/${record.slug} references missing ${relation.targetFamily}/${slug}`);
        }
      }
    }
  }
}

console.log(
  `content validation passed: ${pages.length} pages, ${faqItems.length} FAQs, ` +
    `${entityFamilies.length} entity families`,
);
