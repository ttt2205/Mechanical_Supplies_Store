'use client';

import React, { useMemo } from 'react';
import { Category } from '@/types/category';
import { Product } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CategoryProductSectionProps {
    category: Category;
    allCategories: Category[];
    allProducts: Product[];
    index: number;
}

const CategoryProductSection: React.FC<CategoryProductSectionProps> = ({ 
    category, 
    allCategories, 
    allProducts, 
    index 
}) => {
    const sectionProducts = useMemo(() => {
        // Find all subcategory IDs
        const subCategoryIds = allCategories
            .filter(cat => cat.parent_id === category.category_id)
            .map(cat => cat.category_id);
        
        const allTargetIds = [category.category_id, ...subCategoryIds];
        
        // Return first 8 products for this category
        return allProducts
            .filter(product => allTargetIds.includes(product.category_id))
            .slice(0, 8);
    }, [category, allCategories, allProducts]);

    if (sectionProducts.length === 0) return null;

    const isEven = index % 2 === 0;

    return (
        <section className={`py-16 ${isEven ? 'bg-white' : 'bg-[#f8fafc]'} overflow-hidden`}>
            <div className="container mx-auto px-4 md:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                    <ScrollReveal animation="reveal-left">
                        <div className="flex items-center gap-3 mb-4 text-brand-primary">
                            <div className="w-10 h-px bg-brand-primary"></div>
                            <span className="text-xs font-black uppercase tracking-[0.3em]">{category.name}</span>
                        </div>
                        <h2 className="text-2xl md:text-5xl font-black tracking-tight text-slate-900 uppercase">
                            Giải pháp <span className="text-gradient">{category.name}</span>
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal animation="reveal-right">
                        <Link 
                            href={`/products/${category.slug}`}
                            className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary transition-all"
                        >
                            Xem toàn bộ danh mục
                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
                    {sectionProducts.map((product, pIndex) => (
                        <ScrollReveal 
                            key={product.product_id} 
                            animation="reveal-scale" 
                            delay={pIndex * 50}
                        >
                            <div className="transform scale-95 origin-top-left h-full">
                                <ProductCard product={product} />
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link 
                        href={`/products/${category.slug}`}
                        className="inline-flex items-center gap-4 px-10 py-5 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-slate-900 hover:border-brand-primary hover:text-brand-primary hover:shadow-xl transition-all"
                    >
                        Tất cả sản phẩm {category.name}
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CategoryProductSection;
