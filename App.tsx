
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { initialAppState, initialData } from './mockData';
import { WeeklyData, AppState, KPIValues, GameMetric } from './types';
import { 
  getWeekId, 
  getMostRecentThursday, 
  getWeekIdOffset, 
  isFileSystemSupported, 
  readWorkspaceFiles, 
  writeToFile,
  readFilesFromList
} from './utils';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { 
  Layout, 
  Calendar, 
  Save, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  FolderOpen, 
  RefreshCw, 
  AlertCircle,
  LogOut,
  Download,
  X,
  Upload
} from 'lucide-react';

const STORAGE_KEY = 'gaming_dashboard_archive';
const AUTH_KEY = 'gaming_dashboard_auth';
const SECRET_PASSWORD = 'GAMING-SECURE';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });

  const [data, setData] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialAppState;
  });

  const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [selectedWeekId, setSelectedWeekId] = useState<string>(() => {
    return getWeekId(getMostRecentThursday(new Date()));
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showPickerError, setShowPickerError] = useState(false);
  const [dismissedError, setDismissedError] = useState(false);
  
  const folderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const handleLogin = (password: string) => {
    // Robust comparison with trim to prevent failures from trailing spaces
    if (password && password.trim() === SECRET_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_KEY);
  };

  const enrichWeekData = useCallback((weekData: WeeklyData, archive: AppState): WeeklyData => {
    const prevWeekId = getWeekIdOffset(weekData.weekId, -1);
    const prevWeek = archive[prevWeekId];

    const enrichedKpis = {
      ...weekData.kpis,
      prevWeek: prevWeek ? prevWeek.kpis.thisWeek : weekData.kpis.prevWeek,
    };

    const enrichedTopGames = weekData.topGames.map((game, index) => {
      const currentRank = index + 1;
      let rankShift = 0;
      let totalBetLW = game.totalBetLW;
      let grcLW = game.grcLW;
      let isNewEntry = false;

      if (prevWeek) {
        const prevGameIndex = prevWeek.topGames.findIndex(g => g.name === game.name);
        if (prevGameIndex !== -1) {
          const prevRank = prevGameIndex + 1;
          rankShift = prevRank - currentRank;
          totalBetLW = prevWeek.topGames[prevGameIndex].totalBetTW;
          grcLW = prevWeek.topGames[prevGameIndex].grcTW;
        } else {
          rankShift = 99;
          isNewEntry = true;
        }
      }

      let avgRank4W: number | undefined = undefined;
      if (!isNewEntry) {
        const historicalRanks: number[] = [currentRank];
        for (let i = 1; i <= 3; i++) {
          const histId = getWeekIdOffset(weekData.weekId, -i);
          const histWeek = archive[histId];
          if (histWeek) {
            const histIdx = histWeek.topGames.findIndex(g => g.name === game.name);
            historicalRanks.push(histIdx !== -1 ? histIdx + 1 : 11);
          }
        }
        avgRank4W = historicalRanks.reduce((a, b) => a + b, 0) / historicalRanks.length;
      }

      return {
        ...game,
        rank: currentRank,
        rankShift,
        totalBetLW,
        grcLW,
        avgRank4W
      };
    });

    return {
      ...weekData,
      kpis: enrichedKpis,
      topGames: enrichedTopGames
    };
  }, []);

  const handleConnectWorkspace = async () => {
    if (!isFileSystemSupported()) {
      folderInputRef.current?.click();
      return;
    }
    try {
      const handle = await (window as any).showDirectoryPicker();
      setDirHandle(handle);
      setIsSyncing(true);
      const workspaceData = await readWorkspaceFiles(handle);
      if (Object.keys(workspaceData).length > 0) {
        setData(prev => ({ ...prev, ...workspaceData }));
      }
      setShowPickerError(false);
      setDismissedError(false);
      setIsSyncing(false);
    } catch (err: any) {
      setShowPickerError(true);
      setDismissedError(false);
      setTimeout(() => folderInputRef.current?.click(), 100);
    }
  };

  const handleFolderInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsSyncing(true);
    const workspaceData = await readFilesFromList(files);
    if (Object.keys(workspaceData).length > 0) {
      setData(prev => ({ ...prev, ...workspaceData }));
      setShowPickerError(false); 
    }
    setIsSyncing(false);
  };

  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const workspaceData = await readFilesFromList(files);
    setData(prev => ({ ...prev, ...workspaceData }));
  };

  const syncWorkspace = async () => {
    if (!dirHandle) {
      folderInputRef.current?.click();
      return;
    }
    setIsSyncing(true);
    try {
      const workspaceData = await readWorkspaceFiles(dirHandle);
      setData(prev => ({ ...prev, ...workspaceData }));
    } catch (e) {
      console.error("Sync failed", e);
    }
    setIsSyncing(false);
  };

  const downloadWeekJson = () => {
    const currentWeekData = data[selectedWeekId];
    if (!currentWeekData) return;
    const blob = new Blob([JSON.stringify(currentWeekData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedWeekId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveToLocalFile = async () => {
    if (!dirHandle) {
      downloadWeekJson();
      return;
    }
    const currentWeekData = data[selectedWeekId];
    if (!currentWeekData) return;
    const fileName = `${selectedWeekId}.json`;
    await writeToFile(dirHandle, fileName, JSON.stringify(currentWeekData, null, 2));
  };

  const getAverageForRange = useCallback((targetWeekId: string, rangeSize: number, offset: number = 0): KPIValues => {
    const metrics: (keyof KPIValues)[] = ['totalBet', 'ggr', 'grc', 'players', 'rtp'];
    const sums: KPIValues = { totalBet: 0, ggr: 0, grc: 0, players: 0, rtp: 0 };
    let count = 0;
    for (let i = 0; i < rangeSize; i++) {
      const weekId = getWeekIdOffset(targetWeekId, -(i + offset));
      const weekData = data[weekId];
      if (weekData) {
        metrics.forEach(m => sums[m] += weekData.kpis.thisWeek[m]);
        count++;
      }
    }
    if (count === 0) return sums;
    metrics.forEach(m => sums[m] = sums[m] / count);
    return sums;
  }, [data]);

  const weekData = useMemo(() => {
    const base = data[selectedWeekId];
    if (!base) return null;
    return enrichWeekData(base, data);
  }, [selectedWeekId, data, enrichWeekData]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!data[selectedWeekId]) {
      const allWeekIds = Object.keys(data).sort();
      const lastAvailableId = allWeekIds[allWeekIds.length - 1] || initialData.weekId;
      const template = JSON.parse(JSON.stringify(data[lastAvailableId] || initialData));
      
      const newWeek: WeeklyData = {
        ...template,
        weekId: selectedWeekId,
        kpis: {
          ...template.kpis,
          thisWeek: { totalBet: 0, ggr: 0, grc: 0, players: 0, rtp: 0 },
          thisWeekend: { totalBet: 0, ggr: 0, grc: 0, players: 0, rtp: 0 },
        },
        gameReleases: Array.from({ length: 6 }, (_, i) => ({ id: `rel-${i}`, name: '', date: '', features: '' }))
      };
      setData(prev => ({ ...prev, [selectedWeekId]: newWeek }));
    } else {
      const currentData = data[selectedWeekId];
      const thisMonthAvg = getAverageForRange(selectedWeekId, 4, 0);
      const prevMonthAvg = getAverageForRange(selectedWeekId, 4, 1);
      const hasChanged = JSON.stringify(currentData.kpis.thisMonthAvg) !== JSON.stringify(thisMonthAvg) ||
                         JSON.stringify(currentData.kpis.prevMonthAvg) !== JSON.stringify(prevMonthAvg);

      if (hasChanged) {
        setData(prev => ({
          ...prev,
          [selectedWeekId]: {
            ...prev[selectedWeekId],
            kpis: { ...prev[selectedWeekId].kpis, thisMonthAvg, prevMonthAvg }
          }
        }));
      }
    }
  }, [selectedWeekId, data, getAverageForRange, isAuthenticated]);

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  const handleUpdateData = (updatedWeekData: WeeklyData) => {
    setData(prev => ({ ...prev, [selectedWeekId]: updatedWeekData }));
  };

  const handleFinishEditing = async () => {
    setIsEditMode(false);
    await saveToLocalFile();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <input type="file" ref={folderInputRef} className="hidden" multiple onChange={handleFolderInput} webkitdirectory="true" directory="true" />
      <input type="file" ref={fileInputRef} className="hidden" multiple accept=".json" onChange={handleUploadFiles} />

      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Layout className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Gaming Performance Dashboard
          </h1>
          <div className="ml-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-xs font-mono uppercase">
              {selectedWeekId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800 rounded-lg p-1">
            <button onClick={() => setSelectedWeekId(getWeekIdOffset(selectedWeekId, -1))} className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-400">
              <ChevronLeft size={18} />
            </button>
            <div className="px-3 flex items-center gap-2 text-sm font-medium">
              <Calendar size={14} className="text-blue-500" />
              <span className="hidden lg:inline">Archive</span>
            </div>
            <button onClick={() => setSelectedWeekId(getWeekIdOffset(selectedWeekId, 1))} className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-400">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="h-8 w-[1px] bg-slate-700 mx-1" />

          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <Upload size={18} />
            <span className="hidden sm:inline">Upload JSON</span>
          </button>

          <button onClick={dirHandle ? syncWorkspace : handleConnectWorkspace} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${dirHandle ? 'text-slate-400 hover:text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
            {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : (dirHandle ? <RefreshCw size={18} /> : <FolderOpen size={18} />)}
            <span className="hidden sm:inline">{dirHandle ? "Sync" : "Folder"}</span>
          </button>

          <button onClick={downloadWeekJson} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700">
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button onClick={() => isEditMode ? handleFinishEditing() : setIsEditMode(true)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isEditMode ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'}`}>
            {isEditMode ? <Save size={18} /> : <Edit3 size={18} />}
            {isEditMode ? 'Finish' : 'Edit Week'}
          </button>

          <div className="h-8 w-[1px] bg-slate-700 mx-1" />
          <button onClick={handleLogout} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-all" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-10 max-w-[1800px] mx-auto w-full">
        {showPickerError && !dirHandle && !dismissedError && (
           <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start justify-between gap-4 animate-in fade-in slide-in-from-top-4">
             <div className="flex items-start gap-4">
               <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={20} />
               <div className="text-sm">
                 <p className="font-bold text-blue-400 italic">Notice: Local Session Mode</p>
                 <p className="text-slate-400 mt-1">
                   Direct folder sync is restricted. Use <span className="text-white font-medium">Upload JSON</span> to load archive files, or <span className="text-white font-medium">Export</span> to save your current work locally.
                 </p>
               </div>
             </div>
             <button onClick={() => setDismissedError(true)} className="text-slate-500 hover:text-white p-1">
               <X size={16} />
             </button>
           </div>
        )}
        {weekData && <Dashboard data={weekData} isEditMode={isEditMode} onUpdate={handleUpdateData} />}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 p-6 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Gaming KPI Solutions • {Object.keys(data).length} weeks in archive.
      </footer>
    </div>
  );
};

export default App;
