import React from 'react';
import { playPopSound } from '../utils/sound';
import { VplayTab } from './ui/VplayTab';

export type SidebarMenuItem = 'home' | 'play_craftmine' | 'release_notes' | 'settings';

interface SidebarProps {
  activeItem: SidebarMenuItem;
  onSelectItem: (item: SidebarMenuItem) => void;
  onOpenFeedback?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  onSelectItem,
  className = '',
}) => {
  // Hide Ore UI from the tab bar as requested
  const menuItems: { id: SidebarMenuItem; label: string; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'play_craftmine', label: 'Play' },
    { id: 'release_notes', label: 'Releases' },
    { id: 'settings', label: 'Settings' },
  ];

  // Navigate left/right with bumper brackets - only play sound on press down
  const handlePrevTab = () => {
    playPopSound();
    const currentIndex = menuItems.findIndex((m) => m.id === activeItem);
    const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
    onSelectItem(menuItems[prevIndex].id);
  };

  const handleNextTab = () => {
    playPopSound();
    const currentIndex = menuItems.findIndex((m) => m.id === activeItem);
    const nextIndex = (currentIndex + 1) % menuItems.length;
    onSelectItem(menuItems[nextIndex].id);
  };

  return (
    <nav className={`w-full select-none ${className}`}>
      {/* Horizontal Tab Bar without container background, buttons touching each other */}
      <div className="flex items-center justify-center w-full overflow-x-auto no-scrollbar -space-x-[2px] py-0.5">
        
        {/* Left Bumper Bracket [ */}
        <button
          onMouseDown={handlePrevTab}
          onTouchStart={handlePrevTab}
          title="Previous Tab"
          aria-label="Previous Tab"
          className="flex sm:hidden items-center justify-center mc-button-normal font-minecraft-seven text-xs px-2.5 py-2 border-2 border-[#141414] flex-shrink-0 cursor-pointer z-10 btn-press-effect"
        >
          [
        </button>

        {/* Tab Items */}
        <div className="flex-1 flex items-center -space-x-[2px] min-w-0 overflow-x-auto no-scrollbar">
          {menuItems.map((item) => {
            const isSelected = activeItem === item.id;
            return (
              <VplayTab
                key={item.id}
                active={isSelected}
                onClick={() => onSelectItem(item.id)}
                className="flex-1 !min-w-[80px] sm:!min-w-[120px] !py-2"
              >
                <span className="inline-flex items-center gap-1">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] sm:text-xs ${isSelected ? 'text-[#89dc69]' : 'text-gray-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </span>
              </VplayTab>
            );
          })}
        </div>

        {/* Right Bumper Bracket ] */}
        <button
          onMouseDown={handleNextTab}
          onTouchStart={handleNextTab}
          title="Next Tab"
          aria-label="Next Tab"
          className="flex sm:hidden items-center justify-center mc-button-normal font-minecraft-seven text-xs px-2.5 py-2 border-2 border-[#141414] flex-shrink-0 cursor-pointer z-10 btn-press-effect"
        >
          ]
        </button>

      </div>
    </nav>
  );
};
