"use client";

import React, { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Package, ArrowRight } from "lucide-react";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import ProductCard from "@/components/product/ProductCard";
import type { ProductFilters } from "@/lib/product-catalog";

interface ProductListingProps {
  products: Product[];
  totalResults: number;
  totalPages: number;
  filters: ProductFilters;
  category?: Category | null;
  subCategories?: Category[];
  allCategories?: Category[];
}

const MAX_PRICE = 10000000;

const sortOptions: {
  value: ProductFilters["sort"];
  label: string;
}[] = [
  { value: "newest", label: "Mới nhất" },
  { value: "az", label: "A -> Z" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

function ProductListingContent({
  products,
  totalResults,
  totalPages,
  filters,
  category,
  subCategories = [],
  allCategories = [],
}: ProductListingProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(filters.q);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);

  const categoriesToDisplay = category
    ? subCategories
    : allCategories.filter((item) => item.parent_id === null);

  const selectedCategory = useMemo(() => {
    if (!filters.sub) return null;
    return (category ? subCategories : allCategories).find(
      (item) => item.category_id === filters.sub,
    );
  }, [allCategories, category, filters.sub, subCategories]);

  const listingTitle =
    selectedCategory?.name || (category ? category.name : "Tất cả sản phẩm");

  const updateUrl = useCallback((
    updates: Record<string, string | number | null>,
    mode: "push" | "replace" = "push",
  ) => {    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    if (updates.page === undefined) {
      params.set("page", "1");
    }

    if (params.get("page") === "1") {
      params.delete("page");
    }

    if (params.get("limit") === "50") {
      params.delete("limit");
    }

    if (params.get("maxPrice") === String(MAX_PRICE)) {
      params.delete("maxPrice");
    }

    if (params.get("sort") === "newest") {
      params.delete("sort");
    }

    const queryString = params.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;
    startTransition(() => {
      if (mode === "replace") {
        router.replace(href, { scroll: false });
      } else {
        router.push(href, { scroll: false });
      }
    });
  }, [pathname, router, searchParams, startTransition]);

  useEffect(() => {
    if (searchQuery === filters.q) return;

    const timer = window.setTimeout(() => {
      updateUrl({ q: searchQuery || null }, "replace");
    }, 350);

    return () => window.clearTimeout(timer);
  }, [filters.q, searchQuery, updateUrl]);

  useEffect(() => {
    if (maxPrice === filters.maxPrice) return;

    const timer = window.setTimeout(() => {
      updateUrl({ maxPrice }, "replace");
    }, 250);

    return () => window.clearTimeout(timer);
  }, [filters.maxPrice, maxPrice, updateUrl]);

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 md:px-12 lg:flex-row lg:gap-16">
      <aside className="w-full shrink-0 space-y-6 lg:w-72 lg:space-y-12">
        <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 lg:rounded-none lg:border-0 lg:p-0 lg:shadow-none">
          <h3 className="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-slate-900 sm:tracking-[0.3em] lg:mb-8 lg:gap-4">
            <span className="h-1 w-8 rounded-full bg-brand-primary" />
            Tìm kiếm sản phẩm
          </h3>
          <div className="group relative">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand-primary"
              size={22}
            />
            <input
              type="text"
              placeholder="Nhập tên hoặc mã sản phẩm..."
              className="w-full rounded-2xl border-2 border-slate-100 bg-white py-4 pl-14 pr-5 text-base font-bold shadow-sm transition-all placeholder:text-slate-300 focus:border-brand-primary focus:outline-none focus:ring-8 focus:ring-brand-primary/5 lg:rounded-[24px] lg:py-5"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          {categoriesToDisplay.length > 0 && (
            <div className="mt-5 lg:mt-8">
              <select
                value={filters.sub || ""}
                onChange={(event) =>
                  updateUrl({
                    sub: event.target.value ? Number(event.target.value) : null,
                  })
                }
                className="min-h-12 w-full rounded-2xl border-2 border-slate-100 bg-white px-5 text-base font-black text-slate-700 outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 lg:hidden"
                aria-label="Chọn danh mục sản phẩm"
              >
                <option value="">Tất cả</option>
                {categoriesToDisplay.map((item) => (
                  <option key={item.category_id} value={item.category_id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <div className="hidden gap-2 lg:flex lg:flex-col">
                <button
                  onClick={() => updateUrl({ sub: null })}
                  className={`min-h-11 shrink-0 rounded-full px-4 text-xs font-black uppercase tracking-wider transition-all lg:w-full lg:rounded-2xl lg:text-left ${
                    filters.sub === null
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                      : "bg-slate-50 text-slate-500 hover:text-brand-primary"
                  }`}
                >
                  Tất cả
                </button>
                {categoriesToDisplay.map((item) => (
                  <button
                    key={item.category_id}
                    onClick={() => updateUrl({ sub: item.category_id })}
                    className={`min-h-11 shrink-0 rounded-full px-4 text-xs font-black uppercase tracking-wider transition-all lg:w-full lg:rounded-2xl lg:text-left ${
                      filters.sub === item.category_id
                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                        : "bg-slate-50 text-slate-500 hover:text-brand-primary"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 lg:rounded-none lg:border-0 lg:p-0 lg:shadow-none">
          <h3 className="mb-6 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-slate-900 sm:tracking-[0.3em] lg:mb-10 lg:gap-4">
            <span className="h-1 w-8 rounded-full bg-brand-primary" />
            Khoảng giá (VND)
          </h3>
          <div className="px-3">
            <div className="relative mb-8 h-3 rounded-full bg-slate-100">
              <div
                className="absolute h-full rounded-full bg-brand-primary shadow-[0_0_15px_rgba(30,64,175,0.3)]"
                style={{ width: `${(maxPrice / MAX_PRICE) * 100}%` }}
              />
              <input
                type="range"
                min="0"
                max={MAX_PRICE}
                step="100000"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                className="absolute z-10 h-full w-full cursor-pointer opacity-0"
              />
              <div
                className="pointer-events-none absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border-4 border-brand-primary bg-white shadow-xl transition-all"
                style={{ left: `calc(${(maxPrice / MAX_PRICE) * 100}% - 14px)` }}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Đến mức:
                </span>
                <span className="text-lg font-black text-brand-primary">
                  {new Intl.NumberFormat("vi-VN").format(maxPrice)}đ
                </span>
              </div>
              <p className="text-center text-[10px] font-bold italic text-slate-400">
                Kéo thanh trượt để điều chỉnh khoảng giá nhanh
              </p>
            </div>
          </div>
        </div>

        <div className="group relative hidden overflow-hidden rounded-[32px] bg-slate-900 p-8 text-white lg:block">
          <div className="absolute right-0 top-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-accent/10" />
          <Package className="mb-6 text-brand-accent" size={32} />
          <h4 className="mb-3 text-lg font-black tracking-tight">
            Cam kết chất lượng
          </h4>
          <p className="mb-6 text-xs leading-relaxed text-white/50">
            Mọi sản phẩm cung cấp bởi Hưng Thịnh đều đạt tiêu chuẩn quốc tế và
            được kiểm định nghiêm ngặt trước khi xuất xưởng.
          </p>
          <div className="flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-accent transition-all group-hover:gap-4">
            Xem chứng chỉ
            <ArrowRight size={12} />
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="mb-8 flex flex-col gap-5 border-b border-slate-100 pb-6 lg:mb-10">
          <div>
            <h2 className="mb-1 text-2xl font-black uppercase leading-tight tracking-normal text-slate-900 md:text-3xl md:tracking-tighter">
              {listingTitle}
            </h2>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 sm:text-sm sm:tracking-widest">
              Hiển thị{" "}
              <span className="text-brand-primary">{totalResults}</span> kết quả
              {isPending && <span className="ml-2 text-slate-300">...</span>}
            </p>
          </div>

          <div>
            <select
              value={filters.sort}
              onChange={(event) => updateUrl({ sort: event.target.value })}
              className="min-h-12 w-full rounded-2xl border-2 border-slate-100 bg-white px-5 text-base font-black text-slate-700 outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 md:hidden"
              aria-label="Sắp xếp sản phẩm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="hidden gap-2 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-sm md:inline-flex md:flex-wrap">
              {sortOptions.map((option) => {
                const isActive = filters.sort === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateUrl({ sort: option.value })}
                    className={`min-h-11 min-w-[132px] shrink-0 rounded-xl px-5 text-xs font-black uppercase tracking-wider transition-all sm:min-w-[150px] sm:px-7 ${
                      isActive
                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                        : "text-slate-500 hover:bg-slate-50 hover:text-brand-primary"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.product_id}
                  className="h-full w-full lg:origin-top-left lg:scale-95 lg:transform"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-between gap-8 border-t border-slate-100 pt-12 md:flex-row">
              <div className="flex items-center gap-4">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 sm:tracking-widest">
                  Hiển thị:
                </span>
                <div className="flex rounded-xl border border-slate-100 bg-slate-50 p-1">
                  {[50, 100].map((size) => (
                    <button
                      key={size}
                      onClick={() => updateUrl({ limit: size })}
                      className={`rounded-lg px-4 py-2 text-xs font-black transition-all ${
                        filters.limit === size
                          ? "border border-slate-100 bg-white text-brand-primary shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateUrl({ page: Math.max(1, filters.page - 1) })}
                    disabled={filters.page === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 text-slate-400 transition-all hover:bg-slate-50 disabled:opacity-30"
                    aria-label="Trang trước"
                  >
                    <ArrowRight className="rotate-180" size={16} />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => updateUrl({ page: index + 1 })}
                        className={`h-10 w-10 rounded-xl text-xs font-black transition-all ${
                          filters.page === index + 1
                            ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                            : "text-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      updateUrl({ page: Math.min(totalPages, filters.page + 1) })
                    }
                    disabled={filters.page === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 text-slate-400 transition-all hover:bg-slate-50 disabled:opacity-30"
                    aria-label="Trang sau"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[40px] border border-dashed border-slate-200 bg-white py-32">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
              <Package className="text-slate-200" size={40} />
            </div>
            <h3 className="mb-2 text-center text-xl font-black text-slate-900">
              Không tìm thấy sản phẩm
            </h3>
            <p className="mb-8 px-6 text-center text-sm text-slate-400">
              Vui lòng thử lại với từ khóa khác.
            </p>
            <button
              onClick={() =>
                updateUrl({
                  q: null,
                  sub: null,
                  maxPrice: null,
                  page: null,
                  limit: null,
                })
              }
              className="text-xs font-black uppercase tracking-widest text-brand-primary hover:underline"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductListing(props: ProductListingProps) {
  return (
    <ProductListingContent
      key={`${props.filters.q}-${props.filters.maxPrice}`}
      {...props}
    />
  );
}

