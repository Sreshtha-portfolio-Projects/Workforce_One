import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (data) => {
        localStorage.setItem('token', data.token);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        set({
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        });
      },

      setUser: (user) => set({ user }),

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        set({ user: { ...currentUser, ...updates } });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
