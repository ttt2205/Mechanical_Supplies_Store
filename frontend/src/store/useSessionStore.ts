import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  sessionId: string | null;
  initSession: () => string;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessionId: null,

      initSession: () => {
        const currentId = get().sessionId;
        if (currentId) return currentId;

        // Generate a new unique ID
        const newId = typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : `guest_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
        
        set({ sessionId: newId });
        return newId;
      },
    }),
    {
      name: 'session-storage',
    }
  )
);
