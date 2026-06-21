"use client";

import { User, LogOut, LayoutDashboard, UserCircle, LogIn } from 'lucide-react';
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountInfo() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/');
  };

  if (!isHydrated) return null;

  if (!isAuthenticated) {
    return (
      <Link 
        href="/login"
        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
      >
        <div className="bg-white/10 border border-white/20 rounded-full p-2 group-hover:bg-white/20 transition-all">
          <LogIn size={18} />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">
          Đăng nhập
        </span>
      </Link>
    );
  }

  const isAdmin = user?.role_id === 'admin';

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
      >
        <div className="bg-white/10 border border-white/20 rounded-full p-2 group-hover:bg-white/20 transition-all">
          <User size={18} />
        </div>
        <div className="text-left hidden sm:block leading-tight">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent">
            {isAdmin ? "Quản trị viên" : "Khách hàng"}
          </p>
          <p className="text-xs font-bold truncate max-w-[120px]">
            {user?.username || user?.email}
          </p>
        </div>
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden z-[60] animate-fade-in">
          <div className="p-6 bg-slate-50 border-b border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phiên làm việc</p>
            <p className="text-sm font-black text-slate-900 truncate uppercase">{user?.email}</p>
          </div>
          
          <div className="p-3">
            {isAdmin ? (
              <Link 
                href="/admin/dashboard" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-5 py-4 text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-brand-primary hover:text-white rounded-2xl transition-all group/item"
              >
                <LayoutDashboard size={18} className="text-brand-primary group-hover/item:text-white" />
                Trang Quản Trị
              </Link>
            ) : (
              <Link 
                href="/account" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-5 py-4 text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-brand-primary hover:text-white rounded-2xl transition-all group/item"
              >
                <UserCircle size={18} className="text-brand-primary group-hover/item:text-white" />
                Thông tin tài khoản
              </Link>
            )}

            <div className="h-px bg-slate-50 my-2 mx-4"></div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-4 text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
