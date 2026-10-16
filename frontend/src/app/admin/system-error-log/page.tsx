'use client';
import { useLogs } from '@/hooks/useAdminModules';
﻿

import React, { useState } from 'react';
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
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



export default function ErrorLogPage() {
    const { errorLogs, loading, loadLogs } = useLogs();
    const [filterLevel, setFilterLevel] = useState('ALL');

    const normalizedErrors = (errorLogs || []).map((item: any) => {
        const level = (item.level || item.type || 'Error').toUpperCase();
        const message = item.errorMessage || item.message || 'Lỗi không xác định';
        const source = item.source || item.path || item.module || 'Hệ thống';
        const time = item.creationTime ? new Date(item.creationTime).toLocaleString('vi-VN') : (item.time || '-');
        return {
            ...item,
            levelDisplay: level,
            messageDisplay: message,
            sourceDisplay: source,
            timeDisplay: time
        };
    });

    const criticalCount = normalizedErrors.filter(e => e.levelDisplay === 'CRITICAL').length;
    const errorCount = normalizedErrors.filter(e => e.levelDisplay === 'ERROR').length;
    const warningCount = normalizedErrors.filter(e => e.levelDisplay === 'WARNING').length;

    const filteredErrors = normalizedErrors.filter((item: any) => {
        if (filterLevel !== 'ALL' && item.levelDisplay !== filterLevel.toUpperCase()) return false;
        return true;
    });

    return (
        <div className="space-y-8 pb-20">
            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: 'Nghiêm trọng (Critical)', count: criticalCount, color: 'text-red-500', bg: 'bg-red-50', icon: AlertTriangle },
                    { label: 'Lỗi thường (Error)', count: errorCount, color: 'text-amber-500', bg: 'bg-amber-50', icon: Info },
                    { label: 'Cảnh báo (Warning)', count: warningCount, color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertCircle }
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

            <AdminPageLayout
                title="Log Lỗi Hệ Thống"
                description="Giám sát sức khỏe hệ thống và xử lý các sự cố kỹ thuật."
                isLoading={loading}
                onRefresh={loadLogs}
                data={filteredErrors}
                filters={
                    <>
                        <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-brand-primary text-slate-700 font-medium">
                            <option value="ALL">Tất cả mức độ</option>
                            <option value="Critical">Nghiêm trọng (Critical)</option>
                            <option value="Error">Lỗi (Error)</option>
                            <option value="Warning">Cảnh báo (Warning)</option>
                        </select>
                    </>
                }
                searchKey={(item: any) => `${item.messageDisplay} ${item.sourceDisplay} ${item.levelDisplay}`}
                searchPlaceholder="Tìm kiếm log lỗi, module..."
                colSpan={4}
                tableHeader={
                    <tr>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Mức độ / Nguồn</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Thông báo lỗi</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Thời gian</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 text-right">Chi tiết</th>
                    </tr>
                }
                renderRow={(error: any, index: number) => (
                    <tr key={error.id || index} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                    error.levelDisplay === 'CRITICAL' ? 'bg-red-500 text-white' :
                                    error.levelDisplay === 'ERROR' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                                }`}>
                                    <Terminal size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                                        error.levelDisplay === 'CRITICAL' ? 'text-red-600' :
                                        error.levelDisplay === 'ERROR' ? 'text-red-400' : 'text-amber-500'
                                    }`}>{error.levelDisplay}</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{error.sourceDisplay}</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-8 py-4">
                            <h4 className="text-sm font-bold text-slate-900 font-mono break-all">{error.messageDisplay}</h4>
                        </td>
                        <td className="px-8 py-4">
                            <span className="text-xs font-bold text-slate-500">{error.timeDisplay}</span>
                        </td>
                        <td className="px-8 py-4 text-right">
                            <div className="flex items-center justify-end gap-4">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    error.levelDisplay === 'CRITICAL' ? 'bg-red-50 text-red-500' :
                                    error.levelDisplay === 'ERROR' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                                }`}>
                                    {error.levelDisplay}
                                </span>
                            </div>
                        </td>
                    </tr>
                )}
            />
        </div>
    );
}
