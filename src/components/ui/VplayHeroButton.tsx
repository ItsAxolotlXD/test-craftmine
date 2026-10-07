import React, { useState } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

interface VplayHeroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  forcedState?: ComponentState;
  fullWidth?: boolean;
  size?: 'normal' | 'compact' | 'sm';
}

export const VplayHeroButton: React.FC<VplayHeroButtonProps> = ({
  children = 'Play',
  forcedState,
  fullWidth = true,
  size = 'normal',
  onClick,
  disabled,
  className = '',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const effectiveDisabled = forcedState ? forcedState === 'disabled' : disabled;
  const state: ComponentState = forcedState || (
    effectiveDisabled ? 'disabled' :
    isPressed ? 'pressed' :
    isHovered ? 'hovered' : 'normal'
  );

  let stateClass = 'mc-button-normal';
  switch (state) {
    case 'hovered':
      stateClass = 'mc-button-hover';
      break;
    case 'pressed':
      stateClass = 'mc-button-pressed';
      break;
    case 'disabled':
      stateClass = 'mc-button-disabled';
      break;
    case 'normal':
    default:
      stateClass = 'mc-button-normal';
      break;
  }

  // ONLY play sound on button press down, NEVER on button release
  const handleMouseDown = () => {
    if (!effectiveDisabled) {
      setIsPressed(true);
      playPopSound();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (effectiveDisabled) return;
    onClick?.(e);
  };

  const handleTouchStart = () => {
    if (!effectiveDisabled) {
      setIsPressed(true);
      playPopSound();
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => setIsPressed(false), 120);
  };

  const isSmall = size === 'sm' || size === 'compact';
  const fontClasses = isSmall
    ? 'text-xs sm:text-sm'
    : 'text-sm sm:text-base md:text-lg';
  const padClasses = isSmall ? 'px-3 py-1' : 'px-4 py-2';
  const heightClass = isSmall ? 'h-8' : 'h-11 sm:h-12';

  return (
    <button
      disabled={effectiveDisabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => setIsPressed(false)}
      onClick={handleClick}
      className={`
        relative select-none font-minecraft-seven overflow-hidden inline-flex items-center justify-center
        border-2 border-[#141414] rounded-none cursor-pointer btn-press-effect
        ${stateClass}
        ${heightClass}
        ${padClasses}
        ${fontClasses}
        ${effectiveDisabled ? 'cursor-not-allowed opacity-85' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      <span
        className={`inline-flex items-center justify-center gap-2 w-full truncate transition-transform duration-75 ${
          state === 'pressed' ? 'translate-y-[2px]' : ''
        } ${
          state === 'hovered' || state === 'pressed'
            ? 'text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.7)]'
            : state === 'disabled'
            ? 'text-[#606367]'
            : 'text-[#4e5155]'
        }`}
      >
        {children}
      </span>
    </button>
  );
};
