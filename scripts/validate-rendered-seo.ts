import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { faqItems } from "../src/data/faq";
import { site } from "../src/data/site";
import {
  getAllPages,
  getFaqsForPage,
  getFinalRouteManifest,
  getLanguageAlternates,
} from "../src/lib/content";
import { faqSchema } from "../src/lib/schema";
import { metadataForPage } from "../src/lib/seo";
import { absoluteUrl } from "../src/lib/urls";
import { buildLocaleSearchIndex, getSearchIndexUrl } from "../src/lib/search";

function fail(message: string): never {
  console.error(`SEO validation failed: ${message}`);
  process.exit(1);
}

function asString(value: string | URL): string {
  return value instanceof URL ? value.toString() : value;
}

const pages = getAllPages();
const routeManifest = getFinalRouteManifest();
const sitemapEntries = sitemap();
const sitemapByUrl = new Map(sitemapEntries.map((entry) => [entry.url, entry]));

if (sitemapEntries.length !== pages.length) {
  fail(`expected sitemap to contain ${pages.length} URLs, found ${sitemapEntries.length}`);
}
if (routeManifest.length !== pages.length) {
  fail(`expected route manifest to contain ${pages.length} routes, found ${routeManifest.length}`);
}
if (
  routeManifest.some((entry) => entry.url.startsWith("/search-index/")) ||
  sitemapEntries.some((entry) => entry.url.includes("/search-index/"))
) {
  fail("search index resources must not enter the content route manifest or sitemap");
}

for (const page of pages) {
  const metadata = metadataForPage(page);
  const canonical = metadata.alternates?.canonical;
  const expectedAlternates = getLanguageAlternates(page);
  const metadataLanguages = metadata.alternates?.languages as
    | Record<string, string | URL>
    | undefined;

  if (!metadata.title || !metadata.description) {
    fail(`page ${page.id} is missing metadata title or description`);
  }
  if (canonical !== absoluteUrl(page.url)) fail(`page ${page.id} canonical mismatch`);
  if (!metadataLanguages) fail(`page ${page.id} is missing hreflang alternates`);

  for (const [locale, url] of Object.entries(expectedAlternates)) {
    if (asString(metadataLanguages[locale]) !== absoluteUrl(url)) {
      fail(`page ${page.id} hreflang mismatch for ${locale}`);
    }
  }
  const xDefault = expectedAlternates[site.primaryLocale] || page.url;
  if (asString(metadataLanguages["x-default"]) !== absoluteUrl(xDefault)) {
    fail(`page ${page.id} x-default mismatch`);
  }

  const sitemapEntry = sitemapByUrl.get(absoluteUrl(page.url));
  if (!sitemapEntry) fail(`sitemap is missing ${page.url}`);
  const sitemapLanguages = sitemapEntry.alternates?.languages as
    | Record<string, string>
    | undefined;
  if (!sitemapLanguages) fail(`sitemap entry ${page.url} is missing alternates`);
  for (const [locale, url] of Object.entries(expectedAlternates)) {
    if (sitemapLanguages[locale] !== absoluteUrl(url)) {
      fail(`sitemap entry ${page.url} alternate mismatch for ${locale}`);
    }
  }

  const manifestEntry = routeManifest.find((entry) => entry.id === page.id);
  if (!manifestEntry || manifestEntry.url !== page.url) {
    fail(`route manifest is missing ${page.id}`);
  }

  const faqs = getFaqsForPage(page);
  if (faqs.length) {
    const schema = faqSchema(faqs);
    if (!Array.isArray(schema.mainEntity) || schema.mainEntity.length === 0) {
      fail(`page ${page.id} has FAQ content but no FAQ schema entities`);
    }
  }
}

const robotsConfig = robots();
if (robotsConfig.sitemap !== `${site.baseUrl}/sitemap.xml`) {
  fail("robots.txt sitemap URL is not aligned with site.baseUrl");
}

const analyticsSource = readFileSync(join(process.cwd(), "src/lib/analytics.tsx"), "utf8");
const siteSource = readFileSync(join(process.cwd(), "src/data/site.ts"), "utf8");
const layoutSource = readFileSync(join(process.cwd(), "src/app/layout.tsx"), "utf8");
if (!analyticsSource.includes("googletagmanager.com/gtag/js")) {
  fail("GA4 analytics hook is missing the Google tag script");
}
if (!siteSource.includes("NEXT_PUBLIC_GA_MEASUREMENT_ID")) {
  fail("site config is not wired to the public GA4 measurement ID");
}
if (!siteSource.includes("NEXT_PUBLIC_BING_SITE_AUTH_CODE")) {
  fail("site config is not wired to the public Bing authentication code");
}
if (!layoutSource.includes('name="msvalidate.01"')) {
  fail("root layout is missing the Bing verification meta tag hook");
}
if (
  !layoutSource.includes('name="google-adsense-account"') ||
  !layoutSource.includes('content="ca-pub-4194035852162505"')
) {
  fail("root layout is missing the fixed AdSense account meta tag");
}
if (
  !layoutSource.includes(
    "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4194035852162505",
  )
) {
  fail("root layout is missing the fixed AdSense script");
}
const adsTxtSource = readFileSync(join(process.cwd(), "public/ads.txt"), "utf8");
if (
  !adsTxtSource
    .split(/\r?\n/)
    .map((line) => line.trim())
    .includes("google.com, pub-4194035852162505, DIRECT, f08c47fec0942fa0")
) {
  fail("public/ads.txt is missing the fixed AdSense publisher record");
}

if (!faqItems.some((faq) => faq.schemaEligible)) {
  fail("no schema-eligible FAQ items found");
}

const prerenderManifestPath = join(process.cwd(), ".next/prerender-manifest.json");
if (!existsSync(prerenderManifestPath)) {
  fail("Next build did not emit a prerender manifest for static search resources");
}
const prerenderManifest = JSON.parse(readFileSync(prerenderManifestPath, "utf8")) as {
  routes?: Record<string, unknown>;
};
const searchRouteManifestUrls = new Set(routeManifest.map((entry) => entry.url));
for (const locale of site.locales) {
  const searchUrl = getSearchIndexUrl(locale.code);
  if (!prerenderManifest.routes?.[searchUrl]) {
    fail(`static search resource ${searchUrl} is missing from the prerender manifest`);
  }

  const bodyPath = join(
    process.cwd(),
    ".next/server/app/search-index",
    `${locale.code}.body`,
  );
  if (!existsSync(bodyPath)) fail(`static search resource body is missing for ${locale.code}`);
  const entries = JSON.parse(readFileSync(bodyPath, "utf8")) as Array<{
    locale: string;
    url: string;
  }>;
  const expectedEntries = buildLocaleSearchIndex(locale.code);
  if (JSON.stringify(entries) !== JSON.stringify(expectedEntries)) {
    fail(`static search resource ${searchUrl} does not match indexable page data`);
  }
  if (entries.some((entry) => entry.locale !== locale.code)) {
    fail(`static search resource ${searchUrl} contains another locale`);
  }
  for (const entry of entries) {
    if (!searchRouteManifestUrls.has(entry.url)) {
      fail(`static search result ${entry.url} is not in the final route manifest`);
    }
  }
}

console.log(
  `SEO validation passed: ${pages.length} pages, ${sitemapEntries.length} sitemap URLs, ` +
    `${routeManifest.length} manifest routes`,
);
