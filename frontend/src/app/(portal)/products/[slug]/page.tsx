"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useProductCategories } from "@/hooks/useProductCategories";
import ProductListing from "@/features/portal/products/ProductListing";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CategoryProductsPage() {
  const { slug } = useParams();
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useProductCategories();

  const category = categories.find(c => c.slug === slug);
  const subCategories = categories.filter(c => c.parent_id === category?.category_id);
  
  // Get all category IDs including subcategories to filter products
  const categoryIds = [category?.category_id, ...subCategories.map(s => s.category_id)].filter(Boolean) as number[];
  const filteredProducts = products.filter(p => categoryIds.includes(p.category_id));

  if (!category && !categoriesLoading) {
    return (
      <div className="pt-40 pb-20 container mx-auto px-4 text-center">
        <h1 className="text-4xl font-black mb-6">Không tìm thấy danh mục</h1>
        <Link href="/products" className="text-brand-primary font-bold hover:underline">Quay lại danh mục sản phẩm</Link>
      </div>
    );
  }

  return (
    <main>
      {/* Category Hero Header */}
      <section className="bg-brand-primary pt-40 pb-20 overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center gap-3 text-white/50 text-[10px] font-black uppercase tracking-widest mb-6">
            <Link href="/" className="hover:text-brand-accent transition-colors">Trang chủ</Link>
            <ChevronRight size={10} />
            <Link href="/products" className="hover:text-brand-accent transition-colors">Sản phẩm</Link>
            <ChevronRight size={10} />
            <span className="text-white">{category?.name}</span>
          </nav>
          
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4 uppercase">
            {category?.name}
          </h1>
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
            {category?.description || `Khám phá các giải pháp tối ưu trong danh mục ${category?.name} dành cho hệ thống máy móc của bạn.`}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <ProductListing 
            products={filteredProducts} 
            category={category!} 
            subCategories={subCategories}
            loading={productsLoading || categoriesLoading}
          />
        </div>
      </section>
    </main>
  );
}
