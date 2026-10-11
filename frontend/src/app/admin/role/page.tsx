'use client';

import React, { useState } from 'react';
import { useRoles } from '@/hooks/useAdminModules';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Shield, 
    Type, 
    Save, 
    Users, 
    Hash, 
    Lock,
    ShieldAlert
} from 'lucide-react';
import { AdminModal, AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { useToastStore } from '@/store/useToastStore';

export default function RoleManagementPage() {
    const { roles, loading, createRole, updateRole, deleteRole } = useRoles();
    const { addToast } = useToastStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openModal = (role: any = null) => {
        if (role) {
            const isAdmin = Boolean(role.isAdmin || role.is_admin || (role.code || '').toUpperCase() === 'ADMIN');
            if (isAdmin) {
                addToast('Quyền của tài khoản Quản trị viên (Admin) là hệ thống cố định, không được phép chỉnh sửa.', 'error');
                return;
            }
            setEditingRole({ ...role });
        } else {
            setEditingRole({
                name: '',
                code: '',
                description: '',
                isAdmin: false
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!editingRole?.name?.trim() || !editingRole?.code?.trim()) {
            addToast('Vui lòng nhập tên và mã định danh vai trò', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                name: editingRole.name.trim(),
                code: editingRole.code.trim().toUpperCase(),
                description: editingRole.description?.trim() || '',
                isAdmin: Boolean(editingRole.isAdmin)
            };

            if (editingRole.id) {
                await updateRole(editingRole.id, payload);
                addToast('Cập nhật vai trò thành công!', 'success');
            } else {
                await createRole(payload);
                addToast('Tạo vai trò mới thành công!', 'success');
            }
            setIsModalOpen(false);
        } catch (error: any) {
            console.error('Save role error:', error);
            addToast(error?.message || 'Không thể lưu vai trò. Vui lòng thử lại.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number, roleName: string, isAdminRole: boolean) => {
        if (isAdminRole) {
            addToast('Tài khoản Quản trị viên (Admin) là hệ thống cố định, không được phép xóa.', 'error');
            return;
        }
        if (confirm(`Bạn có chắc chắn muốn xóa vai trò "${roleName}"?`)) {
            try {
                await deleteRole(id);
                addToast('Xóa vai trò thành công', 'success');
            } catch (error: any) {
                console.error('Delete role error:', error);
                addToast('Không thể xóa vai trò này', 'error');
            }
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <AdminPageLayout
                title="Quản lý Danh mục Vai trò"
                description="Danh sách các vai trò (Roles) trong hệ thống dùng để phân quyền người dùng."
                actionButton={
                    <button 
                        onClick={() => openModal()}
                        className="bg-brand-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-primary/90 transition-all shadow-xs hover:shadow-sm flex items-center gap-2.5 w-fit"
                    >
                        <Plus size={16} />
                        Thêm vai trò mới
                    </button>
                }
                data={roles}
                searchKey={(role) => (role.name || '') + ' ' + (role.code || '') + ' ' + (role.description || '')}
                searchPlaceholder="Tìm kiếm vai trò theo tên hoặc mã..."
                isLoading={loading}
                colSpan={6}
                tableHeader={
                    <tr>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Mã vai trò (Code)</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Tên hiển thị</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Loại vai trò (IsAdmin)</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Mô tả</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Số tài khoản</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 text-right">Thao tác</th>
                    </tr>
                }
                renderRow={(role, index) => {
                    const accountCount = role.accounts?.length || role.userCount || 0;
                    const isAdmin = Boolean(role.isAdmin || role.is_admin || (role.code || '').toUpperCase() === 'ADMIN');

                    return (
                        <tr key={role.id || index} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isAdmin ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                        <Shield size={18} />
                                    </div>
                                    <span className="font-mono text-xs font-bold text-brand-primary uppercase tracking-wider">
                                        {role.code}
                                    </span>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <span className="text-sm font-bold text-slate-900">{role.name}</span>
                            </td>
                            <td className="px-8 py-5">
                                {isAdmin ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        <ShieldAlert size={12} /> Quản trị viên (IsAdmin: True)
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                        Người dùng (IsAdmin: False)
                                    </span>
                                )}
                            </td>
                            <td className="px-8 py-5 text-xs text-slate-500 font-medium max-w-xs truncate">
                                {role.description || 'Chưa có mô tả cho vai trò này.'}
                            </td>
                            <td className="px-8 py-5">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                                    <Users size={14} className="text-slate-400" />
                                    {accountCount} tài khoản
                                </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                                {isAdmin ? (
                                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
                                        <Lock size={13} /> Cố định
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            className="p-2 text-slate-400 hover:text-brand-primary hover:bg-white rounded-lg shadow-xs transition-all" 
                                            onClick={() => openModal(role)}
                                            title="Chỉnh sửa vai trò"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg shadow-xs transition-all" 
                                            onClick={() => handleDelete(role.id, role.name, isAdmin)}
                                            title="Xóa vai trò"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    );
                }}
            />

            {/* ROLE MODAL */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingRole?.id ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
                size="md"
                footer={
                    <>
                        <button 
                            type="button" 
                            disabled={isSubmitting} 
                            className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-200 transition-colors disabled:opacity-50" 
                            onClick={() => setIsModalOpen(false)}
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="button" 
                            disabled={isSubmitting} 
                            onClick={handleSave} 
                            className="px-6 py-2.5 bg-brand-primary text-white rounded-lg font-semibold text-xs hover:bg-brand-primary/90 transition-all shadow-xs hover:shadow-sm flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save size={16} />
                            {isSubmitting ? 'Đang lưu...' : 'Lưu vai trò'}
                        </button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdminInput 
                            label="Tên vai trò"
                            icon={Type}
                            placeholder="Ví dụ: Quản lý sản phẩm..."
                            value={editingRole?.name || ''} 
                            onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                            required
                        />
                        <AdminInput 
                            label="Mã định danh (Code)"
                            icon={Hash}
                            placeholder="VD: PRODUCT_MANAGER"
                            value={editingRole?.code || ''} 
                            onChange={(e) => setEditingRole({...editingRole, code: e.target.value.toUpperCase()})}
                            disabled={!!editingRole?.id}
                            required
                        />
                    </div>

                    <AdminTextarea 
                        label="Mô tả chi tiết"
                        placeholder="Mô tả nhiệm vụ hoặc phạm vi của vai trò này..."
                        value={editingRole?.description || ''} 
                        onChange={(e) => setEditingRole({...editingRole, description: e.target.value})}
                    />
                </div>
            </AdminModal>
        </div>
    );
}
