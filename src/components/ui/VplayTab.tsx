import React, { useState, useRef, useEffect } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

interface VplayTabProps {
  children?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  forcedState?: ComponentState;
  forcedActive?: boolean;
  disabled?: boolean;
  className?: string;
}

const TabScrollText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        setIsOverflowing(textRef.current.scrollWidth > containerRef.current.clientWidth + 2);
      }
    };
    checkOverflow();
    const timeout = setTimeout(checkOverflow, 100);
    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [children]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-full overflow-hidden relative flex items-center justify-center select-none"
    >
      <div
        ref={textRef}
        className={`whitespace-nowrap ${
          isOverflowing
            ? 'animate-tab-marquee inline-block will-change-transform'
            : 'inline-flex items-center justify-center'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export const VplayTab: React.FC<VplayTabProps> = ({
  children = 'First tab',
  active = false,
  onClick,
  forcedState,
  forcedActive,
  disabled,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [animKey, setAnimKey] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const isActive = forcedActive !== undefined ? forcedActive : active;
  const effectiveDisabled = forcedState ? forcedState === 'disabled' : disabled;

  // Trigger white border animation 1 lap
  const triggerBorderAnim = () => {
    setAnimKey((prev) => prev + 1);
    setIsAnimating(true);
  };

  const prevActiveRef = useRef(isActive);
  useEffect(() => {
    if (isActive && !prevActiveRef.current) {
      triggerBorderAnim();
    }
    prevActiveRef.current = isActive;
  }, [isActive]);

  const state: ComponentState = forcedState || (
    effectiveDisabled ? 'disabled' : (
      isPressed ? 'pressed' : (
        isHovered ? 'hovered' : 'normal'
      )
    )
  );

  let stateClass = isActive ? 'mc-button-hover text-white' : 'mc-button-normal';
  let transformClass = '';

  switch (state) {
    case 'hovered':
      stateClass = 'mc-button-hover text-white';
      break;
    case 'pressed':
      stateClass = 'mc-button-pressed text-white';
      transformClass = 'translate-y-[1px] transition-none';
      break;
    case 'disabled':
      stateClass = 'mc-button-disabled';
      break;
    case 'normal':
    default:
      stateClass = isActive ? 'mc-button-hover text-white' : 'mc-button-normal';
      break;
  }

  const handleClick = () => {
    if (effectiveDisabled) return;
    triggerBorderAnim();
    onClick?.();
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

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => { if (!effectiveDisabled) { setIsPressed(true); playPopSound(); } }}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => setIsPressed(false)}
      className={`
        relative px-2 sm:px-3 py-2 min-w-[75px] sm:min-w-[110px] max-w-full flex items-center justify-center text-center font-minecraft-seven text-xs sm:text-sm select-none
        border-2 ${isActive || isHovered ? 'border-white z-20 outline outline-2 outline-white -outline-offset-2' : 'border-[#141414]'} rounded-none cursor-default btn-press-effect overflow-hidden
        ${stateClass} ${transformClass} ${className}
      `}
    >
      {/* Content */}
      <div className="relative w-full max-w-full overflow-hidden flex items-center justify-center z-10">
        <TabScrollText>
          {children}
        </TabScrollText>
      </div>
    </div>
  );
};
