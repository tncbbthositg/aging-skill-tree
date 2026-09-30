import type { CSSVariables, TreeId } from './types';
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { trees, allSkills, parseAge, unlockedSkills, hasLegendary } from './skills';
import SkillTree from './components/SkillTree';
import Icon from './components/Icon';
import './style.css';
function App() {
  const [age, setAge] = useState(() => parseAge(new URLSearchParams(location.search).get('age')));
  const [selected, setSelected] = useState('nap');
  const [shareMessage, setShareMessage] = useState('');
  const [shareFallback, setShareFallback] = useState('');
  const [activeTree, setActiveTree] = useState<TreeId | 'all'>('all');
  const skill = allSkills.find((item) => item.id === selected);
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
  if (!skill) throw new Error(`Unknown selected skill: ${selected}`);
  return (
    <>
      <header className="topbar">
        <a href="?age=45" className="brand">
          <Icon name="star" /> THE HUMAN PATCH NOTES
        </a>
        <span className="version">
          EST. AT BIRTH <span> / </span> v{age}.0
        </span>
      </header>
      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">A ROLE-PLAYING GAME YOU CAN’T OPT OUT OF</p>
            <h1>
              Aging skill tree<span>.</span>
            </h1>
            <p className="intro">
              Another year older. Another questionable ability.
              <br />
              Discover the perks nobody asked to unlock.
            </p>
          </div>
          <div className="hero-seal">
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
        <section className="build-panel" aria-label="Your age and build">
          <div className="level">
            <span className="eyebrow">YOUR LEVEL</span>
            <div>
              {age}
              <span>years</span>
            </div>
          </div>
          <div className="slider-wrap">
            <div className="slider-label">
              <label htmlFor="age">Slide into your next existential crisis</label>
              <span>
                {count} / {allSkills.length} perks
              </span>
            </div>
            <input
              id="age"
              type="range"
              min="20"
              max="80"
              value={age}
              onChange={(event) => setAge(Number(event.target.value))}
              style={sliderStyle}
              aria-valuetext={`${age} years old, ${count} abilities unlocked`}
            />
            <div className="range-labels">
              <span>20 · FACTORY SETTINGS</span>
              <span>80 · LEGACY HARDWARE</span>
            </div>
          </div>
          <button className="share-button" onClick={share}>
            Share my build <span>↗</span>
          </button>
        </section>
        <div className="share-status" role="status">
          {shareMessage}
          {shareFallback && (
            <input
              aria-label="Shareable build link"
              readOnly
              value={shareFallback}
              onFocus={(e) => e.target.select()}
            />
          )}
        </div>
        <section
          className={`legendary ${hasLegendary(age) ? 'earned' : ''}`}
          aria-label="Legendary synergy"
        >
          <Icon name="star" />
          <div>
            <p className="eyebrow">
              {hasLegendary(age) ? 'LEGENDARY SYNERGY UNLOCKED' : 'LEGENDARY SYNERGY · LEVEL 45'}
            </p>
            <h2>Fully Operational Adult</h2>
            <p>
              {hasLegendary(age)
                ? 'You are tired, slightly sore, and somehow furious that a light was left on downstairs.'
                : 'Requires Thermostat Awareness + Creaking Louder Than the Stairs + Midday Maintenance Window.'}
            </p>
          </div>
          <span className="legendary-tag">
            {hasLegendary(age) ? '+0 ACTUAL BENEFITS' : 'STILL LOADING'}
          </span>
        </section>
        <div className="tree-toolbar">
          <div>
            <p className="eyebrow">CHOOSE YOUR DETERIORATION</p>
            <p>
              Three disciplines. Zero respecs. <span>Tap a skill to inspect it.</span>
            </p>
          </div>
          <div className="legend">
            <span>● Unlocked</span>
            <span>○ Coming for you</span>
          </div>
        </div>
        <nav className="filters" aria-label="Filter disciplines">
          {filters.map((tree) => (
            <button
              key={tree.id}
              aria-pressed={activeTree === tree.id}
              onClick={() => setActiveTree(tree.id)}
            >
              {tree.name}
            </button>
          ))}
        </nav>
        <div className={`trees ${activeTree !== 'all' ? 'single' : ''}`}>
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
        <aside className="inspector" aria-label="Selected skill" aria-live="polite">
          <div className="inspector-icon">
            <Icon name={skill.icon} />
          </div>
          <div>
            <p className="eyebrow">
              {skill.type} · LEVEL {skill.age} ·{' '}
              {age >= skill.age ? 'UNLOCKED' : `UNLOCKS IN ${skill.age - age} YEARS`}
            </p>
            <h2>{skill.name}</h2>
            <p>{skill.description}</p>
          </div>
          <button
            aria-label="Return to age slider"
            onClick={() => document.getElementById('age')?.focus()}
          >
            ↑ <span>Age</span>
          </button>
        </aside>
        <footer>
          <span>AGING SKILL TREE</span>
          <p>
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
if (!root) throw new Error('Missing app root element');
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
