import React from 'react';

interface MinecraftPanoramaProps {
  disablePanorama?: boolean;
  lockPanoramaScroll?: boolean;
  panoramaScrollSpeed?: number;
}

const PANORAMA_IMAGES = [
  'https://minecraft.wiki/images/thumb/Bedrock_Edition_Preview_panorama_0.png/800px-Bedrock_Edition_Preview_panorama_0.png?3cd35',
  'https://minecraft.wiki/images/thumb/Bedrock_Edition_Preview_panorama_1.png/800px-Bedrock_Edition_Preview_panorama_1.png?4b9bd',
  'https://minecraft.wiki/images/thumb/Bedrock_Edition_Preview_panorama_2.png/800px-Bedrock_Edition_Preview_panorama_2.png?956f4',
  'https://minecraft.wiki/images/thumb/Bedrock_Edition_Preview_panorama_3.png/800px-Bedrock_Edition_Preview_panorama_3.png?5b298',
];

export const MinecraftPanorama: React.FC<MinecraftPanoramaProps> = ({
  disablePanorama = false,
  lockPanoramaScroll = false,
  panoramaScrollSpeed = 5,
}) => {
  if (disablePanorama) {
    return (
      <div
        className="fixed inset-0 -z-10 pointer-events-none select-none"
        style={{
          backgroundImage: "url('https://minecraft.wiki/images/thumb/Spruce_Planks_%28texture%29_JE5.png/48px-Spruce_Planks_%28texture%29_JE5.png?37440')",
          backgroundRepeat: 'repeat',
          backgroundSize: '48px 48px',
          imageRendering: 'pixelated',
        }}
      >
        {/* Subtle dark vignette overlay for readable contrast */}
        <div className="absolute inset-0 bg-black/35" />
      </div>
    );
  }

  // Calculate duration based on speed 1 (slow, 120s) to 10 (fast, 12s)
  const speed = Math.max(1, Math.min(10, panoramaScrollSpeed || 5));
  const animDuration = `${Math.max(8, 120 - (speed - 1) * 12)}s`;

  // Repeat 4 panoramas twice so 0% -> -50% translateX scrolls seamlessly
  const seamlessImages = [...PANORAMA_IMAGES, ...PANORAMA_IMAGES];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-[#101113]">
      {/* Seamless Scrolling Track with 4 continuous panorama images */}
      <div
        className="flex h-full w-max animate-panorama transform-gpu"
        style={{
          animationDuration: animDuration,
          animationPlayState: lockPanoramaScroll ? 'paused' : 'running',
        }}
      >
        {seamlessImages.map((imgUrl, idx) => (
          <img
            key={`pano-${idx}`}
            src={imgUrl}
            alt={`Panorama ${idx % 4}`}
            referrerPolicy="no-referrer"
            className="h-screen min-h-full w-auto object-cover flex-shrink-0 filter brightness-90 transform-gpu"
          />
        ))}
      </div>

      {/* Classic Menu Dark Tint Overlay */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};

