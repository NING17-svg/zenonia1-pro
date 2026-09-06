export const adUnitKeys = [
  "native-banner",
  "banner-728x90",
  "banner-468x60",
  "banner-320x50",
  "banner-160x600",
  "smartlink",
] as const;

export type AdUnitKey = (typeof adUnitKeys)[number];
export type AdPlacement = "responsive-banner" | "native-banner" | "right-rail";

export interface AdConfig {
  units: Record<AdUnitKey, string>;
}
