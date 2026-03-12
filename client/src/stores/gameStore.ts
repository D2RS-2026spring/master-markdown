import { create } from 'zustand';
import type { Level, Progress } from '../types';
import { levelsApi, progressApi } from '../api/client';

interface GameState {
  levels: Level[];
  progress: Progress[];
  totalScore: number;
  completedLevels: number;
  isLoading: boolean;
  error: string | null;
  fetchLevels: () => Promise<void>;
  fetchProgress: () => Promise<void>;
  submitAnswer: (levelId: number, code: string) => Promise<{ correct: boolean; score?: number; message?: string }>;
  getLevelStatus: (levelId: number) => { completed: boolean; score: number; attempts: number };
  getCurrentStage: () => number;
}

export const useGameStore = create<GameState>((set, get) => ({
  levels: [],
  progress: [],
  totalScore: 0,
  completedLevels: 0,
  isLoading: false,
  error: null,

  fetchLevels: async () => {
    try {
      set({ isLoading: true, error: null });
      const levels = await levelsApi.getAll();
      set({ levels, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load levels', isLoading: false });
    }
  },

  fetchProgress: async () => {
    try {
      const [progressData, scoreData] = await Promise.all([
        progressApi.getAll(),
        progressApi.getScore()
      ]);
      set({
        progress: progressData,
        totalScore: scoreData.totalScore,
        completedLevels: scoreData.completedLevels
      });
    } catch (error) {
      set({ error: 'Failed to load progress' });
    }
  },

  submitAnswer: async (levelId: number, code: string) => {
    try {
      const result = await progressApi.submit(levelId, code);
      if (result.correct && result.progress) {
        await get().fetchProgress();
      }
      return {
        correct: result.correct,
        score: result.score,
        message: result.message
      };
    } catch (error) {
      return { correct: false, message: '提交失败，请重试' };
    }
  },

  getLevelStatus: (levelId: number) => {
    const progress = get().progress.find(p => p.levelId === levelId);
    return {
      completed: !!progress,
      score: progress?.score || 0,
      attempts: progress?.attempts || 0
    };
  },

  getCurrentStage: () => {
    const { progress, levels } = get();
    if (progress.length === 0) return 1;

    const completedLevelIds = new Set(progress.map(p => p.levelId));
    const stages = [...new Set(levels.map(l => l.stage))].sort((a, b) => a - b);

    for (const stage of stages) {
      const stageLevels = levels.filter(l => l.stage === stage);
      const completedInStage = stageLevels.filter(l => completedLevelIds.has(l.id)).length;
      if (completedInStage < stageLevels.length) {
        return stage;
      }
    }

    return stages[stages.length - 1] || 1;
  }
}));
