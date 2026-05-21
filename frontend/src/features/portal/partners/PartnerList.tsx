'use client';

import React, { useMemo } from 'react';
import { usePartnerCategories } from '@/hooks/usePartnerCategories';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { 
    ChevronRight,
    Handshake
} from 'lucide-react';
import Link from 'next/link';

const PartnerList: React.FC = () => {
    const { partners, loading } = usePartnerCategories();

    const parentPartners = useMemo(() => {
        return partners
            .filter(p => p.parent_id === null)
            .sort((a, b) => a.display_order - b.display_order);
    }, [partners]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 bg-slate-50 rounded-[32px] animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {parentPartners.map((partner, index) => {
                return (
                    <ScrollReveal 
                        key={partner.category_id} 
                        animation="reveal-scale" 
                        delay={index * 100}
                    >
                        <Link href={`/partners/${partner.slug}`} className="block h-full group">
                            <div className="bg-slate-50/50 rounded-[32px] p-10 h-full border border-slate-200 shadow-sm hover:shadow-2xl hover:border-brand-primary hover:bg-white transition-all duration-500 flex flex-col items-start relative overflow-hidden">
                                {/* Large Icon Background */}
                                <div className="absolute -top-4 -right-4 text-9xl font-black text-slate-200/40 group-hover:text-brand-primary/5 transition-colors select-none">
                                    <Handshake size={140} />
                                </div>

                                <div className="relative z-10 flex flex-col h-full w-full">
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-brand-primary transition-colors leading-tight uppercase">
                                        {partner.name}
                                    </h3>
                                    
                                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed font-medium mb-10 flex-grow">
                                        {partner.description || "Hệ thống đối tác và đại lý chiến lược, cam kết cung cấp sản phẩm chính hãng và dịch vụ hỗ trợ tốt nhất."}
                                    </p>
                                    
                                    <div className="flex items-center justify-between w-full pt-6 border-t border-slate-50">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Xem mạng lưới đối tác</span>
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:translate-x-1">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </ScrollReveal>
                );
            })}
        </div>
    );
};

export default PartnerList;