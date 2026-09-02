'use client';

import React, { useMemo } from 'react';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Pagination from '@/components/ui/Pagination';

const ServiceList: React.FC = () => {
    const { services, loading } = useServiceCategories();
    const [currentPage, setCurrentPage] = React.useState(1);
    const ITEMS_PER_PAGE = 6;

    const parentServices = useMemo(() => {
        return services
            .filter(s => s.parent_id === null)
            .sort((a, b) => a.display_order - b.display_order);
    }, [services]);

    const totalPages = Math.max(1, Math.ceil(parentServices.length / ITEMS_PER_PAGE));
    const currentServices = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return parentServices.slice(start, start + ITEMS_PER_PAGE);
    }, [parentServices, currentPage]);

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
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentServices.map((service, index) => {
                    return (
                        <ScrollReveal 
                            key={service.category_id} 
                            animation="reveal-scale" 
                            delay={index * 100}
                        >
                            <Link href={`/services/${service.slug}`} className="block h-full group">
                                <div className="bg-slate-50/50 rounded-2xl md:rounded-[32px] p-6 md:p-10 h-full border border-slate-200 shadow-sm hover:shadow-xl md:hover:shadow-2xl hover:border-brand-primary hover:bg-white transition-all duration-300 md:duration-500 flex flex-col items-start relative overflow-hidden">
                                    {/* Large Number Background */}
                                    <div className="absolute -top-4 -right-4 text-9xl font-black text-slate-200/40 group-hover:text-brand-primary/5 transition-colors select-none">
                                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                    </div>

                                    <div className="relative z-10 flex flex-col h-full w-full">
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-4 group-hover:text-brand-primary transition-colors leading-tight uppercase">
                                            {service.name}
                                        </h3>
                                        
                                        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed font-medium mb-10 flex-grow">
                                            {service.description || "Giải pháp kỹ thuật và dịch vụ công nghiệp đạt tiêu chuẩn chất lượng cao."}
                                        </p>
                                        
                                        <div className="flex items-center justify-between w-full pt-6 border-t border-slate-50">
                                            <span className="text-[10px] font-black uppercase tracking-wider md:tracking-widest text-brand-primary">Khám phá dịch vụ</span>
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
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default ServiceList;
