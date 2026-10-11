'use client';

import React, { useState } from 'react';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Layers, 
    Search,
    Save,
    Type,
    Hash,
    AlignLeft,
    Image as ImageIcon
} from 'lucide-react';
import { AdminModal, AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/AdminUI';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { useProductCategories } from '@/hooks/useProductCategories';
import { useToastStore } from '@/store/useToastStore';

export default function CategoryManagementPage() {
    const { categories, loading, createCategory, updateCategory, deleteCategory } = useProductCategories();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterType, setFilterType] = useState('ALL');
    const addToast = useToastStore(state => state.addToast);

    const filteredCategories = categories.filter((item: any) => {
        if (filterStatus !== 'ALL' && String(item.status).toUpperCase() !== filterStatus) return false;
        if (filterType !== 'ALL' && String(item.type || 'PRODUCT').toUpperCase() !== filterType) return false;
        return true;
    });

    const openModal = (category: any = null) => {
        if (category) {
            setEditingCategory({
                ...category,
                type: category.type || 'PRODUCT',
                parentId: category.parent_id?.toString() || ''
            });
        } else {
            setEditingCategory({
                name: '',
                code: '',
                type: filterType !== 'ALL' ? filterType : 'PRODUCT',
                description: '',
                parentId: '',
                display_order: 0,
                status: 'ACTIVE',
                icon: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!editingCategory?.name || !editingCategory?.code) {
            addToast('Vui lòng nhập tên và mã danh mục', 'error');
            return;
        }

        // Bắt buộc chọn danh mục cha khi tạo mới hoặc khi là danh mục con
        if (!editingCategory?.category_id || editingCategory?.parent_id) {
            if (!editingCategory?.parentId) {
                addToast('Vui lòng chọn danh mục cha tương ứng. Các danh mục mới bắt buộc phải thuộc một danh mục cha.', 'error');
                return;
            }
        }

        const slug = editingCategory.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const payload = {
            name: editingCategory.name,
            code: editingCategory.code,
            slug: slug,
            type: editingCategory.type || 'PRODUCT',
            description: editingCategory.description,
            parentId: editingCategory.parentId ? parseInt(editingCategory.parentId) : null,
            displayOrder: parseInt(editingCategory.display_order?.toString() || '0'),
            status: editingCategory.status,
            icon: editingCategory.icon
        };

        let success = false;
        if (editingCategory.category_id) {
            success = await updateCategory(editingCategory.category_id, payload);
            if (success) addToast('Cập nhật danh mục thành công', 'success');
        } else {
            success = await createCategory(payload);
            if (success) addToast('Tạo danh mục thành công', 'success');
        }

        if (success) {
            setIsModalOpen(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            const success = await deleteCategory(id);
            if (success) addToast('Xóa danh mục thành công', 'success');
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageLayout
                title="Quản lý Danh Mục"
                description="Quản lý các danh mục sản phẩm của hệ thống"
                actionButton={
                    <button 
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/30"
                    >
                        <Plus size={20} />
                        Thêm Danh Mục
                    </button>
                }
                data={filteredCategories}
                filters={
                    <>
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-brand-primary text-slate-700 font-medium">
                            <option value="ALL">Tất cả phân loại</option>
                            <option value="PRODUCT">Sản phẩm (Product)</option>
                            <option value="SERVICE">Dịch vụ (Service)</option>
                            <option value="PARTNER">Đối tác (Partner)</option>
                        </select>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-brand-primary text-slate-700 font-medium">
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="INACTIVE">Đã ẩn</option>
                        </select>
                    </>
                }
                searchKey={(item) => item.name + ' ' + (item.code || '')}
                searchPlaceholder="Tìm kiếm danh mục theo tên hoặc mã..."
                isLoading={loading}
                colSpan={7}
                tableHeader={
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider rounded-tl-2xl">Mã DM</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Tên Danh Mục</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Phân Loại</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Danh Mục Cha</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Sắp Xếp</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng Thái</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right rounded-tr-2xl">Thao Tác</th>
                    </tr>
                }
                renderRow={(c, index) => (
                    <tr key={c.category_id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold text-xs">
                                {c.code}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                    <Layers size={18} />
                                </div>
                                <p className="font-bold text-slate-900">{c.name}</p>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            {c.type === 'SERVICE' ? (
                                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200/80 rounded-lg font-black text-[10px] uppercase tracking-wider">
                                    Dịch vụ
                                </span>
                            ) : c.type === 'PARTNER' ? (
                                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-lg font-black text-[10px] uppercase tracking-wider">
                                    Đối tác
                                </span>
                            ) : (
                                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-lg font-black text-[10px] uppercase tracking-wider">
                                    Sản phẩm
                                </span>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            {c.parent_id ? (
                                <div>
                                    <span className="font-semibold text-slate-700 text-xs block">
                                        {categories.find(p => p.category_id === c.parent_id)?.name || `ID: ${c.parent_id}`}
                                    </span>
                                    {(() => {
                                        const parent = categories.find(p => p.category_id === c.parent_id);
                                        if (parent?.parent_id) {
                                            return (
                                                <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                                                    Cấp 3 (Thuộc {parent.code})
                                                </span>
                                            );
                                        }
                                        return (
                                            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                                                Cấp 2 (Con trực tiếp)
                                            </span>
                                        );
                                    })()}
                                </div>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-lg text-[10px] font-black tracking-wider uppercase">
                                    Cấp 1 (Gốc hệ thống)
                                </span>
                            )}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600">
                            {c.display_order}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider ${
                                String(c.status).toUpperCase() === 'ACTIVE' 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                                {String(c.status).toUpperCase() === 'ACTIVE' ? 'Hoạt động' : 'Đã ẩn'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => openModal(c)}
                                    className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                                    title="Chỉnh sửa danh mục"
                                >
                                    <Edit2 size={16} />
                                </button>
                                {!c.parent_id ? (
                                    <span 
                                        className="p-2 text-slate-300 cursor-not-allowed" 
                                        title="Danh mục cha mặc định của hệ thống không thể xóa"
                                    >
                                        <Trash2 size={16} />
                                    </span>
                                ) : (
                                    <button 
                                        onClick={() => handleDelete(c.category_id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Xóa danh mục"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                )}
            />

            {/* Modal */}
            <AdminModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={editingCategory?.category_id ? "Cập Nhật Danh Mục" : "Thêm Danh Mục Mới"}
            >
                {editingCategory && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AdminInput 
                                label="Tên Danh Mục" 
                                icon={Type}
                                placeholder="Nhập tên..." 
                                value={editingCategory.name} 
                                onChange={(e: any) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                required
                            />
                            <AdminInput 
                                label="Mã Danh Mục" 
                                icon={Hash}
                                placeholder="VÍ DỤ: VD01..." 
                                value={editingCategory.code} 
                                onChange={(e: any) => setEditingCategory({ ...editingCategory, code: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AdminSelect 
                                label="Phân Loại Danh Mục (Type)"
                                value={editingCategory.type || 'PRODUCT'}
                                disabled={Boolean(!editingCategory.parent_id && editingCategory.category_id)}
                                onChange={(e: any) => {
                                    const newType = e.target.value;
                                    setEditingCategory({ 
                                        ...editingCategory, 
                                        type: newType,
                                        parentId: ''
                                    });
                                }}
                                options={[
                                    { value: 'PRODUCT', label: 'Sản phẩm (Product)' },
                                    { value: 'SERVICE', label: 'Dịch vụ (Service)' },
                                    { value: 'PARTNER', label: 'Đối tác (Partner)' }
                                ]}
                            />
                            <AdminSelect 
                                label={(!editingCategory.parent_id && editingCategory.category_id) ? "Danh Mục Cha (Cố định hệ thống)" : "Danh Mục Cha (Bắt buộc)"} 
                                value={editingCategory.parentId}
                                disabled={Boolean(!editingCategory.parent_id && editingCategory.category_id)}
                                onChange={(e: any) => setEditingCategory({ ...editingCategory, parentId: e.target.value })}
                                required={Boolean(!editingCategory.category_id || editingCategory.parent_id)}
                                options={
                                    (!editingCategory.parent_id && editingCategory.category_id)
                                    ? [{ value: '', label: 'Danh mục gốc của hệ thống (Mã cố định)' }]
                                    : [
                                        { value: '', label: `-- Chọn danh mục cha [${editingCategory.type || 'PRODUCT'}] --` },
                                        ...categories
                                            .filter(c => c.category_id !== editingCategory.category_id && (c.type || 'PRODUCT') === (editingCategory.type || 'PRODUCT'))
                                            .sort((a, b) => {
                                                if (!a.parent_id && b.parent_id) return -1;
                                                if (a.parent_id && !b.parent_id) return 1;
                                                return (a.display_order ?? 0) - (b.display_order ?? 0);
                                            })
                                            .map(c => {
                                                const isRoot = !c.parent_id;
                                                const parentCategory = c.parent_id ? categories.find(p => p.category_id === c.parent_id) : null;
                                                const labelPrefix = isRoot ? '[Cấp 1] ' : `  └ [Cấp 2 - ${parentCategory?.code || ''}] `;
                                                return {
                                                    value: c.category_id.toString(),
                                                    label: `${labelPrefix}[${c.code}] ${c.name}`
                                                };
                                            })
                                    ]
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AdminInput 
                                label="Icon (SVG hoặc Tên Component)" 
                                icon={ImageIcon}
                                placeholder="Package, Box, Cog, Sliders..." 
                                value={editingCategory.icon} 
                                onChange={(e: any) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                            />
                            <AdminInput 
                                label="Thứ tự hiển thị" 
                                type="number"
                                icon={Hash}
                                value={editingCategory.display_order} 
                                onChange={(e: any) => setEditingCategory({ ...editingCategory, display_order: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AdminSelect 
                                label="Trạng thái" 
                                value={editingCategory.status}
                                onChange={(e: any) => setEditingCategory({ ...editingCategory, status: e.target.value })}
                                options={[
                                    { value: 'ACTIVE', label: 'Hoạt động' },
                                    { value: 'INACTIVE', label: 'Đã ẩn' }
                                ]}
                            />
                        </div>

                        <AdminTextarea 
                            label="Mô tả" 
                            placeholder="Nhập mô tả chi tiết..."
                            value={editingCategory.description || ''} 
                            onChange={(e: any) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                        />

                        <div className="pt-5 mt-5 border-t border-slate-100 flex justify-end gap-2.5">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-200 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-lg font-semibold text-xs hover:bg-brand-primary/90 transition-all shadow-xs hover:shadow-sm"
                            >
                                <Save size={16} />
                                Lưu danh mục
                            </button>
                        </div>
                    </div>
                )}
            </AdminModal>
        </div>
    );
}
