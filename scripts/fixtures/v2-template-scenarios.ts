import type { GuideModuleType } from "../../src/types/modules";

export interface TemplateScenario {
  id: string;
  shells: Array<"home" | "hub" | "content" | "workspace">;
  modules: GuideModuleType[];
  modes: Array<"light" | "dark" | "mixed">;
}

export const templateScenarios: TemplateScenario[] = [
  {
    id: "persona-4-revival",
    shells: ["home", "hub", "content"],
    modules: ["prose", "entity-grid", "data-table", "comparison", "callout", "media-gallery"],
    modes: ["mixed"],
  },
  {
    id: "gothic-1-remake",
    shells: ["home", "hub", "content", "workspace"],
    modules: ["prose", "entity-grid", "data-table", "steps", "callout", "media-gallery"],
    modes: ["dark"],
  },
  {
    id: "legacy-survival-horror",
    shells: ["home", "hub", "content"],
    modules: ["prose", "steps", "data-table", "callout", "media-gallery"],
    modes: ["dark", "mixed"],
  },
  {
    id: "legacy-pirate-action",
    shells: ["home", "hub", "content", "workspace"],
    modules: ["prose", "entity-grid", "steps", "comparison", "media-gallery"],
    modes: ["light", "mixed"],
  },
  {
    id: "subnautica-2",
    shells: ["home", "hub", "content", "workspace"],
    modules: [
      "prose",
      "entity-grid",
      "data-table",
      "steps",
      "recipes",
      "callout",
      "media-gallery",
    ],
    modes: ["dark", "mixed"],
  },
  {
    id: "grow-a-garden",
    shells: ["home", "hub", "content"],
    modules: ["entity-grid", "data-table", "schedule", "comparison", "callout"],
    modes: ["light"],
  },
  {
    id: "stardew-like",
    shells: ["home", "hub", "content"],
    modules: ["entity-grid", "data-table", "recipes", "schedule", "comparison"],
    modes: ["light"],
  },
  {
    id: "dont-starve-like",
    shells: ["home", "hub", "content"],
    modules: ["entity-grid", "data-table", "steps", "recipes", "schedule", "callout"],
    modes: ["dark", "mixed"],
  },
  {
    id: "oxygen-not-included-like",
    shells: ["home", "hub", "content", "workspace"],
    modules: ["data-table", "steps", "recipes", "comparison", "callout"],
    modes: ["dark", "mixed"],
  },
];
