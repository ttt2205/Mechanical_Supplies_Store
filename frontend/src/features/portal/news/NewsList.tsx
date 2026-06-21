"use client";

import React, { useState, useMemo } from "react";
import { Search, Newspaper, X, Check, SlidersHorizontal } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { useDebounce } from "@/hooks/useDebounce";
import NewsCard from "./NewsCard";

export default function NewsList() {
  const { posts, loading } = usePosts();
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Add Debounce
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesFilter = filter === "all" || post.post_type === filter;
      const matchesSearch = post.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [posts, filter, debouncedSearchQuery]);

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "news", name: "Tin tức" },
    { id: "blog", name: "Blog" },
    { id: "guide", name: "Hướng dẫn" },
  ];

  const handleClear = () => {
    setSearchQuery("");
    setFilter("all");
  };

  return (
    <section className="py-12 md:py-20 bg-slate-50/50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-10 md:mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-12 bg-brand-accent"></span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent">Trung tâm tin tức</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-normal md:tracking-tighter leading-tight md:leading-none mb-5 md:mb-6">
              Cập nhật <span className="text-brand-primary">Kiến thức & Thông tin</span> Công nghiệp
            </h2>
            <p className="text-slate-600 md:text-slate-500 text-base md:text-lg leading-relaxed">
              Tổng hợp những bài viết mới nhất về kỹ thuật thủy lực, tin tức thị trường và hướng dẫn sử dụng thiết bị cơ khí chuyên nghiệp.
            </p>
          </div>
        </div>

        {/* REDESIGNED SEARCH & FILTER BAR */}
        <div className="bg-white p-2 md:p-3 rounded-3xl md:rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 mb-8 md:mb-12 flex flex-col lg:flex-row items-center gap-3 md:gap-4">
          
          {/* Search Input Area */}
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm tiêu đề, nội dung bài viết..."
              className="w-full pl-14 pr-12 py-4 md:py-5 bg-slate-50 border-none rounded-2xl focus:ring-0 text-base lg:text-sm font-bold text-slate-900 placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Vertical Divider (Desktop) */}
          <div className="hidden lg:block w-px h-10 bg-slate-100 mx-2"></div>

          {/* Filters Area */}
          <div className="flex w-full items-center gap-2 overflow-x-auto px-2 md:px-4 py-2 lg:w-auto lg:flex-wrap lg:justify-center scrollbar-hide">
            <div className="flex items-center gap-2 text-slate-400 mr-2">
              <SlidersHorizontal size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Bộ lọc</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                  filter === cat.id 
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-105" 
                    : "bg-white text-slate-500 hover:bg-slate-50 hover:text-brand-primary border border-slate-100"
                }`}
              >
                {filter === cat.id && <Check size={12} strokeWidth={4} />}
                {cat.name}
              </button>
            ))}
          </div>

          {/* Reset Button */}
          {(searchQuery || filter !== "all") && (
            <button 
              onClick={handleClear}
              className="px-6 py-5 text-brand-accent-alt font-black text-[11px] uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-colors flex items-center gap-2"
            >
              Làm mới
            </button>
          )}
        </div>

        {/* Results Info */}
        {!loading && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
            <div className="flex items-center gap-3">
              <p className="text-slate-400 text-sm font-bold">
                Tìm thấy <span className="text-brand-primary">{filteredPosts.length}</span> bài viết
              </p>
              {filter !== "all" && (
                <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase rounded-full">
                  Danh mục: {categories.find(c => c.id === filter)?.name}
                </span>
              )}
            </div>
            {debouncedSearchQuery && (
              <p className="text-slate-400 text-xs italic">
                Kết quả cho: <span className="text-slate-900 font-bold">&quot;{debouncedSearchQuery}&quot;</span>
              </p>
            )}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-[450px] animate-pulse border border-slate-100 shadow-sm"></div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPosts.map((post) => (
              <NewsCard key={post.post_id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
            <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-8">
              <Newspaper className="text-slate-200" size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Không tìm thấy bài viết</h3>
            <p className="text-slate-400 text-sm max-w-xs text-center leading-relaxed">
              Chúng tôi không tìm thấy bài viết nào phù hợp với từ khóa <span className="text-slate-900 font-bold italic">&quot;{searchQuery}&quot;</span>.
            </p>
            <button 
              onClick={handleClear}
              className="mt-10 px-8 py-3 bg-brand-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-xl shadow-brand-primary/20"
            >
              Xem tất cả bài viết
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
