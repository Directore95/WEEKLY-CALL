
/**
 * Calculates the most recent Thursday for a given date.
 */
export const getMostRecentThursday = (date: Date): Date => {
  const d = new Date(date);
  const currentDay = d.getDay();
  const daysToThursday = (currentDay + 7 - 4) % 7;
  d.setDate(d.getDate() - daysToThursday);
  return d;
};

export const getWeekId = (date: Date): string => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
};

export const getWeekIdOffset = (weekId: string, offsetWeeks: number): string => {
  const [year, weekPart] = weekId.split('-W');
  const weekNum = parseInt(weekPart);
  const d = new Date(parseInt(year), 0, 1 + (weekNum - 1) * 7);
  const thursday = getMostRecentThursday(d);
  thursday.setDate(thursday.getDate() + (offsetWeeks * 7));
  return getWeekId(thursday);
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(val);
};

export const formatPercent = (val: number) => {
  return (val || 0).toFixed(2) + '%';
};

export const calculateGrowth = (current: number, previous: number) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

// --- File System Access API Helpers ---

/**
 * Checks if the browser supports the File System Access API.
 */
export const isFileSystemSupported = () => {
  return 'showDirectoryPicker' in window;
};

/**
 * Writes content to a specific file within a directory handle.
 */
export const writeToFile = async (dirHandle: FileSystemDirectoryHandle, fileName: string, content: string) => {
  try {
    const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    return true;
  } catch (err) {
    console.error('Error writing to local file:', err);
    return false;
  }
};

/**
 * Reads all JSON files from a directory and returns them as an AppState object.
 */
export const readWorkspaceFiles = async (dirHandle: FileSystemDirectoryHandle): Promise<Record<string, any>> => {
  const archive: Record<string, any> = {};
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file' && entry.name.endsWith('.json')) {
      const file = await (entry as FileSystemFileHandle).getFile();
      const content = await file.text();
      try {
        const data = JSON.parse(content);
        if (data.weekId) {
          archive[data.weekId] = data;
        }
      } catch (e) {
        console.warn(`Could not parse ${entry.name}, skipping.`);
      }
    }
  }
  return archive;
};

/**
 * Fallback: Reads data from a standard FileList (used when showDirectoryPicker is blocked)
 */
export const readFilesFromList = async (files: FileList): Promise<Record<string, any>> => {
  const archive: Record<string, any> = {};
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.name.endsWith('.json')) {
      const content = await file.text();
      try {
        const data = JSON.parse(content);
        if (data.weekId) {
          archive[data.weekId] = data;
        }
      } catch (e) {
        console.warn(`Could not parse ${file.name}, skipping.`);
      }
    }
  }
  return archive;
};
