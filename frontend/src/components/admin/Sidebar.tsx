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
    Newspaper
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
    const pathname = usePathname();
    const { logout } = useAuthStore();

    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <aside 
            className={`bg-slate-900 text-slate-400 flex flex-col transition-all duration-300 relative z-50 ${isCollapsed ? 'w-20' : 'w-72'}`}
        >
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 border-b border-slate-800 overflow-hidden shrink-0">
                <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shrink-0">
                    <Settings className="text-white w-5 h-5 animate-spin-slow" />
                </div>
                {!isCollapsed && (
                    <span className="ml-4 font-black text-white uppercase tracking-tighter text-xl truncate">Hưng Thịnh <span className="text-brand-accent">Admin</span></span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-grow py-6 overflow-y-auto scrollbar-hide px-3">
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

            {/* Bottom Actions */}
            <div className="p-3 border-t border-slate-800">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all group"
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span className="font-bold text-sm">Đăng xuất</span>}
                </button>
            </div>

            {/* Collapse Toggle */}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-4 top-24 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#0f172a] hover:scale-110 transition-all z-[60]"
            >
                {isCollapsed ? <Menu size={14} /> : <ChevronLeft size={14} />}
            </button>
        </aside>
    );
}
