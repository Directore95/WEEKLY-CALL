
export interface KPIValues {
  totalBet: number;
  ggr: number;
  grc: number;
  players: number;
  rtp: number;
}

export interface KPIRow {
  prevWeek: KPIValues;
  thisWeek: KPIValues;
  prevWeekend: KPIValues;
  thisWeekend: KPIValues;
  prevMonthAvg: KPIValues;
  thisMonthAvg: KPIValues;
}

export interface GameMetric {
  name: string;
  rank: number; // Current rank (1-10)
  rankShift?: number; // Calculated: Gained/Lost positions
  totalBetTW: number; // This Week
  totalBetLW: number; // Last Week (from archive)
  grcTW: number;      // This Week
  grcLW: number;      // Last Week (from archive)
  avgRank4W?: number; // Calculated: 4-week moving average rank
}

export interface DropPeak {
  id: string;
  type: 'drop' | 'peak';
  title: string;
  description: string;
  data: any[];
}

export interface Certificate {
  id: string;
  name: string;
  type: string;
  jurisdictions: string;
  issuedOn: string;
  issuedBy: string;
}

export interface Exclusivity {
  id: string;
  name: string;
  operator: string;
  startDate: string;
  endDate: string;
  category: string;
  status: string;
  contact: string;
}

export interface Promotion {
  id: string;
  name: string;
  operator: string;
  startDate: string;
  endDate: string;
  value?: string;
  type: string;
  status: string;
  contact: string;
}

export interface Integration {
  id: string;
  aggregator: string;
  casino: string;
  country: string;
  status: 'Done' | 'In Progress' | 'Denied' | 'Postponed';
  details: string;
}

export interface TeamMember {
  id: string;
  name: string;
  activity: 'Vacation' | 'Conference' | 'Other';
  conferenceName?: string;
  dates: string;
}

export interface GameRelease {
  id: string;
  name: string;
  date: string;
  features: string;
}

export interface WeeklyData {
  weekId: string;
  kpis: KPIRow;
  topGames: GameMetric[];
  drops: DropPeak[];
  peaks: DropPeak[];
  certificates: Certificate[];
  gameReleases: GameRelease[]; // 6 slots: 2 per month
  exclusivities: Exclusivity[];
  promotions: Promotion[];
  events: any[];
  importantInfo: string;
  teamInfo: TeamMember[];
  spbUpdates: Integration[];
  integrations: Integration[];
}

export type AppState = Record<string, WeeklyData>;
