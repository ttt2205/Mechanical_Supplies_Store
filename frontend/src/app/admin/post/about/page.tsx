'use client';

import React, { useState } from 'react';
import { 
    Search, 
    Plus, 
    Edit2, 
    Trash2, 
    Info,
    Calendar,
    User,
    CheckCircle2,
    Eye,
    Layout,
    Save,
    Type,
    FileText
} from 'lucide-react';
import { AdminModal, AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/AdminUI';

// Mock data for about us sections/posts
const initialPosts = [
    { id: 1, title: 'Lịch sử hình thành & phát triển', author: 'Admin', category: 'Giới thiệu', views: 890, status: 'published', date: '2024-03-21', excerpt: 'Tóm tắt lịch sử công ty...', content: '<p>Nội dung chi tiết...</p>' },
    { id: 2, title: 'Tầm nhìn - Sứ mệnh - Giá trị cốt lõi', author: 'Admin', category: 'Giới thiệu', views: 1240, status: 'published', date: '2024-03-20', excerpt: 'Giá trị cốt lõi của chúng tôi...', content: '<p>Nội dung chi tiết...</p>' },
    { id: 3, title: 'Năng lực nhân sự & Thiết bị', author: 'Admin', category: 'Giới thiệu', views: 650, status: 'draft', date: '2024-03-15', excerpt: 'Đội ngũ kỹ sư giàu kinh nghiệm...', content: '<p>Nội dung chi tiết...</p>' },
];

export default function AboutManagementPage() {
    const [posts, setPosts] = useState(initialPosts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);

    const openModal = (post: any = null) => {
        setEditingPost(post || {
            title: '',
            status: 'draft',
            excerpt: '',
            content: ''
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Quản lý Trang Giới thiệu</h1>
                    <p className="text-slate-500 font-bold">Chỉnh sửa nội dung các phần hiển thị trong trang giới thiệu công ty.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-brand-primary transition-all flex items-center gap-3 w-fit"
                >
                    <Plus size={18} />
                    Thêm nội dung mới
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative flex flex-col cursor-pointer" onClick={() => openModal(post)}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100 group-hover:bg-brand-primary group-hover:text-white transition-all">
                                <Layout size={24} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${post.status === 'published' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                            </span>
                        </div>
                        
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4 group-hover:text-brand-primary transition-colors flex-grow">
                            {post.title}
                        </h3>

                        <div className="space-y-3 pt-6 border-t border-slate-50">
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span>Lượt xem</span>
                                <span className="text-slate-900">{post.views}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span>Cập nhật</span>
                                <span className="text-slate-900">{post.date}</span>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-brand-primary transition-all" onClick={(e) => { e.stopPropagation(); openModal(post); }}>Chỉnh sửa</button>
                            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-red-500 transition-all border border-slate-100" onClick={(e) => e.stopPropagation()}><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ABOUT MODAL */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPost?.id ? "Chỉnh sửa nội dung giới thiệu" : "Thêm mục giới thiệu mới"}
                size="lg"
                footer={
                    <>
                        <button className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                        <button className="px-10 py-3 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-primary/20 hover:bg-blue-800 transition-all flex items-center gap-2">
                            <Save size={16} /> Lưu nội dung
                        </button>
                    </>
                }
            >
                <div className="space-y-8">
                    <AdminInput 
                        label="Tiêu đề mục (Section Title)"
                        icon={Type}
                        placeholder="Ví dụ: Lịch sử hình thành..."
                        defaultValue={editingPost?.title}
                        required
                    />

                    <AdminSelect 
                        label="Trạng thái hiển thị"
                        defaultValue={editingPost?.status}
                        options={[
                            { value: 'published', label: 'Công khai trên trang Giới thiệu' },
                            { value: 'draft', label: 'Bản nháp/Tạm ẩn' }
                        ]}
                        required
                    />

                    <AdminTextarea 
                        label="Mô tả tóm tắt"
                        rows={3}
                        placeholder="Một vài dòng tóm tắt ngắn gọn..."
                        defaultValue={editingPost?.excerpt}
                    />

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-4 flex items-center gap-2">
                            Nội dung chi tiết (HTML/Rich Text) <FileText size={12} />
                        </label>
                        <AdminTextarea 
                            rows={12}
                            placeholder="Nhập nội dung chi tiết bài giới thiệu tại đây..."
                            defaultValue={editingPost?.content}
                        />
                    </div>
                </div>
            </AdminModal>
        </div>
    );
}
