import axios from 'axios';
import type { User, Level, Progress, LeaderboardEntry, SubmitResult } from '../types';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth API
export const authApi = {
  getMe: () => api.get<{ user: User }>('/auth/me').then(r => r.data),
  logout: () => api.get('/auth/logout').then(r => r.data),
  loginWithGitHub: () => {
    window.location.href = '/auth/github';
  }
};

// Levels API
export const levelsApi = {
  getAll: () => api.get<Level[]>('/levels').then(r => r.data),
  getById: (id: number) => api.get<Level>(`/levels/${id}`).then(r => r.data)
};

// Progress API
export const progressApi = {
  getAll: () => api.get<Progress[]>('/progress').then(r => r.data),
  getScore: () => api.get<{ totalScore: number; completedLevels: number; progress: Progress[] }>('/progress/score').then(r => r.data),
  submit: (levelId: number, code: string) => api.post<SubmitResult>('/progress/submit', { levelId, code }).then(r => r.data)
};

// Leaderboard API
export const leaderboardApi = {
  getAll: () => api.get<LeaderboardEntry[]>('/leaderboard').then(r => r.data),
  getRank: (userId: string) => api.get<{ rank: number } & Partial<LeaderboardEntry>>(`/leaderboard/rank/${userId}`).then(r => r.data)
};

export default api;
