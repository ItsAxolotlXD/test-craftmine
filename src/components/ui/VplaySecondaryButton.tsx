import React, { useState } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

interface VplaySecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  forcedState?: ComponentState;
  fullWidth?: boolean;
  size?: 'normal' | 'compact' | 'sm';
}

export const VplaySecondaryButton: React.FC<VplaySecondaryButtonProps> = ({
  children = 'Secondary button',
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
    : 'text-sm sm:text-base';
  const padClasses = isSmall ? 'px-3 py-1' : 'px-4 py-2';
  const heightClass = isSmall ? 'h-8' : 'h-10';

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
        border-2 ${state === 'hovered' || state === 'pressed' ? 'border-white outline outline-2 outline-white -outline-offset-2 z-10' : 'border-[#141414]'} rounded-none cursor-default btn-press-effect
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
        className={`inline-flex items-center justify-center gap-2 w-full truncate ${
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
