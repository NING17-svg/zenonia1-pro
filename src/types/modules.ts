import type { LinkItem } from "@/types/content";

export const guideModuleTypes = [
  "prose",
  "entity-grid",
  "data-table",
  "steps",
  "recipes",
  "schedule",
  "comparison",
  "media-gallery",
  "callout",
] as const;

export type GuideModuleType = (typeof guideModuleTypes)[number];
export type StatusTone = "confirmed" | "caution" | "unknown" | "tip";

interface ModuleBase {
  id: string;
  type: GuideModuleType;
  heading?: string;
}

export interface ProseModule extends ModuleBase {
  type: "prose";
  heading: string;
  body: string;
  links?: LinkItem[];
}

export interface EntityGridModule extends ModuleBase {
  type: "entity-grid";
  heading: string;
  items: Array<{
    title: string;
    summary: string;
    href?: string;
    badge?: string;
    assetId?: string;
  }>;
}

export interface DataTableModule extends ModuleBase {
  type: "data-table";
  heading: string;
  columns: Array<{ key: string; label: string }>;
  rows: Array<Record<string, string>>;
}

export interface StepsModule extends ModuleBase {
  type: "steps";
  heading: string;
  items: Array<{
    title: string;
    body: string;
    doneCondition?: string;
  }>;
}

export interface RecipesModule extends ModuleBase {
  type: "recipes";
  heading: string;
  items: Array<{
    name: string;
    inputs: string[];
    output: string;
    note?: string;
  }>;
}

export interface ScheduleModule extends ModuleBase {
  type: "schedule";
  heading: string;
  items: Array<{
    label: string;
    timing: string;
    detail: string;
    tone?: StatusTone;
  }>;
}

export interface ComparisonModule extends ModuleBase {
  type: "comparison";
  heading: string;
  options: Array<{
    name: string;
    summary: string;
    bestFor?: string;
    badge?: string;
  }>;
}

export interface MediaGalleryModule extends ModuleBase {
  type: "media-gallery";
  heading?: string;
  assetIds: string[];
}

export interface CalloutModule extends ModuleBase {
  type: "callout";
  tone: StatusTone;
  title: string;
  body: string;
}

export type GuideModule =
  | ProseModule
  | EntityGridModule
  | DataTableModule
  | StepsModule
  | RecipesModule
  | ScheduleModule
  | ComparisonModule
  | MediaGalleryModule
  | CalloutModule;
