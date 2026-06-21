'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Category } from '@/types/category';
import { Product } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

    useEffect(() => {
        const updateItemsPerView = () => {
            if (window.innerWidth < 640) setItemsPerView(1);
            else if (window.innerWidth < 1024) setItemsPerView(2);
            else setItemsPerView(4);
        };

        updateItemsPerView();
        window.addEventListener('resize', updateItemsPerView);
        return () => window.removeEventListener('resize', updateItemsPerView);
    }, []);

    const maxIndex = Math.max(0, sectionProducts.length - itemsPerView);
    const totalPages = Math.ceil(sectionProducts.length / itemsPerView);
    const currentPage = Math.floor(currentIndex / itemsPerView);

    const nextSlide = useCallback(() => {
        setCurrentIndex(prev => prev >= maxIndex ? 0 : Math.min(prev + itemsPerView, maxIndex));
    }, [maxIndex, itemsPerView]);

    const prevSlide = useCallback(() => {
        setCurrentIndex(prev => prev <= 0 ? maxIndex : Math.max(prev - itemsPerView, 0));
    }, [maxIndex, itemsPerView]);

    // Swipe handlers
    const minSwipeDistance = 50;
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };
    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) nextSlide();
        else if (distance < -minSwipeDistance) prevSlide();
    };

    if (sectionProducts.length === 0) return null;

    const isEven = index % 2 === 0;

    return (
        <section className={`py-14 md:py-20 ${isEven ? 'bg-white' : 'bg-slate-50/50'} overflow-hidden border-b border-slate-100`}>
            <div className="container mx-auto px-4 md:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-5 md:gap-6">
                    <ScrollReveal animation="reveal-left">
                        <div className="flex items-center gap-3 mb-4 text-brand-primary">
                            <div className="w-10 h-px bg-brand-primary"></div>
                            <span className="text-xs font-black uppercase tracking-[0.3em]">{category.name}</span>
                        </div>
                        <h2 className="text-2xl md:text-5xl font-black tracking-normal md:tracking-tight text-slate-900 uppercase leading-tight">
                            Giải pháp <span className="text-gradient">{category.name}</span>
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal animation="reveal-right">
                        <Link 
                            href={`/products/${category.slug}`}
                            className="group flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-wider md:tracking-widest text-slate-400 hover:text-brand-primary transition-all"
                        >
                            Xem toàn bộ danh mục
                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </ScrollReveal>
                </div>

                <div 
                    className="relative group/slider max-w-[1400px] mx-auto"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Navigation Buttons */}
                    {sectionProducts.length > itemsPerView && (
                        <>
                            <div className="absolute top-1/2 -translate-y-1/2 -left-2 md:-left-12 z-30 transition-all duration-500 opacity-100 md:opacity-0 md:group-hover/slider:opacity-100">
                                <button 
                                    onClick={prevSlide}
                                    className="p-3 md:p-5 rounded-2xl md:rounded-3xl bg-white shadow-xl border border-slate-100 text-slate-900 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all active:scale-90 group/btn"
                                    aria-label="Previous slide"
                                >
                                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover/btn:-translate-x-1" />
                                </button>
                            </div>

                            <div className="absolute top-1/2 -translate-y-1/2 -right-2 md:-right-12 z-30 transition-all duration-500 opacity-100 md:opacity-0 md:group-hover/slider:opacity-100">
                                <button 
                                    onClick={nextSlide}
                                    className="p-3 md:p-5 rounded-2xl md:rounded-3xl bg-white shadow-xl border border-slate-100 text-slate-900 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all active:scale-90 group/btn"
                                    aria-label="Next slide"
                                >
                                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover/btn:translate-x-1" />
                                </button>
                            </div>
                        </>
                    )}

                    <div className="relative">
                        <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-100 overflow-hidden px-3 md:px-8 py-6 md:py-10 relative z-10 shadow-sm">
                            <div 
                                className="flex transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] gap-4 md:gap-8"
                                style={{ 
                                    transform: `translateX(calc(-${currentIndex * (100 / itemsPerView)}% - ${currentIndex * (16 / itemsPerView)}px))` 
                                }}
                            >
                                {sectionProducts.map((product) => (
                                    <div 
                                        key={product.product_id} 
                                        className="flex-shrink-0 transform scale-[0.98] md:scale-95 md:origin-top-left transition-transform duration-500"
                                        style={{ 
                                            width: `calc(${100 / itemsPerView}% - ${(16 * (itemsPerView - 1)) / itemsPerView}px)` 
                                        }}
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Dots / Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-10">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(Math.min(i * itemsPerView, maxIndex))}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${
                                        currentPage === i 
                                        ? 'w-10 bg-brand-primary' 
                                        : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                                    }`}
                                    aria-label={`Go to page ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-8 md:mt-12 text-center">
                    <Link 
                        href={`/products/${category.slug}`}
                        className="inline-flex min-h-12 items-center justify-center gap-3 md:gap-4 px-5 md:px-10 py-4 md:py-5 bg-white border-2 border-slate-100 rounded-2xl text-[11px] md:text-xs font-black uppercase tracking-wider md:tracking-[0.2em] text-slate-900 hover:border-brand-primary hover:text-brand-primary hover:shadow-xl transition-all"
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
