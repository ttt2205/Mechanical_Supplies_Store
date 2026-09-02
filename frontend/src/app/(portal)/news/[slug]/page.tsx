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
      <div className="pt-28 pb-16 container mx-auto px-4 flex justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-28 pb-16 container mx-auto px-4 text-center">
        <h1 className="text-3xl font-black mb-6 uppercase">Không tìm thấy bài viết</h1>
        <Link href="/news" className="text-brand-primary font-bold hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "long", year: "numeric",
  });
  const recentPosts = posts.filter(p => p.slug !== slug).slice(0, 3);

  const sections: ArticleSection[] = [
    {
      id: "content",
      title: "Nội dung bài viết",
      content: (
        <>
          {post.thumbnail && (
             <figure>
               <img src={post.thumbnail} alt={post.title} />
             </figure>
          )}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          <p>
            <em>Thẻ: #Thủy_lực, #Cơ_khí</em>
          </p>
        </>
      )
    },
    {
      id: "related",
      title: "Có thể bạn quan tâm",
      content: (
        <ul>
          {recentPosts.map((recent) => (
            <li key={recent.post_id}>
              <Link href={`/news/${recent.slug}`}>{recent.title}</Link> ({new Date(recent.created_at).toLocaleDateString("vi-VN")})
            </li>
          ))}
        </ul>
      )
    }
  ];

  const excerpt = `Phân loại: ${post.post_type.toUpperCase()} | Tác giả: ${post.author || 'Ban Biên Tập'} | Ngày đăng: ${formattedDate}`;

  const articleData: ArticleDisplayContent = {
    title: post.title,
    excerpt: excerpt,
    sections: sections,
  };

  return <ArticleLayout data={articleData} />;
}
