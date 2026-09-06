"use client";

import { useEffect, useState } from "react";

import { ads } from "@/data/ads";
import type { AdPlacement, AdUnitKey } from "@/types/ads";

type BannerUnitKey =
  | "banner-728x90"
  | "banner-468x60"
  | "banner-320x50";

const bannerDimensions: Record<BannerUnitKey, { width: number; height: number }> = {
  "banner-728x90": { width: 728, height: 90 },
  "banner-468x60": { width: 468, height: 60 },
  "banner-320x50": { width: 320, height: 50 },
};

function appendExecutableAdMarkup(container: HTMLElement, code: string): void {
  const template = document.createElement("template");
  template.innerHTML = code;

  for (const child of Array.from(template.content.childNodes)) {
    if (child instanceof HTMLScriptElement) {
      const script = document.createElement("script");
      for (const attribute of Array.from(child.attributes)) {
        script.setAttribute(attribute.name, attribute.value);
      }
      if (child.src && !child.hasAttribute("async")) {
        script.async = false;
      }
      script.text = child.text;
      container.appendChild(script);
    } else {
      container.appendChild(document.importNode(child, true));
    }
  }
}

function AdsterraMarkup({
  code,
  unit,
  width,
  height,
  responsive = false,
}: {
  code: string;
  unit: AdUnitKey;
  width?: number;
  height?: number;
  responsive?: boolean;
}) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container) return;
    container.replaceChildren();
    if (!code.trim()) return;
    appendExecutableAdMarkup(container, code);
    return () => container.replaceChildren();
  }, [code, container]);

  return (
    <aside
      className={`ad-slot ad-slot-${unit}`}
      aria-label="Advertisement"
      data-ad-provider="adsterra"
      data-ad-unit={unit}
    >
      <div
        ref={setContainer}
        className={responsive ? "ad-frame ad-frame-responsive" : "ad-frame"}
        style={width && height ? { width, height } : undefined}
      />
    </aside>
  );
}

function ResponsiveBannerSlot() {
  const [unit, setUnit] = useState<BannerUnitKey | null>(null);

  useEffect(() => {
    const selectUnit = () => {
      if (window.innerWidth >= 900) setUnit("banner-728x90");
      else if (window.innerWidth >= 560) setUnit("banner-468x60");
      else setUnit("banner-320x50");
    };
    selectUnit();
    window.addEventListener("resize", selectUnit);
    return () => window.removeEventListener("resize", selectUnit);
  }, []);

  if (!unit) return null;
  const dimensions = bannerDimensions[unit];
  return (
    <AdsterraMarkup
      key={unit}
      code={ads.units[unit]}
      unit={unit}
      width={dimensions.width}
      height={dimensions.height}
    />
  );
}

function RightRailSlot() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 901px)");
    const update = () => setVisible(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (!visible) return null;
  return (
    <AdsterraMarkup
      code={ads.units["banner-160x600"]}
      unit="banner-160x600"
      width={160}
      height={600}
    />
  );
}

export function AdSlot({ placement }: { placement: AdPlacement }) {
  if (placement === "responsive-banner") return <ResponsiveBannerSlot />;
  if (placement === "right-rail") return <RightRailSlot />;
  return (
    <AdsterraMarkup
      code={ads.units["native-banner"]}
      unit="native-banner"
      responsive
    />
  );
}

export function Smartlink() {
  const href = ads.units.smartlink;
  if (!href.trim()) return null;
  return (
    <a
      className="sponsored-link"
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      data-ad-provider="adsterra"
      data-ad-unit="smartlink"
    >
      Sponsored Link
    </a>
  );
}
