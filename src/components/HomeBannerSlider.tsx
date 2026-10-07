import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VplayHeroButton } from './ui/VplayHeroButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { playPopSound } from '../utils/sound';

interface HomeBannerSliderProps {
  onExploreDesignSystem: () => void;
  onPlayCraftmine: () => void;
  onOpenFeedback?: () => void;
  reduceMotion?: boolean;
}

export const HomeBannerSlider: React.FC<HomeBannerSliderProps> = ({
  onPlayCraftmine,
  onOpenFeedback,
  reduceMotion = false,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === 1 ? 0 : prev + 1));
  };

  const slideMotionProps = reduceMotion
    ? {
        initial: { opacity: 1, x: 0 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 1, x: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
        transition: { duration: 0.35, ease: 'easeInOut' },
      };

  return (
    <div className="relative w-full bg-[#35383b] border-2 border-[#141414] p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl select-none min-h-[360px] font-minecraft-seven">
      {/* 3D BEVEL INSET SHADOW */}
      <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_2px_2px_0_rgba(255,255,255,0.2),inset_-2px_-4px_0_rgba(0,0,0,0.5)]" />

      {/* SLIDE CONTENT AREA WITH ANIMATION */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-between py-1 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          {currentSlide === 0 ? (
            <motion.div
              key="slide-0"
              {...slideMotionProps}
              className="space-y-4 w-full"
            >
              {/* TITLE & SUBTITLE WITH IMAGE BELOW SUBTITLE */}
              <div className="space-y-2 text-left max-w-3xl mx-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-wide font-minecraft-ten text-center sm:text-left drop-shadow-md">
                  Unlock possibilities without edges
                </h1>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed text-center sm:text-left drop-shadow font-minecraft-seven">
                  The Craftmine is coming soon. Stay tuned!
                </p>
                <div className="pt-2 flex justify-center">
                  <img
                    src="https://static.wikia.nocookie.net/ep-deo/images/b/b4/New_ui_introduction-f34cf248120a1da988fc.png/revision/latest?cb=20260801154934"
                    alt="The Craftmine Ore UI"
                    referrerPolicy="no-referrer"
                    className="w-full max-w-2xl md:max-w-3xl h-auto object-contain shadow-lg [image-rendering:pixelated] [image-rendering:-webkit-optimize-contrast]"
                  />
                </div>
              </div>

              {/* ACTION BUTTONS WITH LEFT AND RIGHT ARROWS AT BOTH ENDS */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
                {/* Left Arrow Button */}
                <VplaySecondaryButton
                  fullWidth={false}
                  size="compact"
                  onClick={handlePrev}
                  aria-label="Previous Banner"
                  title="Previous banner"
                  className="!w-11 !h-11 !px-0 flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5 text-[#1c1d1f]" />
                </VplaySecondaryButton>

                <div className="w-48 sm:w-56">
                  <VplayHeroButton fullWidth onClick={onPlayCraftmine}>
                    Play Craftmine
                  </VplayHeroButton>
                </div>
                <div className="w-48 sm:w-56">
                  <VplaySecondaryButton
                    fullWidth
                    onClick={() => {
                      if (onOpenFeedback) onOpenFeedback();
                    }}
                  >
                    <span>Give Feedback</span>
                  </VplaySecondaryButton>
                </div>

                {/* Right Arrow Button */}
                <VplaySecondaryButton
                  fullWidth={false}
                  size="compact"
                  onClick={handleNext}
                  aria-label="Next Banner"
                  title="Next banner"
                  className="!w-11 !h-11 !px-0 flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5 text-[#1c1d1f]" />
                </VplaySecondaryButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="slide-1"
              {...slideMotionProps}
              className="space-y-4 w-full"
            >
              {/* TITLE & SUBTITLE WITH IMAGE */}
              <div className="space-y-2 text-left max-w-3xl mx-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-wide font-minecraft-ten text-center sm:text-left drop-shadow-md">
                  PLAY 3 CRAFTMINE EDITIONS
                </h1>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed text-center sm:text-left drop-shadow font-minecraft-seven">
                  Experience 3 editions powered by 3 distinct engines: Lovable Edition (WebGL 3D), Base 64 Edition (High-Speed Sandbox), and Studio Edition (Full Voxel Suite).
                </p>
                <div className="pt-2 flex justify-center">
                  <div className="w-full max-w-2xl md:max-w-3xl bg-[#1c1e20] border-2 border-[#141414] p-4 text-center shadow-lg relative overflow-hidden">
                    <img
                      src="https://static.wikia.nocookie.net/ep-deo/images/7/7a/Craftmine.png/revision/latest/scale-to-width-down/1000?cb=20261004160440"
                      alt="The Craftmine"
                      referrerPolicy="no-referrer"
                      className="mx-auto h-16 sm:h-24 object-contain [image-rendering:pixelated] drop-shadow-lg"
                    />
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-[#89dc69] font-minecraft-seven">
                      <span>• LOVABLE EDITION</span>
                      <span>• BASE 64 EDITION</span>
                      <span>• STUDIO EDITION</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS WITH LEFT AND RIGHT ARROWS AT BOTH ENDS */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
                {/* Left Arrow Button */}
                <VplaySecondaryButton
                  fullWidth={false}
                  size="compact"
                  onClick={handlePrev}
                  aria-label="Previous Banner"
                  title="Previous banner"
                  className="!w-11 !h-11 !px-0 flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5 text-[#1c1d1f]" />
                </VplaySecondaryButton>

                <div className="w-48 sm:w-56">
                  <VplayHeroButton fullWidth onClick={onPlayCraftmine}>
                    Play Craftmine Now
                  </VplayHeroButton>
                </div>
                <div className="w-48 sm:w-56">
                  <VplaySecondaryButton
                    fullWidth
                    onClick={() => {
                      if (onOpenFeedback) onOpenFeedback();
                    }}
                  >
                    <span>Give Feedback</span>
                  </VplaySecondaryButton>
                </div>

                {/* Right Arrow Button */}
                <VplaySecondaryButton
                  fullWidth={false}
                  size="compact"
                  onClick={handleNext}
                  aria-label="Next Banner"
                  title="Next banner"
                  className="!w-11 !h-11 !px-0 flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5 text-[#1c1d1f]" />
                </VplaySecondaryButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM DOT INDICATORS */}
      <div className="relative z-10 flex items-center justify-center gap-2 pt-4">
        {[0, 1].map((index) => (
          <button
            key={index}
            onMouseDown={() => playPopSound()}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 border border-[#141414] transition-all duration-150 cursor-pointer ${
              currentSlide === index
                ? 'bg-[#89dc69] shadow-[inset_1px_1px_0_#ffffff]'
                : 'bg-[#202224] hover:bg-[#2b2d30]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
