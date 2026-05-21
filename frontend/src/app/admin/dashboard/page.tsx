'use client';

import React from 'react';
import { 
    Eye, 
    Users, 
    Package, 
    FileText, 
    TrendingUp, 
    ArrowUpRight,
    ArrowDownRight,
    Star
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

// Mock data for dashboard
const stats = [
    { label: 'Tổng lượt xem', value: '45.280', change: '+12.5%', isUp: true, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Người dùng mới', value: '1.240', change: '+8.2%', isUp: true, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Sản phẩm active', value: '850', change: '+2.1%', isUp: true, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Bài viết mới', value: '12', change: '-3.4%', isUp: false, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

const topProducts = [
    { name: 'Ống thủy lực Gates G2', code: 'GATE-G2', views: 5240, rating: 4.9, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop' },
    { name: 'Máy bấm đầu ống Finn-Power P20', code: 'FINN-P20', views: 4120, rating: 4.8, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=200&auto=format&fit=crop' },
    { name: 'Đầu bấm thủy lực inox 304', code: 'DB-SS304', views: 3890, rating: 4.7, image: 'https://images.unsplash.com/photo-1565608438257-fac3c27beb36?q=80&w=200&auto=format&fit=crop' },
    { name: 'Dầu thủy lực Castrol Hyspin', code: 'CAS-HY46', views: 2750, rating: 4.9, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop' },
    { name: 'Phớt ben cao su chịu nhiệt', code: 'SEAL-VITO', views: 1980, rating: 4.5, image: 'https://images.unsplash.com/photo-1565608438257-fac3c27beb36?q=80&w=200&auto=format&fit=crop' },
];

export default function DashboardPage() {
    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Bảng điều khiển</h1>
                <p className="text-slate-500 font-bold">Chào mừng bạn trở lại! Đây là tóm tắt hoạt động hệ thống hôm nay.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content: Most Viewed Products */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden h-full">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Sản phẩm được quan tâm nhiều nhất</h3>
                                <p className="text-xs text-slate-400 font-bold mt-1">Dựa trên dữ liệu lượt xem trong 30 ngày qua</p>
                            </div>
                            <button className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline">Xem tất cả</button>
                        </div>
                        
                        <div className="p-4 sm:p-8">
                            <div className="space-y-6">
                                {topProducts.map((product, idx) => (
                                    <div key={idx} className="flex items-center gap-6 group">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 group-hover:shadow-lg transition-all">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-black text-slate-900 text-sm truncate uppercase group-hover:text-brand-primary transition-colors">{product.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.code}</span>
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                                                    <Star size={10} fill="currentColor" />
                                                    {product.rating}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-sm font-black text-slate-900">{product.views.toLocaleString()}</div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lượt xem</p>
                                        </div>
                                        {/* Simple Bar Chart Representation */}
                                        <div className="hidden sm:block w-32 h-2 bg-slate-50 rounded-full overflow-hidden shrink-0">
                                            <div 
                                                className="h-full bg-brand-primary rounded-full transition-all duration-1000 delay-300"
                                                style={{ width: `${(product.views / topProducts[0].views) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Content: System Health / Quick Trends */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Activity Feed / Trends */}
                    <div className="bg-[#0f172a] rounded-[40px] p-8 text-white relative overflow-hidden h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center mb-8 shadow-xl shadow-brand-primary/20">
                                <TrendingUp className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight mb-2">Xu hướng tuần này</h3>
                            <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">Nhu cầu về <span className="text-white font-bold italic">Máy bấm ống</span> đang tăng mạnh tại khu vực Miền Nam.</p>
                            
                            <div className="space-y-6">
                                {[
                                    { label: 'Yêu cầu tư vấn', value: '42', color: 'bg-brand-accent' },
                                    { label: 'Đăng ký đại lý', value: '08', color: 'bg-emerald-500' },
                                    { label: 'Lỗi hệ thống', value: '02', color: 'bg-red-500' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between group cursor-default">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                                            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">{item.label}</span>
                                        </div>
                                        <span className="font-black text-xl group-hover:scale-110 transition-transform">{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all">
                                Xem báo cáo chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
