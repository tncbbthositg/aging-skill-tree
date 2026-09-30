import { useLayoutEffect, useRef, useState } from 'react';

import Icon from './Icon';
import type { CSSVariables, SkillDiscipline } from '../types';

interface SkillTreeProps {
  tree: SkillDiscipline;
  age: number;
  selected: string;
  onSelect: (id: string) => void;
}

const xFor = (index: number) => (index % 3 === 0 ? 0 : index % 3 === 1 ? 14 : 7);

export default function SkillTree({ tree, age, selected, onSelect }: SkillTreeProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ height: 1, centers: [] as number[] });

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const measure = () => {
      const cards = Array.from(canvas.querySelectorAll<HTMLButtonElement>('[data-skill-node]'));

      setLayout({
        height: canvas.offsetHeight,
        centers: cards.map((card) => card.offsetTop + card.offsetHeight / 2),
      });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    canvas.querySelectorAll('[data-skill-node]').forEach((card) => observer.observe(card));
    measure();

    return () => observer.disconnect();
  }, [tree]);

  const treeStyle: CSSVariables = { '--accent': tree.color };
  const count = tree.skills.filter((skill) => age >= skill.age).length;
  return (
    <section className="min-w-0" style={treeStyle} aria-labelledby={`tree-${tree.id}`}>
      <header className="flex items-center gap-4 border-t-2 border-[var(--accent)] pt-6">
        <div className="w-[2.1875rem] shrink-0 text-[var(--accent)] max-[1000px]:w-[1.625rem] max-[760px]:w-8">
          <Icon name={tree.icon} />
        </div>

        <div>
          <span className="mb-2 block font-display text-[0.5rem] font-semibold tracking-[1.8px] text-[var(--accent)]">
            DISCIPLINE {tree.id === 'structure' ? '01' : tree.id === 'sensors' ? '02' : '03'}
          </span>

          <h2
            className="m-0 font-display text-lg font-medium tracking-[-0.5px] max-[1000px]:text-[0.9375rem] max-[760px]:text-[1.3125rem]"
            id={`tree-${tree.id}`}
          >
            {tree.name}
          </h2>
        </div>

        <span className="ml-auto font-display text-[0.625rem] text-[var(--accent)]">
          {count}/{tree.skills.length}
        </span>
      </header>

      <p className="mt-4 mb-8 min-h-10 text-[0.6875rem] leading-normal text-[#9fa994] max-[1100px]:min-h-0">
        {tree.subtitle}
      </p>

      <div className="relative flex flex-col gap-8 pb-8" ref={canvasRef}>
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox={`0 0 100 ${layout.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {tree.skills.flatMap((skill, index) =>
            skill.parents.map((parent) => {
              const parentIndex = tree.skills.findIndex((item) => item.id === parent);

              if (parentIndex < 0) {
                return null;
              }

              const x1 = xFor(parentIndex) + 4;
              const y1 = layout.centers[parentIndex] ?? 0;
              const x2 = xFor(index) + 4;
              const y2 = layout.centers[index] ?? 0;

              return (
                <path
                  key={`${parent}-${skill.id}`}
                  className={`fill-none stroke-[1.5] ${age >= skill.age ? 'stroke-[var(--accent)] opacity-55' : 'stroke-[#3a4332]'}`}
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
            data-skill-node
            className={`relative flex min-h-36 w-[86%] items-start gap-4 rounded-[9px] border p-6 text-left transition-[border-color,background,transform] duration-200 hover:-translate-y-[2px] hover:border-[var(--accent)] motion-reduce:transition-none max-[760px]:p-4 ${age >= skill.age ? 'bg-[#22291e]' : 'bg-[#171d15]'} ${selected === skill.id ? 'border-[var(--accent)] shadow-[0_0_0_1px_var(--accent),0_0_28px_color-mix(in_srgb,var(--accent)_8%,transparent)]' : age >= skill.age ? 'border-[color-mix(in_srgb,var(--accent)_35%,#22291e)]' : 'border-[#35402d]'}`}
            style={{
              marginLeft: `${xFor(index)}%`,
            }}
            onClick={() => onSelect(skill.id)}
            aria-pressed={selected === skill.id}
            aria-label={`${skill.name}, level ${skill.age}, ${age >= skill.age ? 'unlocked' : 'locked'}. ${skill.description}`}
          >
            <span
              className={`mt-[5px] grid h-[2.125rem] w-8 shrink-0 place-items-center rounded-[7px] border bg-[#192015] [&_svg]:size-[1.3125rem] max-[1000px]:h-7 max-[1000px]:w-[1.625rem] max-[760px]:h-9 max-[760px]:w-[2.125rem] ${age >= skill.age ? 'border-[color-mix(in_srgb,var(--accent)_40%,transparent)] text-[var(--accent)]' : 'border-[#46503c] text-[#8f9a84]'}`}
            >
              <Icon name={skill.icon} />
            </span>

            <span className="block min-w-0">
              <span
                className={`mb-2 flex flex-wrap justify-between gap-2 font-display text-[0.625rem] tracking-[0.4px] ${age >= skill.age ? 'text-[var(--accent)]' : 'text-[#a0ac93]'}`}
              >
                LVL {skill.age} <span>{age >= skill.age ? '✦ UNLOCKED' : '◇ LOCKED'}</span>
              </span>

              <strong
                className={`mb-2 block font-display text-[0.8125rem] leading-[1.25] font-medium max-[1000px]:text-xs max-[760px]:text-sm ${age >= skill.age ? '' : 'text-[#a9b19f]'}`}
              >
                {skill.name}
              </strong>

              <span className="block text-[0.625rem] leading-normal text-[#a8b29c] min-[1500px]:text-[0.6875rem] max-[760px]:text-[0.6875rem]">
                {skill.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
