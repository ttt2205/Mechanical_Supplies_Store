"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Calendar, 
  User, 
  ChevronLeft, 
  Share2, 
  Link as LinkIcon,
  MessageCircle,
  Clock,
  ChevronRight
} from "lucide-react";
import { FacebookIcon, TwitterIcon } from "@/components/ui/icons";
import { usePosts } from "@/hooks/usePosts";
export default function NewsDetailPage() {
  const { slug } = useParams();
  const { posts, loading, getPostBySlug } = usePosts();
  
  const post = getPostBySlug(slug as string);

  if (loading) {
    return (
      <div className="pt-40 pb-20 container mx-auto px-4 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-slate-100 h-[600px] animate-pulse rounded-3xl"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-40 pb-20 container mx-auto px-4 text-center">
        <h1 className="text-4xl font-black mb-6">Không tìm thấy bài viết</h1>
        <Link href="/news" className="text-brand-primary font-bold hover:underline">Quay lại danh sách tin tức</Link>
      </div>
    );
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Suggest other posts
  const recentPosts = posts.filter(p => p.slug !== slug).slice(0, 2);

  return (
    <main className="bg-white">
      {/* Article Header */}
      <section className="pt-40 pb-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/news" 
              className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-primary font-black text-[10px] uppercase tracking-[0.2em] mb-8 transition-colors group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Quay lại tin tức
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-4 py-1.5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                {post.post_type}
              </span>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-tight">
                <Calendar size={14} className="text-brand-accent" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-tight">
                <Clock size={14} className="text-brand-accent" />
                5 phút đọc
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-8">
              {post.title}
            </h1>

            <div className="flex items-center justify-between border-t border-slate-200 pt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-muted flex items-center justify-center text-brand-primary">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tác giả</p>
                  <p className="font-black text-slate-900">{post.author}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all">
                  <FacebookIcon size={18} />
                </button>
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all">
                  <TwitterIcon size={18} />
                </button>
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all">
                  <LinkIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            <div className="rounded-[40px] overflow-hidden shadow-2xl mb-16 relative aspect-video">
              <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
            </div>

            {/* Content Body */}
            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:leading-relaxed prose-p:text-slate-600 prose-strong:text-slate-900 prose-img:rounded-3xl shadow-sm bg-white p-8 md:p-12 rounded-[40px] border border-slate-100">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
              
              <p className="italic text-slate-400 mt-12 pt-12 border-t border-slate-100">
                Nguồn: Ban Biên Tập Hưng Thịnh Mechanical Supplies
              </p>
            </div>

            {/* Tags */}
            <div className="mt-12 flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-slate-50 text-slate-500 text-xs font-bold rounded-xl border border-slate-100 hover:bg-slate-100 cursor-pointer transition-colors">#Thủy_lực</span>
              <span className="px-4 py-2 bg-slate-50 text-slate-500 text-xs font-bold rounded-xl border border-slate-100 hover:bg-slate-100 cursor-pointer transition-colors">#Cơ_khí</span>
              <span className="px-4 py-2 bg-slate-50 text-slate-500 text-xs font-bold rounded-xl border border-slate-100 hover:bg-slate-100 cursor-pointer transition-colors">#Kỹ_thuật</span>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Articles */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Có thể bạn quan tâm</h2>
              <Link href="/news" className="text-brand-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:underline">
                Xem tất cả
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recentPosts.map((recent) => (
                <Link key={recent.post_id} href={`/news/${recent.slug}`} className="group">
                  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm group-hover:shadow-xl transition-all duration-500 flex items-center gap-6">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={recent.thumbnail} alt={recent.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent mb-2 block">
                        {recent.post_type}
                      </span>
                      <h4 className="font-black text-slate-900 leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                        {recent.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-3">{new Date(recent.created_at).toLocaleDateString("vi-VN")}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floating CTA */}
      <div className="fixed bottom-10 right-10 z-40">
        <button className="bg-brand-accent text-brand-primary w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-bounce-subtle group">
          <MessageCircle size={28} />
          <span className="absolute right-full mr-4 bg-white text-brand-primary px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all">
            Liên hệ tư vấn
          </span>
        </button>
      </div>
    </main>
  );
}
