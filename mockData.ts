import { WeeklyData, AppState, GameRelease } from './types';

const INITIAL_WEEK_ID = "2025-W08"; // Feb 17 - Feb 23

const defaultReleases: GameRelease[] = Array.from({ length: 6 }, (_, i) => ({
  id: `rel-${i}`,
  name: i === 0 ? 'Neon Blitz Deluxe' : (i === 1 ? 'Crystal Dynasty 88' : ''),
  date: i === 0 ? '2025-02-10' : (i === 1 ? '2025-02-22' : ''),
  features: i === 0 ? 'Cascading reels, Free spins' : (i === 1 ? 'Asian theme, Mega symbols' : '')
}));

export const initialData: WeeklyData = {
  weekId: INITIAL_WEEK_ID,
  kpis: {
    prevWeek: { totalBet: 245780340, ggr: 11250670, grc: 478920150, players: 1856230, rtp: 94.82 },
    thisWeek: { totalBet: 218450780, ggr: 9876540, grc: 425670890, players: 1789450, rtp: 94.68 },
    prevWeekend: { totalBet: 72340890, ggr: 3456780, grc: 142560780, players: 782340, rtp: 94.55 },
    thisWeekend: { totalBet: 63250470, ggr: 2987650, grc: 128970340, players: 723890, rtp: 94.41 },
    prevMonthAvg: { totalBet: 978450120, ggr: 45230780, grc: 1892340560, players: 4523670, rtp: 94.75 },
    thisMonthAvg: { totalBet: 956780340, ggr: 43560890, grc: 1845670230, players: 4398760, rtp: 94.62 }
  },
  topGames: [
    { name: 'Thunder Phoenix Rising', rank: 1, totalBetTW: 22450670, totalBetLW: 21890340, grcTW: 38760890, grcLW: 37450230, avgRank4W: 1.4 },
    { name: 'Crystal Dynasty 88', rank: 2, totalBetTW: 19870340, totalBetLW: 7230450, grcTW: 35670120, grcLW: 12340560, avgRank4W: 5.2 },
    { name: 'Aztec Treasure Quest', rank: 3, totalBetTW: 18560230, totalBetLW: 17890670, grcTW: 21340780, grcLW: 20560340, avgRank4W: 2.6 },
    { name: 'Wild Safari Express', rank: 4, totalBetTW: 17230890, totalBetLW: 16780450, grcTW: 19870560, grcLW: 19230780, avgRank4W: 3.8 },
    { name: 'Neon Blitz Deluxe', rank: 5, totalBetTW: 16450120, totalBetLW: 18230670, grcTW: 17890340, grcLW: 19560120, avgRank4W: 4.2 },
    { name: 'Dragon Emperor Gold', rank: 6, totalBetTW: 11230780, totalBetLW: 10890450, grcTW: 12560340, grcLW: 12230670, avgRank4W: 6.5 },
    { name: 'Pirate Bounty Hunter', rank: 7, totalBetTW: 10670340, totalBetLW: 11450780, grcTW: 11890230, grcLW: 12340560, avgRank4W: 6.8 },
    { name: 'Mystic Forest Wilds', rank: 8, totalBetTW: 9870560, totalBetLW: 9450230, grcTW: 10780120, grcLW: 10230890, avgRank4W: 8.2 },
    { name: 'Lucky Leprechaun Spins', rank: 9, totalBetTW: 8450230, totalBetLW: 8890670, grcTW: 9230780, grcLW: 9670120, avgRank4W: 8.8 },
    { name: 'Cosmic Cash Voyage', rank: 10, totalBetTW: 7230890, totalBetLW: 7120340, grcTW: 8120560, grcLW: 7980230, avgRank4W: 9.5 }
  ],
  drops: [
    { id: 'd1', type: 'drop', title: 'LuckyBet PL - 19.02 drop in GGR', description: 'High jackpot payout event', data: [] },
    { id: 'd2', type: 'drop', title: 'BetMaster CZ - 21.02 negative GGR', description: 'Promotional bonus abuse detected', data: [] }
  ],
  peaks: [
    { id: 'p1', type: 'peak', title: 'WinZone HU - 20.02 player spike', description: 'Marketing campaign drove 3x normal traffic', data: [] },
    { id: 'p2', type: 'peak', title: 'SpinCity AT - 22.02 weekend surge', description: 'New game launch exceeded expectations', data: [] }
  ],
  certificates: [
    { id: 'c1', name: 'BMM_ES_SlotPack_15Games', type: 'Game', jurisdictions: 'ES', issuedOn: '12.2.2025', issuedBy: 'BMM Testlabs' },
    { id: 'c2', name: '2025_eCOGRA_UK_Dragon_Emperor', type: 'Game', jurisdictions: 'UK', issuedOn: '8.2.2025', issuedBy: 'eCOGRA Ltd' }
  ],
  exclusivities: [
    { id: 'e1', name: 'BetWinner DE - Neon Blitz Deluxe', operator: 'BetWinner', startDate: '1. 3. 2025', endDate: '15. 3. 2025', category: 'Exclusivity', status: 'Approved', contact: 'Marco Bianchi (Available)' },
    { id: 'e2', name: 'JackpotCity NL - Crystal Dynasty 88', operator: 'JackpotCity', startDate: '28. 2. 2025', endDate: '14. 3. 2025', category: 'Exclusivity', status: 'Analyzed', contact: 'Sophie Van Der Berg (Busy)' }
  ],
  promotions: [
    { id: 'pr1', name: 'EuroBet IT - Thunder Phoenix Rising', operator: 'EuroBet', startDate: '15. 2. 2025', endDate: '15. 3. 2025', value: '', type: 'Free Spins Bundle', status: 'Analyzed', contact: 'Marco Bianchi (Available)' },
    { id: 'pr2', name: 'WinMaster PL - Aztec Treasure Quest', operator: 'WinMaster PL', startDate: '1. 3. 2025', endDate: '30. 4. 2025', value: '8,250.00 EUR', type: 'GGR Discount', status: 'Analyzed', contact: 'Katya Novak (Available)' }
  ],
  gameReleases: defaultReleases,
  events: [],
  importantInfo: "Annual compliance review scheduled for March. Prepare documentation for UK and Malta audits.",
  teamInfo: [
    { id: 't1', name: 'Marco Bianchi', activity: 'Conference', conferenceName: 'iGB Live Amsterdam 2025', dates: '18.02 - 21.02' },
    { id: 't2', name: 'Katya Novak', activity: 'Vacation', dates: '24.02 - 28.02' }
  ],
  spbUpdates: [
    { id: 's1', aggregator: 'Direct', casino: 'MegaWin BG', country: 'BG', status: 'Done', details: 'Jackpot Module Update' }
  ],
  integrations: [
    { id: 'i1', aggregator: 'SoftSwiss', casino: 'LuckyDays on PROD', country: 'MT', status: 'Done', details: '' },
    { id: 'i2', aggregator: 'Oryx Gaming', casino: 'BetVictor TST+PROD', country: 'UK', status: 'Done', details: '' },
    { id: 'i3', aggregator: 'iSoftBet', casino: 'Unibet DE on TST+PROD', country: 'DE', status: 'In Progress', details: '' },
    { id: 'i4', aggregator: 'Pariplay', casino: 'PokerStars on PROD', country: 'PT', status: 'Postponed', details: 'Regulatory approval pending' }
  ]
};

export const initialAppState: AppState = {
  [INITIAL_WEEK_ID]: initialData
};
