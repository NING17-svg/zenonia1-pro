import Link from "next/link";
import React from "react";
import { AssetMedia } from "@/components/media/AssetMedia";
import { theme } from "@/data/theme";
import { getLocaleUiLabels } from "@/lib/localization";
import type { PageContent } from "@/types/content";

export function PageHero({
  page,
  priority = false,
}: {
  page: PageContent;
  priority?: boolean;
}) {
  const presentation = page.presentation;
  const variant = presentation.variant ?? theme.variants[presentation.shell];
  const heroClassName = [
    "page-hero",
    `${presentation.shell}-hero`,
    page.hero.assetId ? "hero-with-media" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={heroClassName} data-variant={variant}>
      <div className="hero-copy">
        {page.hero.eyebrow ? <p className="eyebrow">{page.hero.eyebrow}</p> : null}
        <h1>{page.h1}</h1>
        <p>{page.hero.subtitle}</p>
        <p className="page-review">
          <span>{getLocaleUiLabels(page.locale).lastReviewed}:</span>{" "}
          <time dateTime={page.lastReviewed}>{page.lastReviewed}</time>
        </p>
        {page.hero.ctas.length ? (
          <div className="cta-row">
            {page.hero.ctas.map((cta) => (
              <Link key={cta.href} className="btn" href={cta.href}>
                {cta.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      {page.hero.assetId ? (
        <AssetMedia
          assetId={page.hero.assetId}
          className="hero-media"
          priority={priority}
          {...(variant === "media-hero"
            ? { sizes: "(max-width: 1180px) 100vw, 1180px" }
            : {})}
        />
      ) : null}
    </header>
  );
}
