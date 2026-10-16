'use client';

import React, { useState } from 'react';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Calendar,
    User,
    CheckCircle2,
    Clock,
    Image as ImageIcon,
    Save,
    Type,
    Layers,
    Link as LinkIcon,
    Loader2
} from 'lucide-react';
import { AdminModal, AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/AdminUI';
import { AdminPostSectionsEditor, FormSection } from '@/components/admin/AdminPostSectionsEditor';
import { usePosts } from '@/hooks/usePosts';
import { useToastStore } from '@/store/useToastStore';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';

interface NewsFormState {
    id?: number;
    title: string;
    slug: string;
    excerpt: string;
    thumbnail: string;
    status: string;
    categoryId?: string | number;
    sections: FormSection[];
}

const defaultFormData: NewsFormState = {
    title: '',
    slug: '',
    excerpt: '',
    thumbnail: '',
    status: 'published',
    categoryId: 'news',
    sections: [
        {
            heading: '1. Giới thiệu tổng quan',
            content: '',
            order: 1
        }
    ]
};

export default function NewsManagementPage() {
    const { posts, loading, fetchPosts, createPost, updatePost, deletePost } = usePosts('NEWS');
    const { addToast } = useToastStore();
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<NewsFormState>(defaultFormData);

    // State for Category Modal
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('ALL');

    const openModal = (post: any = null) => {
        if (post) {
            const initialSections: FormSection[] = post.sections && post.sections.length > 0
                ? post.sections.map((s: any, idx: number) => ({
                    id: s.id,
                    heading: s.heading || `Mục #${idx + 1}`,
                    content: s.content || '',
                    order: s.order || idx + 1
                }))
                : [
                    {
                        heading: '1. Nội dung chi tiết',
                        content: post.excerpt || '',
                        order: 1
                    }
                ];

            setFormData({
                id: post.id,
                title: post.title || '',
                slug: post.slug || '',
                excerpt: post.excerpt || '',
                thumbnail: post.thumbnail || '',
                status: post.status || 'published',
                categoryId: post.categoryId || 'news',
                sections: initialSections
            });
        } else {
            setFormData(defaultFormData);
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            addToast('Vui lòng nhập tiêu đề bài viết', 'error');
            return;
        }

        if (!formData.sections || formData.sections.length === 0) {
            addToast('Vui lòng thêm ít nhất 1 đoạn mục nội dung', 'error');
            return;
        }

        try {
            setIsSaving(true);
            const payload: any = {
                title: formData.title.trim(),
                slug: formData.slug.trim() || undefined,
                excerpt: formData.excerpt.trim() || '',
                thumbnail: formData.thumbnail.trim() || '',
                status: formData.status,
                postType: 'NEWS',
                sections: formData.sections.map((sec, idx) => ({
                    heading: sec.heading.trim() || `Mục #${idx + 1}`,
                    content: sec.content || '',
                    order: idx + 1
                }))
            };

            if (formData.id) {
                await updatePost(formData.id, payload);
                addToast('Cập nhật bài viết thành công!', 'success');
            } else {
                await createPost(payload);
                addToast('Tạo bài viết mới thành công!', 'success');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Save post error:', error);
            addToast('Không thể lưu bài viết. Vui lòng kiểm tra lại.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
            try {
                await deletePost(id);
                addToast('Đã xóa bài viết thành công!', 'success');
            } catch (error) {
                addToast('Không thể xóa bài viết.', 'error');
            }
        }
    };

    const newsPosts = posts.filter((p: any) => {
        const matchesType = !p.postType || p.postType.toUpperCase() === 'NEWS';
        if (!matchesType) return false;
        if (filterStatus !== 'ALL' && p.status !== filterStatus) return false;
        return true;
    });

    const actionButtons = (
        <div className="flex gap-4">
            <button 
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="bg-slate-50 text-slate-600 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-slate-100 hover:bg-white transition-all flex items-center gap-3 w-fit"
            >
                <Layers size={18} />
                Danh mục bài viết
            </button>
            <button 
                type="button"
                onClick={() => openModal()}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-brand-primary transition-all flex items-center gap-3 w-fit"
            >
                <Plus size={18} />
                Viết bài mới
            </button>
        </div>
    );

    const tableHeader = (
        <tr>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Hình ảnh</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Bài viết</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng thái</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Thống kê</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Thao tác</th>
        </tr>
    );

    const renderRow = (post: any, index: number) => (
        <tr key={post.id || index} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => openModal(post)}>
            <td className="px-6 py-4">
                <div className="w-24 h-16 rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200">
                    {post.thumbnail ? (
                        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={14} /></div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="font-black text-slate-900 line-clamp-1">{post.title}</div>
                <div className="text-xs font-bold text-slate-500 mt-1">
                    {post.sections?.length ? `${post.sections.length} đoạn mục` : '1 đoạn mục'} • {post.slug || 'Chưa có slug'}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    post.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                    {post.status === 'published' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold">
                        <User size={12} /> {post.authorId?.toString() || 'Ban biên tập'}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold">
                        <Calendar size={12} /> {new Date(post.creationTime || Date.now()).toLocaleDateString('vi-VN')}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openModal(post); }}
                        className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"
                        title="Chỉnh sửa"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Xóa"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="space-y-8 pb-20">
            <AdminPageLayout
                title="Quản lý Tin tức"
                description="Viết và quản lý các bài viết tin tức, sự kiện của công ty."
                actionButton={actionButtons}
                data={newsPosts}
                filters={
                    <>
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)} 
                            className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-brand-primary text-slate-700 font-medium"
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="published">Đã xuất bản</option>
                            <option value="draft">Bản nháp</option>
                        </select>
                    </>
                }
                searchKey={(item) => (item.title || '') + ' ' + (item.slug || '')}
                searchPlaceholder="Tìm tiêu đề hoặc đường dẫn bài viết..."
                tableHeader={tableHeader}
                renderRow={renderRow}
                isLoading={loading}
                onRefresh={fetchPosts}
                colSpan={5}
            />

            {/* POST MODAL */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => !isSaving && setIsModalOpen(false)}
                title={formData?.id ? "Biên tập bài viết" : "Viết bài mới"}
                size="xl"
                footer={
                    <>
                        <button 
                            type="button"
                            disabled={isSaving}
                            className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-200 transition-colors disabled:opacity-50" 
                            onClick={() => setIsModalOpen(false)}
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="button"
                            disabled={isSaving}
                            onClick={handleSave}
                            className="px-6 py-2.5 bg-brand-primary text-white rounded-lg font-semibold text-xs hover:bg-brand-primary/90 transition-all shadow-xs hover:shadow-sm flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save size={16} /> Lưu bài viết
                                </>
                            )}
                        </button>
                    </>
                }
            >
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-8 space-y-6">
                            <AdminInput 
                                label="Tiêu đề bài viết"
                                icon={Type}
                                placeholder="Nhập tiêu đề bài viết hấp dẫn..."
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                required
                            />

                            <AdminInput 
                                label="Đường dẫn tĩnh (Slug)"
                                icon={LinkIcon}
                                placeholder="Tự động tạo từ tiêu đề hoặc nhập slug riêng..."
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            />
                            
                            <AdminTextarea 
                                label="Tóm tắt ngắn (Excerpt)"
                                rows={3}
                                placeholder="Mô tả ngắn gọn nội dung bài viết hiển thị ở trang danh sách..."
                                value={formData.excerpt}
                                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                required
                            />

                            {/* SECTIONS & RICH TEXT EDITOR */}
                            <AdminPostSectionsEditor 
                                sections={formData.sections}
                                onChange={(newSections) => setFormData(prev => ({ ...prev, sections: newSections }))}
                            />
                        </div>

                        {/* Sidebar Info Area */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Thumbnail */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-2">
                                    Ảnh đại diện (Thumbnail)
                                </label>
                                <div className="aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 relative overflow-hidden group">
                                    {formData.thumbnail ? (
                                        <img 
                                            src={formData.thumbnail} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <ImageIcon size={32} className="mx-auto text-slate-300 mb-2" />
                                            <span className="text-xs font-bold text-slate-400">Chưa có ảnh đại diện</span>
                                        </div>
                                    )}
                                </div>

                                <AdminInput 
                                    label="Đường dẫn ảnh (URL hoặc đường dẫn file)"
                                    placeholder="https://... hoặc /images/news/..."
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                                />
                            </div>

                            <AdminSelect 
                                label="Danh mục bài viết"
                                value={formData.categoryId || 'news'}
                                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                                options={[
                                    { value: 'news', label: 'Tin tức & Sự kiện' },
                                    { value: 'tech', label: 'Kiến thức kỹ thuật' },
                                    { value: 'event', label: 'Hoạt động công ty' }
                                ]}
                                required
                            />

                            <AdminSelect 
                                label="Trạng thái hiển thị"
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
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

            {/* CATEGORY MODAL */}
            <AdminModal 
                isOpen={isCategoryModalOpen} 
                onClose={() => setIsCategoryModalOpen(false)}
                title="Quản lý danh mục bài viết"
                size="md"
                footer={
                    <>
                        <button 
                            type="button"
                            className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all" 
                            onClick={() => setIsCategoryModalOpen(false)}
                        >
                            Đóng
                        </button>
                    </>
                }
            >
                <div className="space-y-4 text-center py-6">
                    <Layers size={40} className="mx-auto text-brand-primary opacity-60" />
                    <h4 className="text-base font-black text-slate-800 uppercase">Danh mục bài viết</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Hệ thống hiện phân loại bài viết theo các nhóm chính: Tin tức & Sự kiện, Kiến thức kỹ thuật, Hoạt động công ty.
                    </p>
                </div>
            </AdminModal>
        </div>
    );
}
