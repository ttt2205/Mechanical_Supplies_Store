"use client";

import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';

export default function FavoriteBadge({ isMobile }: { isMobile: boolean }) {
  const favorites = useFavoritesStore((state) => state.favorites);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const count = isHydrated && isAuthenticated ? favorites.length : 0;
  const href = '/favorites';

  return (
    <Link 
      href={href}
      className="flex items-center gap-2 text-white hover:text-brand-accent transition-colors group"
    >
      <div className="relative">
        <Heart size={isMobile ? 24 : 20} className={count > 0 ? "fill-current" : ""} />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-heart-beat">
            {count}
          </span>
        )}
      </div>
      {isMobile ? null : <span className="text-sm font-bold uppercase tracking-tight">YÊU THÍCH</span>}
    </Link>
  );
}

