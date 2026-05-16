"use client";

import { ShoppingCart } from 'lucide-react';

export default function CartBadge({ isMobile }: { isMobile: boolean }) {
  return (
    <button className="flex items-center gap-2 text-white hover:text-brand-accent transition-colors group">
      <div className="relative">
        <ShoppingCart size={20} />
        <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">0</span>
      </div>
      {isMobile ? null : <span className="text-sm font-bold uppercase tracking-tight">GIỎ HÀNG</span>}
    </button>
  );
}
