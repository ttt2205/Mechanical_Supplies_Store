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
    Image as ImageIcon,
    Save,
    Type,
    FileText
} from 'lucide-react';
import { AdminModal, AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/AdminUI';

// Mock data for news posts
const initialPosts = [
    { id: 1, title: 'Hướng dẫn lựa chọn ống thủy lực phù hợp', author: 'Admin', category: 'Kỹ thuật', category_id: 'tech', views: 1240, status: 'published', date: '2024-03-21', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200', excerpt: 'Tóm tắt bài viết kỹ thuật...' },
    { id: 2, title: 'Công nghệ bấm đầu ống mới nhất 2024', author: 'Minh Hoàng', category: 'Tin tức', category_id: 'news', views: 850, status: 'draft', date: '2024-03-20', thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=200', excerpt: 'Tóm tắt bài công nghệ...' },
    { id: 3, title: 'Hưng Thịnh khai trương chi nhánh mới tại Bình Dương', author: 'Admin', category: 'Sự kiện', category_id: 'event', views: 2100, status: 'published', date: '2024-03-15', thumbnail: 'https://images.unsplash.com/photo-1565608438257-fac3c27beb36?q=80&w=200', excerpt: 'Tóm tắt sự kiện...' },
];

export default function NewsManagementPage() {
    const [posts, setPosts] = useState(initialPosts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);

    const openModal = (post: any = null) => {
        setEditingPost(post || {
            title: '',
            category_id: 'news',
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
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Quản lý Tin tức</h1>
                    <p className="text-slate-500 font-bold">Viết và quản lý các bài viết tin tức, sự kiện của công ty.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-brand-primary transition-all flex items-center gap-3 w-fit"
                >
                    <Plus size={18} />
                    Viết bài mới
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm tiêu đề bài viết..." 
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-6 py-3 focus:bg-white focus:border-brand-primary outline-none transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400"
                    />
                </div>
                <div className="flex gap-4">
                    <select className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-3 outline-none text-sm font-bold text-slate-700 focus:border-brand-primary transition-all appearance-none cursor-pointer">
                        <option value="">Tất cả Trạng thái</option>
                        <option value="published">Đã xuất bản</option>
                        <option value="draft">Bản nháp</option>
                    </select>
                    <button className="bg-slate-50 text-slate-400 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-slate-100 transition-all border-2 border-transparent">
                        <Filter size={14} /> Thêm bộ lọc
                    </button>
                </div>
            </div>

            {/* Posts Grid/List */}
            <div className="grid grid-cols-1 gap-4">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col md:flex-row items-center gap-6 cursor-pointer" onClick={() => openModal(post)}>
                        {/* Thumbnail */}
                        <div className="w-full md:w-40 h-28 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 relative group-hover:shadow-lg transition-all">
                            <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-md rounded-lg text-slate-400">
                                <ImageIcon size={14} />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-grow min-w-0 space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[9px] font-black uppercase tracking-widest rounded-md">
                                    {post.category}
                                </span>
                                <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${
                                    post.status === 'published' ? 'text-emerald-500' : 'text-amber-500'
                                }`}>
                                    {post.status === 'published' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                    {post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-black text-slate-900 leading-tight uppercase group-hover:text-brand-primary transition-colors line-clamp-1">
                                {post.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-tighter">
                                    <User size={14} className="text-slate-300" />
                                    {post.author}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-tighter">
                                    <Calendar size={14} className="text-slate-300" />
                                    {post.date}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-tighter">
                                    <Eye size={14} className="text-slate-300" />
                                    {post.views.toLocaleString()} lượt xem
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 shrink-0 self-center">
                            <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-primary hover:text-white transition-all" onClick={(e) => { e.stopPropagation(); openModal(post); }}>
                                <Edit2 size={14} /> Chỉnh sửa
                            </button>
                            <button className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" onClick={(e) => e.stopPropagation()}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty state simulation */}
            {posts.length === 0 && (
                <div className="text-center py-40 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                    <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Chưa có bài viết nào</h3>
                </div>
            )}

            {/* POST MODAL */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPost?.id ? "Biên tập bài viết" : "Viết bài mới"}
                size="xl"
                footer={
                    <>
                        <button className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                        <button className="px-10 py-3 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-primary/20 hover:bg-blue-800 transition-all flex items-center gap-2">
                            <Save size={16} /> Lưu bài viết
                        </button>
                    </>
                }
            >
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Main Content Area */}
                        <div className="lg:col-span-8 space-y-8">
                            <AdminInput 
                                label="Tiêu đề bài viết"
                                icon={Type}
                                placeholder="Nhập tiêu đề hấp dẫn..."
                                defaultValue={editingPost?.title}
                                required
                            />
                            
                            <AdminTextarea 
                                label="Tóm tắt ngắn (Excerpt)"
                                rows={3}
                                placeholder="Mô tả ngắn gọn nội dung bài viết..."
                                defaultValue={editingPost?.excerpt}
                                required
                            />

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-4">Nội dung chi tiết</label>
                                <div className="min-h-[400px] w-full bg-slate-50 border-2 border-slate-50 rounded-3xl p-8 text-slate-400 font-bold italic flex items-center justify-center border-dashed">
                                    <div className="text-center">
                                        <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                        Khu vực soạn thảo văn bản (Rich Text Editor)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info Area */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-4">Ảnh đại diện (Thumbnail)</label>
                                <div className="aspect-video bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 relative overflow-hidden group cursor-pointer hover:border-brand-primary transition-all">
                                    {editingPost?.thumbnail ? (
                                        <img src={editingPost.thumbnail} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon size={32} strokeWidth={1} />
                                    )}
                                    <div className="absolute inset-0 bg-brand-primary/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus size={24} className="text-white" />
                                    </div>
                                </div>
                            </div>

                            <AdminSelect 
                                label="Danh mục bài viết"
                                defaultValue={editingPost?.category_id}
                                options={[
                                    { value: 'news', label: 'Tin tức & Sự kiện' },
                                    { value: 'tech', label: 'Kiến thức kỹ thuật' },
                                    { value: 'event', label: 'Hoạt động công ty' }
                                ]}
                                required
                            />

                            <AdminSelect 
                                label="Trạng thái hiển thị"
                                defaultValue={editingPost?.status}
                                options={[
                                    { value: 'published', label: 'Công khai (Published)' },
                                    { value: 'draft', label: 'Bản nháp (Draft)' },
                                    { value: 'archived', label: 'Lưu trữ (Archived)' }
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
