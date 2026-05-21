'use client';

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

// Mock data for users
const initialUsers = [
    { id: '1', username: 'admin_thinh', email: 'admin@hungthinh.vn', fullname: 'Nguyễn Hưng Thịnh', role: 'Admin', role_id: 'admin', status: 'active', phone: '0901.234.567', lastLogin: '2024-03-21 08:30' },
    { id: '2', username: 'hoang_mech', email: 'hoang.le@gmail.com', fullname: 'Lê Minh Hoàng', role: 'Editor', role_id: 'editor', status: 'active', phone: '0908.765.432', lastLogin: '2024-03-20 14:15' },
    { id: '3', username: 'customer_01', email: 'vantu@outlook.com', fullname: 'Trần Văn Tú', role: 'User', role_id: 'user', status: 'inactive', phone: '028.3848.xxxx', lastLogin: '2024-03-15 10:00' },
    { id: '4', username: 'thuy_sales', email: 'thuy.nguyen@hungthinh.vn', fullname: 'Nguyễn Thị Thủy', role: 'Editor', role_id: 'editor', status: 'active', phone: '0912.333.444', lastLogin: '2024-03-21 09:12' },
    { id: '5', username: 'phuc_kithuat', email: 'phuc.ho@hungthinh.vn', fullname: 'Hồ Hoàng Phúc', role: 'User', role_id: 'user', status: 'active', phone: '0988.999.888', lastLogin: '2024-03-19 16:45' },
];

export default function UserManagementPage() {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    const openModal = (user: any = null) => {
        setEditingUser(user || {
            fullname: '',
            username: '',
            email: '',
            phone: '',
            role_id: 'user',
            status: 'active'
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Quản lý người dùng</h1>
                    <p className="text-slate-500 font-bold">Danh sách tất cả tài khoản truy cập vào hệ thống.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-primary/20 hover:bg-blue-800 transition-all flex items-center gap-3 w-fit"
                >
                    <Plus size={18} />
                    Thêm người dùng mới
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên, email, username..." 
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-6 py-3 focus:bg-white focus:border-brand-primary outline-none transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <select className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-3 outline-none text-sm font-bold text-slate-700 focus:border-brand-primary transition-all appearance-none cursor-pointer min-w-[140px]">
                        <option value="">Tất cả Vai trò</option>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="user">User</option>
                    </select>
                    <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <Filter size={14} /> Lọc
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Người dùng</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Liên hệ</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Vai trò</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trạng thái</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Truy cập cuối</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => openModal(user)}>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0">
                                                {user.fullname.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{user.fullname}</p>
                                                <p className="text-[10px] font-bold text-brand-primary">@{user.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                <Mail size={12} className="text-slate-300" />
                                                {user.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                <Phone size={12} className="text-slate-300" />
                                                {user.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className={user.role === 'Admin' ? 'text-brand-accent' : 'text-slate-400'} />
                                            <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                            user.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            {user.status === 'active' ? <UserCheck size={12} /> : <UserX size={12} />}
                                            {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                        {user.lastLogin}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-white rounded-lg shadow-sm transition-all" onClick={(e) => { e.stopPropagation(); openModal(user); }}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg shadow-sm transition-all" onClick={(e) => e.stopPropagation()}>
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg shadow-sm transition-all" onClick={(e) => e.stopPropagation()}>
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Hiển thị 1 - 5 trong số 24 người dùng</p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-300 cursor-not-allowed">
                            <ChevronLeft size={20} />
                        </button>
                        {[1, 2, 3].map(p => (
                            <button key={p} className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${p === 1 ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-400 hover:bg-white'}`}>
                                {p}
                            </button>
                        ))}
                        <button className="p-2 text-slate-400 hover:text-brand-primary transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* USER MODAL */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser?.id ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
                size="md"
                footer={
                    <>
                        <button className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                        <button className="px-10 py-3 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-primary/20 hover:bg-blue-800 transition-all flex items-center gap-2">
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
                            defaultValue={editingUser?.fullname}
                            required
                        />
                        <AdminInput 
                            label="Tên đăng nhập (Username)"
                            placeholder="username_01"
                            icon={Shield}
                            defaultValue={editingUser?.username}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdminInput 
                            label="Địa chỉ Email"
                            placeholder="name@hungthinh.vn"
                            icon={Mail}
                            type="email"
                            defaultValue={editingUser?.email}
                            required
                        />
                        <AdminInput 
                            label="Số điện thoại"
                            placeholder="0123.456.789"
                            icon={Phone}
                            defaultValue={editingUser?.phone}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdminSelect 
                            label="Vai trò hệ thống"
                            icon={KeyRound}
                            defaultValue={editingUser?.role_id}
                            options={[
                                { value: 'admin', label: 'Siêu quản trị (Admin)' },
                                { value: 'editor', label: 'Biên tập viên (Editor)' },
                                { value: 'user', label: 'Khách hàng (User)' }
                            ]}
                            required
                        />
                        <AdminSelect 
                            label="Trạng thái tài khoản"
                            defaultValue={editingUser?.status}
                            options={[
                                { value: 'active', label: 'Đang hoạt động' },
                                { value: 'inactive', label: 'Bị khóa/Tạm ngưng' }
                            ]}
                            required
                        />
                    </div>

                    {!editingUser?.id && (
                        <AdminInput 
                            label="Mật khẩu khởi tạo"
                            placeholder="••••••••"
                            icon={KeyRound}
                            type="password"
                            required
                        />
                    )}
                </div>
            </AdminModal>
        </div>
    );
}
