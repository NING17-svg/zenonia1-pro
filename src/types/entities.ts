import type { SourceStatus } from "@/types/content";

export type EntityFieldValue = string | number | boolean | null | string[];

export interface EntityImageReference {
  assetId?: string;
  sourceUrl?: string;
  sourcePage?: string;
  alt?: string;
}

export interface EntityRelation {
  field: string;
  targetFamily: string;
  slugs: string[];
}

export interface EntityLocalizedRecordCopy {
  name?: string;
  summary?: string;
  category?: string;
  gameVersionScope?: string;
  remakeStatus?: string;
  fieldValues?: Record<string, string>;
}

export interface EntityRecord {
  name: string;
  slug: string;
  category: string;
  summary: string;
  gameVersionScope: string;
  remakeStatus: string;
  sourceUrls: string[];
  fields: Record<string, EntityFieldValue>;
  relations?: EntityRelation[];
  image?: EntityImageReference;
  localized?: Record<string, EntityLocalizedRecordCopy>;
  sourceStatus: SourceStatus;
  lastReviewed: string;
}

export interface EntityFamilyLocaleContent {
  hubH1: string;
  hubSeoTitle: string;
  hubMetaDescription: string;
  hubSummary: string;
  hubQuickAnswer: string;
  hubEyebrow?: string;
  detailSeoTitle: string;
  detailMetaDescription: string;
  overviewHeading: string;
  factsHeading: string;
  sourcesHeading: string;
  sourcesIntro: string;
  sourceLinkLabel: string;
  relatedHeading: string;
  categoryLabel: string;
  gameVersionLabel: string;
  remakeStatusLabel: string;
  trueLabel: string;
  falseLabel: string;
  emptyLabel: string;
  fieldLabels: Record<string, string>;
}

export interface EntityFamilyConfig {
  id: string;
  routePattern: string;
  locales: string[];
  localeContent: Record<string, EntityFamilyLocaleContent>;
  lastReviewed: string;
  records: EntityRecord[];
}
