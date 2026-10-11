"use client";

import React, { use } from "react";
import Link from "next/link";
import { usePosts } from "@/hooks/usePosts";
import ArticleLayout from "@/components/ui/ArticleLayout";
import { ArticleDisplayContent, ArticleSection } from "@/types/article";

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { posts, loading, getPostBySlug } = usePosts();
  
  const post = getPostBySlug(slug);

  if (loading) {
    return (
      <div className="pt-28 pb-16 container mx-auto px-4 flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-36 pb-20 container mx-auto px-4 text-center">
        <h1 className="text-3xl font-black mb-6 uppercase text-slate-900">Không tìm thấy bài viết</h1>
        <p className="text-slate-500 mb-8">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang đường dẫn khác.</p>
        <Link href="/news" className="inline-flex px-6 py-3 bg-brand-primary text-white rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-blue-800 transition-all">
          Quay lại danh sách tin tức
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.creationTime).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "long", year: "numeric",
  });
  const recentPosts = posts.filter(p => p.slug !== slug).slice(0, 4);

  const contentSections: ArticleSection[] = (post.sections && post.sections.length > 0)
    ? post.sections.map((sec, idx) => ({
        id: `sec-${sec.id || idx + 1}`,
        title: sec.heading || `Mục ${idx + 1}`,
        content: (
          <>
            {idx === 0 && post.thumbnail && (
              <figure className="mb-8 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <img 
                  src={post.thumbnail} 
                  alt={post.title} 
                  className="w-full max-h-[500px] object-cover rounded-2xl"
                />
              </figure>
            )}
            <div 
              className="prose-content text-slate-700 leading-relaxed font-normal"
              dangerouslySetInnerHTML={{ __html: sec.content || '' }} 
            />
            {idx === (post.sections?.length || 0) - 1 && (
              <p className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <em>Thẻ: #Thủy_lực, #Cơ_khí, #Thiết_bị_công_nghiệp</em>
              </p>
            )}
          </>
        )
      }))
    : [
        {
          id: "content",
          title: "Nội dung bài viết",
          content: (
            <>
              {post.thumbnail && (
                <figure className="mb-8 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                  <img 
                    src={post.thumbnail} 
                    alt={post.title} 
                    className="w-full max-h-[500px] object-cover rounded-2xl"
                  />
                </figure>
              )}
              <div 
                className="prose-content text-slate-700 leading-relaxed font-normal"
                dangerouslySetInnerHTML={{ __html: post.excerpt || '' }} 
              />
              <p className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <em>Thẻ: #Thủy_lực, #Cơ_khí, #Thiết_bị_công_nghiệp</em>
              </p>
            </>
          )
        }
      ];

  const relatedSection: ArticleSection = {
    id: "related",
    title: "Có thể bạn quan tâm",
    content: (
      <ul className="space-y-3">
        {recentPosts.map((recent) => (
          <li key={recent.id} className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
            <Link 
              href={`/news/${recent.slug}`}
              className="text-slate-700 hover:text-brand-primary font-bold transition-colors"
            >
              {recent.title}
            </Link> 
            <span className="text-xs text-slate-400">
              ({new Date(recent.creationTime).toLocaleDateString("vi-VN")})
            </span>
          </li>
        ))}
      </ul>
    )
  };

  const sections: ArticleSection[] = [...contentSections, relatedSection];

  const excerpt = `Phân loại: ${(post.postType || 'Tin tức').toUpperCase()} | Tác giả: ${post.authorId?.toString() || 'Ban Biên Tập Hưng Thịnh'} | Ngày đăng: ${formattedDate}`;

  const articleData: ArticleDisplayContent = {
    title: post.title,
    excerpt: excerpt,
    sections: sections,
  };

  return <ArticleLayout data={articleData} />;
}
