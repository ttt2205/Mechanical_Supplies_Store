"use client";

import React from "react";
import ProductListing from "@/features/portal/products/ProductListing";
import { useProducts } from "@/hooks/useProducts";
import { useProductCategories } from "@/hooks/useProductCategories";

export default function ProductsPage() {
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useProductCategories();

  return (
    <main>
      {/* Dynamic Header Section - Luxurious "Dark-Bright" Theme */}
      <section className="bg-[#020617] pt-40 pb-24 overflow-hidden relative border-b border-white/5">
        {/* Intensified Deep Glow Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-brand-primary/25 rounded-full blur-[180px] animate-pulse"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-brand-accent/15 rounded-full blur-[180px]"></div>
        </div>

        <div className="absolute inset-0 z-0 opacity-[0.05]">
          <div className="grid grid-cols-6 h-full">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="border-r border-white h-full"></div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
                <span className="h-1 w-12 bg-brand-accent rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)]"></span>
                <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-accent drop-shadow-lg">Hệ sinh thái sản phẩm</span>
                <span className="h-1 w-12 bg-brand-accent rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)]"></span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-tight uppercase drop-shadow-2xl">
              TẤT CẢ <span className="text-gradient">SẢN PHẨM</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
              Khám phá toàn bộ danh mục thiết bị cơ khí và vật tư công nghiệp <span className="text-white font-bold">chính hãng</span>, được tuyển chọn kỹ lưỡng cho hiệu suất vận hành tối ưu.
            </p>
          </div>
        </div>
      </section>


      <section className="py-20 relative z-20">
        <div className="container mx-auto px-4">
          <ProductListing 
            products={products} 
            allCategories={categories}
            loading={productsLoading || categoriesLoading}
          />
        </div>
      </section>
    </main>
  );
}

