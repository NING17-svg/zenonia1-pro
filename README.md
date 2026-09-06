# ZENONIA 1 Game Guide Site

This is the production V3 site for the `zenonia1-pro` launch (Issue #40). It is built from the shared V3 Next.js template by `one-click-builder`. It provides
stable page shells, guide modules, configuration-driven locale routes, generic entity
pages, SEO rendering, validation, and Cloudflare deployment wiring while leaving each
generated site responsible for its approved content, completed theme specification,
entity package, and traceable local assets.

The neutral theme and empty asset manifest are development fallbacks only. A
production site must have a completed game-specific theme specification before
launch.

## Stable Rendering Contract

Pages select one of four shells through their `presentation.shell` value:

- Home: the primary landing-page composition.
- Hub: a browsable collection or guide index.
- Content: a reading or reference page, with optional right rail.
- Workspace: a full-width layout boundary for a specialized feature.

The shell components live in `src/components/pages/`. Workspace does not provide
map, calculator, planner, or other tool logic; add that behavior as separate
feature code and render it inside the Workspace boundary.

`src/components/content/ModuleRenderer.tsx` supports nine guide module types:

- `prose`
- `entity-grid`
- `data-table`
- `steps`
- `recipes`
- `schedule`
- `comparison`
- `media-gallery`
- `callout`

## V3 Locale and Entity Contract

- Configure `primaryLocale` and `locales` in `src/data/site.ts`. The primary locale
  uses the root path; every additional locale uses one unique path prefix.
- Every `PageContent` record declares `translationKey`, `locale`, `routeKind`,
  `slug`, and the final `url`. Pages sharing a `translationKey` become hreflang
  alternates. Add locale-specific Header/Footer labels in `src/data/navigation.ts`.
- Add approved entity families to `src/data/entities.ts`. One base record set can
  serve multiple locales through family-level locale copy and optional localized
  record display overrides.
- Entity route patterns may contain `{locale}` and must contain `{slug}`. The
  template generates a generic Hub and detail page for each declared locale,
  including source links, relationships, and optional registered local images.
- Run `npm run routes:manifest` for a human-readable JSON route list, or
  `npm run routes:manifest -- --output route-manifest.json` for a machine-readable
  file that Builder and Verifier can compare with the Site Plan.

## Discovery and Review Contract

- The header search is fully static and lazy-loaded: a force-static
  `/search-index/{locale}` route emits one locale JSON resource from the final
  indexable page collection. The initial page payload contains only the locale,
  resource URL, and labels; the client fetches that resource when search opens,
  then filters locally and links directly to each page's declared final `url`.
  There is no search backend or cross-locale fallback.
- The homepage renders a deterministic `Recent updates` section from reviewed
  content pages in the same locale. Home, trust/system pages, and tools are
  excluded; `lastReviewed` is the source of ordering.
- Every page hero exposes a locale-aware `Last reviewed` label and the existing
  ISO review date, including entity hubs and details.
- `src/app/manifest.ts`, `src/app/icon.svg`, and root metadata provide a neutral
  favicon and web manifest. `next.config.ts` adds the baseline security headers
  without a CSP that could interfere with approved ad or analytics integrations.

## Production Configuration

- Configure the approved visual system in `src/data/theme.ts`. Do not create a
  production site by leaving the neutral development fallback unchanged.
- Store visual files under `public/` and register every used asset in
  `src/data/assets.ts` with its source URL, source page, credit, usage, dimensions,
  alt text, and page references.
- Do not use official game logos. Brand presentation must use permitted,
  traceable local assets or the text brand mark.
- Ads are pre-positioned but empty in `src/data/ads.ts`. The fixed Adsterra-ready
  contract includes a responsive 728x90 / 468x60 / 320x50 banner across page
  shells, a Native Banner after content module 2, a desktop-only 160x600
  right-rail unit, and a footer Smartlink hook. While the code values are empty,
  they render no placeholder, link, iframe, or ad network request. The one-click
  builder must preserve this empty baseline; `adsterra-integrator` supplies all
  six values after launch. Real Adsterra code runs in the page DOM container and
  must not be wrapped in a sandboxed `srcDoc` iframe.
- AdSense ownership is preinstalled through all three public carriers:
  `public/ads.txt`, the `google-adsense-account` meta tag, and the account script
  in the root layout. Builder must preserve the exact publisher values.

## Baseline Sample URLs

The current nine primary-locale URLs are baseline sample content. They remain the
template's validation fixture and must be replaced or deliberately adapted for
each approved Site Plan. Additional locale and entity routes are generated from
configuration rather than hardcoded here:

- `/`
- `/wiki`
- `/guides`
- `/release-date`
- `/faq`
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms`

## Setup and Verification

```bash
npm install
npm run indexnow:setup
npm run validate:template
npm run routes:manifest
npm run verify
npm run dev
```

Run `npm run validate:template` after changing the theme, assets, page shells, or
guide modules. Run the full `npm run verify` before deployment.

## Growth Handoff Files

- `AGENTS.md`: generated-site operating rules for future content updates.
- `CONTENT_INDEX.md`: URL inventory, search intent map, and internal-link map.
- `GROWTH_LOG.md`: chronological record for growth-relevant changes.

The one-click builder must update these files when it configures a real game
site. `site-growth` uses them after launch.

## Environment and Deployment

- `NEXT_PUBLIC_SITE_URL`: canonical site origin, such as `https://example.com`.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: optional GA4 measurement ID. If empty, no
  Google tag is rendered.
- `NEXT_PUBLIC_BING_SITE_AUTH_CODE`: Bing Webmaster Tools verification code.
  `bing-sitemap-submitter` fills it during launch; it is public and is not the API key.

`npm run indexnow:setup` generates one site-specific `public/indexnow-*.txt`
verification file. The generated site commits and keeps that public file. Initial
launch uses the script's `--from-sitemap` mode because every URL is new; later
content updates pass only the URLs changed by that update with repeated `--url`
arguments. Submission prints one line, and a remote IndexNow rejection does not
block an otherwise valid publish.

The production template uses Next.js static export and Cloudflare Workers Static
Assets. `next.config.ts` emits the deployable site to `out/`; `wrangler.jsonc`
points directly at that directory and intentionally has no Worker `main` script.
`public/_headers` preserves the security response headers at the static asset
layer. The template has no OpenNext production dependency; the retained
`open-next.config.ts` compatibility stub is inert and must not be used by Builder.
The one-click builder should replace the Wrangler project name, configure
build environment variables, connect the generated GitHub repository to
Cloudflare Builds, bind the exact authorized domain, verify that a push updates
the live site, and then verify GA4, GSC, Bing Webmaster sitemap submission, and
the initial IndexNow notification.
