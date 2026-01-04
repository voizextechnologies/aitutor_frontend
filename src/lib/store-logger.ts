/**
 * Logger Store
 * Zustand store for managing application logs
 */

import { create } from 'zustand';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
}

interface LoggerStore {
  logs: LogEntry[];
  addLog: (level: LogEntry['level'], message: string, data?: any) => void;
  clearLogs: () => void;
  getLogsByLevel: (level: LogEntry['level']) => LogEntry[];
  log: (message: string, data?: any) => void;
}

export const useLoggerStore = create<LoggerStore>((set, get) => ({
  logs: [],

  addLog: (level, message, data) => {
    const logEntry: LogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      level,
      message,
      data,
    };

    set((state) => ({
      logs: [...state.logs, logEntry],
    }));

    if (level === 'error') {
      console.error(message, data);
    } else if (level === 'warn') {
      console.warn(message, data);
    } else if (level === 'debug') {
      console.debug(message, data);
    } else {
      console.log(message, data);
    }
  },

  clearLogs: () => set({ logs: [] }),

  getLogsByLevel: (level) => {
    return get().logs.filter((log) => log.level === level);
  },

  log: (message, data) => {
    get().addLog('info', message, data);
  },
}));
