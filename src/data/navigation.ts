import { site } from "@/data/site";

export interface LocalizedNavigationItem {
  href: string;
  labels: Record<string, string>;
}

export const primaryNavigation: LocalizedNavigationItem[] = [
  { href: "/release-date/", labels: { "en-US": "Release" } },
  { href: "/classes/", labels: { "en-US": "Classes" } },
  { href: "/beginner-guide/", labels: { "en-US": "Beginner Guide" } },
  { href: "/remaster-vs-original/", labels: { "en-US": "Remaster vs Original" } },
  { href: "/is-it-worth-playing/", labels: { "en-US": "Worth Playing?" } },
];

export const footerNavigation: LocalizedNavigationItem[] = [];

export function navigationLabel(
  item: LocalizedNavigationItem,
  locale: string,
): string {
  return (
    item.labels[locale] ||
    item.labels[site.primaryLocale] ||
    Object.values(item.labels)[0]
  );
}