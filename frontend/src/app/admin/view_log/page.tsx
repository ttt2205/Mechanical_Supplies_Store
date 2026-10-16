'use client';
import { useLogs } from '@/hooks/useAdminModules';
﻿

import React, { useState } from 'react';
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { 
    Search, 
    Filter, 
    ChevronLeft, 
    ChevronRight,
    History,
    ExternalLink,
    Calendar,
    Clock,
    User,
    ArrowUpRight
} from 'lucide-react';



export default function ViewLogPage() {
    const { systemLogs, loading, loadLogs } = useLogs();
    const [filterEntityType, setFilterEntityType] = useState('ALL');
    
    const logs = (systemLogs || []).map((item: any) => {
        const userDisplay = item.user || (item.userId ? `User #${item.userId}` : 'Khách vãng lai');
        const moduleDisplay = item.module || item.targetType || 'Hệ thống';
        const actionDisplay = item.action || item.targetName || item.details || '-';
        const ipDisplay = item.ipAddress || item.ip || '127.0.0.1';
        const timeDisplay = item.creationTime ? new Date(item.creationTime).toLocaleString('vi-VN') : (item.time || '-');
        return {
            ...item,
            userDisplay,
            moduleDisplay,
            actionDisplay,
            ipDisplay,
            timeDisplay
        };
    }).filter((item: any) => {
        if (filterEntityType !== 'ALL' && !item.moduleDisplay.toLowerCase().includes(filterEntityType.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="space-y-8 pb-20">
            <AdminPageLayout
                title="Lịch sử lượt xem"
                description="Theo dõi chi tiết các tương tác của người dùng trên website."
                actionButton={
                    <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-brand-primary transition-all shadow-xl">
                        <Filter size={14} /> Xuất báo cáo (Excel)
                    </button>
                }
                isLoading={loading}
                onRefresh={loadLogs}
                data={logs}
                filters={
                    <>
                        <select value={filterEntityType} onChange={(e) => setFilterEntityType(e.target.value)} className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-brand-primary text-slate-700 font-medium">
                            <option value="ALL">Tất cả các mục</option>
                            <option value="Product">Sản phẩm</option>
                            <option value="Service">Dịch vụ</option>
                            <option value="Post">Bài viết</option>
                            <option value="System">Hệ thống</option>
                        </select>
                    </>
                }
                searchKey={(item: any) => `${item.userDisplay} ${item.actionDisplay} ${item.ipDisplay} ${item.moduleDisplay}`}
                searchPlaceholder="Tìm tên người dùng/IP/hành động..."
                colSpan={6}
                tableHeader={
                    <tr>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Thời gian</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Người dùng</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Loại mục</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Nội dung / Hành động</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Địa chỉ IP</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 text-right">Chi tiết</th>
                    </tr>
                }
                renderRow={(log: any, index: number) => (
                    <tr key={log.id || index} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-4">
                            <div className="flex items-center gap-2 font-bold text-slate-400 uppercase tracking-tighter text-xs">
                                <Clock size={12} />
                                {log.timeDisplay}
                            </div>
                        </td>
                        <td className="px-8 py-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${String(log.userDisplay).includes('Khách') ? 'bg-slate-100 text-slate-400' : 'bg-brand-primary text-white'}`}>
                                    <User size={12} />
                                </div>
                                <span className="font-black text-slate-900 uppercase tracking-tight text-xs">{log.userDisplay}</span>
                            </div>
                        </td>
                        <td className="px-8 py-4">
                            <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600">
                                {log.moduleDisplay}
                            </span>
                        </td>
                        <td className="px-8 py-4">
                            <span className="font-bold text-slate-700 text-xs">{log.actionDisplay}</span>
                        </td>
                        <td className="px-8 py-4 font-mono text-xs text-slate-400 italic">
                            {log.ipDisplay}
                        </td>
                        <td className="px-8 py-4 text-right">
                            <button className="p-2 text-slate-400 hover:text-brand-primary transition-all">
                                <ExternalLink size={16} />
                            </button>
                        </td>
                    </tr>
                )}
            />
        </div>
    );
}
