import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductListing from "@/features/portal/products/ProductListing";
import {
  filterAndPaginateProducts,
  getCategoryBySlug,
  getDescendantCategoryIds,
  getDirectChildren,
  getProductCategories,
  getProducts,
  parseProductFilters,
  type ProductSearchParams,
} from "@/lib/product-catalog";

interface CategoryProductsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ProductSearchParams>;
}

export default async function CategoryProductsPage({
  params,
  searchParams,
}: CategoryProductsPageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const products = getProducts();
  const categories = getProductCategories();
  const category = getCategoryBySlug(slug);

  if (!category) {
    return (
      <div className="container mx-auto px-4 pb-16 pt-28 text-center md:pb-20 md:pt-40">
        <h1 className="mb-6 text-4xl font-black">Không tìm thấy danh mục</h1>
        <Link
          href="/products"
          className="font-bold text-brand-primary hover:underline"
        >
          Quay lại danh mục sản phẩm
        </Link>
      </div>
    );
  }

  const subCategories = getDirectChildren(category.category_id);
  const filters = parseProductFilters(resolvedSearchParams);
  const categoryIds = getDescendantCategoryIds(categories, category.category_id);
  const listing = filterAndPaginateProducts(
    products,
    categories,
    filters,
    categoryIds,
  );

  return (
    <main>
      <section className="relative overflow-hidden bg-brand-primary pb-14 pt-24 md:pb-20 md:pt-40">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-white blur-[100px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wider text-white/60 md:mb-6 md:gap-3 md:tracking-widest">
            <Link href="/" className="transition-colors hover:text-brand-accent">
              Trang chủ
            </Link>
            <ChevronRight size={10} />
            <Link
              href="/products"
              className="transition-colors hover:text-brand-accent"
            >
              Sản phẩm
            </Link>
            <ChevronRight size={10} />
            <span className="text-white">{category.name}</span>
          </nav>

          <h1 className="mb-4 text-4xl font-black uppercase leading-tight tracking-normal text-white md:text-6xl md:tracking-tighter">
            {category.name}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-white/60">
            {category.description ||
              `Khám phá các giải pháp tối ưu trong danh mục ${category.name} dành cho hệ thống máy móc của bạn.`}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-0 sm:px-4">
          <ProductListing
            products={listing.products}
            totalResults={listing.totalResults}
            totalPages={listing.totalPages}
            filters={listing.filters}
            category={category}
            subCategories={subCategories}
            allCategories={categories}
          />
        </div>
      </section>
    </main>
  );
}
