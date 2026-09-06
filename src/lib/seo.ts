import type { Metadata } from "next";
import { site } from "@/data/site";
import { getLanguageAlternates } from "@/lib/content";
import { getLocaleConfig } from "@/lib/localization";
import { absoluteUrl } from "@/lib/urls";
import type { PageContent } from "@/types/content";

export function metadataForPage(
  page: PageContent,
  sourcePages?: PageContent[],
): Metadata {
  const localeConfig = getLocaleConfig(page.locale);
  const routeAlternates = getLanguageAlternates(page, sourcePages);
  const languages = Object.fromEntries(
    Object.entries(routeAlternates).map(([locale, url]) => [locale, absoluteUrl(url)]),
  );
  const xDefault = routeAlternates[site.primaryLocale] || page.url;
  const alternateLocale = Object.keys(routeAlternates)
    .filter((locale) => locale !== page.locale)
    .map((locale) => getLocaleConfig(locale).openGraphLocale);

  return {
    title: page.seoTitle,
    description: page.metaDescription,
    alternates: {
      canonical: absoluteUrl(page.url),
      languages: {
        ...languages,
        "x-default": absoluteUrl(xDefault),
      },
    },
    openGraph: {
      title: page.seoTitle,
      description: page.metaDescription,
      url: absoluteUrl(page.url),
      siteName: site.name,
      type:
        page.pageType === "site" || page.presentation.shell === "hub"
          ? "website"
          : "article",
      locale: localeConfig.openGraphLocale,
      alternateLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: page.seoTitle,
      description: page.metaDescription,
    },
  };
}
