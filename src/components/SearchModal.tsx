import React, { useState, useMemo } from 'react';
import { playPopSound } from '../utils/sound';
import { SidebarMenuItem } from './Sidebar';
import { Search, Gamepad2, FileText, Settings, HelpCircle, Compass, ArrowRight, X } from 'lucide-react';

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

const SEARCH_DATABASE: SearchResultItem[] = [
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
    title: 'Play Craftmine Tab',
    description: 'Interactive in-browser launcher supporting Lovable, Base 64, and Studio game engines.',
    badge: 'Tab',
    targetTab: 'play_craftmine',
  },
  {
    id: 'nav-notes',
    category: 'nav',
    categoryLabel: 'Navigation',
    title: 'Release Notes Tab',
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

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: SidebarMenuItem, extra?: { articleId?: string; editionId?: string }) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'game' | 'update' | 'setting' | 'faq'>('all');

  const filteredResults = useMemo(() => {
    let results = SEARCH_DATABASE;
    if (activeFilter !== 'all') {
      results = results.filter((r) => r.category === activeFilter);
    }
    if (!query.trim()) {
      return results;
    }
    const q = query.toLowerCase().trim();
    return results.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.badge && r.badge.toLowerCase().includes(q)) ||
        r.categoryLabel.toLowerCase().includes(q)
    );
  }, [query, activeFilter]);

  if (!isOpen) return null;

  const handleSelect = (item: SearchResultItem) => {
    onNavigate(item.targetTab, { articleId: item.articleId, editionId: item.editionId });
    onClose();
  };

  const getCategoryIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'game':
        return <Gamepad2 className="w-4 h-4 text-[#89dc69]" />;
      case 'update':
        return <FileText className="w-4 h-4 text-sky-400" />;
      case 'setting':
        return <Settings className="w-4 h-4 text-amber-400" />;
      case 'faq':
        return <HelpCircle className="w-4 h-4 text-purple-400" />;
      case 'nav':
      default:
        return <Compass className="w-4 h-4 text-gray-300" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 animate-fade-in overflow-y-auto font-minecraft-seven select-none">
      <div className="mc-dialog-window w-full max-w-2xl p-3.5 sm:p-4.5 flex flex-col h-[85vh] max-h-[620px] my-auto overflow-hidden">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between mb-2 sm:mb-2.5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base text-[#313131] font-minecraft-seven font-normal">
              Search Craftmine
            </h2>
          </div>

          <button
            onMouseDown={() => playPopSound()}
            onClick={onClose}
            className="w-6 h-6 mc-button-normal border-2 border-[#141414] text-[#313131] text-xs flex items-center justify-center cursor-default btn-press-effect"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* SEARCH & RESULTS INSIDE BLACK WELL */}
        <div className="mc-dialog-well flex-1 p-3 sm:p-3.5 flex flex-col min-h-0 space-y-2.5 mb-3 overflow-hidden">
          {/* SEARCH INPUT BAR */}
          <div className="relative flex items-center w-full flex-shrink-0">
            <img
              src="https://img.itch.zone/aW1hZ2UvNDMzMzIwMS8yNTg2OTU0MS5wbmc=/original/pechXq.png"
              alt="Search Icon"
              referrerPolicy="no-referrer"
              className="absolute left-3 w-4.5 h-4.5 object-contain pointer-events-none z-10 [image-rendering:pixelated]"
              style={{ imageRendering: 'pixelated' }}
            />
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mc-search-box w-full h-10 pl-10 pr-9 text-xs sm:text-sm font-minecraft-seven focus:border-white cursor-text"
            />
            {query && (
              <button
                onMouseDown={() => playPopSound()}
                onClick={() => setQuery('')}
                className="absolute right-3 text-gray-300 hover:text-white text-xs px-1 cursor-default font-bold z-10"
              >
                ✕
              </button>
            )}
          </div>

          {/* FILTER CHIPS */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-[11px] flex-shrink-0">
            {[
              { id: 'all', label: 'All Results' },
              { id: 'game', label: 'Games (3)' },
              { id: 'update', label: 'Release Notes' },
              { id: 'setting', label: 'Settings' },
              { id: 'faq', label: 'FAQs' },
            ].map((tab) => {
              const isSelected = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onMouseDown={() => playPopSound()}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`
                    px-2.5 py-1 border-2 ${isSelected ? 'border-white z-10' : 'border-[#141414]'} cursor-default flex-shrink-0 font-minecraft-seven text-xs btn-press-effect
                    mc-button-normal
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* RESULTS SCROLLABLE LIST */}
          <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
            {filteredResults.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <p className="text-sm text-yellow-400 font-minecraft-ten">
                  NO MATCHING RESULTS
                </p>
                <p className="text-xs text-gray-400 font-minecraft-seven">
                  No items matched "{query}". Try keywords like "desert", "lovable", "base44", "panorama", or "survival".
                </p>
              </div>
            ) : (
              filteredResults.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onMouseDown={() => playPopSound()}
                  onClick={() => handleSelect(item)}
                  className="mc-button-dark w-full p-2.5 sm:p-3 text-left cursor-default flex items-center justify-between gap-3 shadow-md btn-press-effect"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 bg-[#18191a] border border-[#141414] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-minecraft-seven">
                          {item.categoryLabel}
                        </span>
                        {item.badge && (
                          <span className="bg-[#141414] text-[#89dc69] text-[9px] px-1.5 py-0.2 border border-[#383a3d]">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs sm:text-sm font-minecraft-ten truncate">
                        {item.title}
                      </h3>

                      <p className="text-[11px] text-gray-300 font-minecraft-seven line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[#89dc69] flex-shrink-0 font-minecraft-seven text-xs">
                    <span className="hidden sm:inline font-minecraft-ten text-[10px]">OPEN</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* BOTTOM ACTION BUTTON */}
        <div className="flex flex-col w-full flex-shrink-0">
          <button
            onMouseDown={() => playPopSound()}
            onClick={onClose}
            className="w-full h-10 mc-button-normal border-2 border-[#141414] text-sm font-minecraft-seven flex items-center justify-center cursor-default btn-press-effect"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
