export const themeModes = ["light", "dark", "mixed"] as const;
export type ThemeMode = (typeof themeModes)[number];

export const homeVariants = ["split-panel", "media-hero"] as const;
export const hubVariants = ["card-grid", "grouped-list", "compact-index"] as const;
export const contentVariants = [
  "reading-right-rail",
  "reading-full",
  "wide-reference",
] as const;
export const workspaceVariants = ["full-width", "panelled"] as const;

export type HomeVariant = (typeof homeVariants)[number];
export type HubVariant = (typeof hubVariants)[number];
export type ContentVariant = (typeof contentVariants)[number];
export type WorkspaceVariant = (typeof workspaceVariants)[number];

export interface ThemeTokens {
  pageBg: string;
  surface1: string;
  surface2: string;
  surface3: string;
  surfaceInverse: string;
  textPrimary: string;
  textMuted: string;
  textInverse: string;
  textOnAccentPrimary: string;
  textLink: string;
  focusRing: string;
  line: string;
  lineStrong: string;
  accentPrimary: string;
  accentSecondary: string;
  accentBright: string;
  statusConfirmed: string;
  statusCaution: string;
  statusUnknown: string;
}

export interface ThemeConfig {
  mode: ThemeMode;
  tokens: ThemeTokens;
  typography: {
    headingFamily: string;
    bodyFamily: string;
    headingWeight: 700 | 800 | 900;
  };
  shape: {
    radius: string;
    borderWidth: string;
    shadow: string;
    hoverLift: string;
  };
  density: "compact" | "comfortable";
  background: {
    mode: "solid" | "gradient" | "texture" | "image";
    assetId?: string;
    overlay: number;
    position: string;
  };
  variants: {
    home: HomeVariant;
    hub: HubVariant;
    content: ContentVariant;
    workspace: WorkspaceVariant;
  };
  decoration: {
    motif: "none" | "lines" | "dots" | "grid" | "organic";
    intensity: "low" | "medium";
  };
}
