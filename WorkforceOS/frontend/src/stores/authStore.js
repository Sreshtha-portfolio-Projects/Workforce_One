import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getRedirectPath = (userType) => {
  if (userType === 'candidate') return '/candidate';
  if (userType === 'employee') return '/employee';
  return '/admin';
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }

        set({
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken || null,
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

      getHomePath: () => getRedirectPath(get().user?.userType),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (state.token) {
          localStorage.setItem('token', state.token);
        }
        if (state.refreshToken) {
          localStorage.setItem('refreshToken', state.refreshToken);
        }
        if (!state.token) {
          state.isAuthenticated = false;
          state.user = null;
        }
      },
    }
  )
);

export { getRedirectPath };
