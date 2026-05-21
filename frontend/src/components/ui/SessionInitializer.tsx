'use client';

import { useEffect } from 'react';
import { useSessionStore } from '@/store/useSessionStore';

export default function SessionInitializer() {
  const initSession = useSessionStore((state) => state.initSession);

  useEffect(() => {
    const id = initSession();
    console.log('Session initialized:', id);
  }, [initSession]);

  return null;
}
