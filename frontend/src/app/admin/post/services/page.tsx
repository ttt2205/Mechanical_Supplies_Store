'use client';

import React, { useState } from 'react';
import { 
    Plus, 
    Trash2, 
    Eye, 
    User, 
    Image as ImageIcon,
    Save,
    Type,
    Layers,
    Link as LinkIcon,
    Loader2
} from 'lucide-react';
import { AdminModal, AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/AdminUI';
import { AdminPostSectionsEditor, FormSection } from '@/components/admin/AdminPostSectionsEditor';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { usePosts } from '@/hooks/usePosts';
import { useProductCategories } from '@/hooks/useProductCategories';
import { useToastStore } from '@/store/useToastStore';
import { fetchApi } from '@/lib/api';

interface ServiceFormState {
    id?: number;
    title: string;
    slug: string;
    excerpt: string;
    thumbnail: string;
    status: string;
    categoryId?: string | number;
    sections: FormSection[];
}

const defaultFormData: ServiceFormState = {
    title: '',
    slug: '',
    excerpt: '',
    thumbnail: '',
    status: 'published',
    categoryId: '',
    sections: [
        {
            heading: '1. Giới thiệu dịch vụ & Phạm vi áp dụng',
            content: '',
            order: 1
        }
    ]
};

export default function ServicesManagementPage() {
    const { posts, loading, fetchPosts, createPost, updatePost, deletePost } = usePosts('SERVICE');
    const { categories, refresh: refreshCategories } = useProductCategories("SERVICE");
    const { addToast } = useToastStore();
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<ServiceFormState>(defaultFormData);

    // State for Category Modal (đồng bộ với phần thêm danh mục trong sản phẩm)
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categoryFormData, setCategoryFormData] = useState({
        name: '', 
        code: '', 
        description: '', 
        parentId: '', 
        displayOrder: 0, 
        status: 'ACTIVE', 
        icon: 'Wrench'
    });
    const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

    // Filters
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterCategory, setFilterCategory] = useState('ALL');

    const openModal = (service: any = null) => {
        if (service) {
            const initialSections: FormSection[] = service.sections && service.sections.length > 0
                ? service.sections.map((s: any, idx: number) => ({
                    id: s.id,
                    heading: s.heading || `Mục #${idx + 1}`,
                    content: s.content || '',
                    order: s.order || idx + 1
                }))
                : [
                    {
                        heading: '1. Giới thiệu dịch vụ & Quy trình',
                        content: service.excerpt || '',
                        order: 1
                    }
                ];

            setFormData({
                id: service.id,
                title: service.title || '',
                slug: service.slug || '',
                excerpt: service.excerpt || '',
                thumbnail: service.thumbnail || '',
                status: service.status || 'published',
                categoryId: service.categoryId || service.category_id || (categories.length > 0 ? categories[0].category_id : ''),
                sections: initialSections
            });
        } else {
            setFormData({
                ...defaultFormData,
                categoryId: categories.length > 0 ? categories[0].category_id : ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            addToast('Vui lòng nhập tên dịch vụ kỹ thuật', 'error');
            return;
        }

        if (!formData.sections || formData.sections.length === 0) {
            addToast('Vui lòng thêm ít nhất 1 đoạn mục nội dung cho dịch vụ', 'error');
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
                categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
                postType: 'SERVICE',
                sections: formData.sections.map((sec, idx) => ({
                    heading: sec.heading.trim() || `Mục #${idx + 1}`,
                    content: sec.content || '',
                    order: idx + 1
                }))
            };

            if (formData.id) {
                await updatePost(formData.id, payload);
                addToast('Cập nhật dịch vụ thành công!', 'success');
            } else {
                await createPost(payload);
                addToast('Thêm dịch vụ mới thành công!', 'success');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Save service error:', error);
            addToast('Không thể lưu dịch vụ. Vui lòng kiểm tra lại.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
            try {
                await deletePost(id);
                addToast('Đã xóa dịch vụ thành công!', 'success');
            } catch (error) {
                addToast('Không thể xóa dịch vụ.', 'error');
            }
        }
    };

    const handleCategorySubmit = async () => {
        if (!categoryFormData.name.trim() || !categoryFormData.code.trim()) {
            addToast('Vui lòng điền tên và mã danh mục dịch vụ', 'error');
            return;
        }

        if (!categoryFormData.parentId) {
            addToast('Vui lòng chọn danh mục cha tương ứng. Các danh mục mới bắt buộc phải thuộc một danh mục cha.', 'error');
            return;
        }

        try {
            setIsSubmittingCategory(true);
            const slug = categoryFormData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const res = await fetchApi('/Categories', {
                method: 'POST',
                body: JSON.stringify({
                    name: categoryFormData.name.trim(),
                    code: categoryFormData.code.trim(),
                    slug: slug || categoryFormData.code.toLowerCase().trim(),
                    description: categoryFormData.description,
                    parentId: categoryFormData.parentId ? Number(categoryFormData.parentId) : null,
                    displayOrder: categoryFormData.displayOrder,
                    status: categoryFormData.status,
                    icon: categoryFormData.icon || 'Wrench',
                    type: 'SERVICE'
                })
            });

            if (res) {
                addToast('Tạo danh mục dịch vụ mới thành công', 'success');
                await refreshCategories();
                setIsCategoryModalOpen(false);
                setCategoryFormData({
                    name: '', code: '', description: '', parentId: '', displayOrder: 0, status: 'ACTIVE', icon: 'Wrench'
                });
            } else {
                addToast('Không thể tạo danh mục dịch vụ', 'error');
            }
        } catch (error: any) {
            addToast(error?.message || 'Lỗi khi tạo danh mục dịch vụ', 'error');
        } finally {
            setIsSubmittingCategory(false);
        }
    };

    const filteredPosts = posts.filter((item: any) => {
        if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;
        if (filterCategory !== 'ALL' && String(item.categoryId || item.category_id) !== filterCategory) return false;
        return true;
    });

    return (
        <div className="space-y-8 pb-20">
            <AdminPageLayout
                title="Quản lý Dịch vụ"
                description="Quản lý các bài giới thiệu dịch vụ kỹ thuật của Hưng Thịnh."
                actionButton={
                    <div className="flex flex-wrap items-center gap-3">
                        <button 
                            type="button"
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="bg-slate-50 text-slate-600 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-slate-100 hover:bg-white transition-all flex items-center gap-3 w-fit"
                        >
                            <Layers size={16} />
                            Thêm danh mục
                        </button>
                        <button 
                            type="button"
                            onClick={() => openModal()}
                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-brand-primary transition-all flex items-center gap-3 w-fit"
                        >
                            <Plus size={16} />
                            Thêm dịch vụ mới
                        </button>
                    </div>
                }
                data={filteredPosts}
                filters={
                    <>
                        <select 
                            value={filterCategory} 
                            onChange={(e) => setFilterCategory(e.target.value)} 
                            className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-brand-primary text-slate-700 font-medium"
                        >
                            <option value="ALL">Tất cả nhóm dịch vụ</option>
                            {categories.map((c: any) => (
                                <option key={c.category_id} value={c.category_id.toString()}>{c.name}</option>
                            ))}
                        </select>
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)} 
                            className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-brand-primary text-slate-700 font-medium"
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="published">Đang cung cấp</option>
                            <option value="draft">Đang chuẩn bị</option>
                        </select>
                    </>
                }
                searchKey={(item: any) => (item.title || '') + ' ' + (item.slug || '')}
                searchPlaceholder="Tìm tên dịch vụ hoặc đường dẫn..."
                isLoading={loading}
                onRefresh={async () => { await Promise.all([fetchPosts(), refreshCategories()]); }}
                colSpan={1}
                tableHeader={
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider rounded-tl-2xl rounded-tr-2xl">Danh sách Dịch vụ</th>
                    </tr>
                }
                renderRow={(post: any) => {
                    const postCategory = categories.find(c => c.category_id.toString() === (post.categoryId || post.category_id)?.toString());
                    return (
                        <tr key={post.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group" onClick={() => openModal(post)}>
                            <td className="px-6 py-4">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="w-full md:w-32 h-24 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 relative group-hover:shadow-lg transition-all">
                                        {post.thumbnail ? (
                                            <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-2 py-0.5 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded">
                                                {postCategory?.name || post.categoryId || 'Dịch vụ'}
                                            </span>
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${post.status === 'published' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                {post.status === 'published' ? 'Hoạt động' : 'Đang chuẩn bị'}
                                            </span>
                                        </div>
                                        <h3 className="text-base font-black text-slate-900 uppercase tracking-tight group-hover:text-brand-primary transition-colors">
                                            {post.title}
                                        </h3>
                                        <div className="text-xs font-bold text-slate-500 mt-1">
                                            {post.sections?.length ? `${post.sections.length} đoạn mục` : '1 đoạn mục'} • {post.slug || 'Chưa có slug'}
                                        </div>
                                        <div className="flex items-center gap-6 mt-3">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                                                <User size={12} /> {post.authorId?.toString() || 'Kỹ thuật Hưng Thịnh'}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                                                <Eye size={12} /> {post.views || 0} lượt xem
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            type="button"
                                            className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-brand-primary hover:text-white transition-all" 
                                            onClick={(e) => { e.stopPropagation(); openModal(post); }}
                                        >
                                            Sửa
                                        </button>
                                        <button 
                                            type="button"
                                            className="p-2.5 text-slate-300 hover:text-red-500 transition-colors" 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    );
                }}
            />

            {/* SERVICE MODAL */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => !isSaving && setIsModalOpen(false)}
                title={formData?.id ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
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
                                    <Save size={16} /> Lưu dịch vụ
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
                                label="Tên dịch vụ kỹ thuật"
                                icon={Type}
                                placeholder="Nhập tên dịch vụ..."
                                value={formData.title} 
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                required
                            />

                            <AdminInput 
                                label="Đường dẫn tĩnh (Slug)"
                                icon={LinkIcon}
                                placeholder="Tự động tạo từ tên dịch vụ hoặc nhập slug riêng..."
                                value={formData.slug} 
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            />
                            
                            <AdminTextarea 
                                label="Mô tả dịch vụ (Tóm tắt)"
                                rows={3}
                                placeholder="Nhập mô tả ngắn cho dịch vụ hiển thị ở trang danh sách..."
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
                                    Ảnh minh họa dịch vụ
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
                                            <span className="text-xs font-bold text-slate-400">Chưa có ảnh minh họa</span>
                                        </div>
                                    )}
                                </div>

                                <AdminInput 
                                    label="Đường dẫn ảnh (URL hoặc đường dẫn file)"
                                    placeholder="https://... hoặc /images/services/..."
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                                />
                            </div>

                            <AdminSelect 
                                label="Nhóm danh mục dịch vụ"
                                icon={Layers}
                                value={formData.categoryId?.toString() || ''} 
                                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value ? Number(e.target.value) : '' }))}
                                options={[
                                    { value: '', label: '-- Chọn nhóm dịch vụ --' },
                                    ...categories.map(c => ({ 
                                        value: c.category_id.toString(), 
                                        label: `${!c.parent_id ? '[Gốc] ' : '  └ '}${c.name}` 
                                    }))
                                ]}
                                required
                            />

                            <AdminSelect 
                                label="Trạng thái dịch vụ"
                                value={formData.status} 
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
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

            {/* CATEGORY MODAL - ĐỒNG BỘ HOÀN TOÀN VỚI PHẦN THÊM DANH MỤC TRONG SẢN PHẨM */}
            <AdminModal 
                isOpen={isCategoryModalOpen} 
                onClose={() => setIsCategoryModalOpen(false)}
                title="Thêm danh mục dịch vụ mới"
                size="md"
                footer={
                    <>
                        <button 
                            type="button"
                            className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-200 transition-colors" 
                            onClick={() => setIsCategoryModalOpen(false)}
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="button"
                            disabled={isSubmittingCategory}
                            onClick={handleCategorySubmit}
                            className="px-6 py-2.5 bg-brand-primary text-white rounded-lg font-semibold text-xs hover:bg-brand-primary/90 transition-all shadow-xs hover:shadow-sm flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmittingCategory ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Save size={16} />} 
                            Tạo danh mục
                        </button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdminInput 
                            label="Tên danh mục" 
                            placeholder="Ví dụ: Bảo dưỡng trạm nguồn..." 
                            value={categoryFormData.name}
                            onChange={(e: any) => setCategoryFormData(p => ({ ...p, name: e.target.value }))}
                            required
                        />
                        <AdminInput 
                            label="Mã danh mục" 
                            placeholder="Ví dụ: DV-BH-TN..." 
                            value={categoryFormData.code}
                            onChange={(e: any) => setCategoryFormData(p => ({ ...p, code: e.target.value }))}
                            required
                        />
                    </div>
                    <AdminSelect
                        label="Danh mục cha (Bắt buộc)"
                        value={categoryFormData.parentId}
                        onChange={(e: any) => setCategoryFormData(p => ({ ...p, parentId: e.target.value }))}
                        required
                        options={[
                            { value: '', label: '-- Chọn danh mục cha tương ứng (Bắt buộc) --' },
                            ...categories
                                .sort((a, b) => {
                                    if (!a.parent_id && b.parent_id) return -1;
                                    if (a.parent_id && !b.parent_id) return 1;
                                    return (a.display_order ?? 0) - (b.display_order ?? 0);
                                })
                                .map(c => ({
                                    value: c.category_id.toString(),
                                    label: `${!c.parent_id ? '[Cấp 1] ' : '  └ [Cấp 2] '}[${c.code}] ${c.name}`
                                }))
                        ]}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdminInput 
                            label="Thứ tự hiển thị" 
                            type="number"
                            value={categoryFormData.displayOrder}
                            onChange={(e: any) => setCategoryFormData(p => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))}
                        />
                        <AdminSelect
                            label="Trạng thái"
                            value={categoryFormData.status}
                            onChange={(e: any) => setCategoryFormData(p => ({ ...p, status: e.target.value }))}
                            options={[
                                { value: 'ACTIVE', label: 'Hoạt động' },
                                { value: 'INACTIVE', label: 'Tạm ẩn' }
                            ]}
                        />
                    </div>
                    <AdminTextarea 
                        label="Mô tả" 
                        placeholder="Mô tả chi tiết nhóm dịch vụ này..." 
                        value={categoryFormData.description}
                        onChange={(e: any) => setCategoryFormData(p => ({ ...p, description: e.target.value }))}
                    />
                </div>
            </AdminModal>
        </div>
    );
}
