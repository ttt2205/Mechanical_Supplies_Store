'use client';

import React, { useState } from 'react';
import { 
    Search, 
    Plus, 
    Filter, 
    Edit2, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    Eye,
    Calendar,
    User,
    CheckCircle2,
    Clock,
    Wrench,
    Image as ImageIcon,
    Save,
    Type,
    FileText
} from 'lucide-react';
import { AdminModal, AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/AdminUI';

// Mock data for service posts
const initialPosts = [
    { id: 1, title: 'Bảo trì hệ thống thủy lực công nghiệp', author: 'Kỹ sư Thắng', category: 'Bảo trì', category_id: 'maintenance', views: 3450, status: 'published', date: '2024-03-21', thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=200', excerpt: 'Dịch vụ bảo trì hệ thống thủy lực...' },
    { id: 2, title: 'Gia công ống thủy lực theo yêu cầu', author: 'Minh Hoàng', category: 'Gia công', category_id: 'fabrication', views: 2890, status: 'published', date: '2024-03-18', thumbnail: 'https://images.unsplash.com/photo-1565608438257-fac3c27beb36?q=80&w=200', excerpt: 'Nhận gia công ống các loại...' },
    { id: 3, title: 'Dịch vụ bấm đầu ống tận nơi', author: 'Admin', category: 'Sửa chữa', category_id: 'repair', views: 1560, status: 'draft', date: '2024-03-15', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200', excerpt: 'Hỗ trợ kỹ thuật tận nơi 24/7...' },
];

export default function ServicesManagementPage() {
    const [posts, setPosts] = useState(initialPosts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);

    const openModal = (service: any = null) => {
        setEditingService(service || {
            title: '',
            category_id: 'maintenance',
            status: 'draft',
            excerpt: '',
            content: '',
            thumbnail: ''
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2 flex items-center gap-4">
                         Quản lý Dịch vụ
                    </h1>
                    <p className="text-slate-500 font-bold">Quản lý các bài giới thiệu dịch vụ kỹ thuật của Hưng Thịnh.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-brand-primary transition-all flex items-center gap-3 w-fit"
                >
                    <Plus size={18} />
                    Thêm dịch vụ mới
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm tên dịch vụ..." 
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-6 py-3 focus:bg-white focus:border-brand-primary outline-none transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400"
                    />
                </div>
                <div className="flex gap-4">
                    <select className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-3 outline-none text-sm font-bold text-slate-700 focus:border-brand-primary appearance-none cursor-pointer min-w-[160px]">
                        <option value="">Tất cả Nhóm</option>
                        <option value="1">Bảo trì</option>
                        <option value="2">Gia công</option>
                        <option value="3">Sửa chữa</option>
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col md:flex-row items-center gap-8 cursor-pointer" onClick={() => openModal(post)}>
                        <div className="w-full md:w-32 h-24 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 relative group-hover:shadow-lg transition-all">
                            <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>

                        <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-0.5 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded">
                                    {post.category}
                                </span>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${post.status === 'published' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {post.status === 'published' ? 'Hoạt động' : 'Đang ẩn'}
                                </span>
                            </div>
                            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight group-hover:text-brand-primary transition-colors">{post.title}</h3>
                            <div className="flex items-center gap-6 mt-3">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                                    <User size={12} /> {post.author}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                                    <Eye size={12} /> {post.views} lượt xem
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-brand-primary hover:text-white transition-all" onClick={(e) => { e.stopPropagation(); openModal(post); }}>Sửa</button>
                            <button className="p-2.5 text-slate-300 hover:text-red-500 transition-colors" onClick={(e) => e.stopPropagation()}><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* SERVICE MODAL */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingService?.id ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
                size="xl"
                footer={
                    <>
                        <button className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                        <button className="px-10 py-3 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-primary/20 hover:bg-blue-800 transition-all flex items-center gap-2">
                            <Save size={16} /> Lưu dịch vụ
                        </button>
                    </>
                }
            >
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Main Content Area */}
                        <div className="lg:col-span-8 space-y-8">
                            <AdminInput 
                                label="Tên dịch vụ kỹ thuật"
                                icon={Type}
                                placeholder="Nhập tên dịch vụ..."
                                defaultValue={editingService?.title}
                                required
                            />
                            
                            <AdminTextarea 
                                label="Mô tả dịch vụ (Tóm tắt)"
                                rows={3}
                                placeholder="Nhập mô tả ngắn cho dịch vụ..."
                                defaultValue={editingService?.excerpt}
                                required
                            />

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-4">Nội dung chi tiết dịch vụ</label>
                                <div className="min-h-[300px] w-full bg-slate-50 border-2 border-slate-50 rounded-3xl p-8 text-slate-400 font-bold italic flex items-center justify-center border-dashed">
                                    <div className="text-center">
                                        <Wrench size={48} className="mx-auto mb-4 opacity-20" />
                                        Rich Text Editor cho nội dung kỹ thuật
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info Area */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-4">Ảnh minh họa</label>
                                <div className="aspect-video bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 relative overflow-hidden group cursor-pointer hover:border-brand-primary transition-all">
                                    {editingService?.thumbnail ? (
                                        <img src={editingService.thumbnail} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon size={32} strokeWidth={1} />
                                    )}
                                    <div className="absolute inset-0 bg-brand-primary/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus size={24} className="text-white" />
                                    </div>
                                </div>
                            </div>

                            <AdminSelect 
                                label="Nhóm dịch vụ"
                                defaultValue={editingService?.category_id}
                                options={[
                                    { value: 'maintenance', label: 'Bảo hành & Bảo trì' },
                                    { value: 'fabrication', label: 'Gia công kỹ thuật' },
                                    { value: 'repair', label: 'Sửa chữa thiết bị' }
                                ]}
                                required
                            />

                            <AdminSelect 
                                label="Trạng thái dịch vụ"
                                defaultValue={editingService?.status}
                                options={[
                                    { value: 'published', label: 'Đang cung cấp' },
                                    { value: 'draft', label: 'Đang chuẩn bị' }
                                ]}
                                required
                            />
                        </div>
                    </div>
                </div>
            </AdminModal>
        </div>
    );
}
