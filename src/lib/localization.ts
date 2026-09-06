import { site } from "@/data/site";
import type { SiteLocaleConfig } from "@/types/localization";

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, "");
}

export function normalizePath(path: string): string {
  const normalized = `/${trimSlashes(path)}`.replace(/\/{2,}/g, "/");
  return normalized === "/" ? normalized : normalized.replace(/\/$/, "");
}

export function getLocaleConfig(locale: string): SiteLocaleConfig {
  const config = site.locales.find((candidate) => candidate.code === locale);
  if (!config) {
    throw new Error(`Unknown site locale: ${locale}`);
  }
  return config;
}

export function getPrimaryLocaleConfig(): SiteLocaleConfig {
  return getLocaleConfig(site.primaryLocale);
}

export function getLocaleUiLabels(locale: string) {
  return getLocaleConfig(locale).ui;
}

export function localizePath(path: string, locale: string): string {
  const config = getLocaleConfig(locale);
  const basePath = normalizePath(path);
  if (!config.pathPrefix) return basePath;
  if (basePath === "/") return `/${trimSlashes(config.pathPrefix)}`;
  return normalizePath(`/${trimSlashes(config.pathPrefix)}${basePath}`);
}

export function resolveRoutePattern(
  routePattern: string,
  locale: string,
  slug?: string,
): string {
  const config = getLocaleConfig(locale);
  let resolved = routePattern;

  if (resolved.includes("{locale}")) {
    resolved = resolved.replaceAll("{locale}", trimSlashes(config.pathPrefix));
  } else {
    resolved = localizePath(resolved, locale);
  }

  if (slug !== undefined) {
    resolved = resolved.replaceAll("{slug}", trimSlashes(slug));
  }

  return normalizePath(resolved);
}

export function entityHubPath(routePattern: string, locale: string): string {
  const placeholders = routePattern.match(/\{[^}]+\}/g) || [];
  const slugCount = placeholders.filter((placeholder) => placeholder === "{slug}").length;
  const hasUnknownPlaceholder = placeholders.some(
    (placeholder) => placeholder !== "{slug}" && placeholder !== "{locale}",
  );
  if (slugCount !== 1 || hasUnknownPlaceholder || !/\/?\{slug\}\/?$/.test(routePattern)) {
    throw new Error(
      "Entity route patterns may use {locale} and must end with exactly one {slug}",
    );
  }
  const withoutSlug = routePattern.replace(/\/?\{slug\}\/?$/, "");
  return resolveRoutePattern(withoutSlug || "/", locale);
}
