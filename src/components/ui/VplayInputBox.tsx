import React, { useState } from 'react';
import { ComponentState } from '../../types';

interface VplayInputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  forcedState?: ComponentState;
  disabled?: boolean;
  className?: string;
}

export const VplayInputBox: React.FC<VplayInputBoxProps> = ({
  label = 'Label',
  description = 'Description',
  forcedState,
  disabled,
  value,
  onChange,
  placeholder = '',
  className = '',
  ...props
}) => {
  const [internalVal, setInternalVal] = useState(value || '');
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const effectiveDisabled = forcedState ? forcedState === 'disabled' : disabled;
  const state: ComponentState = forcedState || (
    effectiveDisabled ? 'disabled' :
    isPressed ? 'pressed' :
    isHovered ? 'hovered' : 'normal'
  );

  let stateClass = 'mc-search-box';

  switch (state) {
    case 'hovered':
      stateClass = 'mc-search-box';
      break;
    case 'pressed':
      stateClass = 'mc-search-box';
      break;
    case 'disabled':
      stateClass = 'mc-button-disabled';
      break;
    case 'normal':
    default:
      stateClass = 'mc-search-box';
      break;
  }

  return (
    <div className={`w-full max-w-lg bg-[#36383b] p-3 border border-[#232527] rounded-none ${className}`}>
      {label && (
        <label className={`block font-minecraft-seven text-xs mb-1.5 select-none ${state === 'disabled' ? 'text-[#8c9196]' : 'text-white'}`}>
          {label}
        </label>
      )}

      <input
        disabled={effectiveDisabled}
        value={value !== undefined ? value : internalVal}
        onChange={(e) => {
          setInternalVal(e.target.value);
          onChange?.(e);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        placeholder={placeholder}
        className={`
          w-full h-9 px-3 font-minecraft-seven text-xs sm:text-sm outline-none rounded-none transition-colors duration-75 cursor-text
          focus:outline-none focus:border-white
          ${stateClass}
        `}
        {...props}
      />

      {description && (
        <p className={`font-minecraft-seven text-[11px] mt-1.5 select-none ${state === 'disabled' ? 'text-[#8c9196]' : 'text-[#a0a5aa]'}`}>
          {description}
        </p>
      )}
    </div>
  );
};
