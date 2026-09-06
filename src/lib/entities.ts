import { entityHubPath, resolveRoutePattern } from "@/lib/localization";
import type { PageContent } from "@/types/content";
import type {
  EntityFamilyConfig,
  EntityFamilyLocaleContent,
  EntityFieldValue,
  EntityRecord,
} from "@/types/entities";
import type { EntityGridModule, GuideModule } from "@/types/modules";

function localizedRecord(record: EntityRecord, locale: string) {
  const localized = record.localized?.[locale];
  return {
    name: localized?.name || record.name,
    summary: localized?.summary || record.summary,
    category: localized?.category || record.category,
    gameVersionScope: localized?.gameVersionScope || record.gameVersionScope,
    remakeStatus: localized?.remakeStatus || record.remakeStatus,
    fieldValues: localized?.fieldValues || {},
  };
}

function formatFieldValue(
  value: EntityFieldValue,
  content: EntityFamilyLocaleContent,
): string {
  if (value === null) return content.emptyLabel;
  if (Array.isArray(value)) return value.length ? value.join(", ") : content.emptyLabel;
  if (typeof value === "boolean") return value ? content.trueLabel : content.falseLabel;
  return String(value);
}

function fillNameTemplate(template: string, name: string): string {
  return template.replaceAll("{name}", name);
}

function detailId(familyId: string, slug: string, locale: string): string {
  return `entity-${familyId}-${slug}-${locale.toLowerCase()}`;
}

function hubId(familyId: string, locale: string): string {
  return `entity-family-${familyId}-${locale.toLowerCase()}`;
}

function findRelatedRecords(
  record: EntityRecord,
  locale: string,
  families: EntityFamilyConfig[],
): Array<{ family: EntityFamilyConfig; record: EntityRecord }> {
  const related: Array<{ family: EntityFamilyConfig; record: EntityRecord }> = [];

  for (const relation of record.relations || []) {
    const targetFamily = families.find((family) => family.id === relation.targetFamily);
    if (!targetFamily || !targetFamily.locales.includes(locale)) continue;

    for (const slug of relation.slugs) {
      const targetRecord = targetFamily.records.find((candidate) => candidate.slug === slug);
      if (targetRecord) related.push({ family: targetFamily, record: targetRecord });
    }
  }

  return related;
}

function buildDetailModules(
  family: EntityFamilyConfig,
  record: EntityRecord,
  locale: string,
  families: EntityFamilyConfig[],
): GuideModule[] {
  const content = family.localeContent[locale];
  const localized = localizedRecord(record, locale);
  const fieldRows = [
    { field: content.categoryLabel, value: localized.category },
    { field: content.gameVersionLabel, value: localized.gameVersionScope },
    { field: content.remakeStatusLabel, value: localized.remakeStatus },
    ...Object.entries(record.fields).map(([key, value]) => ({
      field: content.fieldLabels[key] || key,
      value: localized.fieldValues[key] || formatFieldValue(value, content),
    })),
  ];
  const related = findRelatedRecords(record, locale, families);
  const modules: GuideModule[] = [
    {
      id: "entity-overview",
      type: "prose",
      heading: content.overviewHeading,
      body: localized.summary,
    },
    {
      id: "entity-facts",
      type: "data-table",
      heading: content.factsHeading,
      columns: [
        { key: "field", label: content.factsHeading },
        { key: "value", label: localized.name },
      ],
      rows: fieldRows,
    },
    {
      id: "entity-sources",
      type: "prose",
      heading: content.sourcesHeading,
      body: content.sourcesIntro,
      links: record.sourceUrls.map((href, index) => ({
        label: content.sourceLinkLabel.replaceAll("{index}", String(index + 1)),
        href,
      })),
    },
  ];

  if (related.length) {
    modules.push({
      id: "related-entities",
      type: "entity-grid",
      heading: content.relatedHeading,
      items: related.map(({ family: targetFamily, record: targetRecord }) => {
        const target = localizedRecord(targetRecord, locale);
        return {
          title: target.name,
          summary: target.summary,
          href: resolveRoutePattern(targetFamily.routePattern, locale, targetRecord.slug),
          assetId: targetRecord.image?.assetId,
        };
      }),
    });
  }

  return modules;
}

export function buildEntityPages(families: EntityFamilyConfig[]): PageContent[] {
  const pages: PageContent[] = [];

  for (const family of families) {
    for (const locale of family.locales) {
      const content = family.localeContent[locale];
      if (!content) {
        throw new Error(`Entity family ${family.id} is missing locale content for ${locale}`);
      }

      const hubUrl = entityHubPath(family.routePattern, locale);
      const hubItems: EntityGridModule["items"] = family.records.map((record) => {
        const localized = localizedRecord(record, locale);
        return {
          title: localized.name,
          summary: localized.summary,
          href: resolveRoutePattern(family.routePattern, locale, record.slug),
          badge: localized.category,
          assetId: record.image?.assetId,
        };
      });

      pages.push({
        id: hubId(family.id, locale),
        translationKey: `entity-family:${family.id}:hub`,
        locale,
        routeKind: "entity-hub",
        slug: hubUrl.slice(1),
        url: hubUrl,
        pageType: "entity",
        presentation: { shell: "hub", variant: "card-grid" },
        h1: content.hubH1,
        seoTitle: content.hubSeoTitle,
        metaDescription: content.hubMetaDescription,
        summary: content.hubSummary,
        hero: {
          eyebrow: content.hubEyebrow,
          subtitle: content.hubSummary,
          ctas: [],
        },
        quickAnswer: content.hubQuickAnswer,
        keyFacts: [],
        modules: [
          {
            id: "entity-index",
            type: "entity-grid",
            heading: content.hubH1,
            items: hubItems,
          },
        ],
        faqIds: [],
        relatedPageIds: [],
        schemaTypes: ["CollectionPage", "BreadcrumbList"],
        sourceStatus:
          family.records.length > 0 &&
          family.records.every((record) => record.sourceStatus === "official")
            ? "official"
            : "internal",
        lastReviewed: family.lastReviewed,
      });

      for (const record of family.records) {
        const localized = localizedRecord(record, locale);
        const url = resolveRoutePattern(family.routePattern, locale, record.slug);
        const related = findRelatedRecords(record, locale, families);

        pages.push({
          id: detailId(family.id, record.slug, locale),
          translationKey: `entity:${family.id}:${record.slug}`,
          locale,
          routeKind: "entity-detail",
          slug: url.slice(1),
          url,
          pageType: "entity",
          presentation: { shell: "content", variant: "wide-reference" },
          h1: localized.name,
          seoTitle: fillNameTemplate(content.detailSeoTitle, localized.name),
          metaDescription: fillNameTemplate(content.detailMetaDescription, localized.name),
          summary: localized.summary,
          hero: {
            eyebrow: localized.category,
            subtitle: localized.summary,
            ctas: [{ label: content.hubH1, href: hubUrl }],
            assetId: record.image?.assetId,
          },
          quickAnswer: localized.summary,
          keyFacts: [
            { label: content.categoryLabel, value: localized.category },
            { label: content.gameVersionLabel, value: localized.gameVersionScope },
            { label: content.remakeStatusLabel, value: localized.remakeStatus },
          ],
          modules: buildDetailModules(family, record, locale, families),
          faqIds: [],
          relatedPageIds: [
            hubId(family.id, locale),
            ...related.map(({ family: targetFamily, record: targetRecord }) =>
              detailId(targetFamily.id, targetRecord.slug, locale),
            ),
          ],
          schemaTypes: ["Article", "BreadcrumbList"],
          sourceStatus: record.sourceStatus,
          lastReviewed: record.lastReviewed,
        });
      }
    }
  }

  return pages;
}
