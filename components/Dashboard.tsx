import React from 'react';
import { WeeklyData, GameMetric, KPIValues } from '../types';
import { formatCurrency, formatPercent, calculateGrowth } from '../utils';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BarChart3,
  Gamepad2,
  AlertTriangle,
  Zap,
  FileCheck,
  Handshake,
  Megaphone,
  Cpu,
  UserCheck,
  Info,
  Calendar,
  Plus,
  Trash2
} from 'lucide-react';

interface DashboardProps {
  data: WeeklyData;
  isEditMode: boolean;
  onUpdate: (data: WeeklyData) => void;
}

// Editable input component
const EditableField: React.FC<{
  value: string | number;
  onChange: (value: string) => void;
  isEditMode: boolean;
  type?: 'text' | 'number' | 'textarea';
  className?: string;
  placeholder?: string;
}> = ({ value, onChange, isEditMode, type = 'text', className = '', placeholder = '' }) => {
  if (!isEditMode) {
    return <span className={className}>{value}</span>;
  }

  if (type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white w-full ${className}`}
        placeholder={placeholder}
      />
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white ${className}`}
      placeholder={placeholder}
    />
  );
};

// KPI Card with edit support
const KPICard: React.FC<{
  title: string;
  value: number;
  prevValue: number;
  icon: React.ReactNode;
  isEditMode: boolean;
  onChange: (value: number) => void;
}> = ({ title, value, prevValue, icon, isEditMode, onChange }) => {
  const change = calculateGrowth(value, prevValue);
  const isPositive = change >= 0;

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">{title}</span>
        <div className="text-blue-400">{icon}</div>
      </div>
      {isEditMode ? (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="text-2xl font-bold text-white mb-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 w-full"
        />
      ) : (
        <div className="text-2xl font-bold text-white mb-1">{formatCurrency(value)}</div>
      )}
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
        <span className="text-slate-500 ml-1">vs last week</span>
      </div>
    </div>
  );
};

// Game Row with edit support
const GameRow: React.FC<{
  game: GameMetric;
  index: number;
  isEditMode: boolean;
  onUpdate: (game: GameMetric) => void;
  onDelete: () => void;
}> = ({ game, index, isEditMode, onUpdate, onDelete }) => {
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
      <td className="py-3 px-4">
        {isEditMode ? (
          <input
            type="text"
            value={game.name}
            onChange={(e) => onUpdate({ ...game, name: e.target.value })}
            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white w-full"
          />
        ) : (
          <span className="font-medium">{game.name}</span>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        {isEditMode ? (
          <input
            type="number"
            value={game.totalBetTW}
            onChange={(e) => onUpdate({ ...game, totalBetTW: parseFloat(e.target.value) || 0 })}
            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white w-24 text-right"
          />
        ) : (
          <span className="text-slate-300">{formatCurrency(game.totalBetTW)}</span>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        {isEditMode ? (
          <input
            type="number"
            value={game.grcTW}
            onChange={(e) => onUpdate({ ...game, grcTW: parseFloat(e.target.value) || 0 })}
            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white w-24 text-right"
          />
        ) : (
          <span className="text-slate-300">{formatCurrency(game.grcTW)}</span>
        )}
      </td>
      <td className="py-3 px-4 text-right text-slate-400">{game.avgRank4W?.toFixed(1) || '-'}</td>
      {isEditMode && (
        <td className="py-3 px-4">
          <button onClick={onDelete} className="text-rose-400 hover:text-rose-300">
            <Trash2 size={16} />
          </button>
        </td>
      )}
    </tr>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ data, isEditMode, onUpdate }) => {
  const { kpis, topGames, drops, peaks, certificates, exclusivities, promotions, integrations, teamInfo, importantInfo, gameReleases } = data;

  // Helper to update nested data
  const updateKPI = (period: 'thisWeek' | 'thisWeekend', field: keyof KPIValues, value: number) => {
    onUpdate({
      ...data,
      kpis: {
        ...data.kpis,
        [period]: { ...data.kpis[period], [field]: value }
      }
    });
  };

  const updateGame = (index: number, game: GameMetric) => {
    const newGames = [...topGames];
    newGames[index] = game;
    onUpdate({ ...data, topGames: newGames });
  };

  const deleteGame = (index: number) => {
    const newGames = topGames.filter((_, i) => i !== index);
    onUpdate({ ...data, topGames: newGames });
  };

  const addGame = () => {
    const newGame: GameMetric = {
      name: 'New Game',
      rank: topGames.length + 1,
      totalBetTW: 0,
      totalBetLW: 0,
      grcTW: 0,
      grcLW: 0
    };
    onUpdate({ ...data, topGames: [...topGames, newGame] });
  };

  const updateDrop = (index: number, field: string, value: string) => {
    const newDrops = [...drops];
    newDrops[index] = { ...newDrops[index], [field]: value };
    onUpdate({ ...data, drops: newDrops });
  };

  const updatePeak = (index: number, field: string, value: string) => {
    const newPeaks = [...peaks];
    newPeaks[index] = { ...newPeaks[index], [field]: value };
    onUpdate({ ...data, peaks: newPeaks });
  };

  const updateCertificate = (index: number, field: string, value: string) => {
    const newCerts = [...certificates];
    newCerts[index] = { ...newCerts[index], [field]: value };
    onUpdate({ ...data, certificates: newCerts });
  };

  const updateExclusivity = (index: number, field: string, value: string) => {
    const newExc = [...exclusivities];
    newExc[index] = { ...newExc[index], [field]: value };
    onUpdate({ ...data, exclusivities: newExc });
  };

  const updatePromotion = (index: number, field: string, value: string) => {
    const newPromos = [...promotions];
    newPromos[index] = { ...newPromos[index], [field]: value };
    onUpdate({ ...data, promotions: newPromos });
  };

  const updateIntegration = (index: number, field: string, value: string) => {
    const newInt = [...integrations];
    newInt[index] = { ...newInt[index], [field]: value };
    onUpdate({ ...data, integrations: newInt });
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const newTeam = [...teamInfo];
    newTeam[index] = { ...newTeam[index], [field]: value };
    onUpdate({ ...data, teamInfo: newTeam });
  };

  const updateImportantInfo = (value: string) => {
    onUpdate({ ...data, importantInfo: value });
  };

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
            value={kpis.thisWeek.totalBet}
            prevValue={kpis.prevWeek.totalBet}
            icon={<DollarSign size={18} />}
            isEditMode={isEditMode}
            onChange={(v) => updateKPI('thisWeek', 'totalBet', v)}
          />
          <KPICard
            title="GGR"
            value={kpis.thisWeek.ggr}
            prevValue={kpis.prevWeek.ggr}
            icon={<TrendingUp size={18} />}
            isEditMode={isEditMode}
            onChange={(v) => updateKPI('thisWeek', 'ggr', v)}
          />
          <KPICard
            title="GRC"
            value={kpis.thisWeek.grc}
            prevValue={kpis.prevWeek.grc}
            icon={<BarChart3 size={18} />}
            isEditMode={isEditMode}
            onChange={(v) => updateKPI('thisWeek', 'grc', v)}
          />
          <KPICard
            title="Players"
            value={kpis.thisWeek.players}
            prevValue={kpis.prevWeek.players}
            icon={<Users size={18} />}
            isEditMode={isEditMode}
            onChange={(v) => updateKPI('thisWeek', 'players', v)}
          />
        </div>
      </section>

      {/* Top Games Table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Gamepad2 size={20} className="text-blue-400" />
            Top 10 Games
          </h2>
          {isEditMode && (
            <button onClick={addGame} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm">
              <Plus size={16} /> Add Game
            </button>
          )}
        </div>
        <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-sm">
                <th className="py-3 px-4 text-left">Rank</th>
                <th className="py-3 px-4 text-left">Game</th>
                <th className="py-3 px-4 text-right">Total Bet (TW)</th>
                <th className="py-3 px-4 text-right">GRC (TW)</th>
                <th className="py-3 px-4 text-right">Avg Rank 4W</th>
                {isEditMode && <th className="py-3 px-4"></th>}
              </tr>
            </thead>
            <tbody>
              {topGames.map((game, index) => (
                <GameRow
                  key={game.name + index}
                  game={game}
                  index={index}
                  isEditMode={isEditMode}
                  onUpdate={(g) => updateGame(index, g)}
                  onDelete={() => deleteGame(index)}
                />
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
            {drops.map((drop, index) => (
              <div key={drop.id} className="bg-rose-950/20 border border-rose-900/30 rounded-lg p-4">
                {isEditMode ? (
                  <>
                    <input
                      type="text"
                      value={drop.title}
                      onChange={(e) => updateDrop(index, 'title', e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-rose-300 w-full mb-2 font-medium"
                    />
                    <textarea
                      value={drop.description}
                      onChange={(e) => updateDrop(index, 'description', e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400 w-full text-sm"
                    />
                  </>
                ) : (
                  <>
                    <h3 className="font-medium text-rose-300">{drop.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{drop.description}</p>
                  </>
                )}
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
            {peaks.map((peak, index) => (
              <div key={peak.id} className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-4">
                {isEditMode ? (
                  <>
                    <input
                      type="text"
                      value={peak.title}
                      onChange={(e) => updatePeak(index, 'title', e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-emerald-300 w-full mb-2 font-medium"
                    />
                    <textarea
                      value={peak.description}
                      onChange={(e) => updatePeak(index, 'description', e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400 w-full text-sm"
                    />
                  </>
                ) : (
                  <>
                    <h3 className="font-medium text-emerald-300">{peak.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{peak.description}</p>
                  </>
                )}
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
          {certificates.map((cert, index) => (
            <div key={cert.id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              {isEditMode ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertificate(index, 'name', e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white w-full font-medium"
                    placeholder="Certificate Name"
                  />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <input
                      type="text"
                      value={cert.type}
                      onChange={(e) => updateCertificate(index, 'type', e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400"
                      placeholder="Type"
                    />
                    <input
                      type="text"
                      value={cert.jurisdictions}
                      onChange={(e) => updateCertificate(index, 'jurisdictions', e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400"
                      placeholder="Jurisdictions"
                    />
                    <input
                      type="text"
                      value={cert.issuedOn}
                      onChange={(e) => updateCertificate(index, 'issuedOn', e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400"
                      placeholder="Issued On"
                    />
                    <input
                      type="text"
                      value={cert.issuedBy}
                      onChange={(e) => updateCertificate(index, 'issuedBy', e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400"
                      placeholder="Issued By"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-medium text-white">{cert.name}</h3>
                  <div className="mt-2 text-sm text-slate-400 space-y-1">
                    <p>Type: {cert.type} | Jurisdictions: {cert.jurisdictions}</p>
                    <p>Issued: {cert.issuedOn} by {cert.issuedBy}</p>
                  </div>
                </>
              )}
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
            {exclusivities.map((exc, index) => (
              <div key={exc.id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={exc.name}
                      onChange={(e) => updateExclusivity(index, 'name', e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white w-full font-medium"
                    />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <input
                        type="text"
                        value={exc.operator}
                        onChange={(e) => updateExclusivity(index, 'operator', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400"
                        placeholder="Operator"
                      />
                      <input
                        type="text"
                        value={exc.status}
                        onChange={(e) => updateExclusivity(index, 'status', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400"
                        placeholder="Status"
                      />
                      <input
                        type="text"
                        value={exc.startDate}
                        onChange={(e) => updateExclusivity(index, 'startDate', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400"
                        placeholder="Start Date"
                      />
                      <input
                        type="text"
                        value={exc.endDate}
                        onChange={(e) => updateExclusivity(index, 'endDate', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400"
                        placeholder="End Date"
                      />
                    </div>
                    <input
                      type="text"
                      value={exc.contact}
                      onChange={(e) => updateExclusivity(index, 'contact', e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400 w-full text-sm"
                      placeholder="Contact"
                    />
                  </div>
                ) : (
                  <>
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
                  </>
                )}
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
            {promotions.map((promo, index) => (
              <div key={promo.id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={promo.name}
                      onChange={(e) => updatePromotion(index, 'name', e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white w-full font-medium"
                    />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <input
                        type="text"
                        value={promo.operator}
                        onChange={(e) => updatePromotion(index, 'operator', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400"
                        placeholder="Operator"
                      />
                      <input
                        type="text"
                        value={promo.type}
                        onChange={(e) => updatePromotion(index, 'type', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400"
                        placeholder="Type"
                      />
                      <input
                        type="text"
                        value={promo.startDate}
                        onChange={(e) => updatePromotion(index, 'startDate', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400"
                        placeholder="Start Date"
                      />
                      <input
                        type="text"
                        value={promo.endDate}
                        onChange={(e) => updatePromotion(index, 'endDate', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400"
                        placeholder="End Date"
                      />
                    </div>
                    <input
                      type="text"
                      value={promo.value || ''}
                      onChange={(e) => updatePromotion(index, 'value', e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400 w-full text-sm"
                      placeholder="Value (optional)"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="font-medium text-white">{promo.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {promo.operator} | {promo.type} {promo.value && `| ${promo.value}`}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{promo.startDate} - {promo.endDate}</p>
                  </>
                )}
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
              {integrations.map((int, index) => (
                <tr key={int.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={int.aggregator}
                        onChange={(e) => updateIntegration(index, 'aggregator', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white w-full"
                      />
                    ) : int.aggregator}
                  </td>
                  <td className="py-3 px-4">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={int.casino}
                        onChange={(e) => updateIntegration(index, 'casino', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white w-full"
                      />
                    ) : int.casino}
                  </td>
                  <td className="py-3 px-4">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={int.country}
                        onChange={(e) => updateIntegration(index, 'country', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white w-20"
                      />
                    ) : int.country}
                  </td>
                  <td className="py-3 px-4">
                    {isEditMode ? (
                      <select
                        value={int.status}
                        onChange={(e) => updateIntegration(index, 'status', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white"
                      >
                        <option value="Done">Done</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Postponed">Postponed</option>
                        <option value="Denied">Denied</option>
                      </select>
                    ) : (
                      <span className={`text-xs px-2 py-1 rounded ${
                        int.status === 'Done' ? 'bg-emerald-900/30 text-emerald-400' :
                        int.status === 'In Progress' ? 'bg-blue-900/30 text-blue-400' :
                        int.status === 'Denied' ? 'bg-rose-900/30 text-rose-400' :
                        'bg-amber-900/30 text-amber-400'
                      }`}>
                        {int.status}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={int.details}
                        onChange={(e) => updateIntegration(index, 'details', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400 w-full text-sm"
                      />
                    ) : (
                      <span className="text-slate-400 text-sm">{int.details || '-'}</span>
                    )}
                  </td>
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
          {teamInfo.map((member, index) => (
            <div key={member.id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              {isEditMode ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white w-full font-medium"
                  />
                  <select
                    value={member.activity}
                    onChange={(e) => updateTeamMember(index, 'activity', e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400 w-full text-sm"
                  >
                    <option value="Vacation">Vacation</option>
                    <option value="Conference">Conference</option>
                    <option value="Other">Other</option>
                  </select>
                  {member.activity === 'Conference' && (
                    <input
                      type="text"
                      value={member.conferenceName || ''}
                      onChange={(e) => updateTeamMember(index, 'conferenceName', e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400 w-full text-sm"
                      placeholder="Conference Name"
                    />
                  )}
                  <input
                    type="text"
                    value={member.dates}
                    onChange={(e) => updateTeamMember(index, 'dates', e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-400 w-full text-sm"
                    placeholder="Dates"
                  />
                </div>
              ) : (
                <>
                  <h3 className="font-medium text-white">{member.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {member.activity}{member.conferenceName && `: ${member.conferenceName}`}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{member.dates}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Important Info */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Info size={20} className="text-amber-400" />
          Important Information
        </h2>
        <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-4">
          {isEditMode ? (
            <textarea
              value={importantInfo}
              onChange={(e) => updateImportantInfo(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-300 w-full min-h-[100px]"
              placeholder="Enter important information..."
            />
          ) : (
            <p className="text-slate-300">{importantInfo || 'No important information for this week.'}</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
