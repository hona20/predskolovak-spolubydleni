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
    id: 'other',
    name: 'Jiné / VUT & MENDELU',
    shortName: 'Jiné / Brno',
    dates: 'Září 2026',
    badgeColor: '#E42D21',
    description: 'Ostatní turnusy a kamarádi z jiných univerzit v Brně',
  },
];

export const FACULTIES: FacultyInfo[] = [
  { code: 'LF', name: 'Lékařská fakulta MUNI', university: 'MUNI', campus: 'Bohunice', color: '#DC2626' },
  { code: 'PrF', name: 'Právnická fakulta MUNI', university: 'MUNI', campus: 'Veveří', color: '#7C3AED' },
  { code: 'FF', name: 'Filozofická fakulta MUNI', university: 'MUNI', campus: 'Arna Nováka', color: '#EA580C' },
  { code: 'PřF', name: 'Přírodovědecká fakulta MUNI', university: 'MUNI', campus: 'Kotlářská', color: '#16A34A' },
  { code: 'ESF', name: 'Ekonomicko-správní fakulta MUNI', university: 'MUNI', campus: 'Lipová', color: '#0EA5E9' },
  { code: 'PdF', name: 'Pedagogická fakulta MUNI', university: 'MUNI', campus: 'Poříčí', color: '#D97706' },
  { code: 'FI', name: 'Fakulta informatiky MUNI', university: 'MUNI', campus: 'Botanická', color: '#2563E2' },
  { code: 'FSS', name: 'Fakulta sociálních studií MUNI', university: 'MUNI', campus: 'Joštova', color: '#5AC8AF' },
  { code: 'FSpS', name: 'Fakulta sportovních studií MUNI', university: 'MUNI', campus: 'Kamenice', color: '#DB2777' },
  { code: 'FaF', name: 'Farmaceutická fakulta MUNI', university: 'MUNI', campus: 'Kamenice', color: '#0891B2' },
  { code: 'FAST', name: 'Fakulta stavební VUT', university: 'VUT', campus: 'Veveří', color: '#78716C' },
  { code: 'FSI', name: 'Fakulta strojního inženýrství VUT', university: 'VUT', campus: 'Technická', color: '#57534E' },
  { code: 'FEKT', name: 'Fakulta elektrotechniky a komunikačních technologií VUT', university: 'VUT', campus: 'Technická', color: '#B91C1C' },
  { code: 'FIT', name: 'Fakulta informačních technologií VUT', university: 'VUT', campus: 'Božetěchova', color: '#E42D21' },
  { code: 'FCH', name: 'Fakulta chemická VUT', university: 'VUT', campus: 'Purkyňova', color: '#059669' },
  { code: 'FA', name: 'Fakulta architektury VUT', university: 'VUT', campus: 'Poříčí', color: '#9333EA' },
  { code: 'FP', name: 'Fakulta podnikatelská VUT', university: 'VUT', campus: 'Kolejní', color: '#CA8A04' },
  { code: 'FaVU', name: 'Fakulta výtvarných umění VUT', university: 'VUT', campus: 'Údolní', color: '#DB2777' },
  { code: 'AF', name: 'Agronomická fakulta MENDELU', university: 'MENDELU', campus: 'Zemědělská', color: '#65A30D' },
  { code: 'LDF', name: 'Lesnická a dřevařská fakulta MENDELU', university: 'MENDELU', campus: 'Zemědělská', color: '#166534' },
  { code: 'ZF', name: 'Zahradnická fakulta MENDELU', university: 'MENDELU', campus: 'Lednice', color: '#16A34A' },
  { code: 'PEF', name: 'Provozně ekonomická fakulta MENDELU', university: 'MENDELU', campus: 'Zemědělská', color: '#0D9488' },
  { code: 'FRRMS', name: 'Fakulta regionálního rozvoje a mezinárodních studií MENDELU', university: 'MENDELU', campus: 'Zemědělská', color: '#7C3AED' },
];

export const DEFAULT_AVATARS = [
  '🏕️', '🏖️', '😎', '🤠', '🤓', '🥳', 
  '🎸', '☕', '🍕', '🥑', '🐱', '🐶'
];
