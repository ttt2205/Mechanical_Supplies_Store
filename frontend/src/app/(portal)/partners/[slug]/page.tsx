'use client';

import React, { useMemo, use } from 'react';
import { usePartnerCategories } from '@/hooks/usePartnerCategories';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ArrowLeft, BadgeCheck, MapPin, Phone, Mail, Globe } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function PartnerCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { partners, loading, getCategoryBySlug, getSubCategories } = usePartnerCategories();

  const category = useMemo(() => getCategoryBySlug(slug), [partners, slug, getCategoryBySlug]);
  
  const subCategories = useMemo(() => {
    if (!category) return [];
    return getSubCategories(category.category_id);
  }, [category, getSubCategories]);

  // Mock partners data for the list
  const mockPartnerDetails = [
    { id: 1, name: "Đại lý Thủy lực ABC", address: "123 Đường Số 1, KCN VSIP, Bình Dương", phone: "0901.234.567", email: "contact@abc-hydraulics.vn", type: "Đại lý ủy quyền" },
    { id: 2, name: "Cơ khí Hưng Phát", address: "456 Lô C, KCN Amata, Đồng Nai", phone: "0908.765.432", email: "info@hungphat-mech.com", type: "Đối tác chiến lược" },
    { id: 3, name: "Vật tư Công nghiệp Miền Nam", address: "789 Quốc lộ 1A, Quận 12, TP.HCM", phone: "028.3848.xxxx", email: "sales@mt-industrial.vn", type: "Nhà phân phối" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-40 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!category) {
    return notFound();
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-[#0f172a] pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{ 
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
                backgroundSize: '40px 40px' 
            }}></div>
        </div>
        
        <div className="container mx-auto px-8 md:px-12 relative z-10">
            <Link 
                href="/partners" 
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Quay lại mạng lưới đối tác
            </Link>
            
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-tight">
                Đối tác <span className="text-brand-accent">{category.name}</span>
            </h1>
            <p className="mt-6 text-slate-400 text-lg max-w-3xl font-medium leading-relaxed">
                {category.description || `Hệ thống mạng lưới đối tác chiến lược và đại lý ủy quyền tại khu vực ${category.name}.`}
            </p>
        </div>
      </section>

      {/* Navigation Sub-regions Section (if any) */}
      {subCategories.length > 0 && (
        <section className="py-12 bg-slate-50 border-b border-slate-100">
            <div className="container mx-auto px-8 md:px-12">
                <div className="flex flex-wrap gap-4">
                    {subCategories.map(sub => (
                        <Link 
                            key={sub.category_id}
                            href={`/partners/${sub.slug}`}
                            className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-brand-primary hover:text-brand-primary hover:shadow-md transition-all flex items-center gap-2"
                        >
                            <MapPin size={16} className="text-brand-primary" />
                            {sub.name}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* Partners List Section */}
      <section className="py-20">
        <div className="container mx-auto px-8 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mockPartnerDetails.map((partner, index) => (
                    <ScrollReveal key={partner.id} animation="reveal-scale" delay={index * 100}>
                        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 group">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="inline-flex px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-md">
                                        {partner.type}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-brand-primary transition-colors uppercase">
                                        {partner.name}
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 text-slate-500">
                                            <MapPin size={18} className="text-slate-300 mt-1 flex-shrink-0" />
                                            <p className="text-sm font-medium leading-relaxed">{partner.address}</p>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <Phone size={18} className="text-slate-300 flex-shrink-0" />
                                            <p className="text-sm font-bold">{partner.phone}</p>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <Mail size={18} className="text-slate-300 flex-shrink-0" />
                                            <p className="text-sm font-medium">{partner.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex md:flex-col gap-3">
                                    <button className="flex-1 md:flex-none p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-inner">
                                        <Globe size={20} />
                                    </button>
                                    <button className="flex-1 md:flex-none p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-inner">
                                        <Phone size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
            
            {/* Empty State / Load More (Placeholder) */}
            <div className="mt-20 text-center">
                <p className="text-slate-400 font-medium mb-8">Bạn muốn trở thành đối tác của Hưng Thịnh tại khu vực {category.name}?</p>
                <Link 
                    href="/contact"
                    className="inline-flex items-center gap-4 px-10 py-5 bg-brand-primary text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-primary/90 hover:shadow-2xl transition-all"
                >
                    Đăng ký hợp tác ngay
                    <BadgeCheck size={18} />
                </Link>
            </div>
        </div>
      </section>
    </main>
  );
}
