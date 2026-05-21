'use client';

import React, { useState } from 'react';
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

// Mock data for view logs
const initialLogs = [
    { id: 101, user: 'admin_thinh', targetType: 'Sản phẩm', targetName: 'Ống thủy lực Gates G2', time: '2024-03-21 10:15:30', ip: '1.54.12.xx' },
    { id: 102, user: 'Khách vãng lai', targetType: 'Dịch vụ', targetName: 'Bảo trì hệ thống thủy lực', time: '2024-03-21 10:12:05', ip: '113.161.xx.xx' },
    { id: 103, user: 'hoang_mech', targetType: 'Bài viết', targetName: 'Hướng dẫn lựa chọn ống thủy lực', time: '2024-03-21 09:45:12', ip: '14.232.xx.xx' },
    { id: 104, user: 'Khách vãng lai', targetType: 'Đối tác', targetName: 'Đại lý Miền Nam', time: '2024-03-21 09:30:00', ip: '27.72.xx.xx' },
    { id: 105, user: 'customer_01', targetType: 'Sản phẩm', targetName: 'Máy bấm đầu ống Finn-Power', time: '2024-03-21 08:20:45', ip: '1.53.xx.xx' },
];

export default function ViewLogPage() {
    const [logs] = useState(initialLogs);

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Lịch sử lượt xem</h1>
                <p className="text-slate-500 font-bold">Theo dõi chi tiết các tương tác của người dùng trên website.</p>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="date" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-6 py-3 focus:bg-white focus:border-brand-primary outline-none transition-all text-sm font-bold text-slate-900" />
                    </div>
                    <select className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-3 outline-none text-sm font-bold text-slate-700 focus:border-brand-primary transition-all appearance-none cursor-pointer">
                        <option value="">Tất cả Loại mục</option>
                        <option value="product">Sản phẩm</option>
                        <option value="service">Dịch vụ</option>
                        <option value="post">Bài viết</option>
                        <option value="partner">Đối tác</option>
                    </select>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Tìm tên người dùng/IP..." className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-6 py-3 focus:bg-white focus:border-brand-primary outline-none transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400" />
                    </div>
                </div>
                <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                    <Filter size={14} /> Xuất báo cáo (Excel)
                </button>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden text-[13px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Thời gian</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Người dùng</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loại mục</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tên nội dung</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Địa chỉ IP</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {logs.map((log) => (
                                <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-2 font-bold text-slate-400 uppercase tracking-tighter">
                                            <Clock size={12} />
                                            {log.time}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${log.user.includes('Khách') ? 'bg-slate-100 text-slate-400' : 'bg-brand-primary text-white'}`}>
                                                <User size={12} />
                                            </div>
                                            <span className="font-black text-slate-900 uppercase tracking-tight">{log.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                            log.targetType === 'Sản phẩm' ? 'bg-blue-50 text-blue-600' :
                                            log.targetType === 'Dịch vụ' ? 'bg-purple-50 text-purple-600' :
                                            log.targetType === 'Bài viết' ? 'bg-emerald-50 text-emerald-600' :
                                            'bg-amber-50 text-amber-600'
                                        }`}>
                                            {log.targetType}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="font-bold text-slate-700">{log.targetName}</span>
                                    </td>
                                    <td className="px-8 py-4 font-mono text-xs text-slate-400 italic">
                                        {log.ip}
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-brand-primary transition-all">
                                            <ExternalLink size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="p-6 bg-slate-50/30 flex justify-center">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-brand-primary transition-all">
                        Tải thêm dữ liệu <History size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
