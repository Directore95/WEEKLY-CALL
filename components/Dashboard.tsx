import React from 'react';
import { WeeklyData, GameMetric } from '../types';
import { formatCurrency, formatPercent, calculateGrowth } from '../utils';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BarChart3,
  Gamepad2,
  Award,
  Calendar,
  AlertTriangle,
  Zap,
  FileCheck,
  Handshake,
  Megaphone,
  Cpu,
  UserCheck,
  Info
} from 'lucide-react';

interface DashboardProps {
  data: WeeklyData;
  isEditMode: boolean;
  onUpdate: (data: WeeklyData) => void;
}

const KPICard: React.FC<{ title: string; value: string; change: number; icon: React.ReactNode }> = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">{title}</span>
        <div className="text-blue-400">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
        <span className="text-slate-500 ml-1">vs last week</span>
      </div>
    </div>
  );
};

const GameRow: React.FC<{ game: GameMetric; index: number }> = ({ game, index }) => {
  const rankChange = game.rankShift || 0;
  return (
    <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">
            {index + 1}
          </span>
          {rankChange !== 0 && rankChange !== 99 && (
            <span className={`text-xs ${rankChange > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {rankChange > 0 ? `+${rankChange}` : rankChange}
            </span>
          )}
          {rankChange === 99 && <span className="text-xs text-amber-400">NEW</span>}
        </div>
      </td>
      <td className="py-3 px-4 font-medium">{game.name}</td>
      <td className="py-3 px-4 text-right text-slate-300">{formatCurrency(game.totalBetTW)}</td>
      <td className="py-3 px-4 text-right text-slate-300">{formatCurrency(game.grcTW)}</td>
      <td className="py-3 px-4 text-right text-slate-400">{game.avgRank4W?.toFixed(1) || '-'}</td>
    </tr>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ data, isEditMode, onUpdate }) => {
  const { kpis, topGames, drops, peaks, certificates, exclusivities, promotions, integrations, teamInfo, importantInfo } = data;

  const totalBetGrowth = calculateGrowth(kpis.thisWeek.totalBet, kpis.prevWeek.totalBet);
  const ggrGrowth = calculateGrowth(kpis.thisWeek.ggr, kpis.prevWeek.ggr);
  const grcGrowth = calculateGrowth(kpis.thisWeek.grc, kpis.prevWeek.grc);
  const playersGrowth = calculateGrowth(kpis.thisWeek.players, kpis.prevWeek.players);

  return (
    <div className="space-y-8">
      {/* KPI Summary Cards */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 size={20} className="text-blue-400" />
          Weekly KPIs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Bet"
            value={formatCurrency(kpis.thisWeek.totalBet)}
            change={totalBetGrowth}
            icon={<DollarSign size={18} />}
          />
          <KPICard
            title="GGR"
            value={formatCurrency(kpis.thisWeek.ggr)}
            change={ggrGrowth}
            icon={<TrendingUp size={18} />}
          />
          <KPICard
            title="GRC"
            value={formatCurrency(kpis.thisWeek.grc)}
            change={grcGrowth}
            icon={<BarChart3 size={18} />}
          />
          <KPICard
            title="Players"
            value={formatCurrency(kpis.thisWeek.players)}
            change={playersGrowth}
            icon={<Users size={18} />}
          />
        </div>
      </section>

      {/* Top Games Table */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Gamepad2 size={20} className="text-blue-400" />
          Top 10 Games
        </h2>
        <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-sm">
                <th className="py-3 px-4 text-left">Rank</th>
                <th className="py-3 px-4 text-left">Game</th>
                <th className="py-3 px-4 text-right">Total Bet (TW)</th>
                <th className="py-3 px-4 text-right">GRC (TW)</th>
                <th className="py-3 px-4 text-right">Avg Rank 4W</th>
              </tr>
            </thead>
            <tbody>
              {topGames.map((game, index) => (
                <GameRow key={game.name} game={game} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Drops & Peaks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-rose-400" />
            Drops
          </h2>
          <div className="space-y-3">
            {drops.map(drop => (
              <div key={drop.id} className="bg-rose-950/20 border border-rose-900/30 rounded-lg p-4">
                <h3 className="font-medium text-rose-300">{drop.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{drop.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap size={20} className="text-emerald-400" />
            Peaks
          </h2>
          <div className="space-y-3">
            {peaks.map(peak => (
              <div key={peak.id} className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-4">
                <h3 className="font-medium text-emerald-300">{peak.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{peak.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Certificates */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileCheck size={20} className="text-blue-400" />
          Certificates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map(cert => (
            <div key={cert.id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <h3 className="font-medium text-white">{cert.name}</h3>
              <div className="mt-2 text-sm text-slate-400 space-y-1">
                <p>Type: {cert.type} | Jurisdictions: {cert.jurisdictions}</p>
                <p>Issued: {cert.issuedOn} by {cert.issuedBy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Exclusivities & Promotions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Handshake size={20} className="text-amber-400" />
            Exclusivities
          </h2>
          <div className="space-y-3">
            {exclusivities.map(exc => (
              <div key={exc.id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <h3 className="font-medium text-white">{exc.name}</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {exc.operator} | {exc.startDate} - {exc.endDate}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${exc.status === 'Approved' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-amber-900/30 text-amber-400'}`}>
                    {exc.status}
                  </span>
                  <span className="text-xs text-slate-500">{exc.contact}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Megaphone size={20} className="text-purple-400" />
            Promotions
          </h2>
          <div className="space-y-3">
            {promotions.map(promo => (
              <div key={promo.id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <h3 className="font-medium text-white">{promo.name}</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {promo.operator} | {promo.type} {promo.value && `| ${promo.value}`}
                </p>
                <p className="text-xs text-slate-500 mt-1">{promo.startDate} - {promo.endDate}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Integrations */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu size={20} className="text-blue-400" />
          Integrations
        </h2>
        <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-sm">
                <th className="py-3 px-4 text-left">Aggregator</th>
                <th className="py-3 px-4 text-left">Casino</th>
                <th className="py-3 px-4 text-left">Country</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {integrations.map(int => (
                <tr key={int.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">{int.aggregator}</td>
                  <td className="py-3 px-4">{int.casino}</td>
                  <td className="py-3 px-4">{int.country}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      int.status === 'Done' ? 'bg-emerald-900/30 text-emerald-400' :
                      int.status === 'In Progress' ? 'bg-blue-900/30 text-blue-400' :
                      int.status === 'Denied' ? 'bg-rose-900/30 text-rose-400' :
                      'bg-amber-900/30 text-amber-400'
                    }`}>
                      {int.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-sm">{int.details || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Team Info */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <UserCheck size={20} className="text-blue-400" />
          Team Availability
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamInfo.map(member => (
            <div key={member.id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <h3 className="font-medium text-white">{member.name}</h3>
              <p className="text-sm text-slate-400 mt-1">
                {member.activity}{member.conferenceName && `: ${member.conferenceName}`}
              </p>
              <p className="text-xs text-slate-500 mt-1">{member.dates}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Important Info */}
      {importantInfo && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Info size={20} className="text-amber-400" />
            Important Information
          </h2>
          <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-4">
            <p className="text-slate-300">{importantInfo}</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
