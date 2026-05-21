'use client';

import React, { useMemo, use } from 'react';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import { usePosts } from '@/hooks/usePosts';
import ScrollReveal from '@/components/ui/ScrollReveal';
import NewsCard from '@/features/portal/news/NewsCard';
import { ArrowLeft, ChevronRight, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function ServiceCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { services, loading: categoriesLoading, getCategoryBySlug, getSubCategories } = useServiceCategories();
  const { posts, loading: postsLoading } = usePosts();

  const category = useMemo(() => getCategoryBySlug(slug), [services, slug, getCategoryBySlug]);
  
  const subCategories = useMemo(() => {
    if (!category) return [];
    return getSubCategories(category.category_id);
  }, [category, getSubCategories]);

  const categoryPosts = useMemo(() => {
    if (!category) return [];
    
    // Get this category's posts
    const directPosts = posts.filter(p => p.category_id === category.category_id);
    
    // If it's a parent, maybe get children's posts too? 
    // Requirement says "danh sách các bài viết dịch vụ của danh mục cha"
    // Usually means all posts under this hierarchy.
    const subCategoryIds = services
        .filter(s => s.parent_id === category.category_id)
        .map(s => s.category_id);
    
    // Also handle one more level if needed (like Level 3)
    const subSubCategoryIds = services
        .filter(s => s.parent_id && subCategoryIds.includes(s.parent_id))
        .map(s => s.category_id);

    const allTargetIds = [category.category_id, ...subCategoryIds, ...subSubCategoryIds];
    
    return posts.filter(p => allTargetIds.includes(p.category_id));
  }, [category, posts, services]);

  if (categoriesLoading || postsLoading) {
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
      <section className="bg-slate-900 pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{ 
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
                backgroundSize: '40px 40px' 
            }}></div>
        </div>
        
        <div className="container mx-auto px-8 md:px-12 relative z-10">
            <Link 
                href="/services" 
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Quay lại tất cả dịch vụ
            </Link>
            
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-tight">
                {category.name}
            </h1>
            <p className="mt-6 text-slate-400 text-lg max-w-3xl font-medium leading-relaxed">
                {category.description || `Khám phá các giải pháp và bài viết kỹ thuật chuyên sâu về ${category.name}.`}
            </p>
        </div>
      </section>

      {/* Sub-categories Section (if any) */}
      {subCategories.length > 0 && (
        <section className="py-12 bg-slate-50 border-b border-slate-100">
            <div className="container mx-auto px-8 md:px-12">
                <div className="flex flex-wrap gap-4">
                    {subCategories.map(sub => (
                        <Link 
                            key={sub.category_id}
                            href={`/services/${sub.slug}`}
                            className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-brand-primary hover:text-brand-primary hover:shadow-md transition-all flex items-center gap-2"
                        >
                            <BadgeCheck size={16} className="text-brand-primary" />
                            {sub.name}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* Posts List Section */}
      <section className="py-20">
        <div className="container mx-auto px-8 md:px-12">
            {categoryPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryPosts.map((post, index) => (
                        <ScrollReveal key={post.post_id} animation="reveal-scale" delay={index * 100}>
                            <NewsCard post={post} />
                        </ScrollReveal>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BadgeCheck size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có bài viết nào</h3>
                    <p className="text-slate-500">Chúng tôi đang cập nhật nội dung cho danh mục này. Vui lòng quay lại sau.</p>
                </div>
            )}
        </div>
      </section>
    </main>
  );
}
