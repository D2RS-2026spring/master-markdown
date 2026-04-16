import axios from 'axios';
import type { User, Level, Progress, LeaderboardEntry, SubmitResult } from '../types';

const resolveApiBase = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return '/api';
  }

  return 'https://api.bio-spring.top/api';
};

export const API_BASE_URL = resolveApiBase();
export const AUTH_GITHUB_URL = `${API_BASE_URL}/auth/github`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const userApi = {
  getMe: () => api.get<{ user: User }>('/user/me').then((r) => r.data),
  setNickname: (nickname: string) => api.post<{ user: User }>('/user/nickname', { nickname }).then((r) => r.data),
};

// Auth API
export const authApi = {
  logout: () => api.post<{ success: boolean }>('/auth/logout').then((r) => r.data),
};

// Levels API
export const levelsApi = {
  getAll: () => api.get<Level[]>('/levels').then((r) => r.data),
  getById: (id: number) => api.get<Level>(`/levels/${id}`).then((r) => r.data),
};

// Progress API
export const progressApi = {
  getAll: () => api.get<Progress[]>('/progress').then((r) => r.data),
  getScore: () => api.get<{ totalScore: number; completedLevels: number; progress: Progress[] }>('/progress/score').then((r) => r.data),
  submit: (levelId: number, code: string) => api.post<SubmitResult>('/progress/submit', { levelId, code }).then((r) => r.data),
};

// Leaderboard API
export const leaderboardApi = {
  getAll: () => api.get<LeaderboardEntry[]>('/leaderboard').then((r) => r.data),
  getRank: (userId: string) => api.get<{ rank: number } & Partial<LeaderboardEntry>>(`/leaderboard/rank/${userId}`).then((r) => r.data),
};

export default api;
