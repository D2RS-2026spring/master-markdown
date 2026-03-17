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
  isStageComplete: (stageId: number) => boolean;
  isAllComplete: () => boolean;
  getStageStats: (stageId: number) => { totalLevels: number; completedLevels: number; totalScore: number; maxScore: number; levels: Level[] };
  getStageLevels: (stageId: number) => Level[];
  isLastLevelInStage: (levelId: number) => boolean;
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
  },

  isStageComplete: (stageId: number) => {
    const { levels, progress } = get();
    const completedLevelIds = new Set(progress.map(p => p.levelId));
    const stageLevels = levels.filter(l => l.stage === stageId);
    if (stageLevels.length === 0) return false;
    return stageLevels.every(l => completedLevelIds.has(l.id));
  },

  isAllComplete: () => {
    const { levels, progress } = get();
    if (levels.length === 0) return false;
    const completedLevelIds = new Set(progress.map(p => p.levelId));
    return levels.every(l => completedLevelIds.has(l.id));
  },

  getStageStats: (stageId: number) => {
    const { levels, progress } = get();
    const stageLevels = levels.filter(l => l.stage === stageId);
    const completedLevelIds = new Set(progress.map(p => p.levelId));
    const completedInStage = stageLevels.filter(l => completedLevelIds.has(l.id));
    const totalScore = completedInStage.reduce((sum, l) => {
      const p = progress.find(p => p.levelId === l.id);
      return sum + (p?.score || 0);
    }, 0);
    const maxScore = stageLevels.reduce((sum, l) => sum + l.maxScore, 0);
    return {
      totalLevels: stageLevels.length,
      completedLevels: completedInStage.length,
      totalScore,
      maxScore,
      levels: stageLevels,
    };
  },

  getStageLevels: (stageId: number) => {
    return get().levels.filter(l => l.stage === stageId);
  },

  isLastLevelInStage: (levelId: number) => {
    const { levels } = get();
    const level = levels.find(l => l.id === levelId);
    if (!level) return false;
    const stageLevels = levels.filter(l => l.stage === level.stage);
    const maxOrder = Math.max(...stageLevels.map(l => l.order));
    return level.order === maxOrder;
  },
}));
