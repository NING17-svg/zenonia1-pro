import { AssetMedia } from "@/components/media/AssetMedia";
import type { MediaGalleryModule } from "@/types/modules";

export function MediaGallery({ guideModule }: { guideModule: MediaGalleryModule }) {
  return (
    <section id={guideModule.id} className="content-module">
      {guideModule.heading ? <h2>{guideModule.heading}</h2> : null}
      <div className="media-gallery">
        {guideModule.assetIds.map((assetId, index) => (
          <AssetMedia key={`${assetId}-${index}`} assetId={assetId} />
        ))}
      </div>
    </section>
  );
}
