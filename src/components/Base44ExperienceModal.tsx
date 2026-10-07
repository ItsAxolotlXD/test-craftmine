import React from 'react';
import { playPopSound } from '../utils/sound';
import { VplayPrimaryButton } from './ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { ExternalLink } from 'lucide-react';

interface Base44ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Base44ExperienceModal: React.FC<Base44ExperienceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleJoinExperience = () => {
    playPopSound();
    window.open('https://craftmine-preview.base44.app/', '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleClose = () => {
    playPopSound();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 font-minecraft-seven select-none animate-fade-in">
      {/* MINECRAFT BEDROCK MODAL DIALOG (as in IMG_0210) */}
      <div className="mc-dialog-window w-full max-w-md p-3.5 sm:p-4.5 flex flex-col my-auto overflow-hidden">
        
        {/* TITLE AT TOP */}
        <div className="flex items-center justify-between mb-2 sm:mb-2.5">
          <h2 className="text-sm sm:text-base text-[#313131] font-minecraft-seven font-normal">
            External Experience
          </h2>
          <button
            type="button"
            onMouseDown={() => playPopSound()}
            onClick={handleClose}
            className="w-5 h-5 mc-button-normal border-2 border-[#141414] text-[#313131] text-xs flex items-center justify-center cursor-default btn-press-effect"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* INNER BLACK WELL CONTAINER */}
        <div className="mc-dialog-well p-3.5 sm:p-4 space-y-2.5 mb-3 sm:mb-3.5">
          <p className="text-xs text-gray-200 leading-relaxed font-noto-sans font-normal">
            The Base44 Edition of Craftmine cannot be played directly inside web embedded frames due to browser security restrictions. You can play this edition at its standalone address.
          </p>
          <p className="text-xs text-white font-noto-sans pt-1">
            Do you want to launch Craftmine: Base44 Edition now?
          </p>
        </div>

        {/* ACTION BUTTONS (Stacked like in IMG_0210) */}
        <div className="flex flex-col gap-2 w-full">
          <VplayPrimaryButton
            size="normal"
            fullWidth={true}
            onClick={handleJoinExperience}
          >
            <span className="inline-flex items-center gap-1.5">
              <span>Join Experience</span>
              <ExternalLink className="w-3.5 h-3.5 inline-block" />
            </span>
          </VplayPrimaryButton>

          <VplaySecondaryButton
            size="normal"
            fullWidth={true}
            onClick={handleClose}
          >
            Exit
          </VplaySecondaryButton>
        </div>

      </div>
    </div>
  );
};
