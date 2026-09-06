import type { GuideModule } from "@/types/modules";
import type {
  ContentVariant,
  HomeVariant,
  HubVariant,
  WorkspaceVariant,
} from "@/types/theme";

export type PageType = "home" | "wiki" | "guides" | "release" | "faq" | "site" | "entity";
export type RouteKind = "home" | "fixed" | "tool" | "entity-hub" | "entity-detail";

export type SchemaType =
  | "WebSite"
  | "CollectionPage"
  | "Article"
  | "FAQPage"
  | "BreadcrumbList";

export type SourceStatus = "official" | "placeholder" | "internal";

export interface LinkItem {
  label: string;
  href: string;
  description?: string;
}

export interface KeyFact {
  label: string;
  value: string;
}

export type PagePresentation =
  | { shell: "home"; variant?: HomeVariant }
  | { shell: "hub"; variant?: HubVariant }
  | { shell: "content"; variant?: ContentVariant }
  | { shell: "workspace"; variant?: WorkspaceVariant };

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  pageIds: string[];
  category: "release" | "platform" | "gameplay" | "wiki" | "site";
  schemaEligible: boolean;
  sourceStatus: SourceStatus;
}

export interface PageContent {
  id: string;
  translationKey: string;
  locale: string;
  routeKind: RouteKind;
  slug: string;
  url: string;
  pageType: PageType;
  presentation: PagePresentation;
  h1: string;
  seoTitle: string;
  metaDescription: string;
  summary: string;
  hero: {
    eyebrow?: string;
    subtitle: string;
    ctas: LinkItem[];
    assetId?: string;
  };
  quickAnswer: string;
  keyFacts: KeyFact[];
  modules: GuideModule[];
  faqIds: string[];
  relatedPageIds: string[];
  schemaTypes: SchemaType[];
  sourceStatus: SourceStatus;
  lastReviewed: string;
}
