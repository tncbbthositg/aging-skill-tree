import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSVariables, SkillDiscipline } from '../types';

interface SkillTreeProps {
  tree: SkillDiscipline;
  age: number;
  selected: string;
  onSelect: (id: string) => void;
}

import Icon from './Icon';
const xFor = (index: number) => (index % 3 === 0 ? 0 : index % 3 === 1 ? 14 : 7);
export default function SkillTree({ tree, age, selected, onSelect }: SkillTreeProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ height: 1, centers: [] as number[] });
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const measure = () => {
      const cards = Array.from(canvas.querySelectorAll<HTMLButtonElement>('.skill-node'));
      setLayout({
        height: canvas.offsetHeight,
        centers: cards.map((card) => card.offsetTop + card.offsetHeight / 2),
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    canvas.querySelectorAll('.skill-node').forEach((card) => observer.observe(card));
    measure();
    return () => observer.disconnect();
  }, [tree]);
  const treeStyle: CSSVariables = { '--accent': tree.color };
  const count = tree.skills.filter((skill) => age >= skill.age).length;
  return (
    <section className="tree" style={treeStyle} aria-labelledby={`tree-${tree.id}`}>
      <header className="tree-header">
        <div className="tree-symbol">
          <Icon name={tree.icon} />
        </div>
        <div>
          <span className="eyebrow">
            DISCIPLINE {tree.id === 'structure' ? '01' : tree.id === 'sensors' ? '02' : '03'}
          </span>
          <h2 id={`tree-${tree.id}`}>{tree.name}</h2>
        </div>
        <span className="tree-count">
          {count}/{tree.skills.length}
        </span>
      </header>
      <p className="tree-subtitle">{tree.subtitle}</p>
      <div className="tree-canvas" ref={canvasRef}>
        <svg
          className="connections"
          viewBox={`0 0 100 ${layout.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {tree.skills.flatMap((skill, index) =>
            skill.parents.map((parent) => {
              const parentIndex = tree.skills.findIndex((item) => item.id === parent);
              if (parentIndex < 0) return null;
              const x1 = xFor(parentIndex) + 4,
                y1 = layout.centers[parentIndex] ?? 0,
                x2 = xFor(index) + 4,
                y2 = layout.centers[index] ?? 0;
              return (
                <path
                  key={`${parent}-${skill.id}`}
                  className={age >= skill.age ? 'lit' : ''}
                  d={`M ${x1} ${y1} C ${x1} ${y1 + 90}, ${x2} ${y2 - 90}, ${x2} ${y2}`}
                  vectorEffect="non-scaling-stroke"
                />
              );
            }),
          )}
        </svg>
        {tree.skills.map((skill, index) => (
          <button
            key={skill.id}
            className={`skill-node ${age >= skill.age ? 'unlocked' : 'locked'} ${selected === skill.id ? 'selected' : ''}`}
            style={{
              marginLeft: `${xFor(index)}%`,
            }}
            onClick={() => onSelect(skill.id)}
            aria-pressed={selected === skill.id}
            aria-label={`${skill.name}, level ${skill.age}, ${age >= skill.age ? 'unlocked' : 'locked'}. ${skill.description}`}
          >
            <span className="node-icon">
              <Icon name={skill.icon} />
            </span>
            <span className="node-copy">
              <span className="node-meta">
                LVL {skill.age} <span>{age >= skill.age ? '✦ UNLOCKED' : '◇ LOCKED'}</span>
              </span>
              <strong>{skill.name}</strong>
              <span className="node-description">{skill.description}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
