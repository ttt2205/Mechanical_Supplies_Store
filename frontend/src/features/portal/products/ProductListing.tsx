"use client";

import React, { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Package, ArrowRight, ChevronDown, Check, SlidersHorizontal } from "lucide-react";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import ProductCard from "@/components/product/ProductCard";
import Pagination from "@/components/ui/Pagination";
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

function SearchableCategorySelect({ categories, selectedValue, onChange }: { categories: Category[], selectedValue: number | null | undefined, onChange: (val: number | null) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = categories.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  const selectedName = selectedValue ? categories.find(c => c.category_id === selectedValue)?.name : "Tất cả danh mục";

  return (
    <div className="relative min-w-[180px] lg:minw-[220px]" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 border-b border-slate-200/60 bg-transparent px-1 py-2.5 text-sm font-medium text-slate-700 outline-none transition-all hover:border-slate-400 focus:border-brand-primary"
      >
        <span className="truncate">{selectedName}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-[280px] rounded-xl border border-slate-100/50 bg-white shadow-xl shadow-slate-200/50 max-h-80 flex flex-col overflow-hidden top-full left-0 backdrop-blur-md">
          <div className="p-2 border-b border-slate-50">
            <div className="relative flex items-center">
                <Search size={14} className="absolute left-3 text-slate-400" />
                <input 
                type="text" 
                placeholder="Tìm danh mục..." 
                autoFocus
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50/50 border border-slate-100 rounded-lg outline-none focus:border-slate-300 font-medium placeholder:text-slate-400 placeholder:font-normal transition-all"
                value={query}
                onChange={e => setQuery(e.target.value)}
                />
            </div>
          </div>
          <div className="overflow-y-auto p-1.5 flex-1 custom-scrollbar">
            <button 
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 text-sm rounded-lg transition-colors ${!selectedValue ? 'font-medium text-brand-primary bg-brand-primary/5' : 'text-slate-600 hover:bg-slate-50'}`}
              onClick={() => { onChange(null); setIsOpen(false); setQuery(""); }}
            >
              Tất cả danh mục
              {!selectedValue && <Check size={14} />}
            </button>
            {filtered.map(c => (
              <button 
                key={c.category_id}
                className={`w-full flex items-center justify-between text-left px-3 py-2.5 text-sm rounded-lg transition-colors ${selectedValue === c.category_id ? 'font-medium text-brand-primary bg-brand-primary/5' : 'text-slate-600 hover:bg-slate-50'}`}
                onClick={() => { onChange(c.category_id); setIsOpen(false); setQuery(""); }}
              >
                {c.name}
                {selectedValue === c.category_id && <Check size={14} />}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-6 text-center text-xs text-slate-400 font-medium">Không tìm thấy</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
  const [localPriceInput, setLocalPriceInput] = useState<string>("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const displayPrice = isInputFocused 
    ? localPriceInput 
    : (maxPrice ? new Intl.NumberFormat('vi-VN').format(maxPrice) : "");

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
    }, 500);

    return () => window.clearTimeout(timer);
  }, [filters.maxPrice, maxPrice, updateUrl]);

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col px-4 md:px-12">
      
      {/* Sleek Filter Bar - All filters at the top */}
      <div className="mb-10 w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] md:p-8">
        
        {/* Top Header / Title */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-slate-50 pb-6 md:flex-row md:items-end">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                {listingTitle}
                </h2>
                <p className="mt-1.5 text-sm font-medium text-slate-500">
                Hiển thị <span className="font-semibold text-slate-900">{totalResults}</span> kết quả
                {isPending && <span className="ml-2 animate-pulse text-slate-300">...</span>}
                </p>
            </div>
            
            {/* Show per page toggle (Optional/Sleek) */}
            <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-400">Hiển thị:</span>
                <div className="flex items-center gap-1">
                    {[50, 100].map((size) => (
                    <button
                        key={size}
                        onClick={() => updateUrl({ limit: size })}
                        className={`px-3 py-1 text-xs rounded-md transition-all ${
                        filters.limit === size
                            ? "bg-slate-900 text-white font-medium"
                            : "text-slate-500 hover:bg-slate-50"
                        }`}
                    >
                        {size}
                    </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            
            {/* Left side: Search & Categories */}
            <div className="flex flex-1 flex-col sm:flex-row gap-6">
                {/* Search Input */}
                <div className="relative flex-1 group">
                    <Search
                        className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand-primary"
                        size={16}
                    />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full border-b border-slate-200/60 bg-transparent py-2.5 pl-8 pr-4 text-sm font-medium text-slate-800 transition-all placeholder:text-slate-400 placeholder:font-normal focus:border-brand-primary focus:outline-none"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                    />
                </div>

                {/* Categories */}
                {categoriesToDisplay.length > 0 && (
                    <div className="flex-shrink-0">
                        <SearchableCategorySelect 
                        categories={categoriesToDisplay}
                        selectedValue={filters.sub}
                        onChange={(val) => updateUrl({ sub: val })}
                        />
                    </div>
                )}
            </div>

            {/* Right side: Price & Sort */}
            <div className="flex flex-col sm:flex-row gap-6 md:pl-8 md:border-l md:border-slate-100">
                
                {/* Price Input */}
                <div className="flex flex-col gap-1.5 min-w-[140px]">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mức giá tối đa</span>
                    <div className="relative group">
                        <input
                        type="text"
                        value={displayPrice}
                        onFocus={() => {
                            setIsInputFocused(true);
                            setLocalPriceInput(maxPrice ? new Intl.NumberFormat('vi-VN').format(maxPrice) : "");
                        }}
                        onBlur={() => {
                            setIsInputFocused(false);
                            const rawValue = localPriceInput.replace(/\D/g, "");
                            const val = rawValue ? Number(rawValue) : 0;
                            const finalVal = val > MAX_PRICE ? MAX_PRICE : val;
                            setMaxPrice(finalVal);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                            e.currentTarget.blur();
                            }
                        }}
                        onChange={(e) => setLocalPriceInput(e.target.value)}
                        className="w-full border-b border-slate-200/60 bg-transparent py-2.5 px-1 pr-6 text-sm font-medium text-slate-800 transition-all placeholder:text-slate-300 focus:border-brand-primary focus:outline-none"
                        placeholder="0"
                        />
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">đ</span>
                    </div>
                </div>

                {/* Sort */}
                <div className="flex flex-col gap-1.5 min-w-[160px]">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Sắp xếp theo</span>
                    <div className="relative">
                        <select
                            value={filters.sort}
                            onChange={(event) => updateUrl({ sort: event.target.value })}
                            className="w-full appearance-none border-b border-slate-200/60 bg-transparent py-2.5 pl-1 pr-6 text-sm font-medium text-slate-800 outline-none transition-all focus:border-brand-primary"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                {option.label}
                                </option>
                            ))}
                        </select>
                        <SlidersHorizontal size={14} className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

            </div>

        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 w-full">
        {products.length > 0 ? (
          <div className="space-y-16">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4 lg:gap-8">
              {products.map((product) => (
                <div key={product.product_id} className="h-full w-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination 
              currentPage={filters.page} 
              totalPages={totalPages} 
              onPageChange={(page) => updateUrl({ page })} 
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/50 py-32">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Package className="text-slate-300" size={28} />
            </div>
            <h3 className="mb-2 text-center text-lg font-medium text-slate-800">
              Không tìm thấy sản phẩm
            </h3>
            <p className="mb-8 px-6 text-center text-sm text-slate-500">
              Vui lòng thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm.
            </p>
            <button
              onClick={() =>
                updateUrl({
                  q: null,
                  sub: null,
                  maxPrice: null,
                  page: null,
                  limit: null,
                  sort: null,
                })
              }
              className="text-sm font-medium text-brand-primary hover:underline underline-offset-4"
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
