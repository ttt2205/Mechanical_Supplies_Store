"use client";

import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useEffect, useState } from 'react';

export default function FavoriteBadge({ isMobile }: { isMobile: boolean }) {
  const favorites = useFavoritesStore((state) => state.favorites);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration to avoid mismatch with SSR
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const count = isHydrated ? favorites.length : 0;

  return (
    <Link 
      href="/favorites"
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
