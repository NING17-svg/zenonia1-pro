# AGENTS.md

## Project Snapshot

`example.com` is a generated game guide site. After launch, treat the generated project as a live content property, not as the central workflow repo or a template.

The site uses Next.js App Router, TypeScript, data-driven content in `src/data`, generated metadata, JSON-LD, sitemap, robots, and Next.js static export deployed through Cloudflare Workers Static Assets. Production guide sites must not route ordinary page requests through an OpenNext or other Worker JS runtime.

## Mandatory Agent Workflow

For every growth-relevant edit:

1. Read this file before making changes.
2. Check `CONTENT_INDEX.md` to identify affected pages.
3. Inspect only the files relevant to the requested change.
4. Make the smallest change that solves the task.
5. Run narrow verification proportional to the change.
6. Update `GROWTH_LOG.md`.
7. Update `CONTENT_INDEX.md` if any URL, route, page type, keyword, CTA, title, H1, canonical, schema, or internal-link role changes.

A growth-relevant task is not complete until `GROWTH_LOG.md` is updated.

## Site Structure Rules

- Content source of truth is `src/data/pages/*.ts`, `src/data/entities.ts`, `src/data/faq.ts`, `src/data/site.ts`, and `src/data/navigation.ts`.
- Page shell selection is stored in each page's `presentation.shell`; shell components live in `src/components/pages/`, and shared guide modules are defined in `src/types/modules.ts` and rendered by `src/components/content/ModuleRenderer.tsx`.
- Make visual-theme changes in `src/data/theme.ts`, not in route-specific CSS.
- Keep visual assets local under `public/` and register every used asset with complete traceability in `src/data/assets.ts`.
- Do not use official game logos.
- The one-click builder must leave `src/data/ads.ts` with all six Adsterra unit values empty. Empty ad values must not make network requests. Only `adsterra-integrator` may populate the fixed Native Banner, 728x90, 468x60, 320x50, 160x600, and Smartlink values after launch. Real Adsterra code must run in the page DOM container and must not be wrapped in a sandboxed `srcDoc` iframe.
- Preserve the fixed AdSense ownership trio: the Google DIRECT record in `public/ads.txt`, the `google-adsense-account` meta tag, and the AdSense script in the root layout. They are public publisher identifiers, not secrets.
- Use the Workspace shell as the layout boundary for a specialized map, calculator, planner, or other tool, and implement the tool itself as separate feature code.
- `src/data/site.ts` owns `primaryLocale` and locale path prefixes. The primary locale stays on the root path; every additional locale needs a unique non-empty prefix.
- Every localized page must declare `translationKey`, `locale`, `routeKind`, `slug`, and final `url`; pages sharing a `translationKey` are hreflang alternates. Every declared locale also needs Header/Footer labels in `src/data/navigation.ts`.
- Entity families use one base fact package from `src/data/entities.ts`; do not duplicate collection per locale. Locale copy changes labels and display text, not the underlying fact boundary.
- Preserve existing URLs unless there is a deliberate redirect plan.
- Preserve the static deployment contract: `next.config.ts` uses `output: "export"`, `wrangler.jsonc` serves `./out` with no `main` Worker script, dynamic content routes are fully enumerated at build time, and `public/_headers` owns the fixed security response headers.
- Every new page must be reachable through related links, homepage modules, nav, or an obvious hub page.
- Legal and trust pages stay factual and plain.

## Content Standards

- Use official publisher pages, platform storefronts, official announcements, press kits, or reliable first-party material for factual updates.
- Mark unconfirmed details as unconfirmed instead of filling gaps with guesses.
- Do not invent puzzle solutions, boss tactics, item tables, maps, performance settings, preorder details, editions, release dates, or walkthrough steps.

## Technical SEO Notes

- `npm run validate:template` is mandatory after theme, asset, page-shell, or guide-module changes.
- `npm run validate:content` checks page count, URLs, FAQ references, and related-page references.
- `npm run validate:rendered-seo` checks sitemap, canonical metadata, hreflang/x-default, route-manifest alignment, FAQ schema, robots alignment, GA4/Bing wiring, and the fixed AdSense ownership trio.
- `npm run indexnow:submit -- --submit --site-url https://example.com --url https://example.com/changed-page` submits only the live URLs changed by the current update. It prints one line and a remote submission failure does not roll back or block an otherwise verified publish.
- `npm run routes:manifest` prints the final fixed, tool, entity-Hub, and entity-detail routes; use `-- --output route-manifest.json` when Builder/Verifier needs a machine-readable file.
- `npm run verify` runs the broader local validation chain.

## Risk Warnings

- Do not treat the site as only a starter template after it is launched.
- Do not publish rumor as fact.
- Do not change deployment, Cloudflare, GA4, GSC, Bing Webmaster, or domain settings without explicit authorization.
- Keep the generated `public/indexnow-*.txt` file. It is the site's public IndexNow ownership token and is intentionally committed with the generated site.

## Documentation Files

- `AGENTS.md`: stable project and growth rules.
- `CONTENT_INDEX.md`: page inventory and page-level SEO/GEO/conversion map.
- `GROWTH_LOG.md`: chronological growth-relevant change log.
