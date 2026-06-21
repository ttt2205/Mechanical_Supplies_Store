'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    Users, 
    ShieldCheck, 
    Package, 
    FileText, 
    Settings, 
    Handshake, 
    History, 
    AlertCircle,
    ChevronLeft,
    Menu,
    LogOut,
    Wrench,
    Info,
    Newspaper,
    User,
    Globe,
    ChevronDown,
    UserCircle
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

const menuItems = [
    { name: 'Tổng quan', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Sản phẩm', icon: Package, href: '/admin/product' },
    { 
        name: 'Bài viết', 
        icon: FileText, 
        isHeader: true 
    },
    { name: 'Giới thiệu', icon: Info, href: '/admin/post/about' },
    { name: 'Dịch vụ', icon: Wrench, href: '/admin/post/services' },
    { name: 'Tin tức', icon: Newspaper, href: '/admin/post/news' },
    { 
        name: 'Hệ thống', 
        icon: Settings, 
        isHeader: true 
    },
    { name: 'Người dùng', icon: Users, href: '/admin/user' },
    { name: 'Phân quyền', icon: ShieldCheck, href: '/admin/role' },
    { name: 'Đối tác', icon: Handshake, href: '/admin/supplier' },
    { name: 'Lượt xem', icon: History, href: '/admin/view_log' },
    { name: 'Lỗi hệ thống', icon: AlertCircle, href: '/admin/system-error-log' },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <>
        <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="fixed left-4 top-4 z-[70] flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl lg:hidden"
            aria-label="Mở menu quản trị"
        >
            <Menu size={20} />
        </button>

        {isMobileOpen && (
            <button
                type="button"
                className="fixed inset-0 z-[75] bg-slate-950/60 backdrop-blur-sm lg:hidden"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Đóng menu quản trị"
            />
        )}

        <aside 
            className={`fixed inset-y-0 left-0 z-[80] flex w-72 flex-col bg-slate-900 text-slate-400 transition-all duration-300 lg:relative lg:z-50 ${
                isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}
        >
            {/* User Profile / Top Header Area */}
            <div className="relative h-20 flex items-center px-4 border-b border-slate-800 shrink-0 z-50">
                <div 
                    className={`flex items-center gap-3 w-full p-2 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                    <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white">
                            <User size={18} />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                    </div>
                    
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-white truncate">{user?.username || 'Admin'}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">Quản trị viên</p>
                        </div>
                    )}
                    
                    {!isCollapsed && (
                        <ChevronDown size={16} className={`text-slate-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    )}
                </div>

                {/* USER DROPDOWN POPUP */}
                {isUserMenuOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsUserMenuOpen(false); }}></div>
                        <div className={`absolute top-full left-4 right-4 mt-2 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden z-50 ${isCollapsed ? 'w-48 left-16 top-4' : ''}`}>
                            <div className="p-2">
                                <Link 
                                    href="/" 
                                    className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-300 hover:bg-brand-primary hover:text-white rounded-xl transition-colors"
                                >
                                    <Globe size={16} />
                                    Về trang chủ
                                </Link>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white rounded-xl transition-colors">
                                    <UserCircle size={16} />
                                    Hồ sơ cá nhân
                                </button>
                                <div className="h-px bg-slate-700 my-1 mx-2"></div>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors"
                                >
                                    <LogOut size={16} />
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-grow py-6 overflow-y-auto scrollbar-hide px-3 z-10">
                {menuItems.map((item, idx) => {
                    if (item.isHeader) {
                        return !isCollapsed ? (
                            <div key={idx} className="px-4 mt-8 mb-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">{item.name}</span>
                            </div>
                        ) : <div key={idx} className="h-px bg-slate-800 my-6 mx-2" />;
                    }

                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link 
                            key={idx} 
                            href={item.href || '#'}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all mb-1 group relative ${
                                isActive 
                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                                : 'hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <Icon size={20} className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-brand-accent'}`} />
                            {!isCollapsed && (
                                <span className="font-bold text-sm truncate">{item.name}</span>
                            )}
                            
                            {/* Active Indicator Tooltip for Collapsed State */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-slate-700 shadow-xl">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <button 
                onClick={() => {
                    setIsCollapsed(!isCollapsed);
                    setIsUserMenuOpen(false);
                }}
                className="absolute -right-4 top-10 -translate-y-1/2 hidden w-8 h-8 bg-brand-primary text-white rounded-full lg:flex items-center justify-center shadow-lg border-4 border-[#0f172a] hover:scale-110 transition-all z-[60]"
                aria-label={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            >
                {isCollapsed ? <Menu size={14} /> : <ChevronLeft size={14} />}
            </button>
        </aside>
        </>
    );
}
