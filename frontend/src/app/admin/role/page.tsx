'use client';

import React, { useState } from 'react';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Shield, 
    ChevronRight,
    Users,
    Lock,
    Settings,
    Save,
    Type,
    CheckSquare
} from 'lucide-react';
import { AdminModal, AdminInput, AdminSelect } from '@/components/admin/AdminUI';

// Mock data for roles
const initialRoles = [
    { id: 1, name: 'Siêu quản trị (Super Admin)', code: 'SUPER_ADMIN', users: 2, permissions: ['all'], status: 'active' },
    { id: 2, name: 'Quản lý Nội dung', code: 'CONTENT_MANAGER', users: 5, permissions: ['products', 'posts', 'partners'], status: 'active' },
    { id: 3, name: 'Kỹ thuật viên', code: 'TECHNICIAN', users: 12, permissions: ['view_logs', 'products'], status: 'active' },
    { id: 4, name: 'Nhân viên Bán hàng', code: 'SALES', users: 8, permissions: ['products', 'customers'], status: 'inactive' },
];

const availablePermissions = [
    { id: 'dashboard', label: 'Xem Thống kê (Dashboard)' },
    { id: 'products', label: 'Quản lý Sản phẩm' },
    { id: 'posts', label: 'Quản lý Bài viết' },
    { id: 'partners', label: 'Quản lý Đối tác' },
    { id: 'users', label: 'Quản lý Người dùng' },
    { id: 'roles', label: 'Quản lý Phân quyền' },
    { id: 'view_logs', label: 'Xem Lịch sử hệ thống' },
    { id: 'error_logs', label: 'Xem Log lỗi' },
];

export default function RoleManagementPage() {
    const [roles, setRoles] = useState(initialRoles);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<any>(null);

    const openModal = (role: any = null) => {
        setEditingRole(role || {
            name: '',
            code: '',
            permissions: [],
            status: 'active'
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Quản lý Phân quyền</h1>
                    <p className="text-slate-500 font-bold">Thiết lập các nhóm quyền và gán cho người dùng hệ thống.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-brand-primary transition-all flex items-center gap-3 w-fit"
                >
                    <Plus size={18} />
                    Tạo vai trò mới
                </button>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map((role) => (
                    <div key={role.id} className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden cursor-pointer" onClick={() => openModal(role)}>
                        {/* Decorative Background Icon */}
                        <Shield className="absolute -bottom-10 -right-10 w-48 h-48 text-slate-50 group-hover:text-brand-primary/5 transition-colors -z-0" />
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${role.status === 'active' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-slate-100 text-slate-400'}`}>
                                    <Shield size={28} />
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-primary hover:text-white transition-all" onClick={(e) => { e.stopPropagation(); openModal(role); }}><Edit2 size={16} /></button>
                                    <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all" onClick={(e) => e.stopPropagation()}><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-1">{role.name}</h3>
                                <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">{role.code}</span>
                            </div>

                            <div className="space-y-4 border-t border-slate-50 pt-6">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest">
                                        <Users size={14} /> Số lượng User
                                    </div>
                                    <span className="font-black text-slate-900">{role.users}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest">
                                        <Lock size={14} /> Trạng thái
                                    </div>
                                    <span className={`font-black uppercase tracking-tighter ${role.status === 'active' ? 'text-emerald-500' : 'text-slate-300'}`}>
                                        {role.status === 'active' ? 'Đang kích hoạt' : 'Ngưng dùng'}
                                    </span>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-4 bg-slate-50 group-hover:bg-brand-primary group-hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-slate-100 flex items-center justify-center gap-2">
                                Chi tiết phân quyền <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ROLE MODAL */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingRole?.id ? "Thiết lập vai trò" : "Tạo vai trò mới"}
                size="lg"
                footer={
                    <>
                        <button className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                        <button className="px-10 py-3 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-primary/20 hover:bg-blue-800 transition-all flex items-center gap-2">
                            <Save size={16} /> Lưu cấu hình
                        </button>
                    </>
                }
            >
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AdminInput 
                            label="Tên vai trò"
                            icon={Type}
                            placeholder="Ví dụ: Quản lý kho..."
                            defaultValue={editingRole?.name}
                            required
                        />
                        <AdminInput 
                            label="Mã định danh (Code)"
                            icon={Lock}
                            placeholder="PRODUCT_MANAGER"
                            defaultValue={editingRole?.code}
                            required
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 ml-4">
                            <CheckSquare size={18} className="text-brand-primary" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Danh sách quyền hạn</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                            {availablePermissions.map((perm) => (
                                <label key={perm.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 cursor-pointer hover:border-brand-primary transition-all group shadow-sm">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded-lg border-2 border-slate-200 text-brand-primary focus:ring-brand-primary transition-all" 
                                        defaultChecked={editingRole?.permissions?.includes('all') || editingRole?.permissions?.includes(perm.id)}
                                    />
                                    <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{perm.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <AdminSelect 
                        label="Trạng thái kích hoạt"
                        defaultValue={editingRole?.status}
                        options={[
                            { value: 'active', label: 'Kích hoạt vai trò này' },
                            { value: 'inactive', label: 'Vô hiệu hóa (Ngưng dùng)' }
                        ]}
                        required
                    />
                </div>
            </AdminModal>
        </div>
    );
}
