"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { MOCK_PRODUCTS } from "@/data/mock-products";

const normalize = (value: string) => value.trim().toLowerCase();

export default function SearchHeader() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const results = useMemo(() => {
    const keyword = normalize(query);

    if (keyword.length < 2) {
      return MOCK_PRODUCTS.filter(
        (product) => product.status === "active" && !product.is_deleted && product.is_featured
      ).slice(0, 6);
    }

    return MOCK_PRODUCTS.filter((product) => {
      return (
        product.status === "active" &&
        !product.is_deleted &&
        (normalize(product.name).includes(keyword) ||
          normalize(product.product_code).includes(keyword))
      );
    }).slice(0, 6);
  }, [query]);

  const isDefaultView = query.trim().length < 2;
  const showResults = isFocused;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (results[0]) {
      router.push(`/product/${results[0].product_code.toLowerCase()}`);
      setIsFocused(false);
      return;
    }

    const keyword = query.trim();
    if (keyword) {
      router.push(`/products?q=${encodeURIComponent(keyword)}`);
      setIsFocused(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full lg:max-w-md lg:ml-auto"
      role="search"
    >
      <div className="bg-white border border-gray-200 rounded-full px-4 py-2.5 flex items-center gap-2 w-full shadow-sm hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-brand-accent/50">
        <Search size={16} className="text-brand-primary/60 shrink-0" />
        <input
          type="search"
          placeholder="Tìm kiếm linh kiện..."
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsFocused(false);
            }
          }}
          className="bg-transparent border-none text-base lg:text-sm text-brand-primary placeholder:text-brand-primary/40 focus:ring-0 w-full outline-none font-medium"
          aria-label="Tìm kiếm sản phẩm"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Xóa từ khóa tìm kiếm"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[120] overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-slate-900/15">
          {results.length > 0 ? (
            <div className="max-h-[360px] overflow-y-auto p-2">
              {isDefaultView && (
                <div className="px-3 pt-3 pb-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-primary/60">
                    Sản phẩm nổi bật
                  </h4>
                </div>
              )}
              {results.map((product) => (
                <Link
                  key={product.product_id}
                  href={`/product/${product.product_code.toLowerCase()}`}
                  onClick={() => setIsFocused(false)}
                  className="group flex min-h-20 items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-slate-50"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-black uppercase tracking-widest text-brand-primary/60">
                      {product.product_code}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm font-black leading-snug text-slate-900 group-hover:text-brand-primary">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {product.is_contact_price
                        ? "Giá liên hệ"
                        : new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.base_price)}
                    </p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-brand-primary"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-5 text-center">
              <p className="text-sm font-black text-slate-700">
                Không tìm thấy sản phẩm phù hợp
              </p>
              <button
                type="submit"
                className="mt-3 text-xs font-black uppercase tracking-widest text-brand-primary hover:underline"
              >
                Tìm trong toàn bộ sản phẩm
              </button>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
