import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { buildSitemapEntries } from "../src/app/sitemap";
import { AssetMedia } from "../src/components/media/AssetMedia";
import { PageHero } from "../src/components/pages/PageHero";
import {
  generateStaticParams as generateSearchIndexStaticParams,
} from "../src/app/search-index/[locale]/route";
import { ads } from "../src/data/ads";
import { assetManifest } from "../src/data/assets";
import { footerNavigation, primaryNavigation } from "../src/data/navigation";
import { site } from "../src/data/site";
import { theme } from "../src/data/theme";
import {
  getAllPages,
  getFinalRouteManifest,
  getIndexablePages,
  getRecentUpdates,
} from "../src/lib/content";
import { buildEntityPages } from "../src/lib/entities";
import { localizePath } from "../src/lib/localization";
import { metadataForPage } from "../src/lib/seo";
import { themeClassName, themeStyle } from "../src/lib/theme";
import { absoluteUrl } from "../src/lib/urls";
import {
  buildLocaleSearchIndex,
  buildSearchIndex,
  searchIndex,
} from "../src/lib/search";
import type { AdConfig } from "../src/types/ads";
import type { AssetManifest, AssetRecord } from "../src/types/assets";
import { guideModuleTypes } from "../src/types/modules";
import {
  contentVariants,
  homeVariants,
  hubVariants,
  themeModes,
  workspaceVariants,
} from "../src/types/theme";
import type { ThemeConfig } from "../src/types/theme";
import { templateScenarios } from "./fixtures/v2-template-scenarios";
import {
  multilingualEntityFixture,
  secondaryLocaleFixture,
} from "./fixtures/v3-template-scenarios";

function fail(message: string): never {
  console.error(`template validation failed: ${message}`);
  process.exit(1);
}

function isColor(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value) || /^(rgb|hsl)a?\(/.test(value);
}

function isValidLocalAssetSrc(src: string): boolean {
  if (!src.startsWith("/") || src.startsWith("//")) return false;
  if (src.includes("\\") || src.includes("?") || src.includes("#")) return false;

  return src
    .slice(1)
    .split("/")
    .every((segment) => segment !== "" && segment !== "." && segment !== "..");
}

function validateAsset(key: string, asset: AssetRecord): string[] {
  const errors: string[] = [];
  if (key !== asset.id) errors.push("id mismatch");
  if (!isValidLocalAssetSrc(asset.src)) errors.push("invalid local src");
  if (!asset.sourceUrl.startsWith("https://")) errors.push("invalid source URL");
  if (!asset.alt || !asset.sourcePage || !asset.credit || !asset.usage) {
    errors.push("missing traceability");
  }
  if (asset.width <= 0 || asset.height <= 0) errors.push("invalid dimensions");
  return errors;
}

function assertExactErrors(label: string, actual: string[], expected: string[]): void {
  if (
    actual.length !== expected.length ||
    actual.some((error, index) => error !== expected[index])
  ) {
    fail(`${label} returned ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
  }
}

const adConfig: AdConfig = ads;
const adsTxtSource = readFileSync(resolve(process.cwd(), "public/ads.txt"), "utf8");
const rootLayoutSource = readFileSync(resolve(process.cwd(), "src/app/layout.tsx"), "utf8");
const manifestSource = readFileSync(resolve(process.cwd(), "src/app/manifest.ts"), "utf8");
const iconPath = resolve(process.cwd(), "src/app/icon.svg");
const nextConfigSource = readFileSync(resolve(process.cwd(), "next.config.ts"), "utf8");
const packageSource = readFileSync(resolve(process.cwd(), "package.json"), "utf8");
const openNextConfigSource = readFileSync(
  resolve(process.cwd(), "open-next.config.ts"),
  "utf8",
);
const wranglerSource = readFileSync(resolve(process.cwd(), "wrangler.jsonc"), "utf8");
const staticHeadersSource = readFileSync(resolve(process.cwd(), "public/_headers"), "utf8");
const globalStylesSource = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");
const headerSource = readFileSync(
  resolve(process.cwd(), "src/components/layout/Header.tsx"),
  "utf8",
);
const searchDialogSource = readFileSync(
  resolve(process.cwd(), "src/components/layout/SearchDialog.tsx"),
  "utf8",
);
const searchRouteSource = readFileSync(
  resolve(process.cwd(), "src/app/search-index/[locale]/route.ts"),
  "utf8",
);
const expectedAdsTxt = "google.com, pub-4194035852162505, DIRECT, f08c47fec0942fa0";
if (!adsTxtSource.split(/\r?\n/).map((line) => line.trim()).includes(expectedAdsTxt)) {
  fail("public/ads.txt is missing the fixed AdSense publisher record");
}
if (
  !rootLayoutSource.includes('name="google-adsense-account"') ||
  !rootLayoutSource.includes('content="ca-pub-4194035852162505"')
) {
  fail("root layout is missing the fixed AdSense account meta tag");
}
if (
  !rootLayoutSource.includes(
    "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4194035852162505",
  )
) {
  fail("root layout is missing the fixed AdSense script");
}
if (!existsSync(iconPath)) fail("src/app/icon.svg favicon is missing");
if (
  !rootLayoutSource.includes('manifest: "/manifest.webmanifest"') ||
  !rootLayoutSource.includes('icon: "/icon.svg"')
) {
  fail("root layout is missing manifest and favicon metadata wiring");
}
if (
  !manifestSource.includes('src: "/icon.svg"') ||
  !manifestSource.includes('type: "image/svg+xml"')
) {
  fail("web manifest is missing the reusable SVG icon");
}
if (!nextConfigSource.includes('output: "export"')) {
  fail("next config must use static export");
}
if (!nextConfigSource.includes("unoptimized: true")) {
  fail("static export must disable the Next.js runtime image optimizer");
}
if (nextConfigSource.includes("async headers()")) {
  fail("static export must not rely on Next.js runtime headers");
}
if (
  packageSource.includes("@opennextjs/cloudflare") ||
  openNextConfigSource.includes("@opennextjs/cloudflare") ||
  openNextConfigSource.includes("defineCloudflareConfig")
) {
  fail("static guide sites must not depend on the OpenNext production runtime");
}
for (const header of [
  "X-Content-Type-Options: nosniff",
  "Referrer-Policy: strict-origin-when-cross-origin",
  "X-Frame-Options: SAMEORIGIN",
]) {
  if (!staticHeadersSource.includes(header)) fail(`public/_headers is missing security header ${header}`);
}
for (const deploymentMarker of [
  '"directory": "./out"',
  '"not_found_handling": "404-page"',
  '"html_handling": "auto-trailing-slash"',
]) {
  if (!wranglerSource.includes(deploymentMarker)) {
    fail(`wrangler config is missing static asset setting ${deploymentMarker}`);
  }
}
if (wranglerSource.includes('"main"') || wranglerSource.includes('"binding": "ASSETS"')) {
  fail("static guide sites must not configure a Worker script or assets binding");
}
if (
  headerSource.includes("buildSearchIndex") ||
  headerSource.includes("entries={") ||
  !headerSource.includes("indexUrl={getSearchIndexUrl(locale)}")
) {
  fail("Header must not serialize the full search index into initial page props");
}
if (
  searchDialogSource.includes("entries: SearchIndexEntry[]") ||
  !searchDialogSource.includes("fetch(indexUrl)") ||
  !searchDialogSource.includes("<Link href={result.url} onClick={close}>") ||
  !searchDialogSource.includes("labels.searchLoading") ||
  !searchDialogSource.includes("labels.searchError")
) {
  fail(
    "SearchDialog must lazy-load a static locale index, render navigable results, and localize loading/error states",
  );
}
if (!globalStylesSource.includes(".site-header {\n  position: relative;\n  z-index: 20;")) {
  fail("site header must stack above page content so search results remain clickable");
}
if (
  !searchRouteSource.includes('dynamic = "force-static"') ||
  !searchRouteSource.includes("generateStaticParams") ||
  !searchRouteSource.includes("buildLocaleSearchIndex") ||
  !searchRouteSource.includes('"public, max-age=0, must-revalidate"') ||
  searchRouteSource.includes("immutable")
) {
  fail(
    "search index route must be locale-pre-generated without stale immutable browser caching",
  );
}

const expectedAdUnitKeys = [
  "native-banner",
  "banner-728x90",
  "banner-468x60",
  "banner-320x50",
  "banner-160x600",
  "smartlink",
];
const rawAdConfig = adConfig as unknown as Record<string, unknown>;
const rawAdUnits = rawAdConfig.units;
if (!rawAdUnits || typeof rawAdUnits !== "object") {
  fail("ad config must define the six fixed Adsterra units");
}
const actualAdUnitKeys = Object.keys(rawAdUnits as Record<string, unknown>).sort();
if (actualAdUnitKeys.join(",") !== [...expectedAdUnitKeys].sort().join(",")) {
  fail(`ad config units must be exactly ${expectedAdUnitKeys.join(", ")}`);
}
const filledAdUnits = expectedAdUnitKeys.filter((key) => {
  const value = (rawAdUnits as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim();
});
if (filledAdUnits.length > 0 && filledAdUnits.length !== expectedAdUnitKeys.length) {
  fail("ad config must be empty or define all six fixed Adsterra units");
}

const componentRoot = resolve(process.cwd(), "src/components");
const adLayoutSources = {
  adSlot: readFileSync(resolve(componentRoot, "ads/AdSlot.tsx"), "utf8"),
  home: readFileSync(resolve(componentRoot, "pages/HomePage.tsx"), "utf8"),
  hub: readFileSync(resolve(componentRoot, "pages/HubPage.tsx"), "utf8"),
  content: readFileSync(resolve(componentRoot, "pages/ContentPage.tsx"), "utf8"),
  workspace: readFileSync(resolve(componentRoot, "pages/WorkspacePage.tsx"), "utf8"),
  rightRail: readFileSync(resolve(componentRoot, "layout/RightRail.tsx"), "utf8"),
  footer: readFileSync(resolve(componentRoot, "layout/Footer.tsx"), "utf8"),
};
if (adLayoutSources.adSlot.includes("srcDoc") || adLayoutSources.adSlot.includes("sandbox=")) {
  fail("Adsterra code must run in the page container, not in sandboxed srcDoc iframes");
}
if (!adLayoutSources.adSlot.includes("appendExecutableAdMarkup")) {
  fail("Adsterra component must preserve executable script injection");
}
for (const shell of ["home", "hub", "content", "workspace"] as const) {
  if (!adLayoutSources[shell].includes('<AdSlot placement="responsive-banner" />')) {
    fail(`${shell} shell must include the responsive banner slot`);
  }
}
if (!adLayoutSources.rightRail.includes('<AdSlot placement="right-rail" />')) {
  fail("right rail must include the 160x600 slot");
}
if (!adLayoutSources.footer.includes("<Smartlink />")) {
  fail("footer must include the Smartlink hook");
}
const firstModules = adLayoutSources.content.indexOf(
  "<ModuleRenderer modules={leadingModules} />",
);
const nativeBanner = adLayoutSources.content.indexOf(
  '<AdSlot placement="native-banner" />',
);
const remainingModules = adLayoutSources.content.indexOf(
  "<ModuleRenderer modules={remainingModules} />",
);
if (!(firstModules >= 0 && firstModules < nativeBanner && nativeBanner < remainingModules)) {
  fail("content shell must place the Native Banner after module 2");
}

for (const [token, value] of Object.entries(theme.tokens)) {
  if (!isColor(value)) fail(`theme token ${token} is not a supported color`);
}

if (!themeModes.includes(theme.mode)) fail(`unsupported theme mode ${theme.mode}`);
if (!homeVariants.includes(theme.variants.home)) fail("unsupported home variant");
if (!hubVariants.includes(theme.variants.hub)) fail("unsupported hub variant");
if (!contentVariants.includes(theme.variants.content)) fail("unsupported content variant");
if (!workspaceVariants.includes(theme.variants.workspace)) fail("unsupported workspace variant");
if (theme.background.overlay < 0 || theme.background.overlay > 1) {
  fail("background overlay must be between 0 and 1");
}

const assets: AssetManifest = assetManifest;
const themeConfig: ThemeConfig = theme;
const publicRoot = resolve(process.cwd(), "public");

const invalidAssetErrors = validateAsset("remote", {
  id: "remote",
  src: "/invalid",
  sourceUrl: "invalid",
  alt: "",
  width: 0,
  height: 0,
  sourcePage: "",
  credit: "",
  usage: "",
  pageIds: [],
  fallback: "surface",
});
assertExactErrors("invalid asset fixture", invalidAssetErrors, [
  "invalid source URL",
  "missing traceability",
  "invalid dimensions",
]);

const validAssetFixture: AssetRecord = {
  id: "valid",
  src: "/images/valid.webp",
  sourceUrl: "https://example.com/source",
  alt: "Valid asset fixture",
  width: 1200,
  height: 800,
  sourcePage: "Fixture source page",
  credit: "Fixture credit",
  usage: "Fixture usage",
  pageIds: [],
  fallback: "surface",
};

const invalidLocalSrcFixtures = [
  ["protocol-relative", "//cdn.example.com/image.webp"],
  ["backslash", "/images\\image.webp"],
  ["query", "/images/image.webp?size=large"],
  ["hash", "/images/image.webp#hero"],
  ["double-slash", "/images//image.webp"],
  ["dot-segment", "/images/./image.webp"],
  ["traversal", "/images/../image.webp"],
] satisfies ReadonlyArray<readonly [string, `/${string}`]>;

for (const [id, src] of invalidLocalSrcFixtures) {
  const errors = validateAsset(id, { ...validAssetFixture, id, src });
  assertExactErrors(`${id} asset fixture`, errors, ["invalid local src"]);
}

const missingAssetMarkup = renderToStaticMarkup(
  createElement(AssetMedia, { assetId: "missing-fixture" }),
);
if (
  !missingAssetMarkup.includes("asset-fallback") ||
  !missingAssetMarkup.includes('aria-hidden="true"')
) {
  fail("missing asset renderer did not produce an aria-hidden fallback");
}

for (const [key, asset] of Object.entries(assets)) {
  for (const error of validateAsset(key, asset)) {
    fail(`asset ${key}: ${error}`);
  }
  const localPath = resolve(publicRoot, asset.src.slice(1));
  const pathFromPublic = relative(publicRoot, localPath);
  if (
    pathFromPublic === "" ||
    pathFromPublic === ".." ||
    pathFromPublic.startsWith(`..${sep}`) ||
    isAbsolute(pathFromPublic)
  ) {
    fail(`asset ${key} resolves outside public: ${asset.src}`);
  }
  if (!existsSync(localPath)) fail(`asset ${key} is missing local file ${asset.src}`);
}

if (
  themeConfig.background.assetId &&
  !Object.prototype.hasOwnProperty.call(assetManifest, themeConfig.background.assetId)
) {
  fail(`theme background references missing asset ${themeConfig.background.assetId}`);
}

const supportedShells = new Set(["home", "hub", "content", "workspace"]);
const supportedModules = new Set<string>(guideModuleTypes);

for (const scenario of templateScenarios) {
  for (const shell of scenario.shells) {
    if (!supportedShells.has(shell)) fail(`${scenario.id} needs unsupported shell ${shell}`);
  }
  for (const moduleType of scenario.modules) {
    if (!supportedModules.has(moduleType)) {
      fail(`${scenario.id} needs unsupported module ${moduleType}`);
    }
  }
}

for (const page of getAllPages()) {
  if (!supportedShells.has(page.presentation.shell)) {
    fail(`page ${page.id} has unsupported shell ${page.presentation.shell}`);
  }
  const moduleIds = new Set<string>();
  for (const guideModule of page.modules) {
    if (moduleIds.has(guideModule.id)) {
      fail(`page ${page.id} has duplicate module id ${guideModule.id}`);
    }
    moduleIds.add(guideModule.id);
    if (!supportedModules.has(guideModule.type)) {
      fail(`page ${page.id} has unsupported module ${guideModule.type}`);
    }
  }
}

const rootClass = themeClassName(theme);
const rootStyle = themeStyle(theme);

const expectedRootClasses = [
  "site-theme",
  `theme-${theme.mode}`,
  `density-${theme.density}`,
  `background-${theme.background.mode}`,
  `motif-${theme.decoration.motif}`,
  `motif-${theme.decoration.intensity}`,
];
const rootClasses = new Set(rootClass.split(/\s+/));

for (const className of expectedRootClasses) {
  if (!rootClasses.has(className)) fail(`theme root class is missing ${className}`);
}

const backgroundAsset =
  themeConfig.background.assetId &&
  Object.prototype.hasOwnProperty.call(assetManifest, themeConfig.background.assetId)
    ? assets[themeConfig.background.assetId]
    : undefined;

const expectedRootStyles = [
  ["--page-bg", theme.tokens.pageBg],
  ["--surface-1", theme.tokens.surface1],
  ["--surface-2", theme.tokens.surface2],
  ["--surface-3", theme.tokens.surface3],
  ["--surface-inverse", theme.tokens.surfaceInverse],
  ["--text-primary", theme.tokens.textPrimary],
  ["--text-muted", theme.tokens.textMuted],
  ["--text-inverse", theme.tokens.textInverse],
  ["--text-on-accent-primary", theme.tokens.textOnAccentPrimary],
  ["--text-link", theme.tokens.textLink],
  ["--focus-ring", theme.tokens.focusRing],
  ["--line", theme.tokens.line],
  ["--line-strong", theme.tokens.lineStrong],
  ["--accent-primary", theme.tokens.accentPrimary],
  ["--accent-secondary", theme.tokens.accentSecondary],
  ["--accent-bright", theme.tokens.accentBright],
  ["--status-confirmed", theme.tokens.statusConfirmed],
  ["--status-caution", theme.tokens.statusCaution],
  ["--status-unknown", theme.tokens.statusUnknown],
  ["--font-heading", theme.typography.headingFamily],
  ["--font-body", theme.typography.bodyFamily],
  ["--heading-weight", String(theme.typography.headingWeight)],
  ["--radius", theme.shape.radius],
  ["--border-width", theme.shape.borderWidth],
  ["--shadow", theme.shape.shadow],
  ["--hover-lift", theme.shape.hoverLift],
  ["--background-overlay", String(theme.background.overlay)],
  ["--background-position", theme.background.position],
  ["--background-image", backgroundAsset ? `url("${backgroundAsset.src}")` : "none"],
] as const;

for (const [property, expectedValue] of expectedRootStyles) {
  if (rootStyle[property] !== expectedValue) {
    fail(`theme style ${property} was not mapped`);
  }
}

const assertedStyleProperties = new Set<string>(
  expectedRootStyles.map(([property]) => property),
);
for (const property of Object.keys(rootStyle)) {
  if (!assertedStyleProperties.has(property)) {
    fail(`theme style assertion is missing ${property}`);
  }
}

const representativeTheme: ThemeConfig = {
  ...themeConfig,
  background: { ...themeConfig.background, mode: "texture" },
  decoration: { motif: "organic", intensity: "medium" },
};
const representativeClasses = new Set(themeClassName(representativeTheme).split(/\s+/));

for (const className of ["background-texture", "motif-organic", "motif-medium"]) {
  if (!representativeClasses.has(className)) {
    fail(`representative theme class is missing ${className}`);
  }
}

if (!site.locales.length) fail("site must define at least one locale");
const localeCodes = new Set<string>();
const localePrefixes = new Set<string>();
for (const locale of site.locales) {
  if (localeCodes.has(locale.code)) fail(`duplicate locale code ${locale.code}`);
  localeCodes.add(locale.code);
  if (localePrefixes.has(locale.pathPrefix)) {
    fail(`duplicate locale path prefix ${locale.pathPrefix || "<root>"}`);
  }
  localePrefixes.add(locale.pathPrefix);
  if (!locale.code || !locale.label || !locale.htmlLang || !locale.openGraphLocale) {
    fail(`locale ${locale.code || "<unknown>"} is incomplete`);
  }
  for (const label of Object.values(locale.ui)) {
    if (!label.trim()) fail(`locale ${locale.code} has an empty UI label`);
  }
  if (locale.pathPrefix && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(locale.pathPrefix)) {
    fail(`locale ${locale.code} has an invalid path prefix`);
  }
}
const primaryLocale = site.locales.find((locale) => locale.code === site.primaryLocale);
if (!primaryLocale) fail("site.primaryLocale must exist in site.locales");
if (primaryLocale.pathPrefix !== "") fail("primary locale must use the root path");
for (const locale of site.locales) {
  if (locale.code !== site.primaryLocale && !locale.pathPrefix) {
    fail(`secondary locale ${locale.code} must have a path prefix`);
  }
}
for (const item of [...primaryNavigation, ...footerNavigation]) {
  for (const locale of site.locales) {
    if (!item.labels[locale.code]?.trim()) {
      fail(`navigation item ${item.href} is missing label for ${locale.code}`);
    }
  }
}

for (const page of getAllPages()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(page.lastReviewed)) {
    fail(`page ${page.id} has invalid lastReviewed date`);
  }
}

const heroFixturePage = getAllPages().find((page) => page.id === "guides");
if (!heroFixturePage) fail("guide fixture page is missing for review-date rendering validation");
const pageHeroMarkup = renderToStaticMarkup(
  createElement(PageHero, { page: heroFixturePage }),
);
if (
  !pageHeroMarkup.includes(site.locales[0].ui.lastReviewed) ||
  !pageHeroMarkup.includes(`dateTime="${heroFixturePage.lastReviewed}"`)
) {
  fail("PageHero does not visibly render the locale-aware lastReviewed date");
}

const searchPages = getIndexablePages();
const searchManifest = new Map(getFinalRouteManifest(searchPages).map((entry) => [entry.id, entry]));
const generatedSearchLocales = generateSearchIndexStaticParams()
  .map(({ locale }) => locale)
  .sort();
const declaredSearchLocales = site.locales.map((locale) => locale.code).sort();
if (generatedSearchLocales.join(",") !== declaredSearchLocales.join(",")) {
  fail("search index static params do not cover exactly the declared locales");
}
for (const locale of site.locales) {
  const entries = buildSearchIndex(searchPages, locale.code);
  const staticEntries = buildLocaleSearchIndex(locale.code);
  if (JSON.stringify(staticEntries) !== JSON.stringify(entries)) {
    fail(`static search resource for ${locale.code} diverges from the indexable page set`);
  }
  if (entries.some((entry) => entry.locale !== locale.code)) {
    fail(`search index leaked a page from another locale into ${locale.code}`);
  }
  for (const entry of entries) {
    const manifestEntry = searchManifest.get(entry.id);
    if (!manifestEntry || manifestEntry.url !== entry.url) {
      fail(`search result ${entry.id} is not backed by the final route manifest URL`);
    }
  }
}

const germanSearchFixture = {
  ...getAllPages().find((page) => page.id === "guides")!,
  id: "fixture-guides-de",
  locale: "de-DE",
  slug: "de/guides",
  url: "/de/guides",
  h1: "Leitfaden",
  summary: "Eine kurze Anleitung.",
};
const localizedSearchEntries = buildSearchIndex(
  [...searchPages, germanSearchFixture],
  "de-DE",
);
const localizedSearchManifest = getFinalRouteManifest([
  ...searchPages,
  germanSearchFixture,
]);
if (
  localizedSearchEntries.length !== 1 ||
  localizedSearchEntries[0].url !== "/de/guides" ||
  localizedSearchManifest.find((entry) => entry.id === germanSearchFixture.id)?.url !==
    localizedSearchEntries[0].url ||
  searchIndex(localizedSearchEntries, "Anleitung").length !== 1
) {
  fail("locale-aware static search did not isolate and query the German route");
}

const recentFixture = [
  {
    ...getAllPages().find((page) => page.id === "guides")!,
    id: "recent-z",
    slug: "z",
    url: "/z",
    lastReviewed: "2026-08-01",
  },
  {
    ...getAllPages().find((page) => page.id === "wiki")!,
    id: "recent-a",
    slug: "a",
    url: "/a",
    lastReviewed: "2026-08-01",
  },
  {
    ...getAllPages().find((page) => page.id === "about")!,
    id: "recent-trust",
    slug: "trust",
    url: "/trust",
    lastReviewed: "2026-09-01",
  },
  {
    ...getAllPages().find((page) => page.id === "faq")!,
    id: "recent-faq",
    slug: "faq-copy",
    url: "/faq-copy",
    lastReviewed: "2026-09-03",
  },
  {
    ...getAllPages().find((page) => page.id === "home")!,
    id: "recent-home",
    lastReviewed: "2026-09-02",
  },
];
const recentFixtureResult = getRecentUpdates("en-US", 5, recentFixture);
if (recentFixtureResult.map((page) => page.id).join(",") !== "recent-a,recent-z") {
  fail("recent updates did not filter trust/home pages or sort deterministically");
}

site.locales.push(secondaryLocaleFixture);
try {
  if (localizePath("/guides", "de-DE") !== "/de/guides") {
    fail("secondary locale path prefix was not applied");
  }
  const entityPages = buildEntityPages(multilingualEntityFixture);
  const entityUrls = new Set(entityPages.map((page) => page.url));
  const expectedEntityUrls = [
    "/characters",
    "/characters/alex",
    "/characters/sam",
    "/de/characters",
    "/de/characters/alex",
    "/de/characters/sam",
  ];
  for (const url of expectedEntityUrls) {
    if (!entityUrls.has(url)) fail(`multilingual entity fixture is missing ${url}`);
  }
  const germanAlex = entityPages.find((page) => page.url === "/de/characters/alex");
  if (!germanAlex || germanAlex.summary !== "Eine bestätigte Begleitfigur.") {
    fail("entity localized copy was not applied");
  }
  if (!germanAlex.hero.assetId) fail("entity image asset was not preserved");
  if (!germanAlex.keyFacts.some((fact) => fact.value === "Begleiter")) {
    fail("entity localized common facts were not applied");
  }
  const germanSourceModule = germanAlex.modules.find(
    (module) => module.id === "entity-sources",
  );
  if (
    !germanSourceModule ||
    germanSourceModule.type !== "prose" ||
    germanSourceModule.links?.[0]?.label !== "Quelle 1"
  ) {
    fail("entity source labels were not localized");
  }
  if (!germanAlex.relatedPageIds.some((id) => id.includes("sam"))) {
    fail("entity relation did not resolve to a localized detail page");
  }

  const fixturePages = [...getAllPages(), ...entityPages];
  const englishAlex = entityPages.find((page) => page.url === "/characters/alex");
  if (!englishAlex) fail("English entity detail fixture is missing");
  const metadata = metadataForPage(englishAlex, fixturePages);
  const languages = metadata.alternates?.languages as
    | Record<string, string | URL>
    | undefined;
  if (!languages) fail("multilingual entity metadata is missing hreflang alternates");
  const languageValue = (value: string | URL | undefined) =>
    value instanceof URL ? value.toString() : value;
  if (languageValue(languages["en-US"]) !== absoluteUrl("/characters/alex")) {
    fail("English entity hreflang is incorrect");
  }
  if (languageValue(languages["de-DE"]) !== absoluteUrl("/de/characters/alex")) {
    fail("German entity hreflang is incorrect");
  }
  if (languageValue(languages["x-default"]) !== absoluteUrl("/characters/alex")) {
    fail("entity x-default must point to the primary locale");
  }

  const manifestEntry = getFinalRouteManifest(fixturePages).find(
    (entry) => entry.url === "/characters/alex",
  );
  if (manifestEntry?.alternates["de-DE"] !== "/de/characters/alex") {
    fail("final route manifest is missing the German entity alternate");
  }

  const sitemapEntry = buildSitemapEntries(fixturePages).find(
    (entry) => entry.url === absoluteUrl("/characters/alex"),
  );
  const sitemapLanguages = sitemapEntry?.alternates?.languages as
    | Record<string, string>
    | undefined;
  if (sitemapLanguages?.["de-DE"] !== absoluteUrl("/de/characters/alex")) {
    fail("multilingual sitemap is missing the German entity alternate");
  }
} finally {
  site.locales.pop();
}

if (site.brandMark !== undefined && Array.from(site.brandMark).length > 4) {
  fail("brand mark must be at most 4 characters");
}

console.log(
  `template validation passed: ${getAllPages().length} pages, ` +
    `${Object.keys(assetManifest).length} assets, ${templateScenarios.length} scenarios`,
);
