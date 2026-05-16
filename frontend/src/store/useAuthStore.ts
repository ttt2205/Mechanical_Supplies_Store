import { create } from 'zustand';
import { subscribeWithSelector, persist } from 'zustand/middleware';
import { AuthStore, UserAccount } from '@/types/auth';

const initialState = {
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        ...initialState,
        
        login: (userData: UserAccount) => 
          set({ 
            user: userData, 
            isAuthenticated: true 
          }),

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
