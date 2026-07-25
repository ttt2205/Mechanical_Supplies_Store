import React from "react";
import ProductListing from "@/features/portal/products/ProductListing";
import {
  filterAndPaginateProducts,
  getProductCategories,
  getProducts,
  parseProductFilters,
  type ProductSearchParams,
} from "@/lib/product-catalog";

interface ProductsPageProps {
  searchParams: Promise<ProductSearchParams>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const products = getProducts();
  const categories = getProductCategories();
  const filters = parseProductFilters(resolvedSearchParams);
  const listing = filterAndPaginateProducts(products, categories, filters);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/5 bg-[#020617] pb-12 pt-32 md:pb-16 md:pt-40">
        <div className="absolute inset-0 z-0">
          <div className="absolute -left-[10%] -top-[30%] h-[70%] w-[70%] animate-pulse rounded-full bg-brand-primary/25 blur-[180px]" />
          <div className="absolute -bottom-[30%] -right-[10%] h-[70%] w-[70%] rounded-full bg-brand-accent/15 blur-[180px]" />
        </div>

        <div className="absolute inset-0 z-0 opacity-[0.05]">
          <div className="grid h-full grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-full border-r border-white" />
            ))}
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4 font-montserrat">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 flex items-center justify-center gap-3 md:mb-8 md:gap-4">
              <span className="h-1 w-12 rounded-full bg-brand-accent shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-accent drop-shadow-lg md:text-xs md:tracking-[0.4em]">
                Hệ sinh thái sản phẩm
              </span>
              <span className="h-1 w-12 rounded-full bg-brand-accent shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
            </div>
            <h1 className="mb-4 text-3xl font-black uppercase leading-tight tracking-normal text-white drop-shadow-2xl md:mb-6 md:text-6xl md:tracking-tighter">
              TẤT CẢ <span className="text-gradient">SẢN PHẨM</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-slate-300 md:text-lg md:text-slate-400">
              Khám phá toàn bộ danh mục thiết bị cơ khí và vật tư công nghiệp{" "}
              <span className="font-bold text-white">chính hãng</span>, được
              tuyển chọn kỹ lưỡng cho hiệu suất vận hành tối ưu.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-20 py-12 md:py-20">
        <div className="container mx-auto px-0 sm:px-4">
          <ProductListing
            products={listing.products}
            totalResults={listing.totalResults}
            totalPages={listing.totalPages}
            filters={listing.filters}
            allCategories={categories}
          />
        </div>
      </section>
    </main>
  );
}
