import React, { useState } from 'react';
import { playPopSound } from '../utils/sound';
import { VplayHeroButton } from './ui/VplayHeroButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { ArrowLeft, Calendar, AlertTriangle, Play } from 'lucide-react';

export interface ReleaseArticle {
  id: string;
  title: string;
  versionTag: string;
  editionBadge: string;
  date: string;
  thumbnail: string;
  summary: string;
  editionId?: 'lovable' | 'base64' | 'studio';
  features: {
    category: string;
    items: string[];
  }[];
  bugFixes: string[];
  knownIssues: string[];
}

export const ARTICLES_LIST: ReleaseArticle[] = [
  {
    id: 'snapshot-26w04-base',
    title: 'Snapshot 26w04-base',
    versionTag: 'SNAPSHOT 26w04-base',
    editionBadge: 'Exclusive to Base44 Edition',
    date: '10/06/2026',
    thumbnail: 'https://static.wikia.nocookie.net/ep-deo/images/2/28/Update_thumb.png/revision/latest/scale-to-width-down/1000?cb=20261006103204',
    summary: 'The latest experimental snapshot exclusively for Base44 Edition introduces a brand-new set of decorative blocks, an expanded cave system, Desert & Oak Forest biomes, and multiple render transparency fixes.',
    editionId: 'base64',
    features: [
      {
        category: 'NEW ADDITIONS',
        items: [
          'Added brand-new set of decorative blocks',
          'Added Desert biome (hot temperature, still broken)',
          'Added Oak Forest biome (regular temperature, broken)',
          'Player swimming in liquid blocks now slides slowly',
          'New particles when breaking blocks',
        ],
      },
      {
        category: 'THE SIFT',
        items: [
          'Now spawn less trees but more creatures',
          'Willow Leaves transparency are now rendered correctly',
          'Willow Bushes now has a correct X cross texture rendering',
          'Cactus Flowers now spawn in the Sift',
        ],
      },
      {
        category: 'CAVES SYSTEM',
        items: [
          'Expanded caves system',
          'Caves now generated natural lava and waterfalls (which looks broken rn)',
          'Ores are now generated more frequently',
        ],
      },
    ],
    bugFixes: [
      'Leaves transparency are now rendered correctly',
      'Some Mangrove Swamp biome related block textures are now rendered correctly',
      'Creatures can now be killed, again',
      'Cave entrances are now connected perfectly',
    ],
    knownIssues: [
      'Ability to see-through transparency blocks',
      'Top grass block texture overlay does not render correctly',
      'Water texture overlay does not render correctly',
      'Granite/diorite/andesite shows static unknown image instead of textures',
      'Plant blocks spawn underwater',
      'Leaves randomly floating in the air',
      'Wild mushrooms not spawning in caves and Fall Forests',
    ],
  },
];

const SettingsDivider = () => (
  <div className="w-full flex flex-col select-none pointer-events-none">
    <div className="w-full h-[1px] bg-[#18191b]" />
    <div className="w-full h-[1px] bg-[#5e6266]" />
  </div>
);

interface ReleaseNotesViewProps {
  onPlayEdition?: (editionId: string) => void;
  initialArticleId?: string | null;
}

export const ReleaseNotesView: React.FC<ReleaseNotesViewProps> = ({
  onPlayEdition,
  initialArticleId = null,
}) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(initialArticleId);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedArticle = ARTICLES_LIST.find((a) => a.id === selectedArticleId);

  const handleSelectArticle = (id: string) => {
    setSelectedArticleId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedArticleId(null);
  };

  // Filter articles by search query
  const filteredArticles = ARTICLES_LIST.filter((article) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const titleMatch = article.title.toLowerCase().includes(q);
    const versionMatch = article.versionTag.toLowerCase().includes(q);
    const badgeMatch = article.editionBadge.toLowerCase().includes(q);
    const summaryMatch = article.summary.toLowerCase().includes(q);
    const featuresMatch = article.features.some(
      (f) =>
        f.category.toLowerCase().includes(q) ||
        f.items.some((item) => item.toLowerCase().includes(q))
    );
    const fixesMatch = article.bugFixes.some((fix) => fix.toLowerCase().includes(q));
    const issuesMatch = article.knownIssues.some((issue) => issue.toLowerCase().includes(q));

    return (
      titleMatch ||
      versionMatch ||
      badgeMatch ||
      summaryMatch ||
      featuresMatch ||
      fixesMatch ||
      issuesMatch
    );
  });

  return (
    <div className="w-full space-y-4 font-minecraft-seven">
      {/* SEARCH BAR (NO CONTAINER BACKGROUND) */}
      <div className="w-full select-none">
        <div className="relative flex items-center w-full">
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/c/c8/MagnifyingGlass-52f96e5f47f42e682a00.png/revision/latest?cb=20260723030208"
            alt="Search Icon"
            referrerPolicy="no-referrer"
            className="absolute left-3 w-4.5 h-4.5 object-contain pointer-events-none z-10 [image-rendering:pixelated] filter brightness-0 invert opacity-80"
            style={{ imageRendering: 'pixelated' }}
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mc-search-box w-full h-10 pl-10 pr-8 text-xs font-minecraft-seven transition-colors focus:border-white cursor-text"
          />
          {searchQuery && (
            <button
              onMouseDown={() => playPopSound()}
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-gray-300 hover:text-white text-xs px-1 cursor-pointer font-bold z-10"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* FULL ARTICLE DETAIL VIEW */}
      {selectedArticle ? (
        <div className="space-y-4 animate-fade-in">
          {/* TOP BACK BAR */}
          <div className="flex items-center justify-between bg-[#35383b] border-2 border-[#141414] p-3 shadow-md">
            <button
              onMouseDown={() => playPopSound()}
              onClick={handleBackToList}
              className="flex items-center gap-2 bg-[#2a2c2f] hover:bg-[#34373b] active:bg-[#1a1b1d] text-white px-3 py-1.5 border-2 border-[#141414] text-xs font-minecraft-seven cursor-pointer btn-press-effect"
            >
              <ArrowLeft className="w-4 h-4 text-[#89dc69]" />
              <span>BACK TO ALL RELEASE NOTES</span>
            </button>

            {selectedArticle.editionId && onPlayEdition && (
              <button
                onMouseDown={() => playPopSound()}
                onClick={() => onPlayEdition(selectedArticle.editionId!)}
                className="flex items-center gap-1.5 bg-[#418a28] hover:bg-[#52a634] text-white px-3 py-1.5 border-2 border-[#141414] text-xs font-minecraft-ten cursor-pointer shadow-[inset_1px_1px_0_#89dc69]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>PLAY BASE44 EDITION NOW</span>
              </button>
            )}
          </div>

          {/* ARTICLE MAIN CONTAINER */}
          <article className="bg-[#2e3134] border-2 border-[#141414] shadow-2xl p-4 sm:p-6 md:p-8 space-y-6 text-white font-minecraft-seven">
            {/* ARTICLE HEADER */}
            <div className="space-y-3 border-b-2 border-[#3d4145] pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#89dc69] text-[#141414] px-2.5 py-0.5 text-[11px] font-minecraft-ten border border-[#141414] uppercase">
                  {selectedArticle.versionTag}
                </span>
                <span className="bg-[#38bdf8] text-[#141414] px-2.5 py-0.5 text-[11px] font-minecraft-seven border border-[#141414]">
                  {selectedArticle.editionBadge}
                </span>
                <span className="text-gray-400 font-minecraft-seven text-xs flex items-center gap-1 ml-auto">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedArticle.date}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-minecraft-ten text-white uppercase tracking-wide leading-tight">
                {selectedArticle.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 font-medium italic leading-relaxed">
                {selectedArticle.summary}
              </p>
            </div>

            {/* HERO THUMBNAIL BANNER */}
            <div className="w-full aspect-[16/9] sm:aspect-[21/9] max-h-[380px] bg-[#1b1c1e] border-2 border-[#141414] overflow-hidden flex items-center justify-center shadow-inner">
              <img
                src={selectedArticle.thumbnail}
                alt={selectedArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover [image-rendering:pixelated] shadow-md"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            {/* ARTICLE BODY SECTIONS (REDUCED SPACE BETWEEN CATEGORIES) */}
            <div className="space-y-4 pt-1">
              {/* SECTION: FEATURES */}
              <section className="space-y-2">
                <div className="flex items-center gap-2 border-b-2 border-[#418a28] pb-1">
                  <span className="w-3 h-3 bg-[#89dc69] inline-block border border-[#141414]" />
                  <h2 className="text-lg sm:text-xl font-minecraft-ten tracking-wider text-white">
                    FEATURES
                  </h2>
                </div>

                <div className="space-y-2.5 pl-2 sm:pl-3">
                  {selectedArticle.features.map((cat, idx) => (
                    <div key={idx} className="space-y-1.5 bg-[#25272a] p-3 border border-[#141414]">
                      <h3 className="text-xs sm:text-sm text-[#89dc69] font-minecraft-ten uppercase tracking-wider flex items-center gap-1.5">
                        <span>{cat.category}</span>
                      </h3>
                      <ul className="space-y-1 pl-4 sm:pl-6 text-xs sm:text-sm text-gray-200 list-disc marker:text-[#89dc69]">
                        {cat.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION: BUG FIXES */}
              <section className="space-y-2">
                <div className="flex items-center gap-2 border-b-2 border-[#38bdf8] pb-1">
                  <span className="w-3 h-3 bg-[#38bdf8] inline-block border border-[#141414]" />
                  <h2 className="text-lg sm:text-xl font-minecraft-ten tracking-wider text-white">
                    BUG FIXES
                  </h2>
                </div>

                <div className="bg-[#25272a] p-3 border border-[#141414] pl-2 sm:pl-3">
                  <ul className="space-y-1 pl-4 sm:pl-6 text-xs sm:text-sm text-gray-200 list-disc marker:text-[#38bdf8]">
                    {selectedArticle.bugFixes.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* SECTION: KNOWN ISSUES */}
              <section className="space-y-2">
                <div className="flex items-center gap-2 border-b-2 border-[#f59e0b] pb-1">
                  <span className="w-3 h-3 bg-[#f59e0b] inline-block border border-[#141414]" />
                  <h2 className="text-lg sm:text-xl font-minecraft-ten tracking-wider text-white">
                    KNOWN ISSUES
                  </h2>
                </div>

                <div className="bg-[#25272a] p-3 border border-[#141414] pl-2 sm:pl-3">
                  <p className="text-xs text-amber-300 font-minecraft-seven mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reported issues being resolved in upcoming snapshots:</span>
                  </p>
                  <ul className="space-y-1 pl-4 sm:pl-6 text-xs sm:text-sm text-gray-200 list-disc marker:text-[#f59e0b]">
                    {selectedArticle.knownIssues.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>

            {/* BOTTOM ARTICLE ACTIONS */}
            <div className="pt-6 border-t-2 border-[#3d4145] flex flex-wrap items-center justify-between gap-3">
              <button
                onMouseDown={() => playPopSound()}
                onClick={handleBackToList}
                className="mc-button-normal border-2 border-[#141414] px-4 py-2 text-xs font-minecraft-seven cursor-pointer btn-press-effect flex items-center justify-center"
              >
                <span className="-translate-y-[1px]">← Back to list</span>
              </button>

              {selectedArticle.editionId && onPlayEdition && (
                <div className="w-full sm:w-64">
                  <VplayHeroButton
                    fullWidth
                    onClick={() => onPlayEdition(selectedArticle.editionId!)}
                  >
                    <span>Play this snapshot</span>
                  </VplayHeroButton>
                </div>
              )}
            </div>
          </article>
        </div>
      ) : (
        /* ARTICLES LIST VIEW */
        <div className="space-y-4">
          {/* HEADER BANNER */}
          <div className="bg-[#35383b] border-2 border-[#141414] p-4 sm:p-5 shadow-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#89dc69] inline-block border border-[#141414]" />
              <h1 className="text-base sm:text-lg text-white uppercase tracking-wider font-minecraft-ten">
                RELEASE NOTES & CHANGELOGS
              </h1>
            </div>
            <p className="text-xs text-gray-300 font-minecraft-seven">
              Follow all updates, experimental snapshots, new features, and bug fixes for The Craftmine. Click any article to read the full changelog.
            </p>
          </div>

          {/* ARTICLES LIST */}
          {filteredArticles.length === 0 ? (
            <div className="bg-[#292a2c] p-8 text-center border-2 border-[#141414] space-y-3">
              <p className="text-sm text-white font-minecraft-seven">
                We found nothing :(
              </p>
              <p className="text-xs text-gray-300 font-minecraft-seven">
                No results found for {searchQuery ? `"${searchQuery}"` : 'your query'}. Refine your search query.
              </p>
              <div className="w-56 mx-auto pt-2">
                <VplaySecondaryButton
                  onClick={() => {
                    const searchInput = document.querySelector('input[placeholder*="Search for release notes"]') as HTMLInputElement;
                    if (searchInput) {
                      searchInput.focus();
                      searchInput.select();
                    }
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  <img
                    src="https://static.wikia.nocookie.net/ep-deo/images/c/c8/MagnifyingGlass-52f96e5f47f42e682a00.png/revision/latest?cb=20260723030208"
                    alt="Search"
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 object-contain filter brightness-0 inline-block mr-1.5"
                  />
                  <span>Refine search</span>
                </VplaySecondaryButton>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredArticles.map((article) => {
                const isLatest = article.id === 'snapshot-26w04-base';
                return (
                  <div
                    key={article.id}
                    onMouseDown={() => playPopSound()}
                    onClick={() => handleSelectArticle(article.id)}
                    className={`
                      group relative bg-[#313437] hover:bg-[#393d41] border-2 cursor-pointer transition-all duration-150 p-4 sm:p-5 shadow-lg select-none btn-press-effect overflow-hidden
                      ${isLatest ? 'border-[#89dc69]' : 'border-[#141414] hover:border-[#89dc69]'}
                    `}
                  >
                    {/* 3D bevel overlay */}
                    <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_2px_2px_0_rgba(255,255,255,0.15),inset_-2px_-3px_0_rgba(0,0,0,0.5)]" />

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 relative z-10">
                      {/* Thumbnail Image */}
                      <div className="w-full md:w-56 h-36 bg-[#1b1c1e] border-2 border-[#141414] flex-shrink-0 flex items-center justify-center overflow-hidden relative shadow-inner">
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover [image-rendering:pixelated] group-hover:scale-105 transition-transform duration-200"
                          style={{ imageRendering: 'pixelated' }}
                        />
                        {isLatest && (
                          <div className="absolute top-1 left-1 bg-[#89dc69] text-[#141414] text-[9px] font-minecraft-ten px-1.5 py-0.5 border border-[#141414]">
                            LATEST
                          </div>
                        )}
                      </div>

                      {/* Content Details */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-[#141414] text-[#89dc69] px-2 py-0.5 text-[10px] font-minecraft-ten border border-[#383a3d] uppercase">
                            {article.versionTag}
                          </span>
                          <span className="bg-[#141414] text-sky-300 px-2 py-0.5 text-[10px] font-minecraft-seven border border-[#383a3d]">
                            {article.editionBadge}
                          </span>
                          <span className="text-gray-400 font-minecraft-seven text-[11px] ml-auto">
                            {article.date}
                          </span>
                        </div>

                        <h2 className="text-base sm:text-lg md:text-xl text-white group-hover:text-[#89dc69] font-minecraft-ten tracking-wide">
                          {article.title}
                        </h2>

                        <p className="text-xs text-gray-300 font-minecraft-seven leading-relaxed line-clamp-2">
                          {article.summary}
                        </p>

                        <div className="pt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-minecraft-seven">
                            <span>{article.features.reduce((acc, f) => acc + f.items.length, 0)} Features</span>
                            <span>•</span>
                            <span>{article.bugFixes.length} Fixes</span>
                            <span>•</span>
                            <span>{article.knownIssues.length} Issues</span>
                          </div>

                          <span className="text-xs text-[#89dc69] font-minecraft-seven group-hover:underline flex items-center gap-1">
                            <span>READ FULL ARTICLE</span>
                            <span>→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
