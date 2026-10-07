import React, { useState, useRef, useEffect } from 'react';
import { playPopSound } from '../utils/sound';
import { VplayHeroButton } from './ui/VplayHeroButton';
import { ExternalLink, Maximize2, RotateCw } from 'lucide-react';
import { Base44ExperienceModal } from './Base44ExperienceModal';

export interface CraftmineEdition {
  id: string;
  name: string;
  engineName: string;
  engineType: string;
  url: string;
  tagline: string;
  description: string;
  badge: string;
  accentColor: string;
  features: string[];
}

export const CRAFTMINE_EDITIONS: CraftmineEdition[] = [
  {
    id: 'lovable',
    name: 'Craftmine Lovable Edition',
    engineName: 'Lovable WebGL Engine',
    engineType: 'Three.js / WebGL 3D Voxel',
    url: 'https://boundless-block-worlds.lovable.app/',
    tagline: 'Boundless 3D Block Worlds with dynamic lighting & terrain',
    description: 'Modern 3D WebGL graphics powered by Lovable engine, featuring infinite block world generation, dynamic sun & moon lighting cycles, and smooth voxel physics.',
    badge: 'LOVABLE ENGINE',
    accentColor: '#89dc69',
    features: ['Infinite Voxel Terrain', 'Dynamic Sunlight & Shadows', 'Block Physics', 'Smooth 60+ FPS'],
  },
  {
    id: 'base64',
    name: 'Craftmine Base 64 Edition',
    engineName: 'Base44 Engine',
    engineType: 'Base44 High-Speed Voxel Canvas',
    url: 'https://craftmine-preview.base44.app/',
    tagline: 'Ultra-fast loading & lightweight creative block sandbox',
    description: 'High-performance edition built on Base44, optimized for ultra-fast load times, minimal memory usage, and instant creative sandbox gameplay.',
    badge: 'BASE 64 ENGINE',
    accentColor: '#38bdf8',
    features: ['Instant Chunk Streaming', 'Low Latency Input', 'Creative Building', 'Lightweight Footprint'],
  },
  {
    id: 'studio',
    name: 'Craftmine Studio Edition',
    engineName: 'Studio Vercel Engine',
    engineType: 'Next-Gen Full Voxel Architecture',
    url: 'https://the-craftmine.vercel.app/',
    tagline: 'The flagship full-featured Craftmine experience',
    description: 'The complete flagship edition of The Craftmine with a rich feature set, custom world lobby, Bedrock styling, and deep customization.',
    badge: 'STUDIO EDITION',
    accentColor: '#f59e0b',
    features: ['Full Gameplay Suite', 'World Customization', 'Lobby & Skins', 'Ore UI Integration'],
  },
];

interface PlayCraftmineViewProps {
  initialEditionId?: string | null;
}

export const PlayCraftmineView: React.FC<PlayCraftmineViewProps> = ({ initialEditionId }) => {
  const initial = (initialEditionId && CRAFTMINE_EDITIONS.find((e) => e.id === initialEditionId)) || CRAFTMINE_EDITIONS[0];
  const [selectedEdition, setSelectedEdition] = useState<CraftmineEdition>(initial);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [, setIsFullscreen] = useState<boolean>(false);
  const [isLoadingFrame, setIsLoadingFrame] = useState<boolean>(true);
  const [showBase44Modal, setShowBase44Modal] = useState<boolean>(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialEditionId === 'base64') {
      setShowBase44Modal(true);
    } else if (initialEditionId) {
      const match = CRAFTMINE_EDITIONS.find((e) => e.id === initialEditionId);
      if (match && match.id !== selectedEdition.id) {
        setIsLoadingFrame(true);
        setSelectedEdition(match);
        setIframeKey((prev) => prev + 1);
      }
    }
  }, [initialEditionId]);

  const handleSelectEdition = (edition: CraftmineEdition) => {
    if (edition.id === 'base64') {
      setShowBase44Modal(true);
      return;
    }
    if (edition.id !== selectedEdition.id) {
      setIsLoadingFrame(true);
      setSelectedEdition(edition);
      setIframeKey((prev) => prev + 1);
    }
  };

  const handleReloadFrame = () => {
    setIsLoadingFrame(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="w-full space-y-4 font-minecraft-seven">
      {/* HEADER BAR: PLAY CRAFTMINE TITLE & EDITION SELECTOR */}
      <div className="bg-[#35383b] border-2 border-[#141414] p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#2d3033] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#89dc69] inline-block border border-[#141414]" />
              <h1 className="text-base sm:text-lg text-white uppercase tracking-wider font-minecraft-ten flex items-center gap-2">
                <span>PLAY CRAFTMINE (3 GAME ENGINES)</span>
              </h1>
            </div>
            <p className="text-xs text-gray-300 font-minecraft-seven mt-0.5">
              Choose from 3 editions developed on different engines to experience The Craftmine.
            </p>
          </div>

          {/* Quick External Link to current engine */}
          <a
            href={selectedEdition.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseDown={() => playPopSound()}
            className="flex items-center gap-2 bg-[#89dc69] hover:bg-[#9ded7e] text-[#141414] font-minecraft-ten text-xs px-3.5 py-1.5 border-2 border-[#141414] shadow-[inset_1px_1px_0_#ffffff] cursor-default flex-shrink-0 active:translate-y-[1px]"
          >
            <span>Open Original Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3 ENGINE SWITCHER TABS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {CRAFTMINE_EDITIONS.map((edition, idx) => {
            const isSelected = selectedEdition.id === edition.id;
            return (
              <button
                key={edition.id}
                onMouseDown={() => playPopSound()}
                onClick={() => handleSelectEdition(edition)}
                className={`
                  relative p-2.5 sm:p-3 text-left border-2 cursor-default flex flex-col justify-between overflow-hidden select-none btn-press-effect
                  ${isSelected
                    ? 'bg-[#292b2d] border-white shadow-[inset_2px_2px_0_rgba(255,255,255,0.2)]'
                    : 'bg-[#3e4246] hover:bg-[#484c50] border-[#141414]'
                  }
                `}
              >
                {/* 3D bevel overlay */}
                <div
                  className={`absolute inset-0 pointer-events-none z-20 ${
                    isSelected
                      ? 'shadow-[inset_2px_2px_0_rgba(0,0,0,0.6)]'
                      : 'shadow-[inset_2px_2px_0_rgba(255,255,255,0.2),inset_-2px_-3px_0_rgba(0,0,0,0.4)]'
                  }`}
                />

                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className="px-1.5 py-0.5 text-[9px] font-minecraft-ten uppercase border border-[#141414]"
                    style={{ backgroundColor: isSelected ? edition.accentColor : '#222426', color: isSelected ? '#141414' : '#d1d5db' }}
                  >
                    #{idx + 1} {edition.badge}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[9px] text-[#89dc69] font-minecraft-seven">
                      <span className="w-1.5 h-1.5 bg-[#89dc69] rounded-full animate-ping" />
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-white font-minecraft-ten truncate mt-1">
                  {edition.name}
                </div>

                <div className="text-[10px] text-gray-300 font-minecraft-seven truncate mt-0.5">
                  {edition.engineName}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* EMBEDDED GAME VIEWPORT CONTAINER */}
      <div
        ref={playerContainerRef}
        className="bg-[#292b2d] border-2 border-[#141414] shadow-2xl overflow-hidden flex flex-col relative"
      >
        {/* PLAYER CONTROL TOOLBAR */}
        <div className="bg-[#1e2022] border-b-2 border-[#141414] px-3 py-2 flex items-center justify-between flex-wrap gap-2 text-xs font-minecraft-seven select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#89dc69] rounded-full" />
            <span className="text-white text-xs sm:text-sm tracking-wide font-minecraft-ten">
              {selectedEdition.name}
            </span>
            <span className="hidden md:inline-block bg-[#141414] text-gray-300 text-[10px] px-2 py-0.5 border border-[#383a3d]">
              {selectedEdition.engineType}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onMouseDown={() => playPopSound()}
              onClick={handleReloadFrame}
              title="Reload game"
              className="mc-button-normal border-2 border-[#141414] px-2 py-1 cursor-default flex items-center gap-1 text-[11px] btn-press-effect"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#313131]" />
              <span className="hidden sm:inline text-[#313131] -translate-y-[0.5px]">Reload</span>
            </button>

            <button
              onMouseDown={() => playPopSound()}
              onClick={handleToggleFullscreen}
              title="Fullscreen"
              className="mc-button-normal border-2 border-[#141414] px-2 py-1 cursor-default flex items-center gap-1 text-[11px] btn-press-effect"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#313131]" />
              <span className="hidden sm:inline text-[#313131] -translate-y-[0.5px]">Fullscreen</span>
            </button>

            <a
              href={selectedEdition.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseDown={() => playPopSound()}
              title="Open in new tab"
              className="mc-button-normal border-2 border-[#141414] px-2.5 py-1 cursor-default flex items-center gap-1 text-[11px] btn-press-effect font-minecraft-seven text-[#313131]"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#313131]" />
              <span className="-translate-y-[0.5px]">New Tab</span>
            </a>
          </div>
        </div>

        {/* IFRAME GAME CANVAS */}
        <div className="relative w-full aspect-[16/10] min-h-[460px] sm:min-h-[560px] md:min-h-[640px] bg-[#121315]">
          {isLoadingFrame && (
            <div className="absolute inset-0 z-10 bg-[#16181a] flex flex-col items-center justify-center p-6 text-center">
              <img
                src="https://img1.picmix.com/output/stamp/thumb/5/1/5/3/2513515_ae923.gif"
                alt="Loading Craftmine"
                referrerPolicy="no-referrer"
                className="h-16 sm:h-20 w-auto object-contain [image-rendering:pixelated]"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          )}

          <iframe
            key={iframeKey}
            src={selectedEdition.url}
            title={selectedEdition.name}
            onLoad={() => setIsLoadingFrame(false)}
            allow="fullscreen; gamepad; accelerometer; gyroscope; cross-origin-isolated; autoplay"
            className="w-full h-full border-0 relative z-20"
          />
        </div>

        {/* BOTTOM HELPER BAR: CONTROLS & ENGINE SPECS */}
        <div className="bg-[#1e2022] border-t-2 border-[#141414] p-3 text-xs font-minecraft-seven flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-gray-300">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#89dc69] uppercase font-minecraft-ten">Controls:</span>
            <span className="bg-[#141414] px-1.5 py-0.5 text-white text-[11px] border border-[#383a3d]">W A S D</span>
            <span>Move</span>
            <span className="text-gray-500">•</span>
            <span className="bg-[#141414] px-1.5 py-0.5 text-white text-[11px] border border-[#383a3d]">Space</span>
            <span>Jump</span>
            <span className="text-gray-500">•</span>
            <span className="bg-[#141414] px-1.5 py-0.5 text-white text-[11px] border border-[#383a3d]">Left Click</span>
            <span>Break block</span>
            <span className="text-gray-500">•</span>
            <span className="bg-[#141414] px-1.5 py-0.5 text-white text-[11px] border border-[#383a3d]">Right Click</span>
            <span>Place block</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span>Direct URL:</span>
            <a
              href={selectedEdition.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#89dc69] hover:underline truncate max-w-[200px]"
            >
              {selectedEdition.url}
            </a>
          </div>
        </div>
      </div>

      {/* THREE EDITIONS DETAILED COMPARISON MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CRAFTMINE_EDITIONS.map((edition) => {
          const isSelected = selectedEdition.id === edition.id;
          return (
            <div
              key={`detail-${edition.id}`}
              className={`
                bg-[#35383b] border-2 p-4 shadow-lg space-y-3 flex flex-col justify-between
                ${isSelected ? 'border-[#89dc69]' : 'border-[#141414]'}
              `}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-minecraft-ten px-2 py-0.5 border border-[#141414]"
                    style={{ backgroundColor: edition.accentColor, color: '#141414' }}
                  >
                    {edition.badge}
                  </span>
                  <span className="text-[10px] text-gray-400 font-minecraft-seven">ONLINE</span>
                </div>

                <h3 className="text-sm sm:text-base text-white font-minecraft-ten">
                  {edition.name}
                </h3>

                <p className="text-xs text-gray-300 font-minecraft-seven leading-relaxed">
                  {edition.description}
                </p>

                {/* Features Pill List */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {edition.features.map((feat, i) => (
                    <span
                      key={i}
                      className="bg-[#242628] text-gray-300 px-2 py-0.5 text-[10px] font-minecraft-seven border border-[#141414]"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#2d3033]">
                {isSelected ? (
                  <div className="w-full bg-[#242628] text-[#89dc69] text-center py-2 text-xs font-minecraft-ten border border-[#418a28]">
                    ▶ PLAYING THIS EDITION
                  </div>
                ) : (
                  <VplayHeroButton fullWidth onClick={() => handleSelectEdition(edition)}>
                    Switch to this edition
                  </VplayHeroButton>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* BASE44 EXPERIENCED MODAL POPUP */}
      <Base44ExperienceModal
        isOpen={showBase44Modal}
        onClose={() => setShowBase44Modal(false)}
      />
    </div>
  );
};
