"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Package, LayoutGrid } from "lucide-react";
import { useProductCategories } from "@/hooks/useProductCategories";

export default function CategoryIndex() {
  const { categories, loading } = useProductCategories();
  
  // Filter for root categories (Level 1)
  const rootCategories = categories.filter(c => c.parent_id === null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-3xl border border-slate-100"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rootCategories.map((cat) => (
          <Link 
            key={cat.category_id} 
            href={`/products/${cat.slug}`}
            className="group relative bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="p-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-brand-muted flex items-center justify-center text-brand-primary mb-8 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                <Package size={32} />
              </div>

              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-brand-primary transition-colors">
                {cat.name}
              </h3>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                {cat.description || `Khám phá bộ sưu tập đầy đủ các thiết bị và phụ kiện chất lượng cao trong nhóm ${cat.name}.`}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent flex items-center gap-2">
                  <span className="w-8 h-px bg-brand-accent"></span>
                  Khám phá ngay
                </span>
                <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>

            {/* Subtle Texture/Pattern */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        ))}
      </div>

      {/* Featured Promo */}
      <div className="relative rounded-[40px] bg-brand-primary p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <LayoutGrid className="w-full h-full" strokeWidth={1} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4">
                Tìm kiếm giải pháp kỹ thuật <span className="text-brand-accent">chuyên biệt?</span>
            </h2>
            <p className="text-white/70 text-lg">
                Đội ngũ kỹ sư của chúng tôi sẵn sàng tư vấn và cung cấp các thiết bị được tùy chỉnh theo yêu cầu kỹ thuật đặc thù của bạn.
            </p>
          </div>
          <button className="px-10 py-4 bg-brand-accent text-brand-primary font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20">
            Liên hệ tư vấn
          </button>
        </div>
      </div>
    </div>
  );
}
