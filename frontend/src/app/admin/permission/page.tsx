'use client';

import React, { useState } from 'react';
import { 
    Search, 
    Plus, 
    Filter, 
    Edit2, 
    Trash2, 
    Key, 
    ChevronRight,
    CheckCircle2,
    ShieldAlert,
    Save,
    Type,
    Lock
} from 'lucide-react';
import { AdminModal, AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/AdminUI';

// Mock data for permissions
const initialPermissions = [
    { id: 1, name: 'Xem báo cáo', code: 'VIEW_DASHBOARD', group: 'Thống kê', status: 'active' },
    { id: 2, name: 'Thêm sản phẩm', code: 'CREATE_PRODUCT', group: 'Sản phẩm', status: 'active' },
    { id: 3, name: 'Xóa người dùng', code: 'DELETE_USER', group: 'Người dùng', status: 'active' },
    { id: 4, name: 'Duyệt bài viết', code: 'PUBLISH_POST', group: 'Bài viết', status: 'inactive' },
];

export default function PermissionManagementPage() {
    const [permissions] = useState(initialPermissions);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState<any>(null);

    const openModal = (perm: any = null) => {
        setEditingPermission(perm || {
            name: '',
            code: '',
            group: 'Sản phẩm',
            status: 'active'
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Quản lý Quyền hạn</h1>
                    <p className="text-slate-500 font-bold">Danh mục các quyền chi tiết (fine-grained) trong hệ thống.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-brand-primary transition-all flex items-center gap-3 w-fit"
                >
                    <Plus size={18} />
                    Thêm quyền mới
                </button>
            </div>

            {/* Permissions List */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tên quyền</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mã định danh</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nhóm chức năng</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trạng thái</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {permissions.map((perm) => (
                                <tr key={perm.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => openModal(perm)}>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-all">
                                                <Key size={18} />
                                            </div>
                                            <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{perm.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-mono text-xs font-bold text-slate-400">
                                        {perm.code}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-md">
                                            {perm.group}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            perm.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            {perm.status === 'active' ? 'Khả dụng' : 'Khóa'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-brand-primary transition-all" onClick={(e) => { e.stopPropagation(); openModal(perm); }}><Edit2 size={16} /></button>
                                            <button className="p-2 text-slate-400 hover:text-red-500 transition-all" onClick={(e) => e.stopPropagation()}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PERMISSION MODAL */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPermission?.id ? "Chỉnh sửa quyền hạn" : "Tạo quyền mới"}
                size="md"
                footer={
                    <>
                        <button className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                        <button className="px-10 py-3 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-primary/20 hover:bg-blue-800 transition-all flex items-center gap-2">
                            <Save size={16} /> Lưu quyền
                        </button>
                    </>
                }
            >
                <div className="space-y-8">
                    <AdminInput 
                        label="Tên quyền hạn"
                        icon={Type}
                        placeholder="Ví dụ: Chỉnh sửa bài viết..."
                        defaultValue={editingPermission?.name}
                        required
                    />

                    <AdminInput 
                        label="Mã định danh hệ thống"
                        icon={Lock}
                        placeholder="EDIT_POST"
                        defaultValue={editingPermission?.code}
                        required
                    />

                    <AdminSelect 
                        label="Nhóm chức năng"
                        defaultValue={editingPermission?.group}
                        options={[
                            { value: 'Thống kê', label: 'Thống kê & Dashboard' },
                            { value: 'Sản phẩm', label: 'Quản lý Sản phẩm' },
                            { value: 'Người dùng', label: 'Quản lý Người dùng' },
                            { value: 'Bài viết', label: 'Quản lý Bài viết' }
                        ]}
                        required
                    />

                    <AdminSelect 
                        label="Trạng thái"
                        defaultValue={editingPermission?.status}
                        options={[
                            { value: 'active', label: 'Kích hoạt ngay' },
                            { value: 'inactive', label: 'Tạm ẩn' }
                        ]}
                        required
                    />
                </div>
            </AdminModal>
        </div>
    );
}
