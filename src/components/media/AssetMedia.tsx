import Image from "next/image";
import React from "react";
import { assetManifest } from "@/data/assets";
import type { AssetManifest } from "@/types/assets";

interface AssetMediaProps {
  assetId?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function AssetMedia({
  assetId,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: AssetMediaProps) {
  const assets: AssetManifest = assetManifest;
  const asset =
    assetId && Object.prototype.hasOwnProperty.call(assetManifest, assetId)
      ? assets[assetId]
      : undefined;

  if (!asset) {
    return <div className={`asset-media asset-fallback ${className}`} aria-hidden="true" />;
  }

  return (
    <figure className={`asset-media ${className}`}>
      <Image
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        priority={priority}
        sizes={sizes}
        style={{ objectPosition: asset.objectPosition ?? "center" }}
      />
      <figcaption>{asset.credit} · Source recorded in the asset manifest</figcaption>
    </figure>
  );
}
