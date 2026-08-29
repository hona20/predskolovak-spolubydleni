import { TurnusInfo } from '../types';

export interface FacultyInfo {
  code: string;
  name: string;
  university: 'MUNI' | 'VUT' | 'MENDELU';
  campus: string;
  color: string;
}

export const TURNUSY: TurnusInfo[] = [
  {
    id: 'turnus1',
    name: '1. Turnus MUNI',
    shortName: '1. Turnus',
    dates: '30. 8. – 2. 9. 2026',
    badgeColor: '#2563E2',
    description: 'Vranovská pláž – hlavní celouniverzitní turnus',
  },
  {
    id: 'turnus2',
    name: '2. Turnus MUNI',
    shortName: '2. Turnus',
    dates: '2. 9. – 5. 9. 2026',
    badgeColor: '#0ea5e9',
    description: 'Vranovská pláž – druhý celouniverzitní turnus',
  },
  {
    id: 'turnus_fsps',
    name: 'Turnus FSpS',
    shortName: 'FSpS Turnus',
    dates: '10. 9. – 13. 9. 2026',
    badgeColor: '#5AC8AF',
    description: 'Speciální sportovní termín pro Fakultu sportovních studií',
  },
  {
    id: 'other',
    name: 'Jiné / VUT & MENDELU',
    shortName: 'Jiné / Brno',
    dates: 'Září 2026',
    badgeColor: '#E42D21',
    description: 'Ostatní turnusy a kamarádi z jiných univerzit v Brně',
  },
];

export const DEFAULT_AVATARS = [
  '🏕️', '🏖️', '😎', '🤠', '🤓', '🥳', 
  '🎸', '☕', '🍕', '🥑', '🐱', '🐶'
];
