'use client';

import React, { useState, useEffect } from 'react';
import { 
    Search, Plus, Filter, Edit2, Trash2, ChevronLeft, ChevronRight,
    Package, Box, Layers, Tag, Image as ImageIcon, CheckCircle2,
    XCircle, ArrowUpRight, MoreHorizontal, Code, DollarSign, Save, Star,
    FileText, Sliders, Type, Sparkles, BookOpen
} from 'lucide-react';
import { AdminModal, AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/AdminUI';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminRichText } from '@/components/admin/AdminRichText';
import { AdminPostSectionsEditor, FormSection } from '@/components/admin/AdminPostSectionsEditor';
import { useProducts } from '@/hooks/useProducts';
import { useProductCategories } from '@/hooks/useProductCategories';
import { useToastStore } from '@/store/useToastStore';
import { useImageUpload } from '@/hooks/useImageUpload';
import { fetchApi } from '@/lib/api';

// Helper chuyển đổi Sections sang HTML và ngược lại
function sectionsToHtml(sections: FormSection[]): string {
    if (!sections || sections.length === 0) return '';
    return sections
        .filter(s => s.heading?.trim() || s.content?.trim())
        .map(s => `<!-- section: ${encodeURIComponent(s.heading || '')} -->\n<div class="product-section mb-8">\n<h3 class="text-xl font-black text-slate-800 uppercase tracking-tight mb-4 flex items-center gap-3"><span class="w-1.5 h-6 bg-brand-primary rounded-full"></span>${s.heading}</h3>\n<div class="prose-content text-slate-600 leading-relaxed font-normal">${s.content}</div>\n</div>`)
        .join('\n\n');
}

function htmlToSections(html: string): FormSection[] {
    if (!html || !html.trim()) {
        return [
            {
                heading: '1. Giới thiệu tổng quan & Ưu điểm nổi bật',
                content: '',
                order: 1
            }
        ];
    }
    
    // Nếu có comment <!-- section: ... -->
    const regex = /<!-- section: (.*?) -->\s*<div class="product-section[^>]*>[\s\S]*?<h3[^>]*>[\s\S]*?<\/h3>\s*<div class="prose-content[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
    const sections: FormSection[] = [];
    let match;
    let idx = 1;
    while ((match = regex.exec(html)) !== null) {
        sections.push({
            heading: decodeURIComponent(match[1]),
            content: match[2],
            order: idx++
        });
    }

    if (sections.length > 0) return sections;

    // Nếu có thẻ <h3> tự nhiên
    const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$)/g;
    idx = 1;
    while ((match = h3Regex.exec(html)) !== null) {
        const headingText = match[1].replace(/<[^>]*>/g, '').trim();
        sections.push({
            heading: headingText,
            content: match[2].trim(),
            order: idx++
        });
    }

    if (sections.length > 0) return sections;

    // Fallback: toàn bộ html vào 1 mục
    return [
        {
            heading: '1. Chi tiết sản phẩm',
            content: html,
            order: 1
        }
    ];
}

export default function ProductManagementPage() {
    const { products, loading, deleteProduct, createProduct, updateProduct, refresh } = useProducts();
    const { categories, refresh: refreshCategories } = useProductCategories("PRODUCT");
    const addToast = useToastStore(state => state.addToast);
    const { isUploading, uploadImage } = useImageUpload();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});
    
    // Tabs trong Modal sản phẩm: 'basic' (Thông tin cơ bản) hoặc 'article' (Bài viết chi tiết)
    const [modalTab, setModalTab] = useState<'basic' | 'article'>('basic');
    // Chế độ soạn thảo trong tab bài viết: 'sections' (Từng đoạn mục) hoặc 'full' (Toàn bài viết)
    const [articleEditorMode, setArticleEditorMode] = useState<'sections' | 'full'>('sections');
    const [productSections, setProductSections] = useState<FormSection[]>([]);

    const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const [galleryFiles, setGalleryFiles] = useState<{id: number, file: File | null, url: string | null}[]>([
        {id: 1, file: null, url: null},
        {id: 2, file: null, url: null},
        {id: 3, file: null, url: null}
    ]);

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categoryFormData, setCategoryFormData] = useState({
        name: '', code: '', description: '', parentId: '', displayOrder: 0, status: 'ACTIVE', icon: ''
    });
    const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [filterFeatured, setFilterFeatured] = useState('ALL');

    const filteredProducts = products.filter((item: any) => {
        if (filterStatus !== 'ALL' && String(item.status).toUpperCase() !== filterStatus) return false;
        if (filterCategory !== 'ALL' && String(item.categoryId) !== filterCategory) return false;
        if (filterFeatured === 'FEATURED' && !(item.isFeatured || item.is_featured)) return false;
        if (filterFeatured === 'NORMAL' && (item.isFeatured || item.is_featured)) return false;
        return true;
    });

    const openModal = (product: any = null) => {
        const newProduct = product ? {
            id: product.id,
            name: product.name || '',
            productCode: product.productCode || '',
            categoryId: product.categoryId || (categories.length > 0 ? categories[0].category_id : 1),
            basePrice: product.basePrice || 0,
            isContactPrice: product.isContactPrice || false,
            isFeatured: Boolean(product.isFeatured ?? product.is_featured ?? false),
            status: product.status || 'ACTIVE',
            stockQuantity: product.stockQuantity || 0,
            shortDescription: product.shortDescription || '',
            content: product.content || '',
            thumbnail: product.thumbnail || ''
        } : {
            name: '',
            productCode: '',
            categoryId: categories.length > 0 ? categories[0].category_id : 1,
            basePrice: 0,
            isContactPrice: false,
            isFeatured: false,
            status: 'ACTIVE',
            stockQuantity: 0,
            shortDescription: '',
            content: '',
            thumbnail: ''
        };
        
        setEditingProduct(newProduct);
        setFormData(newProduct);
        setModalTab('basic');
        setArticleEditorMode('sections');
        setProductSections(htmlToSections(newProduct.content));

        setPendingImageFile(null);
        setImagePreviewUrl(null);
        setGalleryFiles([
            {id: 1, file: null, url: null},
            {id: 2, file: null, url: null},
            {id: 3, file: null, url: null}
        ]);
        setIsModalOpen(true);
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPendingImageFile(file);
        setImagePreviewUrl(URL.createObjectURL(file));
    };

    const handleGalleryUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setGalleryFiles(prev => prev.map(item => 
            item.id === id 
                ? { ...item, file, url: URL.createObjectURL(file) }
                : item
        ));
    };

    const handleSectionsChange = (newSections: FormSection[]) => {
        setProductSections(newSections);
        // Đồng bộ sang content html
        const html = sectionsToHtml(newSections);
        setFormData((prev: any) => ({ ...prev, content: html }));
    };

    const handleFullContentChange = (html: string) => {
        setFormData((prev: any) => ({ ...prev, content: html }));
        // Đồng bộ ngược lại sections
        setProductSections(htmlToSections(html));
    };

    const handleSubmit = async () => {
        try {
            // Xác định nội dung bài viết cuối cùng
            const finalContent = articleEditorMode === 'sections' 
                ? sectionsToHtml(productSections) 
                : (formData.content || '');

            const payload = { 
                ...formData,
                content: finalContent
            };

            let productId = editingProduct?.id;
            
            if (productId) {
                await updateProduct(productId, payload);
                addToast('Cập nhật thông tin và bài viết sản phẩm thành công', 'success');
            } else {
                const res = await createProduct(payload);
                productId = res?.data?.id || res?.id;
                addToast('Thêm mới sản phẩm thành công', 'success');
            }

            if (pendingImageFile && productId) {
                const url = await uploadImage(pendingImageFile, 'product', productId.toString());
                if (url) {
                    await updateProduct(productId, { ...payload, thumbnail: url });
                    addToast('Đã lưu ảnh đại diện thành công', 'success');
                }
            }

            if (productId) {
                for (const item of galleryFiles) {
                    if (item.file) {
                        await uploadImage(item.file, 'product_gallery', productId.toString());
                    }
                }
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error('Submit product error:', error);
            addToast('Có lỗi xảy ra khi lưu sản phẩm', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            await deleteProduct(id);
            addToast('Đã xóa sản phẩm thành công', 'success');
        }
    };

    const handleCategorySubmit = async () => {
        if (!categoryFormData.name.trim() || !categoryFormData.code.trim()) {
            addToast('Vui lòng điền tên và mã danh mục', 'error');
            return;
        }

        if (!categoryFormData.parentId) {
            addToast('Vui lòng chọn danh mục cha tương ứng. Các danh mục mới bắt buộc phải thuộc một danh mục cha.', 'error');
            return;
        }

        try {
            setIsSubmittingCategory(true);
            const res = await fetchApi('/Categories', {
                method: 'POST',
                body: JSON.stringify({
                    name: categoryFormData.name,
                    code: categoryFormData.code,
                    description: categoryFormData.description,
                    parentId: categoryFormData.parentId ? Number(categoryFormData.parentId) : null,
                    displayOrder: categoryFormData.displayOrder,
                    status: categoryFormData.status,
                    icon: categoryFormData.icon
                })
            });

            if (res) {
                addToast('Tạo danh mục mới thành công', 'success');
                await refreshCategories();
                setIsCategoryModalOpen(false);
                setCategoryFormData({
                    name: '', code: '', description: '', parentId: '', displayOrder: 0, status: 'ACTIVE', icon: ''
                });
            } else {
                addToast('Không thể tạo danh mục', 'error');
            }
        } catch (error) {
            addToast('Lỗi khi tạo danh mục', 'error');
        } finally {
            setIsSubmittingCategory(false);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <AdminPageLayout
                title="Quản lý Sản phẩm"
                description="Danh sách thiết bị công nghiệp, cơ khí và phụ tùng."
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
                            Thêm sản phẩm
                        </button>
                    </div>
                }
                data={filteredProducts}
                filters={
                    <>
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)} 
                            className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-brand-primary text-slate-700 font-medium"
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="ACTIVE">Đang bán</option>
                            <option value="INACTIVE">Tạm ngưng</option>
                            <option value="DRAFT">Bản nháp</option>
                        </select>
                        <select 
                            value={filterCategory} 
                            onChange={(e) => setFilterCategory(e.target.value)} 
                            className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-brand-primary text-slate-700 font-medium max-w-[200px]"
                        >
                            <option value="ALL">Tất cả danh mục</option>
                            {categories.map((c) => (
                                <option key={c.category_id} value={String(c.category_id)}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <select 
                            value={filterFeatured} 
                            onChange={(e) => setFilterFeatured(e.target.value)} 
                            className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-brand-primary text-slate-700 font-medium"
                        >
                            <option value="ALL">Tất cả sản phẩm</option>
                            <option value="FEATURED">Sản phẩm nổi bật ⭐</option>
                            <option value="NORMAL">Sản phẩm thường</option>
                        </select>
                    </>
                }
                searchKey={(item: any) => item.name + ' ' + (item.productCode || '')}
                searchPlaceholder="Tìm theo tên hoặc mã sản phẩm..."
                isLoading={loading}
                onRefresh={async () => { await Promise.all([refresh(), refreshCategories()]); }}
                colSpan={6}
                tableHeader={
                    <tr>
                        <th className="px-8 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100">Sản phẩm</th>
                        <th className="px-8 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100">Danh mục</th>
                        <th className="px-8 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100">Trạng thái</th>
                        <th className="px-8 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100 text-right">Tồn kho</th>
                        <th className="px-8 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100 text-right">Đơn giá</th>
                        <th className="px-8 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100"></th>
                    </tr>
                }
                renderRow={(p: any) => {
                    const catName = categories.find(c => c.category_id === p.categoryId)?.name || 'N/A';
                    return (
                        <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => openModal(p)}>
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                                        {p.thumbnail ? <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-slate-300" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight line-clamp-1">{p.name}</p>
                                            {(p.isFeatured || p.is_featured) && (
                                                <span className="shrink-0 px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                                                    <Star size={10} className="fill-amber-500 text-amber-500" />
                                                    Nổi bật
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{p.productCode}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                                    {catName}
                                </span>
                            </td>
                            <td className="px-8 py-5">
                                {p.status === 'ACTIVE' ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                        <CheckCircle2 size={12} /> Đang bán
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest">
                                        <XCircle size={12} /> Tạm ngưng
                                    </span>
                                )}
                            </td>
                            <td className="px-8 py-5 text-right font-black text-slate-700">{p.stockQuantity}</td>
                            <td className="px-8 py-5 text-right font-black text-brand-primary">
                                {p.isContactPrice ? "Liên hệ" : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.basePrice || 0)}
                            </td>
                            <td className="px-8 py-5 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        type="button"
                                        className="p-2 text-slate-400 hover:text-brand-primary hover:bg-white rounded-lg shadow-sm transition-all border border-transparent hover:border-slate-100" 
                                        onClick={(e) => { e.stopPropagation(); openModal(p); }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        type="button"
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg shadow-sm transition-all border border-transparent hover:border-slate-100" 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                }}
            />

            {/* PRODUCT MODAL */}
            <AdminModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={editingProduct?.id ? 'Cập nhật Sản phẩm' : 'Thêm Sản phẩm mới'}
                size="xl"
                footer={
                    <>
                        <button 
                            type="button"
                            className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-200 transition-colors" 
                            onClick={() => setIsModalOpen(false)}
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="button"
                            onClick={handleSubmit} 
                            className="px-6 py-2.5 bg-brand-primary text-white rounded-lg font-semibold text-xs hover:bg-brand-primary/90 transition-all shadow-xs hover:shadow-sm flex items-center gap-2"
                        >
                            <Save size={16} /> {editingProduct?.id ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
                        </button>
                    </>
                }
            >
                <div className="space-y-6">
                    {/* Top Navigation Tabs */}
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                        <button
                            type="button"
                            onClick={() => setModalTab('basic')}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                modalTab === 'basic' 
                                    ? 'bg-slate-900 text-white shadow-md' 
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                        >
                            <Sliders size={16} /> Thông tin cơ bản
                        </button>
                        <button
                            type="button"
                            onClick={() => setModalTab('article')}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                modalTab === 'article' 
                                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' 
                                    : 'text-slate-500 hover:text-brand-primary hover:bg-brand-primary/5'
                            }`}
                        >
                            <FileText size={16} /> Bài viết chi tiết sản phẩm
                            {formData.content?.trim() && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            )}
                        </button>
                    </div>

                    {/* TAB 1: THÔNG TIN CƠ BẢN */}
                    {modalTab === 'basic' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                            {/* Left: Image Upload & Preview */}
                            <div className="lg:col-span-4 space-y-6">
                                <label className="aspect-square bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 relative overflow-hidden group cursor-pointer hover:border-brand-primary transition-all">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    {imagePreviewUrl || formData.thumbnail ? (
                                        <img src={imagePreviewUrl || formData.thumbnail} className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <ImageIcon size={48} className="mb-4 text-slate-200 group-hover:text-brand-primary/50 transition-colors" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-brand-primary transition-colors">Tải ảnh lên</span>
                                        </>
                                    )}
                                    {(imagePreviewUrl || formData.thumbnail) && (
                                        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <Edit2 size={14} /> Thay đổi ảnh
                                            </span>
                                        </div>
                                    )}
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    {galleryFiles.map(item => (
                                        <label key={item.id} className="aspect-square bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center text-slate-300 hover:border-brand-primary cursor-pointer transition-all overflow-hidden relative group">
                                            <input type="file" accept="image/*" onChange={(e) => handleGalleryUpload(item.id, e)} className="hidden" />
                                            {item.url ? (
                                                <img src={item.url} className="w-full h-full object-cover" />
                                            ) : (
                                                <Plus size={16} />
                                            )}
                                            {item.url && (
                                                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                    <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                                        Thay đổi
                                                    </span>
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Form Info */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <AdminInput 
                                        label="Tên sản phẩm" 
                                        placeholder="Nhập tên sản phẩm..." 
                                        value={formData.name || ''} 
                                        onChange={(e: any) => handleInputChange('name', e.target.value)}
                                        required
                                    />
                                    <AdminInput 
                                        label="Mã sản phẩm (SKU)" 
                                        icon={Code}
                                        placeholder="SKU-12345" 
                                        value={formData.productCode || ''} 
                                        onChange={(e: any) => handleInputChange('productCode', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <AdminSelect
                                        label="Danh mục"
                                        icon={Layers}
                                        value={formData.categoryId || ''} 
                                        onChange={(e: any) => handleInputChange('categoryId', Number(e.target.value))}
                                        options={categories.map(c => ({ value: c.category_id.toString(), label: c.name }))}
                                    />
                                    <AdminSelect
                                        label="Trạng thái"
                                        icon={Tag}
                                        value={formData.status || 'ACTIVE'} 
                                        onChange={(e: any) => handleInputChange('status', e.target.value)}
                                        options={[
                                            { value: 'ACTIVE', label: 'Đang bán' },
                                            { value: 'INACTIVE', label: 'Tạm ngưng' },
                                            { value: 'DRAFT', label: 'Bản nháp' }
                                        ]}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                    <AdminInput 
                                        label="Giá cơ bản (VNĐ)" 
                                        icon={DollarSign}
                                        type="number"
                                        value={formData.basePrice || 0} 
                                        onChange={(e: any) => handleInputChange('basePrice', Number(e.target.value))}
                                        disabled={formData.isContactPrice}
                                        required={!formData.isContactPrice}
                                    />
                                    <div className="pb-2.5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                        <label className="flex items-center gap-2 cursor-pointer group select-none">
                                            <input 
                                                type="checkbox" 
                                                checked={formData.isContactPrice || false} 
                                                onChange={(e: any) => handleInputChange('isContactPrice', e.target.checked)} 
                                                className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary/20 cursor-pointer" 
                                            />
                                            <span className="text-xs font-semibold text-slate-600 group-hover:text-brand-primary transition-colors">
                                                Giá liên hệ
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group select-none">
                                            <input 
                                                type="checkbox" 
                                                checked={formData.isFeatured || false} 
                                                onChange={(e: any) => handleInputChange('isFeatured', e.target.checked)} 
                                                className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500/20 cursor-pointer" 
                                            />
                                            <span className="text-xs font-semibold text-slate-600 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                                                <Star size={14} className={formData.isFeatured ? "text-amber-500 fill-amber-500" : "text-slate-400"} />
                                                Sản phẩm nổi bật
                                            </span>
                                        </label>
                                    </div>
                                    <AdminInput 
                                        label="Số lượng tồn kho" 
                                        icon={Box}
                                        type="number"
                                        value={formData.stockQuantity || 0} 
                                        onChange={(e: any) => handleInputChange('stockQuantity', Number(e.target.value))}
                                        required
                                    />
                                </div>

                                <AdminTextarea 
                                    label="Mô tả ngắn gọn (Tóm tắt)"
                                    rows={3}
                                    placeholder="Nhập mô tả tóm tắt ngắn về sản phẩm hiển thị ở danh thiếp và phần giới thiệu..."
                                    value={formData.shortDescription || ''} 
                                    onChange={(e: any) => handleInputChange('shortDescription', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* TAB 2: BÀI VIẾT MÔ TẢ CHI TIẾT SẢN PHẨM */}
                    {modalTab === 'article' && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Editor Mode Header */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                            Bài viết mô tả chi tiết sản phẩm
                                        </h4>
                                        <p className="text-xs text-slate-500 font-medium">
                                            Trình bày chi tiết cấu tạo, thông số kỹ thuật, tính năng và hướng dẫn cho sản phẩm.
                                        </p>
                                    </div>
                                </div>

                                {/* Chuyển đổi chế độ soạn thảo */}
                                <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-xl shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setArticleEditorMode('sections')}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                            articleEditorMode === 'sections'
                                                ? 'bg-slate-900 text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        Theo đoạn mục (Sections)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setArticleEditorMode('full')}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                            articleEditorMode === 'full'
                                                ? 'bg-slate-900 text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        Toàn bài viết (Word Editor)
                                    </button>
                                </div>
                            </div>

                            {/* Khung soạn thảo tương ứng theo chế độ */}
                            {articleEditorMode === 'sections' ? (
                                <AdminPostSectionsEditor 
                                    sections={productSections}
                                    onChange={handleSectionsChange}
                                />
                            ) : (
                                <div className="space-y-3">
                                    <AdminRichText 
                                        label="Nội dung bài viết chi tiết sản phẩm"
                                        value={formData.content || ''}
                                        onChange={handleFullContentChange}
                                        placeholder="Soạn thảo toàn bộ bài viết chi tiết cho sản phẩm với đầy đủ hình ảnh, bảng thông số, danh sách và liên kết..."
                                        minHeight="420px"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </AdminModal>

            {/* CATEGORY MODAL */}
            <AdminModal 
                isOpen={isCategoryModalOpen} 
                onClose={() => setIsCategoryModalOpen(false)}
                title="Thêm danh mục mới"
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
                            placeholder="Ví dụ: Vòng bi..." 
                            value={categoryFormData.name}
                            onChange={(e: any) => setCategoryFormData(p => ({ ...p, name: e.target.value }))}
                            required
                        />
                        <AdminInput 
                            label="Mã danh mục" 
                            placeholder="Ví dụ: VB..." 
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
                    <AdminInput 
                        label="Tên Icon (SVG Code hoặc tên Component)" 
                        placeholder="VD: Package, Box, Layers..." 
                        value={categoryFormData.icon}
                        onChange={(e: any) => setCategoryFormData(p => ({ ...p, icon: e.target.value }))}
                    />
                    <AdminTextarea 
                        label="Mô tả"
                        placeholder="Nhập mô tả danh mục..."
                        value={categoryFormData.description}
                        onChange={(e: any) => setCategoryFormData(p => ({ ...p, description: e.target.value }))}
                    />
                </div>
            </AdminModal>
        </div>
    );
}
