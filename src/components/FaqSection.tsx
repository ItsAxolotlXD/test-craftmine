import React, { useState } from 'react';
import { playPopSound } from '../utils/sound';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
  actionText?: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    id: 1,
    question: 'What type of game is Craftmine?',
    answer: 'Craftmine is a sandbox video game takes inspiration from MInecraft that combines elements of survival, exploration, building, and adventure. Players can explore a blocky, open world, collect resources, craft tools and items, build structures, and fight monsters. The game gives players a lot of freedom because there is no single way to play the game. It also has different modes, such as Survival, where players must manage health and resources, and Creative, where they can build freely with unlimited materials.',
    category: 'GAMEPLAY',
  },
  {
    id: 2,
    question: 'Is Craftmine free?',
    answer: 'Absolutely! Both all three versions of Craftmine can be played on your browser for free. Go to the "Play Craftmine" tab to start playing.',
    category: 'PRICING',
    actionText: 'Go to Play Craftmine tab',
  },
  {
    id: 3,
    question: 'On which devices can I play Craftmine?',
    answer: 'You can play Craftmine on  Windows, iOS, Android, PlayStation, Xbox, Nitendo Switch... literally everywhere if that device support websites.',
    category: 'COMPATIBILITY',
  },
  {
    id: 4,
    question: "What's the goal of Craftmine?",
    answer: "Since Craftmine is a sandbox game, there isn't one specific goal of the game, but that's what makes it exciting! In Craftmine, you can build, explore, or focus on an adventure waiting ahead.",
    category: 'OBJECTIVES',
  },
  {
    id: 5,
    question: 'Copyright of Craftmine',
    answer: 'Craftmine is a sandbox game takes inspiration all from Minecraft (developed by Mojang Studios) so most of the features, ideas or block/item textures used in this game are belong to Mojang Studios and the Minecraft community. We do not own any of these.',
    category: 'LEGAL & CREDITS',
  },
];

interface FaqSectionProps {
  onGoToPlayCraftmine?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onGoToPlayCraftmine }) => {
  const [openIds, setOpenIds] = useState<number[]>([1, 2, 3, 4, 5]);

  const toggleFaq = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-[#35383b] border-2 border-[#141414] p-4 sm:p-5 shadow-xl space-y-4 font-minecraft-seven">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between border-b border-[#2d3033] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#89dc69] rounded-none animate-pulse" />
          <h2 className="text-sm sm:text-base text-white uppercase tracking-wider font-minecraft-ten flex items-center gap-2">
            <span>FREQUENTLY ASKED QUESTIONS (FAQ)</span>
          </h2>
        </div>
        <span className="text-xs text-[#89dc69] font-minecraft-seven">
          [5 common questions]
        </span>
      </div>

      {/* FAQ ITEMS LIST */}
      <div className="space-y-2.5">
        {FAQ_LIST.map((faq) => {
          const isOpen = openIds.includes(faq.id);
          return (
            <div
              key={faq.id}
              className="bg-[#2b2d30] border-2 border-[#141414] shadow-md overflow-hidden transition-all duration-150"
            >
              {/* ACCORDION HEADER BUTTON (Sound plays on press down) */}
              <button
                onMouseDown={() => playPopSound()}
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-3 sm:p-3.5 flex items-center justify-between gap-3 text-left hover:bg-[#34373b] active:bg-[#252729] cursor-pointer select-none btn-press-effect"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                  <span className="bg-[#141414] text-[#89dc69] font-minecraft-ten text-[10px] px-2 py-1 border border-[#383a3d] self-start sm:self-auto flex-shrink-0">
                    Q{faq.id}
                  </span>
                  <h3 className="text-xs sm:text-sm text-white font-minecraft-ten tracking-tight truncate sm:whitespace-normal">
                    {faq.question}
                  </h3>
                </div>

                <div className="p-1 text-gray-400 hover:text-white flex-shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* ACCORDION CONTENT */}
              {isOpen && (
                <div className="px-3 sm:px-4 pb-3.5 pt-1 border-t border-[#383b3e] bg-[#222426]/90 space-y-3 font-minecraft-seven">
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
                    {faq.answer}
                  </p>

                  {/* Quick Action Button for Question 2 */}
                  {faq.id === 2 && onGoToPlayCraftmine && (
                    <div className="pt-1">
                      <button
                        onMouseDown={() => playPopSound()}
                        onClick={onGoToPlayCraftmine}
                        className="inline-flex items-center gap-2 mc-button-normal border-2 border-[#141414] text-xs font-minecraft-seven px-3 py-1.5 cursor-pointer btn-press-effect"
                      >
                        <span className="-translate-y-[0.5px]">▶ Play Craftmine right now</span>
                      </button>
                    </div>
                  )}

                  {/* Copyright Notice tag for Question 5 */}
                  {faq.id === 5 && (
                    <div className="text-[11px] text-gray-400 font-minecraft-seven bg-[#18191b] p-2 border border-[#383a3d]">
                      Minecraft is a trademark of Mojang Synergies AB. The Craftmine is an unofficial community fan project and is not affiliated with or endorsed by Mojang or Microsoft.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
