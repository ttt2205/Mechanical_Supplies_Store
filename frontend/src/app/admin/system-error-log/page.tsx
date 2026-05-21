'use client';

import React, { useState } from 'react';
import { 
    AlertTriangle, 
    Search, 
    Filter, 
    ChevronLeft, 
    ChevronRight,
    Terminal,
    RefreshCcw,
    AlertCircle,
    Info,
    Bug
} from 'lucide-react';

// Mock data for error logs
const initialErrors = [
    { id: 5001, type: 'Critical', module: 'Auth', message: 'JWT token invalid format', time: '2024-03-21 10:15', status: 'new' },
    { id: 5002, type: 'Error', module: 'Database', message: 'Connection timeout on cluster 01', time: '2024-03-21 09:20', status: 'resolved' },
    { id: 5003, type: 'Warning', module: 'Media', message: 'Image optimization failed for GATE-G2.jpg', time: '2024-03-21 08:45', status: 'investigating' },
    { id: 5004, type: 'Error', module: 'API', message: 'External API 404 - exchange-rate-service', time: '2024-03-20 22:12', status: 'new' },
    { id: 5005, type: 'Critical', module: 'System', message: 'Heap memory usage above 90%', time: '2024-03-20 18:00', status: 'resolved' },
];

export default function ErrorLogPage() {
    const [errors] = useState(initialErrors);

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2 flex items-center gap-4">
                        <Bug className="text-red-500" /> Log Lỗi Hệ Thống
                    </h1>
                    <p className="text-slate-500 font-bold">Giám sát sức khỏe hệ thống và xử lý các sự cố kỹ thuật.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl">
                    <RefreshCcw size={14} /> Làm mới dữ liệu
                </button>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Chưa xử lý', count: '12', color: 'text-red-500', bg: 'bg-red-50', icon: AlertTriangle },
                    { label: 'Đang điều tra', count: '04', color: 'text-amber-500', bg: 'bg-amber-50', icon: Info },
                    { label: 'Đã giải quyết', count: '158', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: AlertCircle }
                ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center`}>
                                <s.icon size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{s.label}</p>
                                <p className="text-2xl font-black text-slate-900">{s.count}</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-200 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                    </div>
                ))}
            </div>

            {/* Logs List */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                    <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">Danh sách Log gần đây</h3>
                    <div className="flex gap-4">
                        <select className="bg-white border-2 border-slate-100 rounded-xl px-4 py-2 outline-none text-xs font-bold text-slate-600 focus:border-brand-primary appearance-none cursor-pointer">
                            <option>Mọi cấp độ</option>
                            <option>Critical</option>
                            <option>Error</option>
                            <option>Warning</option>
                        </select>
                    </div>
                </div>

                <div className="divide-y divide-slate-50">
                    {errors.map((error) => (
                        <div key={error.id} className="p-6 flex items-start gap-6 hover:bg-slate-50/50 transition-colors group">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                error.type === 'Critical' ? 'bg-red-500 text-white' :
                                error.type === 'Error' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                            }`}>
                                <Terminal size={18} />
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                                        error.type === 'Critical' ? 'text-red-600' :
                                        error.type === 'Error' ? 'text-red-400' : 'text-amber-500'
                                    }`}>{error.type}</span>
                                    <span className="text-[10px] font-bold text-slate-300">•</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{error.module}</span>
                                    <span className="text-[10px] font-bold text-slate-300">•</span>
                                    <span className="text-[10px] font-bold text-slate-400">{error.time}</span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 font-mono break-all">{error.message}</h4>
                            </div>
                            <div className="shrink-0 flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    error.status === 'new' ? 'bg-red-50 text-red-500 animate-pulse' :
                                    error.status === 'investigating' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                                }`}>
                                    {error.status}
                                </span>
                                <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
