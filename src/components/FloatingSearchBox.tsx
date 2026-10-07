import React, { useState, useMemo, useRef, useEffect } from 'react';
import { playPopSound } from '../utils/sound';
import { SidebarMenuItem } from './Sidebar';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { Search, X } from 'lucide-react';

export interface SearchResultItem {
  id: string;
  category: 'game' | 'update' | 'setting' | 'faq' | 'nav';
  categoryLabel: string;
  title: string;
  description: string;
  badge?: string;
  targetTab: SidebarMenuItem;
  articleId?: string;
  editionId?: string;
}

export const SEARCH_DATABASE: SearchResultItem[] = [
  // 1. GAME EDITIONS & ENGINES
  {
    id: 'game-lovable',
    category: 'game',
    categoryLabel: 'Playable Edition',
    title: 'Craftmine Lovable Edition',
    description: 'Boundless 3D block worlds with dynamic sunlight & moon lighting, infinite voxel terrain, and physics.',
    badge: 'WebGL 3D',
    targetTab: 'play_craftmine',
    editionId: 'lovable',
  },
  {
    id: 'game-base64',
    category: 'game',
    categoryLabel: 'Playable Edition',
    title: 'Craftmine Base 64 Edition',
    description: 'Ultra-fast loading & lightweight creative block sandbox engine built on Base44 with instant chunk streaming.',
    badge: 'Base44 Engine',
    targetTab: 'play_craftmine',
    editionId: 'base64',
  },
  {
    id: 'game-studio',
    category: 'game',
    categoryLabel: 'Playable Edition',
    title: 'Craftmine Studio Edition',
    description: 'The flagship full-featured Craftmine experience with world customization, multiplayer lobby & Bedrock styling.',
    badge: 'Studio Vercel',
    targetTab: 'play_craftmine',
    editionId: 'studio',
  },

  // 2. RELEASE NOTES & UPDATES
  {
    id: 'update-26w04',
    category: 'update',
    categoryLabel: 'Release Note',
    title: 'Snapshot 26w04-base',
    description: 'New decorative blocks, Desert & Oak Forest biomes, expanded cave systems, and liquid sliding physics.',
    badge: 'Latest Snapshot',
    targetTab: 'release_notes',
    articleId: 'snapshot-26w04-base',
  },
  {
    id: 'update-desert',
    category: 'update',
    categoryLabel: 'Game Feature',
    title: 'Desert Biome (Snapshot 26w04-base)',
    description: 'Hot temperature desert biome with cactus flower spawns and arid terrain generation.',
    badge: 'New Biome',
    targetTab: 'release_notes',
    articleId: 'snapshot-26w04-base',
  },
  {
    id: 'update-caves',
    category: 'update',
    categoryLabel: 'Game Feature',
    title: 'Caves System & Natural Waterfalls',
    description: 'Expanded subterranean caves with natural lava, waterfalls, and increased ore generation frequency.',
    badge: 'Caves',
    targetTab: 'release_notes',
    articleId: 'snapshot-26w04-base',
  },
  {
    id: 'update-sift',
    category: 'update',
    categoryLabel: 'Game Feature',
    title: 'The Sift & Willow Trees',
    description: 'Balanced creature spawning, corrected willow leaf transparency rendering, and cactus flower generation.',
    badge: 'The Sift',
    targetTab: 'release_notes',
    articleId: 'snapshot-26w04-base',
  },
  {
    id: 'update-fixes',
    category: 'update',
    categoryLabel: 'Bug Fixes',
    title: 'Transparency & Mob Fixes',
    description: 'Leaves transparency rendering, mangrove block textures, connected cave entrances, and creature damage fixes.',
    badge: 'Bug Fixes',
    targetTab: 'release_notes',
    articleId: 'snapshot-26w04-base',
  },

  // 3. SETTINGS & OPTIONS
  {
    id: 'setting-panorama-disable',
    category: 'setting',
    categoryLabel: 'Setting',
    title: 'Disable Panorama',
    description: 'Change application background to dark charcoal instead of the rotating 3D space panorama.',
    badge: 'Display',
    targetTab: 'settings',
  },
  {
    id: 'setting-panorama-lock',
    category: 'setting',
    categoryLabel: 'Setting',
    title: 'Lock Panorama Scroll',
    description: 'Freeze the rotating space panorama in place instead of continuous rotation.',
    badge: 'Display',
    targetTab: 'settings',
  },
  {
    id: 'setting-panorama-speed',
    category: 'setting',
    categoryLabel: 'Setting',
    title: 'Panorama Scroll Speed',
    description: 'Adjust how fast or slow the panoramic background rotates (slider 1 to 10).',
    badge: 'Display',
    targetTab: 'settings',
  },
  {
    id: 'setting-reduce-motion',
    category: 'setting',
    categoryLabel: 'Setting',
    title: 'Reduce Motion',
    description: 'Disable slide transitions and animations between pages for maximum snappiness.',
    badge: 'Motion',
    targetTab: 'settings',
  },
  {
    id: 'setting-dev',
    category: 'setting',
    categoryLabel: 'Setting',
    title: 'Developer Options & Key',
    description: 'Unlock restricted experimental features with passcode key (366761).',
    badge: 'Dev Tools',
    targetTab: 'settings',
  },
  {
    id: 'setting-perf',
    category: 'setting',
    categoryLabel: 'Tool',
    title: 'Performance Stress Test',
    description: 'Full-screen GPU/CPU benchmark measuring real-time FPS, frame latency, memory and particle stress.',
    badge: 'Benchmark',
    targetTab: 'settings',
  },

  // 4. FREQUENTLY ASKED QUESTIONS
  {
    id: 'faq-type',
    category: 'faq',
    categoryLabel: 'FAQ',
    title: 'What type of game is Craftmine?',
    description: 'A sandbox video game inspired by Minecraft combining survival, exploration, building, crafting, and adventure.',
    badge: 'FAQ #1',
    targetTab: 'home',
  },
  {
    id: 'faq-free',
    category: 'faq',
    categoryLabel: 'FAQ',
    title: 'Is Craftmine free?',
    description: 'Yes! All three versions of Craftmine can be played directly on your web browser completely for free.',
    badge: 'FAQ #2',
    targetTab: 'home',
  },
  {
    id: 'faq-devices',
    category: 'faq',
    categoryLabel: 'FAQ',
    title: 'On which devices can I play Craftmine?',
    description: 'Playable on Windows, iOS, Android, PlayStation, Xbox, Nintendo Switch, and any device with a modern browser.',
    badge: 'FAQ #3',
    targetTab: 'home',
  },
  {
    id: 'faq-goal',
    category: 'faq',
    categoryLabel: 'FAQ',
    title: "What's the goal of Craftmine?",
    description: 'There is no single path—players enjoy complete open-ended freedom to build, survive, explore, or create.',
    badge: 'FAQ #4',
    targetTab: 'home',
  },
  {
    id: 'faq-copyright',
    category: 'faq',
    categoryLabel: 'FAQ',
    title: 'Copyright & Mojang Disclaimer',
    description: 'The Craftmine is an unofficial community fan project inspired by Minecraft (Mojang Studios).',
    badge: 'FAQ #5',
    targetTab: 'home',
  },

  // 5. NAVIGATION TABS
  {
    id: 'nav-home',
    category: 'nav',
    categoryLabel: 'Navigation',
    title: 'Home Dashboard',
    description: 'Main overview featuring banner slider, 3 game engine launchers, latest updates, and FAQ.',
    badge: 'Tab',
    targetTab: 'home',
  },
  {
    id: 'nav-play',
    category: 'nav',
    categoryLabel: 'Navigation',
    title: 'Play Tab',
    description: 'Interactive in-browser launcher supporting Lovable, Base 64, and Studio game engines.',
    badge: 'Tab',
    targetTab: 'play_craftmine',
  },
  {
    id: 'nav-notes',
    category: 'nav',
    categoryLabel: 'Navigation',
    title: 'Releases Tab',
    description: 'Full changelogs and snapshot documentation for all Craftmine updates.',
    badge: 'Tab',
    targetTab: 'release_notes',
  },
  {
    id: 'nav-settings',
    category: 'nav',
    categoryLabel: 'Navigation',
    title: 'Settings Tab',
    description: 'Configure panorama motion, display options, performance tests, and developer preferences.',
    badge: 'Tab',
    targetTab: 'settings',
  },
];

interface FloatingSearchBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: SidebarMenuItem, extra?: { articleId?: string; editionId?: string }) => void;
  triggerButtonRef?: React.RefObject<HTMLButtonElement | null>;
  onSelectBase44?: () => void;
}

export const FloatingSearchBox: React.FC<FloatingSearchBoxProps> = ({
  isOpen,
  onClose,
  onNavigate,
  triggerButtonRef,
  onSelectBase44,
}) => {
  const [query, setQuery] = useState('');
  const [isFlyoutLoading, setIsFlyoutLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when opened after loading
  useEffect(() => {
    if (isOpen) {
      setIsFlyoutLoading(true);
      const timer = setTimeout(() => {
        setIsFlyoutLoading(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
      }, 450);
      return () => clearTimeout(timer);
    } else {
      setIsFlyoutLoading(true);
      setQuery('');
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        (!triggerButtonRef?.current || !triggerButtonRef.current.contains(target))
      ) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, triggerButtonRef]);

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return SEARCH_DATABASE;
    }
    const q = query.toLowerCase().trim();
    return SEARCH_DATABASE.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.categoryLabel.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (item: SearchResultItem) => {
    playPopSound();
    if (item.editionId === 'base64') {
      if (onSelectBase44) {
        onSelectBase44();
        onClose();
        return;
      }
    }
    onNavigate(item.targetTab, { articleId: item.articleId, editionId: item.editionId });
    onClose();
  };

  return (
    <div
      ref={containerRef}
      className="absolute top-full right-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-[460px] md:w-[500px] max-w-[95vw] bg-[#35383b] border-2 border-[#141414] shadow-[0_12px_36px_rgba(0,0,0,0.85)] z-50 text-white font-minecraft-seven flex flex-col max-h-[82vh] overflow-hidden select-none"
      style={{
        boxShadow: '0 12px 36px rgba(0,0,0,0.85), inset 2px 2px 0 rgba(255,255,255,0.18), inset -2px -3px 0 rgba(0,0,0,0.5)',
      }}
    >
      {isFlyoutLoading ? (
        <div className="p-8 sm:p-10 bg-[#2b2d30] flex flex-col items-center justify-center text-center min-h-[190px]">
          <img
            src="https://img1.picmix.com/output/stamp/thumb/5/1/5/3/2513515_ae923.gif"
            alt="Loading Craftmine Search..."
            referrerPolicy="no-referrer"
            className="h-16 sm:h-20 w-auto object-contain [image-rendering:pixelated]"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      ) : (
        <>
          {/* TOP FLOATING SEARCH BAR HEADER */}
        <div className="bg-[#292b2d] border-b-2 border-[#141414] p-2.5 sm:p-3 flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <img
              src="https://img.itch.zone/aW1hZ2UvNDMzMzIwMS8yNTg2OTU0MS5wbmc=/original/pechXq.png"
              alt="Search"
              referrerPolicy="no-referrer"
              className="absolute left-2.5 w-4.5 h-4.5 object-contain pointer-events-none z-10 [image-rendering:pixelated]"
              style={{ imageRendering: 'pixelated' }}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="mc-search-box w-full h-9 pl-9 pr-8 text-xs font-minecraft-seven transition-colors focus:border-white"
            />
            {query && (
              <button
                type="button"
                onMouseDown={() => playPopSound()}
                onClick={() => setQuery('')}
                className="absolute right-2 text-gray-300 hover:text-white text-xs px-1 cursor-default font-bold z-10"
                title="Clear query"
              >
                ✕
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            type="button"
            onMouseDown={() => playPopSound()}
            onClick={onClose}
            className="w-9 h-9 mc-button-normal border-2 border-[#141414] flex items-center justify-center cursor-default btn-press-effect flex-shrink-0"
            title="Close search (Esc)"
          >
            <X className="w-4 h-4 text-[#313131]" />
          </button>
        </div>

        {/* SEARCH RESULTS SCROLLABLE LIST */}
        <div className="overflow-y-auto max-h-[380px] p-2 space-y-1.5 bg-[#2a2c2f]/95">
          {filteredResults.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-gray-400 space-y-2.5">
              <p className="text-xs font-minecraft-seven text-white">
                We found nothing :(
              </p>
              <p className="text-[11px] text-gray-300 font-minecraft-seven">
                No results found for {query ? `"${query}"` : 'your query'}. Refine your search query.
              </p>
              <div className="w-52 mx-auto pt-1">
                <VplaySecondaryButton
                  size="compact"
                  onClick={() => {
                    inputRef.current?.focus();
                    inputRef.current?.select();
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  <img
                    src="https://img.itch.zone/aW1hZ2UvNDMzMzIwMS8yNTg2OTU0MS5wbmc=/original/pechXq.png"
                    alt="Search"
                    referrerPolicy="no-referrer"
                    className="w-4.5 h-4.5 object-contain inline-block mr-1.5 [image-rendering:pixelated]"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <span>Refine search</span>
                </VplaySecondaryButton>
              </div>
            </div>
          ) : (
            filteredResults.map((item) => (
              <button
                type="button"
                key={item.id}
                onMouseDown={() => playPopSound()}
                onClick={() => handleSelect(item)}
                className="mc-button-dark w-full p-2.5 text-left cursor-default flex flex-col gap-1 select-none btn-press-effect"
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <span className="text-xs font-minecraft-ten truncate">
                    {item.title}
                  </span>
                  {item.badge && (
                    <span className="text-[9px] bg-[#141414] text-[#89dc69] px-1.5 py-0.2 border border-[#444] font-minecraft-seven flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-300 font-minecraft-seven line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </button>
            ))
          )}
        </div>

        {/* BOTTOM STATUS FOOTER */}
        <div className="bg-[#242628] px-3 py-1.5 border-t border-[#141414] flex items-center justify-between text-[10px] text-gray-400">
          <span>{filteredResults.length} {filteredResults.length === 1 ? 'item' : 'items'} found</span>
          <span className="flex items-center gap-1">
            <kbd className="bg-[#18191a] px-1 py-0.5 border border-[#333] text-[9px] text-gray-300">ESC</kbd>
            <span>to close</span>
          </span>
        </div>
      </>
    )}
  </div>
  );
};
