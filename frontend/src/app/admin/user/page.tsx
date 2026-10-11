'use client';
import { useUsers, useRoles } from '@/hooks/useAdminModules';
import React, { useState } from 'react';
import { 
    Search, 
    Plus, 
    Filter, 
    MoreVertical, 
    Edit2, 
    Trash2, 
    Shield, 
    UserCheck, 
    UserX,
    ChevronLeft,
    ChevronRight,
    Mail,
    Phone,
    User as UserIcon,
    KeyRound,
    Save
} from 'lucide-react';
import { AdminModal, AdminInput, AdminSelect } from '@/components/admin/AdminUI';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { useToastStore } from '@/store/useToastStore';

export default function UserManagementPage() {
    const { users, createUser, updateUser, deleteUser } = useUsers();
    const { roles } = useRoles();
    const { addToast } = useToastStore();
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    const handleSave = async () => {
        if (!editingUser?.username?.trim()) {
            addToast('Vui lòng nhập tên đăng nhập', 'error');
            return;
        }

        const roleIdInt = parseInt(editingUser.roleId?.toString() || editingUser.role_id?.toString() || '1') || 1;
        const fullName = editingUser.fullName || editingUser.fullname || '';

        try {
            if (editingUser.id) {
                const payload: any = {
                    roleId: roleIdInt,
                    email: editingUser.email || '',
                    fullName: fullName,
                    phone: editingUser.phone || '',
                    status: (editingUser.status || 'ACTIVE').toUpperCase()
                };
                if (editingUser.password?.trim()) {
                    payload.password = editingUser.password.trim();
                }
                await updateUser(editingUser.id, payload);
                addToast('Cập nhật tài khoản thành công', 'success');
            } else {
                if (!editingUser.password?.trim()) {
                    addToast('Vui lòng nhập mật khẩu khởi tạo', 'error');
                    return;
                }
                const payload = {
                    roleId: roleIdInt,
                    username: editingUser.username.trim(),
                    password: editingUser.password.trim(),
                    email: editingUser.email || `${editingUser.username.trim()}@hungthinh.vn`,
                    fullName: fullName || editingUser.username.trim(),
                    phone: editingUser.phone || '',
                    status: (editingUser.status || 'ACTIVE').toUpperCase()
                };
                await createUser(payload);
                addToast('Thêm mới tài khoản thành công', 'success');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Save user error:', error);
            addToast('Không thể lưu tài khoản. Vui lòng kiểm tra lại.', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            await deleteUser(id);
            addToast('Đã xóa người dùng thành công', 'success');
        }
    };

    const roleFilteredUsers = users.filter(user => {
        const userRoleId = String(user.roleId ?? user.role_id ?? user.role?.id ?? '');
        const userRoleCode = String(user.role?.code ?? '').toUpperCase();
        if (roleFilter !== '' && userRoleId !== roleFilter && userRoleCode !== roleFilter) return false;
        const currentStatus = String(user.status || 'ACTIVE').toUpperCase();
        if (statusFilter !== 'ALL' && currentStatus !== statusFilter) return false;
        return true;
    });

    const openModal = (user: any = null) => {
        if (user) {
            setEditingUser({
                ...user,
                fullName: user.fullName || user.fullname || '',
                fullname: user.fullName || user.fullname || '',
                roleId: user.roleId || user.role_id || user.role?.id || 1,
                role_id: user.roleId || user.role_id || user.role?.id || 1,
                status: (user.status || 'ACTIVE').toUpperCase(),
                password: ''
            });
        } else {
            const defaultRoleId = roles.length > 0 ? roles[0].id : 1;
            setEditingUser({
                fullName: '',
                fullname: '',
                username: '',
                email: '',
                phone: '',
                roleId: defaultRoleId,
                role_id: defaultRoleId,
                status: 'ACTIVE',
                password: ''
            });
        }
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 pb-20">
            <AdminPageLayout
                title="Quản lý người dùng"
                description="Danh sách tất cả tài khoản truy cập vào hệ thống."
                actionButton={
                    <button 
                        onClick={() => openModal()}
                        className="bg-brand-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-primary/90 transition-all shadow-xs hover:shadow-sm flex items-center gap-2.5 w-fit"
                    >
                        <Plus size={16} />
                        Thêm người dùng mới
                    </button>
                }
                data={roleFilteredUsers}
                filters={
                    <>
                        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-brand-primary text-slate-700 font-medium">
                            <option value="">Tất cả Vai trò</option>
                            {roles.map(r => (
                                <option key={r.id} value={r.id.toString()}>{r.name} ({r.code})</option>
                            ))}
                        </select>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-brand-primary text-slate-700 font-medium">
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="INACTIVE">Bị khóa</option>
                        </select>
                    </>
                }
                searchKey={(user) => (user.fullName || user.fullname || '') + ' ' + (user.email || '') + ' ' + (user.username || '')}
                searchPlaceholder="Tìm theo tên, email, username..."
                colSpan={6}
                tableHeader={
                    <tr>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Người dùng</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Liên hệ</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Vai trò</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Trạng thái</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Truy cập cuối</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 text-right">Thao tác</th>
                    </tr>
                }
                renderRow={(user, index) => {
                    const fullName = user.fullName || user.fullname || user.username || 'Người dùng';
                    const roleItem = user.role || roles.find(r => r.id === (user.roleId || user.role_id));
                    const roleName = roleItem?.name || 'Thành viên';
                    const isSuper = roleItem?.code === 'SUPER_ADMIN' || user.role_id === 'SUPER_ADMIN';
                    const isActive = String(user.status || 'ACTIVE').toUpperCase() === 'ACTIVE';
                    const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('vi-VN') : 'Chưa đăng nhập';

                    return (
                        <tr key={user.id || index} className="group hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => openModal(user)}>
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 uppercase">
                                        {fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{fullName}</p>
                                        <p className="text-[10px] font-bold text-brand-primary">@{user.username}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <Mail size={12} className="text-slate-300" />
                                        {user.email || 'Chưa cập nhật'}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <Phone size={12} className="text-slate-300" />
                                        {user.phone || 'Chưa cập nhật'}
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-2">
                                    <Shield size={14} className={isSuper ? 'text-brand-accent' : 'text-slate-400'} />
                                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{roleName}</span>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                    isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    {isActive ? <UserCheck size={12} /> : <UserX size={12} />}
                                    {isActive ? 'Hoạt động' : 'Bị khóa'}
                                </div>
                            </td>
                            <td className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                {lastLogin}
                            </td>
                            <td className="px-8 py-5 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-white rounded-lg shadow-sm transition-all" onClick={(e) => { e.stopPropagation(); openModal(user); }}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg shadow-sm transition-all" onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                }}
            />

            {/* USER MODAL */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser?.id ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
                size="md"
                footer={
                    <>
                        <button className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-200 transition-colors" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                        <button className="px-6 py-2.5 bg-brand-primary text-white rounded-lg font-semibold text-xs hover:bg-brand-primary/90 transition-all shadow-xs hover:shadow-sm flex items-center gap-2" onClick={handleSave}>
                            <Save size={16} /> Lưu thông tin
                        </button>
                    </>
                }
            >
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdminInput 
                            label="Họ và tên"
                            placeholder="Nhập tên đầy đủ..."
                            icon={UserIcon}
                            value={editingUser?.fullName || editingUser?.fullname || ''} 
                            onChange={(e) => setEditingUser({...editingUser, fullName: e.target.value, fullname: e.target.value})}
                            required
                        />
                        <AdminInput 
                            label="Tên đăng nhập (Username)"
                            placeholder="username_01"
                            icon={Shield}
                            value={editingUser?.username || ''} 
                            onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                            disabled={!!editingUser?.id}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdminInput 
                            label="Địa chỉ Email"
                            placeholder="name@hungthinh.vn"
                            icon={Mail}
                            type="email"
                            value={editingUser?.email || ''} 
                            onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                            required
                        />
                        <AdminInput 
                            label="Số điện thoại"
                            placeholder="0123.456.789"
                            icon={Phone}
                            value={editingUser?.phone || ''} 
                            onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdminSelect 
                            label="Vai trò hệ thống"
                            icon={KeyRound}
                            value={String(editingUser?.roleId || editingUser?.role_id || '')} 
                            onChange={(e) => setEditingUser({...editingUser, roleId: parseInt(e.target.value) || 1, role_id: parseInt(e.target.value) || 1})}
                            options={roles.length > 0 ? roles.map(r => ({ value: r.id.toString(), label: `${r.name} (${r.code})` })) : [
                                { value: '1', label: 'Quản trị viên (ADMIN)' },
                                { value: '2', label: 'Khách hàng (USER)' }
                            ]}
                            required
                        />
                        <AdminSelect 
                            label="Trạng thái tài khoản"
                            value={editingUser?.status || 'ACTIVE'} 
                            onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                            options={[
                                { value: 'ACTIVE', label: 'Đang hoạt động' },
                                { value: 'INACTIVE', label: 'Bị khóa/Tạm ngưng' }
                            ]}
                            required
                        />
                    </div>

                    {!editingUser?.id ? (
                        <AdminInput 
                            label="Mật khẩu khởi tạo"
                            placeholder="••••••••"
                            icon={KeyRound}
                            type="password"
                            value={editingUser?.password || ''}
                            onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                            required
                        />
                    ) : (
                        <AdminInput 
                            label="Đổi mật khẩu mới (để trống nếu không đổi)"
                            placeholder="••••••••"
                            icon={KeyRound}
                            type="password"
                            value={editingUser?.password || ''}
                            onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                        />
                    )}
                </div>
            </AdminModal>
        </div>
    );
}
