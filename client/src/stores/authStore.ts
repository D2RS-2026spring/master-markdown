import { create } from 'zustand';
import type { User } from '../types';
import { userApi } from '../api/client';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  setNickname: (nickname: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  fetchUser: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await userApi.getMe();
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: '无法连接到服务器',
      });
    }
  },

  setNickname: async (nickname: string) => {
    try {
      set({ error: null });
      const data = await userApi.setNickname(nickname);
      set({ user: data.user });
    } catch (error: any) {
      const message = error.response?.data?.error || '设置昵称失败';
      set({ error: message });
      throw new Error(message);
    }
  },
}));
