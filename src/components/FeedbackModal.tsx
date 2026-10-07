import React, { useState } from 'react';
import { playPopSound } from '../utils/sound';
import { VplayPrimaryButton } from './ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!feedbackText.trim()) {
      setToastMessage('Please enter your feedback before submitting.');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFeedbackText('');
      setToastMessage('Thank you for your feedback on The Craftmine!');
      setTimeout(() => {
        setToastMessage(null);
        onClose();
      }, 1000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 font-minecraft-seven select-none animate-fade-in">
      {/* MINECRAFT BEDROCK MODAL DIALOG (as in IMG_0210) */}
      <div className="mc-dialog-window w-full max-w-md p-3.5 sm:p-4.5 flex flex-col my-auto overflow-hidden">
        
        {/* TITLE AT TOP */}
        <div className="flex items-center justify-between mb-2 sm:mb-2.5">
          <h2 className="text-sm sm:text-base text-[#313131] font-minecraft-seven font-normal">
            Submit Feedback
          </h2>
          <button
            onMouseDown={() => playPopSound()}
            onClick={onClose}
            className="w-6 h-6 mc-button-normal border-2 border-[#141414] text-[#313131] text-xs flex items-center justify-center cursor-pointer btn-press-effect"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* INNER BLACK WELL CONTAINER */}
        <div className="mc-dialog-well p-3.5 sm:p-4 space-y-3 mb-3 sm:mb-3.5">
          <p className="text-xs text-gray-200 leading-relaxed font-noto-sans font-normal">
            We would love to hear what you think of The Craftmine experience and Ore UI. Share your thoughts, report bugs, or request features!
          </p>

          <textarea
            rows={4}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Type your feedback here..."
            className="mc-search-box w-full p-2.5 text-xs font-minecraft-seven resize-none cursor-text placeholder:text-gray-400"
          />

          {toastMessage && (
            <p className="text-[11px] text-yellow-300 font-minecraft-seven">
              {toastMessage}
            </p>
          )}

          <p className="text-[10px] text-gray-400 font-noto-sans">
            Please do not include sensitive personal information.
          </p>
        </div>

        {/* ACTION BUTTONS (Stacked like in IMG_0210) */}
        <div className="flex flex-col gap-2 w-full">
          {isSubmitted ? (
            <VplaySecondaryButton size="normal" fullWidth={true} disabled={true}>
              Sending...
            </VplaySecondaryButton>
          ) : (
            <VplayPrimaryButton size="normal" fullWidth={true} onClick={handleSubmit}>
              Submit Feedback
            </VplayPrimaryButton>
          )}

          <VplaySecondaryButton size="normal" fullWidth={true} onClick={onClose}>
            Cancel
          </VplaySecondaryButton>
        </div>

      </div>
    </div>
  );
};
