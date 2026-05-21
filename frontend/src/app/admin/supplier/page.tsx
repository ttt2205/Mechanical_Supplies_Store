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
    Save
} from 'lucide-react';
import { AdminModal, AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/AdminUI';

// Mock data for partners/suppliers
const initialPartners = [
    { id: 1, name: 'Đại lý Thủy lực ABC', region: 'Miền Nam', region_id: 'mn', address: 'Bình Dương', phone: '0901.234.567', email: 'contact@abc.vn', status: 'active', website: 'www.abc.vn', description: '' },
    { id: 2, name: 'Cơ khí Hưng Phát', region: 'Miền Nam', region_id: 'mn', address: 'Đồng Nai', phone: '0908.765.432', email: 'info@hungphat.com', status: 'active', website: 'www.hungphat.com', description: '' },
    { id: 3, name: 'Vật tư Miền Trung', region: 'Miền Trung', region_id: 'mt', address: 'Đà Nẵng', phone: '0236.3848.xxx', email: 'sales@mt-ind.vn', status: 'inactive', website: '', description: '' },
];

export default function PartnerManagementPage() {
    const [partners] = useState(initialPartners);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<any>(null);

    const openModal = (partner: any = null) => {
        setEditingPartner(partner || {
            name: '',
            region_id: 'mn',
            address: '',
            phone: '',
            email: '',
            website: '',
            status: 'active',
            description: ''
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Quản lý Đối tác</h1>
                    <p className="text-slate-500 font-bold">Quản lý mạng lưới đại lý và đối tác chiến lược trên toàn quốc.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-brand-primary transition-all flex items-center gap-3 w-fit"
                >
                    <Plus size={18} />
                    Thêm đối tác mới
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên đối tác, khu vực..." 
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-6 py-3 focus:bg-white focus:border-brand-primary outline-none transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400"
                    />
                </div>
                <div className="flex gap-4">
                    <select className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-3 outline-none text-sm font-bold text-slate-700 focus:border-brand-primary appearance-none cursor-pointer min-w-[160px]">
                        <option value="">Tất cả Khu vực</option>
                        <option value="mn">Miền Nam</option>
                        <option value="mt">Miền Trung</option>
                        <option value="mb">Miền Bắc</option>
                    </select>
                </div>
            </div>

            {/* Partners Table */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Đối tác</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Khu vực</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Liên hệ</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trạng thái</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {partners.map((partner) => (
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
                                            {partner.region}
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
                                            <button className="p-2 text-slate-400 hover:text-red-500 transition-all" onClick={(e) => e.stopPropagation()}><Trash2 size={16} /></button>
                                            <button className="p-2 text-slate-400 hover:text-slate-900 transition-all" onClick={(e) => e.stopPropagation()}><Globe size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PARTNER MODAL */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPartner?.id ? "Chỉnh sửa đối tác" : "Thêm đối tác mới"}
                size="lg"
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
                            label="Tên đối tác/Đại lý"
                            placeholder="Công ty TNHH ABC..."
                            icon={Handshake}
                            defaultValue={editingPartner?.name}
                            required
                        />
                        <AdminSelect 
                            label="Khu vực quản lý"
                            defaultValue={editingPartner?.region_id}
                            options={[
                                { value: 'mn', label: 'Miền Nam' },
                                { value: 'mt', label: 'Miền Trung' },
                                { value: 'mb', label: 'Miền Bắc' }
                            ]}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdminInput 
                            label="Địa chỉ văn phòng"
                            placeholder="Số 123, Đường..."
                            icon={MapPin}
                            defaultValue={editingPartner?.address}
                            required
                        />
                        <AdminInput 
                            label="Website (nếu có)"
                            placeholder="www.partner-site.com"
                            icon={Globe}
                            defaultValue={editingPartner?.website}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <AdminInput 
                            label="Số điện thoại"
                            placeholder="09xx.xxx.xxx"
                            icon={Phone}
                            defaultValue={editingPartner?.phone}
                            required
                        />
                        <AdminInput 
                            label="Địa chỉ Email"
                            placeholder="contact@partner.vn"
                            icon={Mail}
                            type="email"
                            defaultValue={editingPartner?.email}
                            required
                        />
                        <AdminSelect 
                            label="Trạng thái hợp tác"
                            defaultValue={editingPartner?.status}
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
                        defaultValue={editingPartner?.description}
                    />
                </div>
            </AdminModal>
        </div>
    );
}
