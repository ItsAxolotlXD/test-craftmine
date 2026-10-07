import React, { useState } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

interface VplayToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  forcedState?: ComponentState;
  forcedChecked?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
}

const TOGGLE_IMAGES = {
  off: 'https://static.wikia.nocookie.net/ep-deo/images/6/6e/Toggle_off.png/revision/latest?cb=20260728024809',
  offHover: 'https://static.wikia.nocookie.net/ep-deo/images/4/4f/Toggle_off_disabled.png/revision/latest?cb=20260728024809',
  on: 'https://static.wikia.nocookie.net/ep-deo/images/4/4d/Toggle_on.png/revision/latest?cb=20260728024809',
  onHover: 'https://static.wikia.nocookie.net/ep-deo/images/9/9e/Toggle_on_hover.png/revision/latest?cb=20260728024809',
};

export const VplayToggleSwitch: React.FC<VplayToggleSwitchProps> = ({
  checked = false,
  onChange,
  forcedState,
  forcedChecked,
  disabled,
  label,
  className = '',
}) => {
  const [internalChecked, setInternalChecked] = useState(checked);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isChecked = forcedChecked !== undefined ? forcedChecked : internalChecked;
  const effectiveDisabled = forcedState ? forcedState === 'disabled' : disabled;

  const state: ComponentState = forcedState || (
    effectiveDisabled ? 'disabled' :
    isPressed ? 'pressed' :
    isHovered ? 'hovered' : 'normal'
  );

  const handlePointerDown = () => {
    if (effectiveDisabled) return;
    setIsPressed(true);
    playPopSound();
  };

  const handleClick = () => {
    if (effectiveDisabled) return;
    const next = !isChecked;
    if (forcedChecked === undefined) {
      setInternalChecked(next);
    }
    onChange?.(next);
  };

  // Determine which pixel image asset to show based on state & checked
  let imgSrc = TOGGLE_IMAGES.off;
  if (effectiveDisabled || state === 'disabled') {
    imgSrc = isChecked ? TOGGLE_IMAGES.on : TOGGLE_IMAGES.offHover;
  } else if (isChecked) {
    if (state === 'hovered') {
      imgSrc = TOGGLE_IMAGES.onHover;
    } else {
      imgSrc = TOGGLE_IMAGES.on;
    }
  } else {
    if (state === 'hovered') {
      imgSrc = TOGGLE_IMAGES.offHover;
    } else {
      imgSrc = TOGGLE_IMAGES.off;
    }
  }

  return (
    <label
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={handlePointerDown}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={handlePointerDown}
      onTouchEnd={() => setIsPressed(false)}
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${effectiveDisabled ? 'cursor-not-allowed opacity-75' : ''} ${className}`}
    >
      <div className="relative flex items-center justify-center transition-transform duration-75">
        <img
          src={imgSrc}
          alt={isChecked ? 'Toggle On' : 'Toggle Off'}
          referrerPolicy="no-referrer"
          className="h-6 sm:h-7 w-auto max-w-none object-contain [image-rendering:pixelated]"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {label && (
        <span className={`font-jura font-semibold text-xs sm:text-sm ${effectiveDisabled ? 'text-[#8c9196]' : 'text-white'}`}>
          {label}
        </span>
      )}
    </label>
  );
};

