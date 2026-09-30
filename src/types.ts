import type { CSSProperties } from 'react';

export type IconName =
  | 'bone'
  | 'eye'
  | 'moon'
  | 'stairs'
  | 'bolt'
  | 'sound'
  | 'cloud'
  | 'shield'
  | 'thermometer'
  | 'drop'
  | 'star';
export type AbilityType = 'Passive' | 'Active ability';
export type TreeId = 'structure' | 'sensors' | 'recovery';

export interface Skill {
  id: string;
  age: number;
  name: string;
  description: string;
  icon: IconName;
  parents: string[];
  type: AbilityType;
}

export interface SkillDiscipline {
  id: TreeId;
  name: string;
  subtitle: string;
  color: string;
  icon: IconName;
  skills: Skill[];
}

export type CSSVariables = CSSProperties & { [key: `--${string}`]: string | number };
