'use client';

import React, { useMemo } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ChevronRight, Wrench } from 'lucide-react';
import Link from 'next/link';
import Pagination from '@/components/ui/Pagination';

const ServiceList: React.FC = () => {
    const { posts, loading: postsLoading } = usePosts('SERVICE');
    const { services: categoryList, loading: categoriesLoading } = useServiceCategories();
    const [currentPage, setCurrentPage] = React.useState(1);
    const ITEMS_PER_PAGE = 6;

    const loading = postsLoading && categoriesLoading;

    const rootCategories = useMemo(() => {
        return categoryList
            .filter(c => !c.parent_id)
            .sort((a, b) => a.display_order - b.display_order);
    }, [categoryList]);

    const displayItems = useMemo(() => {
        if (posts.length > 0) {
            return posts.map(p => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                excerpt: p.excerpt || 'Giải pháp kỹ thuật và dịch vụ công nghiệp đạt tiêu chuẩn chất lượng cao.'
            }));
        }
        return rootCategories.map(c => ({
            id: c.category_id,
            title: c.name,
            slug: c.slug,
            excerpt: c.description || 'Dịch vụ kỹ thuật chuyên nghiệp đạt tiêu chuẩn chất lượng cao.'
        }));
    }, [posts, rootCategories]);

    const totalPages = Math.max(1, Math.ceil(displayItems.length / ITEMS_PER_PAGE));
    const currentServices = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return displayItems.slice(start, start + ITEMS_PER_PAGE);
    }, [displayItems, currentPage]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 bg-slate-50 rounded-[32px] animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (displayItems.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                    <Wrench size={36} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Đang cập nhật danh mục dịch vụ</h3>
                <p className="text-slate-500">Các dịch vụ kỹ thuật đang được bổ sung và hoàn thiện. Vui lòng quay lại sau.</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentServices.map((service, index) => {
                    return (
                        <ScrollReveal 
                            key={service.id} 
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
                                            {service.title}
                                        </h3>
                                        
                                        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed font-medium mb-10 flex-grow">
                                            {service.excerpt}
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
            
            {totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};

export default ServiceList;
