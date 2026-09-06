export interface AssetRecord {
  id: string;
  src: `/${string}`;
  sourceUrl: string;
  alt: string;
  width: number;
  height: number;
  sourcePage: string;
  credit: string;
  usage: string;
  pageIds: string[];
  objectPosition?: string;
  fallback: "surface" | "gradient" | "hide";
}

export type AssetManifest = Record<string, AssetRecord>;
