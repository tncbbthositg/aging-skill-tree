import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import type { CSSVariables, TreeId } from './types';
import {
  trees,
  allSkills,
  parseAge,
  unlockedSkills,
  hasLegendary,
  eyesightUnlocks,
} from './skills';
import SkillTree from './components/SkillTree';
import Icon from './components/Icon';

import './style.css';

function App() {
  const [age, setAge] = useState(() => parseAge(new URLSearchParams(location.search).get('age')));
  const [selected, setSelected] = useState('nap');
  const [shareMessage, setShareMessage] = useState('');
  const [shareFallback, setShareFallback] = useState('');
  const [activeTree, setActiveTree] = useState<TreeId | 'all'>('all');

  const selectedTree = trees.find((tree) => tree.skills.some((item) => item.id === selected));
  const skill = selectedTree?.skills.find((item) => item.id === selected);
  const count = unlockedSkills(age).length;
  const sliderStyle: CSSVariables = { '--progress': `${((age - 20) / 60) * 100}%` };

  const filters: { id: TreeId | 'all'; name: string }[] = [
    { id: 'all', name: 'All disciplines' },
    ...trees,
  ];

  useEffect(() => {
    const url = new URL(location.href);
    url.searchParams.set('age', String(age));
    history.replaceState(null, '', url);

    setShareMessage('');
    setShareFallback('');
  }, [age]);

  useEffect(() => {
    const steps = eyesightUnlocks(age);
    document.documentElement.style.fontSize = `${100 + steps * 6.25}%`;

    return () => {
      document.documentElement.style.removeProperty('font-size');
    };
  }, [age]);

  async function share() {
    try {
      await Promise.race([
        navigator.clipboard.writeText(location.href),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Clipboard unavailable')), 1500),
        ),
      ]);

      setShareMessage('Build link copied. Send condolences.');
    } catch {
      setShareFallback(location.href);
      setShareMessage('Copy your build link below.');
    }
  }

  if (!skill || !selectedTree) {
    throw new Error(`Unknown selected skill: ${selected}`);
  }

  const detailsStyle: CSSVariables = { '--accent': selectedTree.color };

  return (
    <>
      <header className="mx-auto flex h-[83px] max-w-[1440px] items-center justify-between border-b border-white/10 px-[5%] max-[760px]:h-16">
        <a
          href="?age=45"
          className="flex items-center gap-3 text-xs font-bold tracking-[2px] [&_svg]:text-[#c0d598] max-[760px]:text-[0.5625rem] max-[760px]:tracking-[1px]"
        >
          <Icon name="star" /> THE HUMAN PATCH NOTES
        </a>
        <span className="font-display text-[0.625rem] tracking-[1.5px] text-[#a3aa96] max-[760px]:text-[0.5rem] [&_span]:px-[15px] [&_span]:text-[#4b5344] max-[760px]:[&_span]:px-[3px]">
          EST. AT BIRTH <span> / </span> v{age}.0
        </span>
      </header>

      <main className="mx-auto max-w-[1440px] px-[5%]">
        <section className="flex items-center justify-between pt-16 pb-12 max-[760px]:pt-10 max-[760px]:pb-8">
          <div>
            <p className="mb-3 font-display text-[0.625rem] font-semibold tracking-[1.8px] text-[#a8b19b] max-[760px]:text-[0.5rem] max-[760px]:tracking-[1px]">
              A ROLE-PLAYING GAME YOU CAN’T OPT OUT OF
            </p>

            <h1 className="my-6 font-display text-[clamp(2.375rem,5.5vw,4.75rem)] leading-[1.05] font-medium tracking-[-4px] max-[760px]:text-[2.6875rem] max-[760px]:tracking-[-2px]">
              Aging skill tree<span className="text-[#bbd98a]">.</span>
            </h1>

            <p className="m-0 text-base leading-[1.65] text-[#aab19f] max-[760px]:text-sm">
              Another year older. Another questionable ability.
              <br />
              Discover the perks nobody asked to unlock.
            </p>
          </div>

          <div className="mr-5 flex size-35 rotate-12 flex-col items-center justify-center gap-[9px] rounded-full border border-[#82956555] text-center font-display text-[0.625rem] leading-[1.7] tracking-[2px] text-[#bcd393] max-[1000px]:size-30 max-[760px]:hidden">
            <Icon name="star" />
            <span>
              EXPERIENCE
              <br />
              WITHOUT
              <br />
              <b>CONSENT</b>
            </span>
          </div>
        </section>

        <section
          className="flex items-center gap-8 rounded-[14px] border border-[#4c5841] bg-[#20271c] p-8 max-[1000px]:gap-6 max-[760px]:flex-wrap max-[760px]:p-6"
          aria-label="Your age and build"
        >
          <div className="min-w-[100px] max-[760px]:min-w-[68px]">
            <span className="mb-4 block font-display text-[0.5625rem] font-semibold tracking-[1.8px] text-[#a8b19b]">
              YOUR LEVEL
            </span>

            <div className="font-display text-5xl leading-none font-medium tracking-[-2px] max-[760px]:text-[2.5rem]">
              {age}
              <span className="pl-2 font-sans text-xs font-normal tracking-normal text-[#a2ad95] max-[760px]:hidden">
                years
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-4 flex justify-between gap-4 text-xs max-[760px]:block max-[760px]:text-[0.6875rem]">
              <label htmlFor="age">Slide into your next existential crisis</label>
              <span className="whitespace-nowrap text-[#c6d8a4] max-[760px]:mt-[5px] max-[760px]:block max-[760px]:text-[0.625rem]">
                {count} / {allSkills.length} perks
              </span>
            </div>

            <input
              className="my-[8px] mb-[18px] h-[5px] w-full cursor-pointer appearance-none rounded-[5px] bg-[linear-gradient(to_right,#bfd78d_var(--progress),#424b38_var(--progress))]"
              id="age"
              type="range"
              min="20"
              max="80"
              value={age}
              onChange={(event) => setAge(Number(event.target.value))}
              style={sliderStyle}
              aria-valuetext={`${age} years old, ${count} abilities unlocked`}
            />
            <div className="flex justify-between font-display text-[0.5625rem] tracking-[1px] text-[#aab49d] max-[760px]:text-[0.4375rem] max-[760px]:tracking-[0.3px]">
              <span>20 · FACTORY SETTINGS</span>

              <span>80 · LEGACY HARDWARE</span>
            </div>
          </div>

          <button
            className="rounded-[7px] border-0 bg-[#c6dd9e] px-6 py-4 text-xs font-bold whitespace-nowrap text-[#18200f] hover:bg-[#deefbd] max-[760px]:w-full max-[760px]:p-4"
            onClick={share}
          >
            Share my build <span className="ml-[22px]">↗</span>
          </button>
        </section>

        <div className="min-h-8 py-2 text-xs text-[#c6dd9e]" role="status">
          {shareMessage}
          {shareFallback && (
            <input
              className="mt-2 block w-full border-2 border-[#767676] bg-[#3b3b3b] p-2.5"
              aria-label="Shareable build link"
              readOnly
              value={shareFallback}
              onFocus={(e) => e.target.select()}
            />
          )}
        </div>

        <section
          className={`flex items-center gap-6 rounded-[10px] border p-8 [&>svg]:size-8 [&>svg]:shrink-0 max-[760px]:gap-4 max-[760px]:p-6 ${hasLegendary(age) ? 'border-[#665b33] bg-[linear-gradient(100deg,#2d2b1a,#1b2117)] text-[#e2cd8f]' : 'border-[#3b4133] bg-[#1c2118] text-[#9ea893]'}`}
          aria-label="Legendary synergy"
        >
          <Icon name="star" />
          <div>
            <p className="mb-2 font-display text-[0.5625rem] font-semibold tracking-[1.8px]">
              {hasLegendary(age) ? 'LEGENDARY SYNERGY UNLOCKED' : 'LEGENDARY SYNERGY · LEVEL 45'}
            </p>

            <h2 className="mb-2 font-display text-lg font-medium">Fully Operational Adult</h2>

            <p className="m-0 text-xs leading-normal text-[#b9b9a6] max-[760px]:text-[0.6875rem]">
              {hasLegendary(age)
                ? 'You are tired, slightly sore, and somehow furious that a light was left on downstairs.'
                : 'Requires Thermostat Awareness + Creaking Louder Than the Stairs + Midday Maintenance Window.'}
            </p>
          </div>

          <span className="ml-auto font-display text-[0.5625rem] tracking-[1px] whitespace-nowrap max-[1000px]:hidden">
            {hasLegendary(age) ? '+0 ACTUAL BENEFITS' : 'STILL LOADING'}
          </span>
        </section>

        <div className="mt-16 mb-8 flex items-center justify-between gap-6 max-[760px]:mt-12 max-[760px]:flex-wrap">
          <div>
            <p className="mb-4 font-display text-[0.625rem] font-semibold tracking-[1.8px] text-[#c4cbb9]">
              CHOOSE YOUR DETERIORATION
            </p>

            <p className="m-0 text-xs text-[#c4cbb9]">
              Three disciplines. Zero respecs.{' '}
              <span className="text-[#8f9a85] max-[760px]:mt-[5px] max-[760px]:block">
                Tap a skill to inspect it.
              </span>
            </p>
          </div>

          <div className="flex gap-6 text-[0.625rem] text-[#b9ce9d] max-[760px]:flex-col max-[760px]:gap-2">
            <span>● Unlocked</span>

            <span className="text-[#9ba48f]">○ Coming for you</span>
          </div>
        </div>

        <nav className="mb-10 flex flex-wrap gap-4" aria-label="Filter disciplines">
          {filters.map((tree) => (
            <button
              key={tree.id}
              className="rounded-full border border-[#3a4432] bg-transparent px-4 py-3 text-[0.6875rem] text-[#a9b29e] aria-pressed:border-[#c1d795] aria-pressed:bg-[#c1d795] aria-pressed:text-[#15200f] max-[760px]:px-4 max-[760px]:text-[0.625rem]"
              aria-pressed={activeTree === tree.id}
              onClick={() => setActiveTree(tree.id)}
            >
              {tree.name}
            </button>
          ))}
        </nav>

        <div
          className={`grid items-start gap-10 max-[1100px]:mx-auto max-[1100px]:max-w-[640px] max-[1100px]:gap-12 ${activeTree !== 'all' ? 'grid-cols-[minmax(0,580px)] justify-center' : 'grid-cols-3 max-[1100px]:grid-cols-1'}`}
        >
          {trees
            .filter((tree) => activeTree === 'all' || tree.id === activeTree)
            .map((tree) => (
              <SkillTree
                key={tree.id}
                tree={tree}
                age={age}
                selected={selected}
                onSelect={setSelected}
              />
            ))}
        </div>

        <aside
          className="sticky bottom-4 z-2 mt-8 flex items-center gap-6 rounded-xl border border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,#171d15)] p-6 shadow-[0_8px_40px_#0009] max-[760px]:bottom-2 max-[760px]:gap-4 max-[760px]:p-4"
          style={detailsStyle}
          aria-label="Selected skill"
          aria-live="polite"
        >
          <div className="grid size-[2.875rem] shrink-0 place-items-center rounded-[9px] border border-[color-mix(in_srgb,var(--accent)_60%,transparent)] text-[var(--accent)] max-[760px]:hidden">
            <Icon name={skill.icon} />
          </div>

          <div>
            <p className="mb-2 font-display text-xs leading-normal font-semibold tracking-[1px] text-[var(--accent)]">
              {skill.type} · LEVEL {skill.age} ·{' '}
              {age >= skill.age ? 'UNLOCKED' : `UNLOCKS IN ${skill.age - age} YEARS`}
            </p>

            <h2 className="mb-2 font-display text-[1.0625rem] font-medium max-[760px]:text-sm">
              {skill.name}
            </h2>

            <p className="m-0 text-xs leading-normal text-[#c0c9b4] max-[760px]:text-[0.6875rem]">
              {skill.description}
            </p>
          </div>

          <button
            className="ml-auto rounded-[7px] border border-[color-mix(in_srgb,var(--accent)_50%,transparent)] bg-transparent text-[var(--accent)] p-2.5 text-xs whitespace-nowrap"
            aria-label="Return to age slider"
            onClick={() => document.getElementById('age')?.focus()}
          >
            ↑ <span className="max-[760px]:hidden">Age</span>
          </button>
        </aside>

        <footer className="mt-16 flex items-center justify-between gap-6 border-t border-[#35402c] pt-8 pb-12 font-display text-[0.5625rem] tracking-[1px] text-[#9aa48d] max-[760px]:flex-wrap max-[760px]:justify-center">
          <span>AGING SKILL TREE</span>

          <p className="my-[1em] text-center font-sans text-[0.6875rem] leading-[1.7] tracking-normal max-[760px]:order-3 max-[760px]:m-0 max-[760px]:w-full">
            All ages are made up. All noises are suspicious.
            <br />A joke about getting older, not a forecast.
          </p>

          <span>NO REFUNDS ON XP.</span>
        </footer>
      </main>
    </>
  );
}

const root = document.getElementById('root');

if (!root) {
  throw new Error('Missing app root element');
}

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
