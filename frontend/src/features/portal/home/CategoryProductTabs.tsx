'use client';

import React, { useMemo } from 'react';
import { useProductCategories } from '@/hooks/useProductCategories';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { 
    ArrowRight, 
    Layers, 
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const CategoryProductTabs: React.FC = () => {
    const { categories, loading } = useProductCategories();

    const parentCategories = useMemo(() => {
        return categories
            .filter(cat => cat.parent_id === null)
            .sort((a, b) => a.display_order - b.display_order);
    }, [categories]);

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-8 md:px-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-64 bg-slate-50 rounded-[32px] animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-white overflow-hidden border-t border-slate-50">
            <div className="container mx-auto px-4 md:px-12">
                <ScrollReveal animation="reveal" className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-3 mb-4 text-brand-primary">
                            <div className="w-10 h-px bg-brand-primary"></div>
                            <span className="text-xs font-black uppercase tracking-[0.3em]">Hệ sinh thái sản phẩm</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 uppercase">
                            Danh mục <span className="text-gradient">Sản phẩm</span>
                        </h2>
                    </div>
                    
                    <Link 
                        href="/products" 
                        className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary transition-all"
                    >
                        Khám phá tất cả
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </ScrollReveal>

                {/* Standardized Dynamic Grid (Best Solution) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {parentCategories.map((category, index) => {
                        return (
                            <ScrollReveal 
                                key={category.category_id} 
                                animation="reveal-scale" 
                                delay={index * 50}
                            >
                                <Link href={`/products/${category.slug}`} className="block h-full group">
                                    <div className="bg-white rounded-[32px] p-10 h-full border border-slate-100 shadow-sm hover:shadow-2xl hover:border-brand-primary transition-all duration-500 flex flex-col items-start relative overflow-hidden">
                                        {/* Background Subtle Pattern */}
                                        <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12">
                                            <Layers size={120} strokeWidth={1} />
                                        </div>

                                        {/* Standardized Icon Size & Container */}
                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center mb-10 transition-all duration-500 shadow-inner">
                                            <Layers size={32} />
                                        </div>
                                        
                                        {/* Standardized Typography & Spacing */}
                                        <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-brand-primary transition-colors leading-tight uppercase">
                                            {category.name}
                                        </h3>
                                        
                                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium mb-10">
                                            {category.description || "Giải pháp kỹ thuật và thiết bị công nghiệp đạt tiêu chuẩn quốc tế."}
                                        </p>
                                        
                                        {/* Navigation Indicator always at Bottom Right */}
                                        <div className="mt-auto w-full flex justify-end">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:translate-x-1">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CategoryProductTabs;
