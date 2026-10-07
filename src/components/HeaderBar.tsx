import React, { useRef } from 'react';
import { playPopSound } from '../utils/sound';
import { FloatingSearchBox } from './FloatingSearchBox';
import { SidebarMenuItem } from './Sidebar';

interface HeaderBarProps {
  onBack?: () => void;
  onSearchClick?: () => void;
  isSearchOpen?: boolean;
  onToggleSearch?: () => void;
  onCloseSearch?: () => void;
  onNavigate?: (tab: SidebarMenuItem, extra?: { articleId?: string; editionId?: string }) => void;
  onSelectBase44?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onBack,
  onSearchClick,
  isSearchOpen = false,
  onToggleSearch,
  onCloseSearch,
  onNavigate,
  onSelectBase44,
}) => {
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  const handleBackPress = () => {
    playPopSound();
  };

  const handleSearchPress = () => {
    playPopSound();
    if (onToggleSearch) {
      onToggleSearch();
    } else if (onSearchClick) {
      onSearchClick();
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-[#222426] text-white border-b-4 border-[#141414] px-3 py-1 sm:py-1.5 flex items-center justify-between font-minecraft-seven select-none">
      {/* Left controls: Chevron Left (<) */}
      <div className="flex items-center gap-0.5 sm:gap-1 min-w-[36px]">
        <button
          onMouseDown={handleBackPress}
          onTouchStart={handleBackPress}
          onClick={onBack}
          aria-label="Back"
          className="p-1 hover:bg-[#323538] active:bg-[#1a1b1d] btn-press-effect text-white cursor-pointer rounded-none flex items-center justify-center transition-colors"
          title="Back"
        >
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/a/ab/ArrowLeft.png/revision/latest?cb=20260728033445"
            alt="Back"
            referrerPolicy="no-referrer"
            className="w-[13px] h-[13px] sm:w-[14px] sm:h-[14px] object-contain [image-rendering:pixelated] active:translate-y-[1px] filter brightness-0 invert"
            style={{ imageRendering: 'pixelated' }}
          />
        </button>
      </div>

      {/* Center: Craftmine Logo in the middle (Tab name removed as requested) */}
      <div className="flex items-center justify-center flex-1 mx-2">
        <img
          src="https://static.wikia.nocookie.net/ep-deo/images/7/7a/Craftmine.png/revision/latest/scale-to-width-down/1000?cb=20261004160440"
          alt="The Craftmine"
          referrerPolicy="no-referrer"
          className="h-4.5 sm:h-5 md:h-5.5 w-auto max-w-[170px] sm:max-w-[220px] object-contain [image-rendering:pixelated] select-none filter drop-shadow-sm"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* Right controls: Universal Search Button & Floating Search Box */}
      <div className="flex items-center gap-1 min-w-[36px] justify-end relative">
        <button
          ref={searchButtonRef}
          onMouseDown={handleSearchPress}
          onTouchStart={handleSearchPress}
          aria-label="Universal Search"
          aria-expanded={isSearchOpen}
          className={`p-1 hover:bg-[#323538] active:bg-[#1a1b1d] btn-press-effect text-white cursor-pointer rounded-none flex items-center justify-center transition-colors ${
            isSearchOpen ? 'bg-[#323538] ring-2 ring-[#418a28]' : ''
          }`}
          title={isSearchOpen ? 'Close search' : 'Search all aspects of Craftmine'}
        >
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/c/c8/MagnifyingGlass-52f96e5f47f42e682a00.png/revision/latest?cb=20260723030208"
            alt="Search"
            referrerPolicy="no-referrer"
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain filter brightness-0 invert active:translate-y-[1px]"
          />
        </button>

        {/* FLOATING SEARCH BOX ANCHORED UNDER THE SEARCH BUTTON */}
        {isSearchOpen && (
          <FloatingSearchBox
            isOpen={isSearchOpen}
            onClose={() => {
              if (onCloseSearch) onCloseSearch();
            }}
            onNavigate={(tab, extra) => {
              if (onNavigate) onNavigate(tab, extra);
            }}
            triggerButtonRef={searchButtonRef}
            onSelectBase44={onSelectBase44}
          />
        )}
      </div>
    </div>
  );
};
