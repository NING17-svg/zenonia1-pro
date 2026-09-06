import type { SiteLocaleConfig } from "@/types/localization";

export interface SiteOfficialSource {
  label: string;
  href: string;
  description: string;
}

export interface SiteConfig {
  name: string;
  brandMark?: string;
  gameName: string;
  domain: string;
  baseUrl: string;
  description: string;
  tagline: string;
  primaryLocale: string;
  locales: SiteLocaleConfig[];
  author: string;
  gaMeasurementId: string;
  bingSiteAuthCode: string;
  officialSources: SiteOfficialSource[];
  disclaimer: string;
}

export const site: SiteConfig = {
  name: "ZENONIA 1 Guide",
  brandMark: "Z1",
  gameName: "ZENONIA 1",
  domain: "zenonia1.pro",
  baseUrl: (process.env.NEXT_PUBLIC_SITE_URL || "https://zenonia1.pro").replace(/\/$/, ""),
  description:
    "Unofficial guide hub for the 2026-08-31 Steam release of ZENONIA 1: release, classes, demo, beginner walkthrough, stats, endings, and the remaster-vs-original comparison.",
  tagline: "Release, classes, walkthrough, and remaster comparison for the 2026 Steam build of ZENONIA 1.",
  primaryLocale: "en-US",
  locales: [
    {
      code: "en-US",
      label: "English",
      pathPrefix: "",
      htmlLang: "en-US",
      openGraphLocale: "en_US",
      ui: {
        searchOpen: "Search",
        searchClose: "Close search",
        searchPlaceholder: "Search this guide",
        searchSubmit: "Search",
        searchLoading: "Loading search…",
        searchError: "Search is unavailable right now.",
        searchNoResults: "No matching pages found.",
        recentUpdates: "Recent updates",
        lastReviewed: "Last reviewed",
      },
    },
  ],
  author: "ZENONIA 1 Guide",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  bingSiteAuthCode: process.env.NEXT_PUBLIC_BING_SITE_AUTH_CODE || "",
  officialSources: [
    {
      label: "ZENONIA 1 on Steam",
      href: "https://store.steampowered.com/app/4538960/ZENONIA_1/",
      description: "Official Steam store page for the 2026-08-31 release.",
    },
    {
      label: "ZENONIA Demo on Steam",
      href: "https://store.steampowered.com/app/4733680/ZENONIA_Demo/",
      description: "Official Demo store page.",
    },
    {
      label: "Official ZENONIA X account",
      href: "https://x.com/Zenonia_C2H",
      description: "Publisher channel for the Switch development update.",
    },
  ],
  disclaimer:
    "This is an unofficial fan guide. Facts are sourced from the official Steam store page, the official Demo store page, official Steam announcements, and the official ZENONIA X account.",
};