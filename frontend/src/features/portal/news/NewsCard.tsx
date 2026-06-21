"use client";

import React from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Post } from "@/types/post";

interface NewsCardProps {
  post: Post;
}

export default function NewsCard({ post }: NewsCardProps) {
  const formattedDate = new Date(post.created_at).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case "news": return "Tin tức";
      case "blog": return "Blog";
      case "guide": return "Hướng dẫn";
      default: return "Bài viết";
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 md:duration-500 flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={post.thumbnail} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-brand-primary/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
            {getPostTypeLabel(post.post_type)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400 text-[11px] font-bold uppercase tracking-tight mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-brand-accent" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1.5">
            <User size={14} className="text-brand-accent" />
            {post.author}
          </div>
        </div>

        <Link href={`/news/${post.slug}`} className="block group/title">
          <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight mb-3 group-hover/title:text-brand-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        <Link 
          href={`/news/${post.slug}`}
          className="inline-flex min-h-11 items-center gap-2 text-brand-primary font-black text-xs uppercase tracking-wider group/link"
        >
          Đọc thêm
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/link:bg-brand-primary group-hover/link:text-white transition-all">
            <ArrowRight size={14} />
          </div>
        </Link>
      </div>
    </div>
  );
}
