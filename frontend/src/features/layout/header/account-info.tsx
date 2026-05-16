"use client";

import { User } from 'lucide-react';
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

export default function AccountInfo() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
      <div className="bg-white/10 border border-white/20 rounded-full p-2 group-hover:bg-white/20 transition-all">
        <User size={18} />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider">
        {isHydrated && isAuthenticated ? user?.email : "Chưa đăng nhập"}
      </span>
    </button>
  );
}
