
import { WeeklyData, AppState, GameRelease } from './types';

const INITIAL_WEEK_ID = "2024-W04"; // Jan 22 - Jan 28

const defaultReleases: GameRelease[] = Array.from({ length: 6 }, (_, i) => ({
  id: `rel-${i}`,
  name: i === 0 ? 'Fruity Gold 1000' : (i === 1 ? 'Respin Joker 81 Xmas' : ''),
  date: i === 0 ? '2024-01-15' : (i === 1 ? '2024-01-28' : ''),
  features: i === 0 ? 'Multipliers, Respins' : (i === 1 ? 'Holiday theme, Wilds' : '')
}));

export const initialData: WeeklyData = {
  weekId: INITIAL_WEEK_ID,
  kpis: {
    prevWeek: { totalBet: 186030626, ggr: 8462829, grc: 355088532, players: 1325160, rtp: 95.45 },
    thisWeek: { totalBet: 160987030, ggr: 7397962, grc: 314656769, players: 1301639, rtp: 95.40 },
    prevWeekend: { totalBet: 53066521, ggr: 2462868, grc: 101745938, players: 559885, rtp: 95.36 },
    thisWeekend: { totalBet: 45869716, ggr: 2184140, grc: 91632419, players: 537829, rtp: 95.24 },
    prevMonthAvg: { totalBet: 824371420, ggr: 37984088, grc: 1513998449, players: 3421710, rtp: 95.39 },
    thisMonthAvg: { totalBet: 812450000, ggr: 36500000, grc: 1480000000, players: 3380000, rtp: 95.37 }
  },
  topGames: [
    { name: 'Respin Joker', rank: 1, totalBetTW: 16848708, totalBetLW: 16346147, grcTW: 27863957, grcLW: 27375742, avgRank4W: 1.2 },
    { name: 'Respin Joker 81 Xmas', rank: 2, totalBetTW: 15578041, totalBetLW: 5717351, grcTW: 29911265, grcLW: 9367089, avgRank4W: 4.5 },
    { name: 'Firebird 81', rank: 3, totalBetTW: 15512092, totalBetLW: 14152371, grcTW: 15563639, grcLW: 14365032, avgRank4W: 2.8 },
    { name: 'Respin Joker 243', rank: 4, totalBetTW: 14215317, totalBetLW: 13790477, grcTW: 16434005, grcLW: 16313659, avgRank4W: 4.0 },
    { name: 'Respin Joker 81', rank: 5, totalBetTW: 13642748, totalBetLW: 15321483, grcTW: 14787743, grcLW: 16064667, avgRank4W: 3.5 },
    { name: 'Fire Witch', rank: 6, totalBetTW: 8450000, totalBetLW: 8100000, grcTW: 9200000, grcLW: 9150000, avgRank4W: 6.8 },
    { name: '81 Fruit Carnival', rank: 7, totalBetTW: 8120000, totalBetLW: 8800000, grcTW: 8900000, grcLW: 9020000, avgRank4W: 6.5 },
    { name: 'Viking Joker', rank: 8, totalBetTW: 7800000, totalBetLW: 7500000, grcTW: 8500000, grcLW: 8410000, avgRank4W: 8.5 },
    { name: 'Wild Circus', rank: 9, totalBetTW: 6500000, totalBetLW: 6820000, grcTW: 7210000, grcLW: 7150000, avgRank4W: 8.2 },
    { name: 'Midnight Fruits 81', rank: 10, totalBetTW: 5400000, totalBetLW: 5290000, grcTW: 5980000, grcLW: 5912000, avgRank4W: 10.0 }
  ],
  drops: [
    { id: 'd1', type: 'drop', title: 'Fortuna SK - 23.01 drop in GGR', description: 'Due to high RTP', data: [] },
    { id: 'd2', type: 'drop', title: 'Betano PE - 25.01 negative GGR', description: 'Due to high RTP', data: [] }
  ],
  peaks: [
    { id: 'p1', type: 'peak', title: 'Tipos SK - 26.01 players avg peak', description: 'Increase from 1k/2k to more than 12k', data: [] },
    { id: 'p2', type: 'peak', title: 'Maxbet - 28.01 2x players', description: 'Growth in player base', data: [] }
  ],
  certificates: [
    { id: 'c1', name: 'GLI_IT_Branded_BGame_7Games', type: 'Game', jurisdictions: 'IT', issuedOn: '9.1.2024', issuedBy: 'GLI Europe B.V.' },
    { id: 'c2', name: '2025_GLI_GR_Fire Witch X', type: 'Game', jurisdictions: 'GR', issuedOn: '7.1.2024', issuedBy: 'GLI Europe B.V.' }
  ],
  exclusivities: [
    { id: 'e1', name: 'NovibetIE - Fruity Gold 1000', operator: 'Novibet', startDate: '27. 2. 2026', endDate: '12. 3. 2026', category: 'Exclusivity', status: 'Approved', contact: 'Cornelia Laza (Away)' },
    { id: 'e2', name: 'StarcasinoBE - Fruity Gold 1000', operator: 'Starcasino', startDate: '26. 2. 2026', endDate: '11. 3. 2026', category: 'Exclusivity', status: 'Analyzed', contact: 'Nadica Paunovich (Busy)' }
  ],
  promotions: [
    { id: 'pr1', name: 'Alphawin BG - All Ways Queen', operator: 'Alphawin', startDate: '1. 2. 2026', endDate: '28. 2. 2026', value: '', type: 'GGR Discount', status: 'Analyzed', contact: 'Cornelia Laza (Away)' },
    { id: 'pr2', name: 'Doxxbet SK_Firebird 81 Strategy', operator: 'Doxxbet SK', startDate: '1. 2. 2026', endDate: '31. 3. 2026', value: '5 766,15 €', type: 'GGR Discount', status: 'Analyzed', contact: 'Wayne Garrett (Available)' }
  ],
  gameReleases: defaultReleases,
  events: [],
  importantInfo: "Quarterly review scheduled for next week. Focus on UK market growth.",
  teamInfo: [
    { id: 't1', name: 'Cornelia Laza', activity: 'Conference', conferenceName: 'ICE London 2024', dates: '12.01 - 15.01' },
    { id: 't2', name: 'Wayne Garrett', activity: 'Vacation', dates: '22.01 - 26.01' }
  ],
  spbUpdates: [
    { id: 's1', aggregator: 'Direct', casino: 'Superbet RO', country: 'RO', status: 'Done', details: 'RTP Logic Patch' }
  ],
  integrations: [
    { id: 'i1', aggregator: 'Relax Gaming', casino: 'UnibetRO on PROD', country: 'RO', status: 'Done', details: '' },
    { id: 'i2', aggregator: 'Betpoint', casino: 'Betpoint Fun Bonus TST+PROD', country: 'IT', status: 'Done', details: '' },
    { id: 'i3', aggregator: 'Betconstruct', casino: 'VbetNL on TST+PROD', country: 'NL', status: 'In Progress', details: '' },
    { id: 'i4', aggregator: 'Everymatrix', casino: 'Nairabet on PROD', country: 'CW', status: 'Denied', details: 'Waiting for betting license' }
  ]
};

export const initialAppState: AppState = {
  [INITIAL_WEEK_ID]: initialData
};
