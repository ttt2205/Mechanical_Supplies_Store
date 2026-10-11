import { create } from 'zustand';
import { subscribeWithSelector, persist } from 'zustand/middleware';
import { AuthStore, UserAccount } from '@/types/auth';

const initialState = {
  user: null,
  isAuthenticated: false,
  permissions: [],
  accessToken: null,
  refreshToken: null,
};

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        ...initialState,
        
        login: (userData: UserAccount, permissions: string[], tokens?: { accessToken: string, refreshToken: string }) => 
          set({ 
            user: userData, 
            isAuthenticated: true,
            permissions,
            ...(tokens ? { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken } : {})
          }),

        setTokens: (accessToken: string, refreshToken: string) =>
          set({ accessToken, refreshToken }),

        logout: () => 
          set({ 
            ...initialState 
          }),
      }),
      {
        name: 'auth-storage', // name of the item in storage (default: localStorage)
      }
    )
  )
);
