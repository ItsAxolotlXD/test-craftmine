import React, { useState, useEffect } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

interface VplaySliderProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (val: number) => void;
  forcedState?: ComponentState;
  disabled?: boolean;
  noBackground?: boolean;
  className?: string;
}

export const VplaySlider: React.FC<VplaySliderProps> = ({
  label,
  min = 0,
  max = 10,
  step = 1,
  value = 3,
  onChange,
  forcedState,
  disabled,
  noBackground = false,
  className = '',
}) => {
  const displayLabel = label !== undefined ? label : 'States demonstration';
  const [val, setVal] = useState(value);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    setVal(value);
  }, [value]);

  const effectiveDisabled = forcedState ? forcedState === 'disabled' : disabled;
  const state: ComponentState = forcedState || (
    effectiveDisabled ? 'disabled' :
    isPressed ? 'pressed' :
    isHovered ? 'hovered' : 'normal'
  );

  const currentValue = forcedState !== undefined ? value : val;
  const ratio = Math.max(0, Math.min(1, (max > min ? (currentValue - min) / (max - min) : 0)));
  const totalSegments = 10;
  const activeSegmentsCount = Math.round(ratio * totalSegments);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (effectiveDisabled) return;
    const newVal = Number(e.target.value);
    setVal(newVal);
    onChange?.(newVal);
  };

  const handlePointerDown = () => {
    if (effectiveDisabled) return;
    setIsPressed(true);
    playPopSound();
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  let activeSegmentBg = 'bg-[#418a28] shadow-[inset_0_1px_0_#6bc34b]';
  let layer3Bg = 'bg-[#ffffff]';
  let layer2Bg = 'bg-[#8d9195]';
  let layer1Bg = 'bg-[#e2e5e8]';

  switch (state) {
    case 'hovered':
      activeSegmentBg = 'bg-[#51a233] shadow-[inset_0_1px_0_#89dc69]';
      layer3Bg = 'bg-[#ffffff]';
      layer2Bg = 'bg-[#9ea2a6]';
      layer1Bg = 'bg-[#ffffff]';
      break;
    case 'pressed':
      activeSegmentBg = 'bg-[#2b611a] shadow-[inset_0_1px_0_#3d8225]';
      layer3Bg = 'bg-[#828588]';
      layer2Bg = 'bg-[#484b4e]';
      layer1Bg = 'bg-[#6e7174]';
      break;
    case 'disabled':
      activeSegmentBg = 'bg-[#6b6e73] shadow-none';
      layer3Bg = 'bg-[#9ea1a4]';
      layer2Bg = 'bg-[#5d6063]';
      layer1Bg = 'bg-[#838688]';
      break;
    case 'normal':
    default:
      break;
  }

  return (
    <div
      className={`w-full rounded-none ${
        noBackground ? '' : 'bg-[#36383b] p-2.5 sm:p-3 border border-[#232527]'
      } ${className}`}
    >
      {displayLabel !== '' && (
        <div className="flex items-center justify-between font-montserrat text-xs font-semibold mb-2 select-none">
          <span className={state === 'disabled' ? 'text-[#8c9196]' : 'text-white'}>
            {displayLabel}
          </span>
          <span className={state === 'disabled' ? 'text-[#8c9196]' : 'text-[#89dc69]'}>
            {currentValue}
          </span>
        </div>
      )}

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        className="relative flex items-center h-8 select-none outline-none cursor-pointer px-1"
      >
        {/* Invisible Native Range Input for Smooth Dragging */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          disabled={effectiveDisabled}
          onChange={handleInputChange}
          onInput={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer disabled:cursor-not-allowed"
        />

        {/* Track with Continuous Green Fill Bar */}
        <div className="relative w-full h-3 border-2 border-[#141414] bg-[#2a2c2e] p-[1px] overflow-hidden">
          <div
            className={`h-full transition-all duration-75 ${activeSegmentBg}`}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>

        {/* Square Knob with Secondary Button Bevel Texture */}
        <div
          style={{
            left: `calc(${ratio * 100}% - 16px)`,
          }}
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-75 pointer-events-none z-10"
        >
          <div className="w-8 h-8 border-2 border-[#141414] bg-[#141414] relative overflow-hidden select-none">
            <div className={`relative w-full h-full flex flex-col ${layer3Bg}`}>
              <div className={`absolute inset-x-0 bottom-0 h-[3px] ${layer2Bg} ${state === 'pressed' ? 'hidden' : 'block'}`} />
              <div className={`relative z-10 w-full h-full ${state === 'pressed' ? 'm-[1px]' : 'm-[1px] mb-[3px]'} ${layer1Bg}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
