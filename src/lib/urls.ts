import { site } from "@/data/site";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${site.baseUrl}${normalized === "/" ? "" : normalized}`;
}

