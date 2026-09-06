import type { CSSProperties } from "react";
import { assetManifest } from "@/data/assets";
import type { ThemeConfig } from "@/types/theme";

export type ThemeStyle = CSSProperties & Record<`--${string}`, string>;

export function themeClassName(theme: ThemeConfig): string {
  return [
    "site-theme",
    `theme-${theme.mode}`,
    `density-${theme.density}`,
    `background-${theme.background.mode}`,
    `motif-${theme.decoration.motif}`,
    `motif-${theme.decoration.intensity}`,
  ].join(" ");
}

export function themeStyle(theme: ThemeConfig): ThemeStyle {
  const assets = assetManifest as Record<string, { src: string }>;
  const backgroundAsset =
    theme.background.assetId &&
    Object.prototype.hasOwnProperty.call(assetManifest, theme.background.assetId)
    ? assets[theme.background.assetId]
    : undefined;

  return {
    "--page-bg": theme.tokens.pageBg,
    "--surface-1": theme.tokens.surface1,
    "--surface-2": theme.tokens.surface2,
    "--surface-3": theme.tokens.surface3,
    "--surface-inverse": theme.tokens.surfaceInverse,
    "--text-primary": theme.tokens.textPrimary,
    "--text-muted": theme.tokens.textMuted,
    "--text-inverse": theme.tokens.textInverse,
    "--text-on-accent-primary": theme.tokens.textOnAccentPrimary,
    "--text-link": theme.tokens.textLink,
    "--focus-ring": theme.tokens.focusRing,
    "--line": theme.tokens.line,
    "--line-strong": theme.tokens.lineStrong,
    "--accent-primary": theme.tokens.accentPrimary,
    "--accent-secondary": theme.tokens.accentSecondary,
    "--accent-bright": theme.tokens.accentBright,
    "--status-confirmed": theme.tokens.statusConfirmed,
    "--status-caution": theme.tokens.statusCaution,
    "--status-unknown": theme.tokens.statusUnknown,
    "--font-heading": theme.typography.headingFamily,
    "--font-body": theme.typography.bodyFamily,
    "--heading-weight": String(theme.typography.headingWeight),
    "--radius": theme.shape.radius,
    "--border-width": theme.shape.borderWidth,
    "--shadow": theme.shape.shadow,
    "--hover-lift": theme.shape.hoverLift,
    "--background-overlay": String(theme.background.overlay),
    "--background-position": theme.background.position,
    "--background-image": backgroundAsset ? `url("${backgroundAsset.src}")` : "none",
  };
}
