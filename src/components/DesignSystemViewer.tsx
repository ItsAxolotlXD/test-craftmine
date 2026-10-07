import React, { useState } from 'react';
import { ComponentState } from '../types';
import { ExternalLink } from 'lucide-react';
import { playPopSound } from '../utils/sound';
import { VplayHeroButton } from './ui/VplayHeroButton';
import { VplayPrimaryButton } from './ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { VplaySecondaryButtonDark } from './ui/VplaySecondaryButtonDark';
import { VplayCheckbox } from './ui/VplayCheckbox';
import { VplayDropdown } from './ui/VplayDropdown';
import { VplaySlider } from './ui/VplaySlider';
import { VplayInputBox } from './ui/VplayInputBox';
import { VplayToggleSwitch } from './ui/VplayToggleSwitch';
import { VplayTab } from './ui/VplayTab';

const STATES: ComponentState[] = ['normal', 'hovered', 'pressed', 'disabled'];

interface DesignSystemViewerProps {
  onOpenFeedback?: () => void;
}

export const DesignSystemViewer: React.FC<DesignSystemViewerProps> = ({ onOpenFeedback }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'playground'>('matrix');

  // Interactive playground states
  const [pgCheck, setPgCheck] = useState(true);
  const [pgDropdown, setPgDropdown] = useState('vtv1');
  const [pgSlider, setPgSlider] = useState(5);
  const [pgInput, setPgInput] = useState('Vplay TV Streaming');
  const [pgSwitch, setPgSwitch] = useState(true);
  const [pgSelectedTab, setPgSelectedTab] = useState(0);

  return (
    <div className="w-full text-white font-montserrat">
      {/* Welcome to design preview banner */}
      <div className="p-4 sm:p-5 mb-6 bg-[#292a2c] border-2 border-[#141414] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-sm sm:text-base text-white uppercase tracking-wider mb-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#55b331] inline-block border border-[#141414]" />
            Unlock possibilities without edges
          </h2>
          <p className="text-xs text-gray-300 max-w-2xl font-normal leading-relaxed">
            The Craftmine is coming soon. Stay tuned!
          </p>
        </div>
        <button
          onClick={() => {
            playPopSound();
            if (onOpenFeedback) onOpenFeedback();
          }}
          className="flex items-center gap-2 bg-[#dcdfe2] hover:bg-white text-[#141414] font-extrabold text-xs sm:text-sm px-4 py-2 border-2 border-[#141414] cursor-pointer active:translate-y-[1px] btn-press-effect flex-shrink-0 shadow-[inset_0_1px_0_#ffffff]"
        >
          <ExternalLink className="w-4 h-4" />
          Give feedback
        </button>
      </div>

      {/* Header bar */}
      <div className="bg-[#1e2022] border-2 border-[#141414] p-4 sm:p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#418a28] animate-pulse border border-[#141414]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#51a233] tracking-tight">
              THE CRAFTMINE ORE UI
            </h1>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mt-2 font-montserrat">
            Pixel-perfect Minecraft Component Library & State Matrix (Normal, Hovered, Pressed, Disabled)
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-2 bg-[#2a2c2f] p-1.5 border border-[#141414]">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 text-xs font-montserrat font-bold transition-colors cursor-pointer ${
              activeTab === 'matrix' ? 'bg-[#418a28] text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            Design Matrix (Reference)
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-4 py-2 text-xs font-montserrat font-bold transition-colors cursor-pointer ${
              activeTab === 'playground' ? 'bg-[#418a28] text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            Interactive Playground
          </button>
        </div>
      </div>

      {activeTab === 'matrix' ? (
        <div className="space-y-12">
          {/* SECTION 1: HERO BUTTON */}
          <section className="bg-[#292a2c] p-6 border-2 border-[#141414] rounded-none">
            <h2 className="text-base sm:text-lg font-bold text-gray-200 mb-6 flex items-center gap-2 border-b border-[#3e4145] pb-2">
              <span className="text-xs text-gray-400">01.</span> Hero Button (Play Button Style)
            </h2>
            <div className="space-y-4 max-w-3xl">
              {STATES.map((st) => (
                <div key={st} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <span className="text-sm text-gray-300 capitalize font-minecraft-seven">{st}</span>
                  <div className="sm:col-span-3">
                    <VplayHeroButton forcedState={st}>Play</VplayHeroButton>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 2: PRIMARY BUTTON */}
          <section className="bg-[#292a2c] p-6 border-2 border-[#141414] rounded-none">
            <h2 className="text-base sm:text-lg font-bold text-gray-200 mb-6 flex items-center gap-2 border-b border-[#3e4145] pb-2">
              <span className="text-xs text-gray-400">02.</span> Primary Button (Achievements Button Style)
            </h2>
            <div className="space-y-4 max-w-3xl">
              {STATES.map((st) => (
                <div key={st} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <span className="text-sm text-gray-300 capitalize font-minecraft-seven">{st}</span>
                  <div className="sm:col-span-3">
                    <VplayPrimaryButton forcedState={st}>Achievements</VplayPrimaryButton>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3: SECONDARY BUTTON */}
          <section className="bg-[#292a2c] p-6 border-2 border-[#141414] rounded-none">
            <h2 className="text-base sm:text-lg font-bold text-gray-200 mb-6 flex items-center gap-2 border-b border-[#3e4145] pb-2">
              <span className="text-xs text-gray-400">03.</span> Secondary Button
            </h2>
            <div className="space-y-4 max-w-3xl">
              {STATES.map((st) => (
                <div key={st} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <span className="text-sm text-gray-300 capitalize font-minecraft-seven">{st}</span>
                  <div className="sm:col-span-3">
                    <VplaySecondaryButton forcedState={st}>Options</VplaySecondaryButton>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3B: SECONDARY BUTTON DARK */}
          <section className="bg-[#292a2c] p-6 border-2 border-[#141414] rounded-none">
            <h2 className="text-base sm:text-lg font-bold text-gray-200 mb-6 flex items-center gap-2 border-b border-[#3e4145] pb-2">
              <span className="text-xs text-gray-400">03B.</span> Secondary Button Dark
            </h2>
            <div className="space-y-4 max-w-3xl">
              {STATES.map((st) => (
                <div key={st} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <span className="text-sm text-gray-300 capitalize font-minecraft-seven">{st}</span>
                  <div className="sm:col-span-3">
                    <VplaySecondaryButtonDark forcedState={st}>Secondary button dark</VplaySecondaryButtonDark>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: CHECKBOX */}
          <section className="bg-[#292a2c] p-6 border-2 border-[#141414] rounded-none">
            <h2 className="text-base sm:text-lg font-bold text-[#89dc69] mb-6 flex items-center gap-2 border-b border-[#3e4145] pb-2">
              <span className="text-xs text-gray-400">04.</span> Checkbox (On & Off rows)
            </h2>
            <div className="overflow-x-auto pb-2">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-gray-400 text-xs border-b border-[#3e4145]">
                    <th className="py-2 px-4 w-24">State</th>
                    {STATES.map((st) => (
                      <th key={st} className="py-2 px-4 capitalize">{st}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333538]">
                  <tr>
                    <td className="py-4 px-4 font-bold text-[#89dc69]">On</td>
                    {STATES.map((st) => (
                      <td key={st} className="py-4 px-4">
                        <VplayCheckbox forcedChecked={true} forcedState={st} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-bold text-gray-300">Off</td>
                    {STATES.map((st) => (
                      <td key={st} className="py-4 px-4">
                        <VplayCheckbox forcedChecked={false} forcedState={st} />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 5: DROPDOWN BUTTON */}
          <section className="bg-[#292a2c] p-6 border-2 border-[#141414] rounded-none">
            <h2 className="text-base sm:text-lg font-bold text-gray-200 mb-6 flex items-center gap-2 border-b border-[#3e4145] pb-2">
              <span className="text-xs text-gray-400">05.</span> Dropdown button
            </h2>
            <div className="space-y-6 max-w-3xl">
              {STATES.map((st) => (
                <div key={st} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <span className="text-sm text-gray-300 capitalize font-montserrat font-semibold">{st}</span>
                  <div className="sm:col-span-3">
                    <VplayDropdown label="Label" value="one" forcedState={st} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 6: SLIDER */}
          <section className="bg-[#292a2c] p-6 border-2 border-[#141414] rounded-none">
            <h2 className="text-base sm:text-lg font-bold text-[#89dc69] mb-6 flex items-center gap-2 border-b border-[#3e4145] pb-2">
              <span className="text-xs text-gray-400">06.</span> Slider
            </h2>
            <div className="space-y-6 max-w-3xl">
              {STATES.map((st) => (
                <div key={st} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <span className="text-sm text-gray-300 capitalize font-montserrat font-semibold">{st}</span>
                  <div className="sm:col-span-3">
                    <VplaySlider label="States demonstration" value={3} forcedState={st} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 7: INPUT BOX */}
          <section className="bg-[#292a2c] p-6 border-2 border-[#141414] rounded-none">
            <h2 className="text-base sm:text-lg font-bold text-gray-200 mb-6 flex items-center gap-2 border-b border-[#3e4145] pb-2">
              <span className="text-xs text-gray-400">07.</span> Input box
            </h2>
            <div className="space-y-6 max-w-3xl">
              {STATES.map((st) => (
                <div key={st} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <span className="text-sm text-gray-300 capitalize font-montserrat font-semibold">{st}</span>
                  <div className="sm:col-span-3">
                    <VplayInputBox label="Label" description="Description" forcedState={st} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 8: TOGGLE SWITCH */}
          <section className="bg-[#292a2c] p-6 border-2 border-[#141414] rounded-none">
            <h2 className="text-base sm:text-lg font-bold text-[#89dc69] mb-6 flex items-center gap-2 border-b border-[#3e4145] pb-2">
              <span className="text-xs text-gray-400">08.</span> Toggle switch (On & Off rows)
            </h2>
            <div className="overflow-x-auto pb-2">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-gray-400 text-xs border-b border-[#3e4145]">
                    <th className="py-2 px-4 w-24">State</th>
                    {STATES.map((st) => (
                      <th key={st} className="py-2 px-4 capitalize">{st}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333538]">
                  <tr>
                    <td className="py-4 px-4 font-bold text-[#89dc69]">On</td>
                    {STATES.map((st) => (
                      <td key={st} className="py-4 px-4">
                        <VplayToggleSwitch forcedChecked={true} forcedState={st} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-bold text-gray-300">Off</td>
                    {STATES.map((st) => (
                      <td key={st} className="py-4 px-4">
                        <VplayToggleSwitch forcedChecked={false} forcedState={st} />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 9: TAB */}
          <section className="bg-[#292a2c] p-6 border-2 border-[#141414] rounded-none">
            <h2 className="text-base sm:text-lg font-bold text-gray-200 mb-6 flex items-center gap-2 border-b border-[#3e4145] pb-2">
              <span className="text-xs text-gray-400">09.</span> Tab (On & Off rows)
            </h2>
            <div className="overflow-x-auto pb-2">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-gray-400 text-xs border-b border-[#3e4145]">
                    <th className="py-2 px-4 w-24">State</th>
                    {STATES.map((st) => (
                      <th key={st} className="py-2 px-4 capitalize">{st}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333538]">
                  <tr>
                    <td className="py-4 px-4 font-bold text-[#89dc69]">On</td>
                    {STATES.map((st) => (
                      <td key={st} className="py-4 px-4">
                        <VplayTab forcedActive={true} forcedState={st}>First tab</VplayTab>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-bold text-gray-300">Off</td>
                    {STATES.map((st) => (
                      <td key={st} className="py-4 px-4">
                        <VplayTab forcedActive={false} forcedState={st}>First tab</VplayTab>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        /* INTERACTIVE PLAYGROUND */
        <div className="bg-[#292a2c] p-6 sm:p-8 border-2 border-[#141414] space-y-8">
          <h2 className="text-xl font-bold text-[#89dc69] border-b border-[#3e4145] pb-3">
            Interactive Component Playground
          </h2>
          <p className="text-xs text-gray-300">
            Hover, click, and interact with the custom pixel Vplay design system components below:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Column 1 */}
            <div className="space-y-6">
              <div className="bg-[#1f2123] p-4 border border-[#383a3d]">
                <h3 className="text-xs text-gray-400 mb-3">01, 02 & 03. Buttons</h3>
                <div className="space-y-3">
                  <VplayHeroButton>
                    HERO BUTTON
                  </VplayHeroButton>
                  <VplayPrimaryButton>
                    Primary button
                  </VplayPrimaryButton>
                  <VplaySecondaryButton>
                    Secondary button
                  </VplaySecondaryButton>
                  <VplaySecondaryButtonDark>
                    Secondary button dark
                  </VplaySecondaryButtonDark>
                </div>
              </div>

              <div className="bg-[#1f2123] p-4 border border-[#383a3d]">
                <h3 className="text-xs text-gray-400 mb-3">04. Checkbox</h3>
                <VplayCheckbox
                  checked={pgCheck}
                  onChange={setPgCheck}
                  label={pgCheck ? 'Autoplay next video (ON)' : 'Autoplay next video (OFF)'}
                />
              </div>

              <div className="bg-[#1f2123] p-4 border border-[#383a3d]">
                <h3 className="text-xs text-gray-400 mb-3">08. Toggle Switch</h3>
                <VplayToggleSwitch
                  checked={pgSwitch}
                  onChange={setPgSwitch}
                  label={pgSwitch ? '1080p HD Video Mode' : '720p Standard Video Mode'}
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <div className="bg-[#1f2123] p-4 border border-[#383a3d]">
                <h3 className="text-xs text-gray-400 mb-3">05. Dropdown Button</h3>
                <VplayDropdown
                  label="Select preferred channel"
                  value={pgDropdown}
                  onChange={setPgDropdown}
                  options={[
                    { value: 'channel_1', label: 'Craftmine Live Broadcast' },
                    { value: 'channel_2', label: 'Voxel Survival Stream' },
                    { value: 'channel_3', label: 'Creative Builders Weekly' },
                    { value: 'channel_4', label: 'Redstone Engineering Showcase' },
                  ]}
                />
              </div>

              <div className="bg-[#1f2123] p-4 border border-[#383a3d]">
                <h3 className="text-xs text-gray-400 mb-3">06. Slider</h3>
                <VplaySlider
                  label="Master Audio Volume"
                  value={pgSlider}
                  min={0}
                  max={10}
                  onChange={setPgSlider}
                />
              </div>

              <div className="bg-[#1f2123] p-4 border border-[#383a3d]">
                <h3 className="text-xs text-gray-400 mb-3">07. Input Box</h3>
                <VplayInputBox
                  label="Search Game Channels"
                  description="Enter player name, world seed or event tag"
                  value={pgInput}
                  onChange={(e) => setPgInput(e.target.value)}
                  placeholder="Search channels or worlds..."
                />
              </div>

              <div className="bg-[#1f2123] p-4 border border-[#383a3d]">
                <h3 className="text-xs text-gray-400 mb-3">09. Tabs</h3>
                <div className="flex gap-2 flex-wrap">
                  {['Featured', 'Today', 'Live Streams', 'Settings'].map((tabLabel, idx) => (
                    <VplayTab
                      key={tabLabel}
                      active={pgSelectedTab === idx}
                      onClick={() => setPgSelectedTab(idx)}
                    >
                      {tabLabel}
                    </VplayTab>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
