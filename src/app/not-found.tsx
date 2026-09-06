import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { site } from "@/data/site";

export default function NotFound() {
  return (
    <PageShell locale={site.primaryLocale}>
      <section className="not-found-page">
        <p className="eyebrow">404</p>
        <h1>Page Not Found</h1>
        <p>The requested page is not part of this guide template.</p>
        <Link className="btn" href="/">
          Back to Home
        </Link>
      </section>
    </PageShell>
  );
}

