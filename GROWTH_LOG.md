# GROWTH_LOG.md

## How To Use This File

Record every growth-relevant edit here. Keep entries short, factual, and useful for future agents.

## Change Log

### 2026-09-07 - Achievements full list, walkthrough chapters, per-class builds

- Task: Replace the category-only achievements page with the full 44-achievement list (name, description, global unlock %, location / ending gate); rewrite the walkthrough with five named chapters (Ayles, Adonis Forest faction choice, Five Holy Seals, Leo Kingdom, Ladon's Stronghold); layer per-class stat allocation and skill order (Warrior pure STR, Paladin STR + CON, Assassin 2 AGI / 1 STR) onto the stats page and the class entity records.
- Files changed: `src/data/pages-generated/generated-pages.ts`, `src/data/pages-generated/generated-faqs.ts`, `src/data/entities.ts`, `CONTENT_INDEX.md`.
- URLs affected: `/achievements`, `/walkthrough`, `/stats`, `/classes/warrior`, `/classes/paladin`, `/classes/assassin`.
- Content changed: Achievements page now publishes a 44-row data-table sourced from the Steam Community global stats page (AppID 4538960), with a missable block covering the two ending achievements plus the three completionist achievements, and a Steam-only Achievement Point Network Store reward-loop block. Walkthrough page now lists Chapter 1 Ayles (deliver stone chair to Mr. Brown, cut the Cori Tree, travel east to Adonis Town), the Chapter 2 Adonis Forest faction choice as a save-before-this gate, Chapter 3 Five Holy Seals (Laka Ruins / Pale, Vicious-Vague route split, Frosty Dungeon / Frost Guardian, Lava Cave / Fire Demon, Akun Temple Altar / hidden switches), Chapter 4 Leo Kingdom (Osiris, Pardon = Wolfred Dupre, Sun = adoptive half-sister), and Chapter 5 Ladon's Stronghold (Phase 1 red ground indicators, Phase 2 arena energy waves, Good ending Charity sacrifice, Evil ending Regret embraces Chaos, then Hard / Hell Mode and New Game+). Stats page now publishes three per-class data-tables with named SP skill orders, reported level-90 / level-67 / level-38 spreads, and a callout on the three beginner traps (no even stat spread, focus 2-3 usable skills, SPI weaker than expected). Class entity records gained `primary_stats`, `weapon_affinity`, `armor_affinity`, `active_skills`, `passive_skills`, `stat_allocation_notes`, `gear_focus`, and `difficulty_for_new_players` populated from the public first-week guides. FAQ answers updated to match the new content.
- Verification: `npm run typecheck`, `npm run lint`, `npm run validate:template`, `npm run validate:content`, `npm run validate:indexnow`, `npm run build`, `npm run validate:rendered-seo` will run as part of the publish batch.

### 2026-09-06 - Adsterra fixed six-unit ad codes wired

- Task: Replace empty Adsterra placeholders in `src/data/ads.ts` with the fixed six-unit codes created for `zenonia1.pro` (Native Banner, 728x90, 468x60, 320x50, 160x600, Smartlink).
- Files changed: `src/data/ads.ts`.
- URLs affected: None.
- Ad baseline: All six ad units now hold real Adsterra code or the Smartlink HTTPS URL; the page DOM container continues to execute the Adsterra script markup.
- Verification: `npm run verify` (typecheck, lint, template/content/SEO validation, static export, rendered-SEO validator) passed.

### 2026-08-12 - Static discovery and review freshness baseline added

- Task: Add locale-aware static search, automatic recent updates, visible review dates, and browser metadata/security defaults to the shared template.
- Files changed: Header/search components, content helpers, locale UI labels, homepage/page hero rendering, manifest/favicon metadata, Next.js security headers, and deterministic validators.
- URLs affected: No existing URLs changed; search results use the final route manifest URLs and recent updates use existing indexable pages.
- SEO/GEO changed: Last reviewed dates are public on every page; the homepage surfaces recent non-trust content by deterministic `lastReviewed` order; locale search never falls back across locales. Search indexes are emitted as per-locale force-static resources and lazy-loaded so full-site index data is not repeated in every page payload.
- Browser baseline: Neutral SVG favicon, web manifest, `X-Content-Type-Options`, `Referrer-Policy`, and `X-Frame-Options` are wired without adding a restrictive CSP.
- Verification: Typecheck, lint, template/content/SEO validation, and full verify are required before launch.

### 2026-07-21 - V3 locale and entity routing added

- Task: Upgrade the shared template for configuration-driven locale routes and programmatic entity pages.
- Files changed: Site/page/entity types, locale and entity generators, dynamic routes, metadata, sitemap, validators, and template documentation.
- URLs affected: Existing primary-locale URLs retain their paths; additional locale and entity routes are generated from configuration.
- SEO changed: Canonical, hreflang, x-default, Open Graph locale, multilingual sitemap alternates, and final route-manifest validation are now data-driven.
- Entity changed: Generic entity Hubs/details now render source links, relationships, and optional registered local images from one base fact package.
- Verification: Typecheck, template validation, content validation, rendered SEO validation, route-manifest generation, and multilingual entity fixtures.

### YYYY-MM-DD - Template baseline initialized

- Task: Create the initial generated guide-site baseline.
- Files changed: Template project files.
- URLs affected: `/`, `/wiki`, `/guides`, `/release-date`, `/faq`, `/about`, `/contact`, `/privacy-policy`, `/terms`.
- Content changed: Neutral placeholder content only.
- Ad baseline: Fixed Adsterra-ready modules are present and disabled; no ad markup or request is emitted.
- Follow-up: Replace this entry with a real launch/configuration entry when the one-click builder fills the site for a specific game.
