"use client";

import React, { useState, useMemo } from "react";
import { 
    Search, 
    LayoutGrid, 
    List, 
    ChevronDown, 
    X, 
    SlidersHorizontal, 
    Package,
    ArrowRight
} from "lucide-react";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import ProductCard from "@/components/product/ProductCard";
import { useDebounce } from "@/hooks/useDebounce";

import { useRouter } from "next/navigation";

interface ProductListingProps {
  products: Product[];
  category?: Category | null;
  subCategories?: Category[];
  allCategories?: Category[];
  loading: boolean;
}

export default function ProductListing({ 
  products, 
  category, 
  subCategories = [], 
  allCategories = [],
  loading 
}: ProductListingProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubId, setActiveSubId] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Pagination State
  const [itemsPerPage, setItemsPerPage] = useState<50 | 100>(50);
  const [currentPage, setCurrentPage] = useState(1);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                            p.product_code.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesSub = !activeSubId || p.category_id === activeSubId;
      const matchesPrice = p.is_contact_price || (p.base_price >= priceRange[0] && p.base_price <= priceRange[1]);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      
      return matchesSearch && matchesSub && matchesPrice && matchesStatus;
    });
  }, [products, debouncedSearch, activeSubId, priceRange, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeSubId, priceRange, itemsPerPage]);

  const categoriesToDisplay = category ? subCategories : allCategories.filter(c => c.parent_id === null);

  return (
    <div className="flex flex-col lg:flex-row gap-16 max-w-[1600px] mx-auto px-6 md:px-12">
      {/* SIDEBAR FILTERS (Elegant & Minimal) */}
      <aside className="w-full lg:w-72 shrink-0 space-y-12">
        {/* ... existing sidebar code ... */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-8 flex items-center gap-4">
            <span className="w-8 h-1 bg-brand-primary rounded-full"></span>
            Tìm kiếm sản phẩm
          </h3>
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={22} />
            <input 
              type="text" 
              placeholder="Nhập tên hoặc mã sản phẩm..."
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] shadow-sm focus:outline-none focus:ring-8 focus:ring-brand-primary/5 focus:border-brand-primary transition-all text-base font-bold placeholder:text-slate-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-10 flex items-center gap-4">
            <span className="w-8 h-1 bg-brand-primary rounded-full"></span>
            Khoảng giá (VND)
          </h3>
          <div className="px-3">
            <div className="relative h-3 bg-slate-100 rounded-full mb-8">
                <div 
                    className="absolute h-full bg-brand-primary rounded-full shadow-[0_0_15px_rgba(30,64,175,0.3)]"
                    style={{ width: `${(priceRange[1] / 10000000) * 100}%` }}
                ></div>
                <input 
                    type="range" 
                    min="0" 
                    max="10000000" 
                    step="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                    className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-white border-4 border-brand-primary rounded-full shadow-xl transition-all pointer-events-none"
                    style={{ left: `calc(${(priceRange[1] / 10000000) * 100}% - 14px)` }}
                ></div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đến mức:</span>
                    <span className="text-lg font-black text-brand-primary">
                        {new Intl.NumberFormat("vi-VN").format(priceRange[1])}đ
                    </span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold italic text-center">
                    Kéo thanh trượt để điều chỉnh khoảng giá nhanh
                </p>
            </div>
          </div>
        </div>

        {/* Brand/Quality Pledge Box */}
        <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <Package className="text-brand-accent mb-6" size={32} />
            <h4 className="text-lg font-black tracking-tight mb-3">Cam kết chất lượng</h4>
            <p className="text-white/50 text-xs leading-relaxed mb-6">
                Mọi sản phẩm cung cấp bởi Hưng Thịnh đều đạt tiêu chuẩn quốc tế và được kiểm định nghiêm ngặt trước khi xuất xưởng.
            </p>
            <div className="flex items-center gap-2 text-brand-accent text-[10px] font-black uppercase tracking-widest cursor-pointer group-hover:gap-4 transition-all">
                Xem chứng chỉ
                <ArrowRight size={12} />
            </div>
        </div>
      </aside>

      {/* MAIN LISTING AREA */}
      <div className="flex-1">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-100">
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-1">
                    {activeSubId 
                      ? (category ? subCategories : allCategories).find(s => s.category_id === activeSubId)?.name 
                      : (category ? category.name : "Tất cả sản phẩm")}
                </h2>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                    Hiển thị <span className="text-brand-primary">{filteredProducts.length}</span> kết quả
                </p>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                    <button 
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? 'bg-brand-primary text-white shadow-md' : 'text-slate-400 hover:text-brand-primary'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button 
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition-all ${viewMode === "list" ? 'bg-brand-primary text-white shadow-md' : 'text-slate-400 hover:text-brand-primary'}`}
                    >
                        <List size={18} />
                    </button>
                </div>
                
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                    <SlidersHorizontal size={14} />
                    Sắp xếp
                    <ChevronDown size={14} />
                </button>
            </div>
        </div>

        {/* Results Grid */}
        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="aspect-[4/5] bg-slate-50 animate-pulse rounded-[24px]"></div>
                ))}
            </div>
        ) : paginatedProducts.length > 0 ? (
            <div className="space-y-12">
                <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6" 
                    : "flex flex-col gap-6"
                }>
                    {paginatedProducts.map((product) => (
                        <div key={product.product_id} className="transform scale-95 origin-top-left w-full h-full">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-slate-100">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Hiển thị:</span>
                        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                            {[50, 100].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setItemsPerPage(size as 50 | 100)}
                                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${itemsPerPage === size ? 'bg-white text-brand-primary shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-all"
                            >
                                <ArrowRight className="rotate-180" size={16} />
                            </button>
                            
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-400 hover:bg-slate-50'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-all"
                            >
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            <div className="py-32 flex flex-col items-center justify-center bg-white rounded-[40px] border border-dashed border-slate-200">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                    <Package className="text-slate-200" size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-slate-400 text-sm mb-8">Vui lòng thử lại với từ khóa khác.</p>
                <button 
                    onClick={() => {setSearchQuery(""); setActiveSubId(null); setPriceRange([0, 10000000]);}}
                    className="text-brand-primary font-black text-xs uppercase tracking-widest hover:underline"
                >
                    Xóa tất cả bộ lọc
                </button>
            </div>
        )}
      </div>
    </div>
  );
}

