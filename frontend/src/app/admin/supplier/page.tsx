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
    Handshake, 
    MapPin, 
    Phone, 
    Globe, 
    CheckCircle2, 
    XCircle, 
    Mail, 
    User, 
    Save,
    Layers
} from 'lucide-react';
import { AdminModal, AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/AdminUI';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { usePartners } from '@/hooks/useAdminModules';
import { useProductCategories } from '@/hooks/useProductCategories';
import { useToastStore } from '@/store/useToastStore';
import { fetchApi } from '@/lib/api';

export default function PartnerManagementPage() {
    const { partners, loading, refresh, createPartner, updatePartner, deletePartner } = usePartners();
    const { categories, refresh: refreshCategories } = useProductCategories("PARTNER");
    const addToast = useToastStore(state => state.addToast);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<any>(null);

    // State for Region Modal (đồng bộ với phần thêm danh mục trong sản phẩm)
    const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
    const [regionFormData, setRegionFormData] = useState({
        name: '',
        code: '',
        description: '',
        parentId: '',
        displayOrder: 0,
        status: 'ACTIVE',
        icon: 'MapPin'
    });
    const [isSubmittingRegion, setIsSubmittingRegion] = useState(false);

    // Filters
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterRegion, setFilterRegion] = useState('ALL');

    const filteredPartners = partners.filter((item: any) => {
        if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;
        if (filterRegion !== 'ALL' && String(item.region_id || item.region) !== filterRegion) return false;
        return true;
    });

    const handleSave = async () => {
        if (!editingPartner?.name?.trim()) {
            addToast('Vui lòng nhập tên đối tác hoặc đại lý', 'error');
            return;
        }

        try {
            if (editingPartner.id) {
                await updatePartner(editingPartner.id, editingPartner);
                addToast('Cập nhật thông tin đối tác thành công', 'success');
            } else {
                await createPartner(editingPartner);
                addToast('Thêm đối tác mới thành công', 'success');
            }
            setIsModalOpen(false);
        } catch (error) {
            addToast('Không thể lưu đối tác. Vui lòng kiểm tra lại.', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa đối tác này?')) {
            try {
                await deletePartner(id);
                addToast('Đã xóa đối tác thành công', 'success');
            } catch (error) {
                addToast('Không thể xóa đối tác.', 'error');
            }
        }
    };

    const openModal = (partner: any = null) => {
        setEditingPartner(partner || {
            name: '',
            region_id: categories.length > 0 ? categories[0].category_id.toString() : '',
            region: categories.length > 0 ? categories[0].name : '',
            address: '',
            phone: '',
            email: '',
            website: '',
            status: 'active',
            description: ''
        });
        setIsModalOpen(true);
    };

    const handleRegionSubmit = async () => {
        if (!regionFormData.name.trim() || !regionFormData.code.trim()) {
            addToast('Vui lòng điền tên và mã khu vực đối tác', 'error');
            return;
        }

        if (!regionFormData.parentId) {
            addToast('Vui lòng chọn khu vực cha tương ứng. Các khu vực mới bắt buộc phải thuộc một khu vực cha.', 'error');
            return;
        }

        try {
            setIsSubmittingRegion(true);
            const slug = regionFormData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const res = await fetchApi('/Categories', {
                method: 'POST',
                body: JSON.stringify({
                    name: regionFormData.name.trim(),
                    code: regionFormData.code.trim(),
                    slug: slug || regionFormData.code.toLowerCase().trim(),
                    description: regionFormData.description,
                    parentId: regionFormData.parentId ? Number(regionFormData.parentId) : null,
                    displayOrder: regionFormData.displayOrder,
                    status: regionFormData.status,
                    icon: regionFormData.icon || 'MapPin',
                    type: 'PARTNER'
                })
            });

            if (res) {
                addToast('Tạo khu vực đối tác mới thành công', 'success');
                await refreshCategories();
                setIsRegionModalOpen(false);
                setRegionFormData({
                    name: '', code: '', description: '', parentId: '', displayOrder: 0, status: 'ACTIVE', icon: 'MapPin'
                });
            } else {
                addToast('Không thể tạo khu vực đối tác', 'error');
            }
        } catch (error: any) {
            addToast(error?.message || 'Lỗi khi tạo khu vực đối tác', 'error');
        } finally {
            setIsSubmittingRegion(false);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <AdminPageLayout
                title="Quản lý Đối tác"
                description="Quản lý mạng lưới đại lý và đối tác chiến lược trên toàn quốc."
                actionButton={
                    <div className="flex flex-wrap items-center gap-3">
                        <button 
                            type="button"
                            onClick={() => setIsRegionModalOpen(true)}
                            className="bg-slate-50 text-slate-600 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-slate-100 hover:bg-white transition-all flex items-center gap-3 w-fit"
                        >
                            <MapPin size={16} />
                            Thêm khu vực
                        </button>
                        <button 
                            type="button"
                            onClick={() => openModal()}
                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-brand-primary transition-all flex items-center gap-3 w-fit"
                        >
                            <Plus size={16} />
                            Thêm đối tác mới
                        </button>
                    </div>
                }
                isLoading={loading}
                onRefresh={async () => { await Promise.all([refresh(), refreshCategories()]); }}
                data={filteredPartners}
                filters={
                    <>
                        <select 
                            value={filterRegion} 
                            onChange={(e) => setFilterRegion(e.target.value)} 
                            className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-brand-primary text-slate-700 font-medium"
                        >
                            <option value="ALL">Tất cả khu vực</option>
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
                            <option value="active">Đang hợp tác</option>
                            <option value="inactive">Ngừng hợp tác</option>
                        </select>
                    </>
                }
                searchKey={(item: any) => item.name + ' ' + (item.region || '') + ' ' + (item.address || '')}
                searchPlaceholder="Tìm theo tên đối tác, khu vực..."
                colSpan={5}
                tableHeader={
                    <tr>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Đối tác</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Khu vực</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Liên hệ</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Trạng thái</th>
                        <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 text-right">Thao tác</th>
                    </tr>
                }
                renderRow={(partner: any) => {
                    const matchedCategory = categories.find(c => c.category_id.toString() === (partner.region_id || partner.region)?.toString());
                    return (
                        <tr key={partner.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => openModal(partner)}>
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-brand-primary group-hover:text-white transition-all">
                                        <Handshake size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{partner.name}</p>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                            <MapPin size={10} />
                                            {partner.address}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <span className="px-3 py-1 bg-slate-50 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-md border border-slate-100">
                                    {matchedCategory?.name || partner.region || 'Chưa phân vùng'}
                                </span>
                            </td>
                            <td className="px-8 py-5">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <Phone size={12} className="text-slate-300" />
                                        {partner.phone}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <Mail size={12} className="text-slate-300" />
                                        {partner.email}
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    partner.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                }`}>
                                    {partner.status === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                    {partner.status === 'active' ? 'Hợp tác' : 'Ngưng'}
                                </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-slate-400 hover:text-brand-primary transition-all" onClick={(e) => { e.stopPropagation(); openModal(partner); }}><Edit2 size={16} /></button>
                                    <button className="p-2 text-slate-400 hover:text-red-500 transition-all" onClick={(e) => { e.stopPropagation(); handleDelete(partner.id); }}><Trash2 size={16} /></button>
                                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-all" onClick={(e) => e.stopPropagation()}><Globe size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    );
                }}
            />

            {/* PARTNER MODAL */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPartner?.id ? "Chỉnh sửa đối tác" : "Thêm đối tác mới"}
                size="lg"
                footer={
                    <>
                        <button className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-200 transition-colors" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                        <button onClick={handleSave} className="px-6 py-2.5 bg-brand-primary text-white rounded-lg font-semibold text-xs hover:bg-brand-primary/90 transition-all shadow-xs hover:shadow-sm flex items-center gap-2">
                            <Save size={16} /> Lưu thông tin
                        </button>
                    </>
                }
            >
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdminInput 
                            label="Tên đối tác / Đại lý"
                            placeholder="Công ty TNHH ABC..."
                            icon={Handshake}
                            value={editingPartner?.name || ''}
                            onChange={(e) => setEditingPartner({...editingPartner, name: e.target.value})}
                            required
                        />
                        <AdminSelect 
                            label="Khu vực quản lý"
                            icon={MapPin}
                            value={editingPartner?.region_id?.toString() || ''}
                            onChange={(e) => {
                                const selectedCat = categories.find(c => c.category_id.toString() === e.target.value);
                                setEditingPartner({
                                    ...editingPartner, 
                                    region_id: e.target.value,
                                    region: selectedCat ? selectedCat.name : ''
                                });
                            }}
                            options={[
                                { value: '', label: '-- Chọn khu vực quản lý --' },
                                ...categories.map(c => ({ 
                                    value: c.category_id.toString(), 
                                    label: `${!c.parent_id ? '[Khu vực] ' : '  └ '}${c.name}` 
                                }))
                            ]}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdminInput 
                            label="Địa chỉ văn phòng / Kho"
                            placeholder="Số 123, Đường..."
                            icon={MapPin}
                            value={editingPartner?.address || ''}
                            onChange={(e) => setEditingPartner({...editingPartner, address: e.target.value})}
                            required
                        />
                        <AdminInput 
                            label="Website (nếu có)"
                            placeholder="www.partner-site.com"
                            icon={Globe}
                            value={editingPartner?.website || ''}
                            onChange={(e) => setEditingPartner({...editingPartner, website: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <AdminInput 
                            label="Số điện thoại"
                            placeholder="09xx.xxx.xxx"
                            icon={Phone}
                            value={editingPartner?.phone || ''}
                            onChange={(e) => setEditingPartner({...editingPartner, phone: e.target.value})}
                            required
                        />
                        <AdminInput 
                            label="Địa chỉ Email"
                            placeholder="contact@partner.vn"
                            icon={Mail}
                            type="email"
                            value={editingPartner?.email || ''}
                            onChange={(e) => setEditingPartner({...editingPartner, email: e.target.value})}
                            required
                        />
                        <AdminSelect 
                            label="Trạng thái hợp tác"
                            value={editingPartner?.status || 'active'}
                            onChange={(e) => setEditingPartner({...editingPartner, status: e.target.value})}
                            options={[
                                { value: 'active', label: 'Đang hợp tác' },
                                { value: 'inactive', label: 'Ngừng hợp tác' }
                            ]}
                            required
                        />
                    </div>

                    <AdminTextarea 
                        label="Ghi chú nội bộ"
                        rows={4}
                        placeholder="Các thỏa thuận hoặc thông tin bổ sung về đối tác này..."
                        value={editingPartner?.description || ''}
                        onChange={(e) => setEditingPartner({...editingPartner, description: e.target.value})}
                    />
                </div>
            </AdminModal>

            {/* REGION MODAL - ĐỒNG BỘ HOÀN TOÀN VỚI PHẦN THÊM DANH MỤC TRONG SẢN PHẨM */}
            <AdminModal 
                isOpen={isRegionModalOpen} 
                onClose={() => setIsRegionModalOpen(false)}
                title="Thêm khu vực đối tác mới"
                size="md"
                footer={
                    <>
                        <button 
                            type="button"
                            className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-200 transition-colors" 
                            onClick={() => setIsRegionModalOpen(false)}
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="button"
                            disabled={isSubmittingRegion}
                            onClick={handleRegionSubmit}
                            className="px-6 py-2.5 bg-brand-primary text-white rounded-lg font-semibold text-xs hover:bg-brand-primary/90 transition-all shadow-xs hover:shadow-sm flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmittingRegion ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Save size={16} />} 
                            Tạo khu vực
                        </button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdminInput 
                            label="Tên khu vực" 
                            placeholder="Ví dụ: KCN VSIP 1, Bình Dương..." 
                            value={regionFormData.name}
                            onChange={(e: any) => setRegionFormData(p => ({ ...p, name: e.target.value }))}
                            required
                        />
                        <AdminInput 
                            label="Mã khu vực" 
                            placeholder="Ví dụ: DT-MN-VSIP..." 
                            value={regionFormData.code}
                            onChange={(e: any) => setRegionFormData(p => ({ ...p, code: e.target.value }))}
                            required
                        />
                    </div>
                    <AdminSelect
                        label="Khu vực cha (Bắt buộc)"
                        value={regionFormData.parentId}
                        onChange={(e: any) => setRegionFormData(p => ({ ...p, parentId: e.target.value }))}
                        required
                        options={[
                            { value: '', label: '-- Chọn khu vực cha tương ứng (Bắt buộc) --' },
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
                            value={regionFormData.displayOrder}
                            onChange={(e: any) => setRegionFormData(p => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))}
                        />
                        <AdminSelect
                            label="Trạng thái"
                            value={regionFormData.status}
                            onChange={(e: any) => setRegionFormData(p => ({ ...p, status: e.target.value }))}
                            options={[
                                { value: 'ACTIVE', label: 'Hoạt động' },
                                { value: 'INACTIVE', label: 'Tạm ẩn' }
                            ]}
                        />
                    </div>
                    <AdminTextarea 
                        label="Mô tả / Ghi chú" 
                        placeholder="Mô tả chi tiết khu vực đối tác này..." 
                        value={regionFormData.description}
                        onChange={(e: any) => setRegionFormData(p => ({ ...p, description: e.target.value }))}
                    />
                </div>
            </AdminModal>
        </div>
    );
}
