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
    Package,
    Box,
    Layers,
    Tag,
    Image as ImageIcon,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    MoreHorizontal,
    Code,
    DollarSign,
    Save
} from 'lucide-react';
import { AdminModal, AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/AdminUI';

// Mock data for products
const initialProducts = [
    { id: 1, name: 'Ống thủy lực Gates G2', code: 'GATE-G2', category: 'Ống thủy lực', category_id: 1, price: 0, is_contact: true, stock: 500, status: 'active', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200' },
    { id: 2, name: 'Máy bấm đầu ống Finn-Power P20', code: 'FINN-P20', category: 'Máy & Thiết bị', category_id: 2, price: 120000000, is_contact: false, stock: 5, status: 'active', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=200' },
    { id: 3, name: 'Đầu bấm thủy lực inox 304', code: 'DB-SS304', category: 'Đầu bấm', category_id: 3, price: 45000, is_contact: false, stock: 1200, status: 'inactive', image: 'https://images.unsplash.com/photo-1565608438257-fac3c27beb36?q=80&w=200' },
];

export default function ProductManagementPage() {
    const [products, setProducts] = useState(initialProducts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const openModal = (product: any = null) => {
        setEditingProduct(product || {
            name: '',
            code: '',
            category_id: '1',
            base_price: 0,
            is_contact_price: true,
            status: 'active',
            stock: 0,
            description: ''
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Quản lý Sản phẩm</h1>
                    <p className="text-slate-500 font-bold">Quản lý danh mục, thông tin và tồn kho sản phẩm.</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-slate-50 text-slate-600 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-slate-100 hover:bg-white transition-all flex items-center gap-3">
                        <Layers size={18} />
                        Danh mục
                    </button>
                    <button 
                        onClick={() => openModal()}
                        className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-primary/20 hover:bg-blue-800 transition-all flex items-center gap-3"
                    >
                        <Plus size={18} />
                        Thêm sản phẩm
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên hoặc mã sản phẩm..." 
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-6 py-3 focus:bg-white focus:border-brand-primary outline-none transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400"
                    />
                </div>
                <div className="flex gap-4">
                    <select className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-3 outline-none text-sm font-bold text-slate-700 focus:border-brand-primary appearance-none cursor-pointer min-w-[160px]">
                        <option value="">Mọi Danh mục</option>
                        <option value="1">Ống thủy lực</option>
                        <option value="2">Máy & Thiết bị</option>
                        <option value="3">Đầu bấm</option>
                    </select>
                    <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <Filter size={14} /> Lọc
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sản phẩm</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Danh mục</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Giá cơ bản</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tồn kho</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trạng thái</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {products.map((p) => (
                                <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => openModal(p)}>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight line-clamp-1">{p.name}</p>
                                                <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{p.code}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                            <Tag size={12} className="text-slate-300" />
                                            {p.category}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-black text-slate-900 text-sm">
                                        {p.is_contact ? "Liên hệ" : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <Box size={14} className="text-slate-300" />
                                            <span className={`text-xs font-black ${p.stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>{p.stock}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            p.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                            {p.status === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                            {p.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-white rounded-lg shadow-sm transition-all border border-transparent hover:border-slate-100" onClick={(e) => { e.stopPropagation(); openModal(p); }}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg shadow-sm transition-all border border-transparent hover:border-slate-100" onClick={(e) => e.stopPropagation()}>
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg shadow-sm transition-all border border-transparent hover:border-slate-100" onClick={(e) => e.stopPropagation()}>
                                                <MoreHorizontal size={16} />
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
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Đang xem 1 - 3 trên tổng 850 sản phẩm</p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all"><ChevronLeft size={20} /></button>
                        <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all"><ChevronRight size={20} /></button>
                    </div>
                </div>
            </div>

            {/* PRODUCT MODAL */}
            <AdminModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={editingProduct?.id ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                size="xl"
                footer={
                    <>
                        <button className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                        <button className="px-10 py-3 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-primary/20 hover:bg-blue-800 transition-all flex items-center gap-2">
                            <Save size={16} /> Lưu thay đổi
                        </button>
                    </>
                }
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Image Upload & Preview */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="aspect-square bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 relative overflow-hidden group cursor-pointer hover:border-brand-primary transition-all">
                            {editingProduct?.image ? (
                                <img src={editingProduct.image} className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <ImageIcon size={48} strokeWidth={1} />
                                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest">Tải ảnh lên</p>
                                </>
                            )}
                            <div className="absolute inset-0 bg-brand-primary/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Plus size={32} className="text-white" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300 hover:border-brand-primary cursor-pointer transition-all">
                                    <Plus size={16} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Form Info */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AdminInput 
                                label="Tên sản phẩm" 
                                placeholder="Nhập tên sản phẩm..." 
                                defaultValue={editingProduct?.name}
                                required
                            />
                            <AdminInput 
                                label="Mã sản phẩm (SKU)" 
                                icon={Code}
                                placeholder="SKU-12345" 
                                defaultValue={editingProduct?.code}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AdminSelect 
                                label="Danh mục sản phẩm"
                                defaultValue={editingProduct?.category_id}
                                options={[
                                    { value: '1', label: 'Ống thủy lực' },
                                    { value: '2', label: 'Máy & Thiết bị' },
                                    { value: '3', label: 'Đầu bấm' }
                                ]}
                                required
                            />
                            <AdminSelect 
                                label="Trạng thái kinh doanh"
                                defaultValue={editingProduct?.status}
                                options={[
                                    { value: 'active', label: 'Đang bán' },
                                    { value: 'inactive', label: 'Ngừng bán' }
                                ]}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <AdminInput 
                                label="Giá cơ bản (VNĐ)" 
                                icon={DollarSign}
                                type="number"
                                defaultValue={editingProduct?.price || 0}
                                disabled={editingProduct?.is_contact_price}
                            />
                            <div className="flex items-end pb-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" defaultChecked={editingProduct?.is_contact_price} className="w-5 h-5 rounded-lg border-2 border-slate-200 text-brand-primary focus:ring-brand-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-brand-primary transition-colors">Giá liên hệ</span>
                                </label>
                            </div>
                            <AdminInput 
                                label="Số lượng tồn kho" 
                                icon={Box}
                                type="number"
                                defaultValue={editingProduct?.stock || 0}
                                required
                            />
                        </div>

                        <AdminTextarea 
                            label="Mô tả ngắn gọn"
                            rows={4}
                            placeholder="Nhập mô tả tóm tắt về sản phẩm..."
                            defaultValue={editingProduct?.description}
                        />
                    </div>
                </div>
            </AdminModal>
        </div>
    );
}
