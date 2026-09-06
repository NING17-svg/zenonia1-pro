import type { ThemeConfig } from "@/types/theme";

export const theme = {
  mode: "dark",
  tokens: {
    pageBg: "#0e1424",
    surface1: "#161d2e",
    surface2: "#1f2738",
    surface3: "#2a3346",
    surfaceInverse: "#f3e8c8",
    textPrimary: "#f3ead2",
    textMuted: "#a8a08a",
    textInverse: "#0e1424",
    textOnAccentPrimary: "#0e1424",
    textLink: "#e7a552",
    focusRing: "#ffd066",
    line: "#3a4358",
    lineStrong: "#5a6480",
    accentPrimary: "#c9863a",
    accentSecondary: "#7a5fb0",
    accentBright: "#f0c46e",
    statusConfirmed: "#5fbf6a",
    statusCaution: "#e5b04a",
    statusUnknown: "#9aa0b4",
  },
  typography: {
    headingFamily:
      "'Press Start 2P', 'Silkscreen', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    bodyFamily:
      "'Inter', system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    headingWeight: 700,
  },
  shape: {
    radius: "6px",
    borderWidth: "1px",
    shadow: "0 1px 0 rgba(0,0,0,0.6)",
    hoverLift: "-1px",
  },
  density: "comfortable",
  background: {
    mode: "gradient",
    overlay: 0.15,
    position: "center top",
  },
  variants: {
    home: "split-panel",
    hub: "card-grid",
    content: "reading-right-rail",
    workspace: "panelled",
  },
  decoration: { motif: "grid", intensity: "low" },
} satisfies ThemeConfig;