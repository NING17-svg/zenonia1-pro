import { site } from "@/data/site";
import { buildLocaleSearchIndex } from "@/lib/search";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return site.locales.map((locale) => ({ locale: locale.code }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  const { locale } = await context.params;
  if (!site.locales.some((candidate) => candidate.code === locale)) {
    return Response.json({ error: "Unknown locale" }, { status: 404 });
  }

  return Response.json(buildLocaleSearchIndex(locale), {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
