import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { PageRenderer } from "@/components/pages/PageRenderer";
import { getIndexablePages, getPageByUrl } from "@/lib/content";
import { metadataForPage } from "@/lib/seo";

export const dynamicParams = false;

interface PageProps {
  params: Promise<{
    slug: string;
    segments: string[];
  }>;
}

export function generateStaticParams() {
  const params = getIndexablePages()
    .map((page) => page.url.split("/").filter(Boolean))
    .filter((segments) => segments.length > 1)
    .map(([slug, ...segments]) => ({ slug, segments }));

  // Next.js static export rejects a dynamic route when generateStaticParams
  // returns an empty array. The sentinel renders through notFound() and is
  // never linked, indexed, or included in the route manifest.
  return params.length > 0
    ? params
    : [{ slug: "__static_export_placeholder__", segments: ["__placeholder__"] }];
}

function routePath(slug: string, segments: string[]): string {
  return `/${[slug, ...segments].join("/")}`;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, segments } = await params;
  const page = getPageByUrl(routePath(slug, segments));

  return page ? metadataForPage(page) : {};
}

export default async function Page({ params }: PageProps) {
  const { slug, segments } = await params;
  const page = getPageByUrl(routePath(slug, segments));

  if (!page) notFound();

  return (
    <PageShell locale={page.locale}>
      <PageRenderer page={page} />
    </PageShell>
  );
}
