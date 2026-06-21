'use client';

import React, { useState } from 'react';
import { 
    Bell, 
    User, 
    Globe,
    ChevronDown,
    LogOut,
    UserCircle,
    LayoutDashboard
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Topbar() {
    const { user, logout } = useAuthStore();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <header className="h-16 md:h-20 bg-white border-b border-slate-100 flex items-center justify-between pl-20 pr-4 md:px-8 shrink-0 relative z-40">
            {/* Left side empty space to push actions to right */}
            <div className="hidden md:block flex-1"></div>

            {/* Actions Area */}
            <div className="ml-auto flex items-center gap-3 sm:gap-4 md:gap-6">
                {/* External Link */}
                <Link 
                    href="/" 
                    className="flex items-center gap-2 text-slate-400 hover:text-brand-primary transition-colors font-black uppercase text-[10px] tracking-widest hidden sm:flex"
                >
                    <Globe size={16} />
                    Xem website
                </Link>

                {/* Notifications */}
                <button className="relative min-h-11 min-w-11 p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-primary/10 hover:text-brand-primary transition-all" aria-label="Thông báo">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Vertical Divider */}
                <div className="w-px h-8 bg-slate-100 hidden sm:block"></div>

                {/* User Profile with Popup */}
                <div className="relative">
                    <div 
                        className="flex items-center gap-4 group cursor-pointer"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-slate-900 leading-none mb-1 uppercase truncate max-w-[120px]">
                                {user?.username || 'Admin'}
                            </p>
                            <p className="text-[10px] font-black text-brand-primary uppercase tracking-tighter leading-none">
                                Quản trị viên
                            </p>
                        </div>
                        <div className="relative">
                            <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white border-4 border-slate-50 group-hover:border-brand-primary/20 transition-all overflow-hidden shadow-md">
                                <User size={20} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <ChevronDown size={14} className={`text-slate-300 group-hover:text-brand-primary transition-all ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* USER DROPDOWN POPUP */}
                    {isUserMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                            <div className="absolute right-0 mt-4 w-[calc(100vw-2rem)] max-w-64 bg-white rounded-[28px] sm:rounded-[32px] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 animate-reveal-scale">
                                <div className="p-6 bg-slate-50 border-b border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phiên làm việc</p>
                                    <p className="text-sm font-black text-slate-900 truncate uppercase">{user?.email || 'admin@hungthinh.vn'}</p>
                                </div>
                                
                                <div className="p-3">
                                    <Link 
                                        href="/" 
                                        className="flex items-center gap-3 px-5 py-4 text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-brand-primary hover:text-white rounded-2xl transition-all group/item"
                                    >
                                        <LayoutDashboard size={18} className="text-brand-primary group-hover/item:text-white" />
                                        Về Trang Chủ Chính
                                    </Link>
                                    
                                    <button className="w-full flex items-center gap-3 px-5 py-4 text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100 rounded-2xl transition-all">
                                        <UserCircle size={18} className="text-slate-400" />
                                        Hồ sơ cá nhân
                                    </button>

                                    <div className="h-px bg-slate-50 my-2 mx-4"></div>

                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-5 py-4 text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all"
                                    >
                                        <LogOut size={18} />
                                        Đăng xuất hệ thống
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
