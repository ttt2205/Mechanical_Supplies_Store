'use client';

import React, { use } from 'react';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import { usePosts } from '@/hooks/usePosts';
import ScrollReveal from '@/components/ui/ScrollReveal';
import NewsCard from '@/features/portal/news/NewsCard';
import { ArrowLeft, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function ServiceCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { services, loading: categoriesLoading, getCategoryBySlug, getSubCategories } = useServiceCategories();
  const { posts, loading: postsLoading } = usePosts('SERVICE');

  const post = posts.find((p) => p.slug === slug);
  const category = getCategoryBySlug(slug);

  if (categoriesLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-white pt-28 md:pt-40 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. Direct Service Detail View (when slug matches a SERVICE post)
  if (post) {
    return (
      <main className="bg-white min-h-screen pb-20">
        {/* Header Hero */}
        <section className="bg-slate-900 pt-28 md:pt-40 pb-14 md:pb-20 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <Link 
              href="/services" 
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-xs md:text-sm font-bold uppercase tracking-widest group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Tất cả dịch vụ kỹ thuật
            </Link>
            
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight max-w-4xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 text-slate-300 md:text-slate-400 text-base md:text-lg max-w-3xl font-medium leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>
        </section>

        {/* Content Body */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-12 max-w-5xl">
            {post.thumbnail && (
              <div className="mb-10 rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                <img src={post.thumbnail} alt={post.title} className="w-full max-h-[500px] object-cover" />
              </div>
            )}

            <div className="space-y-10">
              {post.sections && post.sections.length > 0 ? (
                post.sections.sort((a, b) => (a.order || 0) - (b.order || 0)).map((sec, idx) => (
                  <div key={sec.id || idx} className="bg-slate-50/60 p-6 md:p-10 rounded-3xl border border-slate-100">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-3">
                      <span className="w-2.5 h-6 bg-brand-primary rounded-full inline-block"></span>
                      {sec.heading}
                    </h2>
                    <div 
                      className="prose max-w-none text-slate-700 leading-relaxed font-normal"
                      dangerouslySetInnerHTML={{ __html: sec.content || '' }} 
                    />
                  </div>
                ))
              ) : (
                <div className="text-slate-500 py-10 text-center">Nội dung chi tiết dịch vụ đang được cập nhật.</div>
              )}
            </div>

            {/* Direct Service CTA */}
            <div className="mt-14 p-8 md:p-12 bg-slate-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Cần tư vấn & Báo giá dịch vụ?</h3>
                <p className="text-slate-400 text-sm font-medium">Đội ngũ kỹ thuật viên của Hưng Thịnh sẵn sàng hỗ trợ trực tiếp 24/7.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <a href="tel:0123456789" className="px-8 py-4 bg-brand-accent hover:bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest text-center shadow-lg transition-all">
                  Gọi hotline: 0123.456.789
                </a>
                <Link href="/contact" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-widest text-center transition-all border border-white/20">
                  Gửi yêu cầu báo giá
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // 2. Fallback Category View
  if (!category) {
    return notFound();
  }

  const subCategories = getSubCategories(category.category_id);
  const categoryPosts = posts.filter(p => p.categoryId === category.category_id);

  return (
    <main className="bg-white min-h-screen">
      <section className="bg-slate-900 pt-24 md:pt-40 pb-14 md:pb-20 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-12 relative z-10">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Quay lại tất cả dịch vụ
          </Link>
          
          <h1 className="text-3xl md:text-6xl font-black text-white uppercase tracking-normal md:tracking-tight leading-tight">
            {category.name}
          </h1>
          <p className="mt-5 md:mt-6 text-slate-300 md:text-slate-400 text-base md:text-lg max-w-3xl font-medium leading-relaxed">
            {category.description || `Khám phá các giải pháp và bài viết kỹ thuật chuyên sâu về ${category.name}.`}
          </p>
        </div>
      </section>

      {subCategories.length > 0 && (
        <section className="py-8 md:py-12 bg-slate-50 border-b border-slate-100">
          <div className="container mx-auto px-4 md:px-12">
            <div className="flex gap-3 md:gap-4 overflow-x-auto md:flex-wrap scrollbar-hide pb-1">
              {subCategories.map(sub => (
                <Link 
                  key={sub.category_id}
                  href={`/services/${sub.slug}`}
                  className="shrink-0 min-h-11 px-5 md:px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-brand-primary hover:text-brand-primary hover:shadow-md transition-all flex items-center gap-2"
                >
                  <BadgeCheck size={16} className="text-brand-primary" />
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 md:px-12">
          {categoryPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryPosts.map((postItem, index) => (
                <ScrollReveal key={postItem.id} animation="reveal-scale" delay={index * 100}>
                  <NewsCard post={postItem} />
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
