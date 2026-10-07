import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserSettings } from './types';
import { SettingsView } from './components/SettingsView';
import { PlayCraftmineView, CRAFTMINE_EDITIONS } from './components/PlayCraftmineView';
import { ReleaseNotesView } from './components/ReleaseNotesView';
import { FaqSection } from './components/FaqSection';
import { Sidebar, SidebarMenuItem } from './components/Sidebar';
import { HeaderBar } from './components/HeaderBar';
import { MinecraftPanorama } from './components/MinecraftPanorama';
import { HomeBannerSlider } from './components/HomeBannerSlider';
import { FeedbackModal } from './components/FeedbackModal';
import { Base44ExperienceModal } from './components/Base44ExperienceModal';
import { playPopSound } from './utils/sound';

import { Play, Sparkles, Cpu, Layers } from 'lucide-react';

export default function App() {
  const [sidebarItem, setSidebarItem] = useState<SidebarMenuItem>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [showBase44Modal, setShowBase44Modal] = useState(false);
  const [isDeveloperUnlocked, setIsDeveloperUnlocked] = useState<boolean>(false);
  const [targetArticleId, setTargetArticleId] = useState<string | null>(null);
  const [targetEditionId, setTargetEditionId] = useState<string | null>(null);

  const triggerTabLoading = () => {
    setIsTabLoading(true);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 1000);
  };

  const [settings, setSettings] = useState<UserSettings>({
    autoPlay: true,
    subtitles: true,
    hdQuality: true,
    soundVolume: 7,
    qualityOption: '1080p',
    preferredCategory: 'all',
    themeMode: 'dark',
    notifications: true,
    searchQuery: 'Craftmine Player',
    disablePanorama: true,
    lockPanoramaScroll: false,
    panoramaScrollSpeed: 5,
    reduceMotion: true,
  });

  const handleSidebarSelect = (item: SidebarMenuItem) => {
    if (item !== sidebarItem || isSettingsOpen) {
      triggerTabLoading();
    }
    if (item === 'settings') {
      setIsSettingsOpen(true);
      setSidebarItem('settings');
    } else {
      setIsSettingsOpen(false);
      setSidebarItem(item);
    }
  };

  const handleHeaderBack = () => {
    if (isSettingsOpen || sidebarItem !== 'home') {
      triggerTabLoading();
    }
    if (isSettingsOpen) {
      setIsSettingsOpen(false);
      setSidebarItem('home');
    } else if (sidebarItem !== 'home') {
      setSidebarItem('home');
    }
  };

  const handleUniversalSearchNavigate = (
    tab: SidebarMenuItem,
    extra?: { articleId?: string; editionId?: string }
  ) => {
    triggerTabLoading();
    if (extra?.articleId) {
      setTargetArticleId(extra.articleId);
    }
    if (extra?.editionId) {
      setTargetEditionId(extra.editionId);
    }
    if (tab === 'settings') {
      setIsSettingsOpen(true);
      setSidebarItem('settings');
    } else {
      setIsSettingsOpen(false);
      setSidebarItem(tab);
    }
  };

  return (
    <div className="relative min-h-screen text-white font-minecraft-seven antialiased selection:bg-[#418a28] selection:text-white flex flex-col">
      {/* Minecraft Panorama Animated Background */}
      <MinecraftPanorama
        disablePanorama={settings.disablePanorama}
        lockPanoramaScroll={settings.lockPanoramaScroll}
        panoramaScrollSpeed={settings.panoramaScrollSpeed}
      />
      
      {/* STICKY TOP HEADER BAR WITH CRAFTMINE LOGO & FLOATING SEARCH */}
      <HeaderBar
        onBack={handleHeaderBack}
        isSearchOpen={isSearchOpen}
        onToggleSearch={() => setIsSearchOpen((prev) => !prev)}
        onCloseSearch={() => setIsSearchOpen(false)}
        onNavigate={handleUniversalSearchNavigate}
        onSelectBase44={() => setShowBase44Modal(true)}
      />

      {/* HORIZONTAL TAB BAR */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 relative z-40">
        <Sidebar
          activeItem={sidebarItem}
          onSelectItem={handleSidebarSelect}
        />
      </div>

      {/* MAIN CONTAINER CONTENT AREA */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6 lg:pb-8 relative">
        <main className="w-full min-w-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {isTabLoading ? (
              <motion.div
                key="loading"
                initial={settings.reduceMotion ? { opacity: 1, x: 0 } : { x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={settings.reduceMotion ? { opacity: 1, x: 0 } : { opacity: 1, transition: { duration: 0 } }}
                transition={settings.reduceMotion ? { duration: 0 } : { duration: 0.22, ease: 'easeInOut' }}
              >
                <div className="w-full min-h-[380px] bg-black/60 border-2 border-[#141414] shadow-2xl flex flex-col items-center justify-center p-8 text-center select-none my-2">
                  <img
                    src="https://img1.picmix.com/output/stamp/thumb/5/1/5/3/2513515_ae923.gif"
                    alt="Loading The Craftmine..."
                    referrerPolicy="no-referrer"
                    className="h-16 sm:h-20 w-auto object-contain [image-rendering:pixelated]"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={isSettingsOpen ? 'settings' : sidebarItem}
                initial={settings.reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={settings.reduceMotion ? { opacity: 1, x: 0 } : { x: '-100%', opacity: 1 }}
                transition={
                  settings.reduceMotion
                    ? { duration: 0 }
                    : {
                        opacity: { duration: 0.35, ease: 'easeInOut' },
                        x: { duration: 0.2, ease: 'easeInOut' },
                      }
                }
              >
                {sidebarItem === 'settings' || isSettingsOpen ? (
                  <SettingsView
                    settings={settings}
                    onChangeLiveSettings={(newSet) => setSettings(newSet)}
                    onSave={(newSet) => {
                      setSettings(newSet);
                      setIsSettingsOpen(false);
                      triggerTabLoading();
                      setSidebarItem('home');
                    }}
                    onCancel={() => {
                      setIsSettingsOpen(false);
                      triggerTabLoading();
                      setSidebarItem('home');
                    }}
                    onOpenFeedback={() => setIsFeedbackOpen(true)}
                    isDeveloperUnlocked={isDeveloperUnlocked}
                    onToggleDeveloperUnlocked={setIsDeveloperUnlocked}
                  />
                ) : sidebarItem === 'release_notes' ? (
                  <ReleaseNotesView
                    initialArticleId={targetArticleId}
                    onPlayEdition={(editionId) => {
                      if (editionId === 'base64') {
                        setShowBase44Modal(true);
                      } else {
                        triggerTabLoading();
                        setSidebarItem('play_craftmine');
                      }
                    }}
                  />
                ) : sidebarItem === 'play_craftmine' ? (
                  <PlayCraftmineView initialEditionId={targetEditionId} />
                ) : (
                  /* HOME DASHBOARD VIEW */
                  <div className="space-y-4">
                    {/* SLIDING BANNER */}
                    <HomeBannerSlider
                      reduceMotion={settings.reduceMotion}
                      onExploreDesignSystem={() => {
                        triggerTabLoading();
                        setSidebarItem('play_craftmine');
                      }}
                      onPlayCraftmine={() => {
                        triggerTabLoading();
                        setSidebarItem('play_craftmine');
                      }}
                      onOpenFeedback={() => setIsFeedbackOpen(true)}
                    />

                    {/* 3 CRAFTMINE EDITIONS SHOWCASE */}
                    <div className="bg-[#35383b] border-2 border-[#141414] p-4 sm:p-5 shadow-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-[#2d3033] pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-[#89dc69] rounded-none animate-pulse" />
                          <h2 className="text-sm sm:text-base text-white uppercase tracking-wider font-minecraft-ten">
                            3 CRAFTMINE EDITIONS (3 GAME ENGINES)
                          </h2>
                        </div>
                        <button
                          onMouseDown={() => playPopSound()}
                          onClick={() => {
                            triggerTabLoading();
                            setSidebarItem('play_craftmine');
                          }}
                          className="mc-button-normal border-2 border-[#141414] px-2.5 py-1 text-xs font-minecraft-seven cursor-default btn-press-effect flex items-center justify-center"
                        >
                          <span className="-translate-y-[1px]">Play Now</span>
                        </button>
                      </div>

                      {/* 3 EDITIONS CARDS */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {CRAFTMINE_EDITIONS.map((edition, idx) => (
                          <div
                            key={edition.id}
                            onMouseDown={() => playPopSound()}
                            onClick={() => {
                              if (edition.id === 'base64') {
                                setShowBase44Modal(true);
                              } else {
                                triggerTabLoading();
                                setTargetEditionId(edition.id);
                                setSidebarItem('play_craftmine');
                              }
                            }}
                            className="group relative bg-[#3f4246] hover:bg-[#484c50] border-2 border-[#141414] hover:border-white hover:outline hover:outline-2 hover:outline-white hover:-outline-offset-2 cursor-default flex flex-col justify-between overflow-hidden shadow-md select-none btn-press-effect p-3.5 space-y-3"
                          >
                            <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_2px_2px_0_rgba(255,255,255,0.25),inset_-2px_-4px_0_rgba(0,0,0,0.5)]" />

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span
                                  className="text-[10px] font-minecraft-ten px-2 py-0.5 border border-[#141414]"
                                  style={{ backgroundColor: edition.accentColor, color: '#141414' }}
                                >
                                  ENGINE #{idx + 1}
                                </span>
                                <span className="text-[10px] text-gray-300 font-minecraft-seven flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-[#89dc69] rounded-full" />
                                  READY
                                </span>
                              </div>

                              <h3 className="text-sm sm:text-base text-white group-hover:text-[#89dc69] font-minecraft-ten flex items-center gap-1.5">
                                {idx === 0 && <Sparkles className="w-4 h-4 text-[#89dc69]" />}
                                {idx === 1 && <Cpu className="w-4 h-4 text-sky-400" />}
                                {idx === 2 && <Layers className="w-4 h-4 text-amber-400" />}
                                {edition.name}
                              </h3>

                              <div className="text-[11px] text-gray-400 font-minecraft-seven">
                                {edition.engineName}
                              </div>

                              <p className="text-xs text-gray-300 font-minecraft-seven leading-relaxed line-clamp-3">
                                {edition.description}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-[#4e5257] flex items-center justify-between text-[11px]">
                              <span className="text-gray-300 font-minecraft-seven truncate max-w-[140px]">
                                {edition.engineType}
                              </span>
                              <span className="text-[#89dc69] font-minecraft-ten group-hover:underline flex items-center gap-1 text-[11px]">
                                <span>PLAY NOW</span>
                                <Play className="w-3 h-3 fill-current" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* LATEST RELEASE NOTE BANNER */}
                    <div
                      onMouseDown={() => playPopSound()}
                      onClick={() => {
                        triggerTabLoading();
                        setTargetArticleId('snapshot-26w04-base');
                        setSidebarItem('release_notes');
                      }}
                      className="group relative bg-[#2a2d30] hover:bg-[#32363a] border-2 border-[#89dc69] hover:border-white hover:outline hover:outline-2 hover:outline-white hover:-outline-offset-2 p-4 sm:p-5 shadow-xl cursor-default select-none btn-press-effect flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden"
                    >
                      <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_2px_2px_0_rgba(255,255,255,0.2),inset_-2px_-3px_0_rgba(0,0,0,0.5)]" />

                      <div className="flex items-center gap-3 sm:gap-4 relative z-10 w-full sm:w-auto">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#161718] border-2 border-[#141414] flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src="https://static.wikia.nocookie.net/ep-deo/images/2/28/Update_thumb.png/revision/latest/scale-to-width-down/1000?cb=20261006103204"
                            alt="Snapshot 26w04-base"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover [image-rendering:pixelated] group-hover:scale-105 transition-transform"
                            style={{ imageRendering: 'pixelated' }}
                          />
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="bg-[#89dc69] text-[#141414] text-[10px] font-minecraft-ten px-1.5 py-0.5 border border-[#141414]">
                              NEW UPDATE
                            </span>
                            <span className="text-[#38bdf8] text-[11px] font-minecraft-seven">
                              Base44 Exclusive
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base text-white group-hover:text-[#89dc69] font-minecraft-ten">
                            Snapshot 26w04-base: Desert Biome, Caves & Decorative Blocks
                          </h3>
                          <p className="text-xs text-gray-300 font-minecraft-seven truncate max-w-xl">
                            Explore all new features, cactus flowers, natural waterfalls and fixed bugs in the latest snapshot.
                          </p>
                        </div>
                      </div>

                      <div className="self-end sm:self-center relative z-10 flex-shrink-0">
                        <span className="bg-[#418a28] group-hover:bg-[#52a634] text-white px-3.5 py-2 text-xs font-minecraft-ten border-2 border-[#141414] flex items-center gap-1.5 shadow-[inset_1px_1px_0_#89dc69]">
                          <span>VIEW DETAILS</span>
                          <span>→</span>
                        </span>
                      </div>
                    </div>

                    {/* FREQUENTLY ASKED QUESTIONS SECTION */}
                    <FaqSection
                      onGoToPlayCraftmine={() => {
                        triggerTabLoading();
                        setSidebarItem('play_craftmine');
                      }}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* FEEDBACK MODAL */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* BASE44 EXPERIENCE MODAL DIALOG */}
      <Base44ExperienceModal
        isOpen={showBase44Modal}
        onClose={() => setShowBase44Modal(false)}
      />
    </div>
  );
}
