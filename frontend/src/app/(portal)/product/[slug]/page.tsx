"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useProductCategories } from "@/hooks/useProductCategories";
import { useViewLog } from "@/hooks/useViewLog";
import { useAuthStore } from "@/store/useAuthStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import ProductCard from "@/components/product/ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Link from "next/link";
import { 
    ChevronRight, 
    ShieldCheck, 
    Truck, 
    RefreshCcw, 
    ArrowLeft,
    Share2,
    Heart,
    ArrowRight,
    Phone,
    ChevronLeft
} from "lucide-react";

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = useParams();
  const { getProductBySlug, getProductsByCategory, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useProductCategories();
  const { logView } = useViewLog();
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const activePointerIdRef = useRef<number | null>(null);
  const resumeAutoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const product = getProductBySlug(slug as string);

  const productImages = useMemo(() => {
    if (!product) return [];

    const images = product.images?.length ? product.images : [product.thumbnail];
    return Array.from(new Set([product.thumbnail, ...images]));
  }, [product]);

  const selectedImageIndex = productImages.length > 0
    ? Math.min(activeImageIndex, productImages.length - 1)
    : 0;

  useEffect(() => {
    if (product) {
      logView(product.product_id);
    }
  }, [product, logView]);

  useEffect(() => {
    if (isAutoPaused || productImages.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % productImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPaused, productImages.length]);

  useEffect(() => {
    return () => {
      if (resumeAutoTimerRef.current) {
        clearTimeout(resumeAutoTimerRef.current);
      }
    };
  }, []);

  const pauseAutoTemporarily = () => {
    setIsAutoPaused(true);

    if (resumeAutoTimerRef.current) {
      clearTimeout(resumeAutoTimerRef.current);
    }

    resumeAutoTimerRef.current = setTimeout(() => {
      setIsAutoPaused(false);
      resumeAutoTimerRef.current = null;
    }, 5000);
  };

  const goToImage = (index: number) => {
    setActiveImageIndex(index);
    pauseAutoTemporarily();
  };

  const goToPreviousImage = () => {
    setActiveImageIndex((current) =>
      current === 0 ? productImages.length - 1 : current - 1,
    );
    pauseAutoTemporarily();
  };

  const goToNextImage = () => {
    setActiveImageIndex((current) => (current + 1) % productImages.length);
    pauseAutoTemporarily();
  };

  const handleImagePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (productImages.length <= 1) return;

    activePointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    setIsDragging(true);
    setDragOffset(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleImagePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || activePointerIdRef.current !== event.pointerId) return;

    const distance = event.clientX - dragStartXRef.current;
    setDragOffset(Math.max(-120, Math.min(120, distance)));
  };

  const finishImageDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || activePointerIdRef.current !== event.pointerId) return;

    const distance = event.clientX - dragStartXRef.current;
    const threshold = 56;

    if (distance > threshold) {
      goToPreviousImage();
    } else if (distance < -threshold) {
      goToNextImage();
    } else {
      pauseAutoTemporarily();
    }

    setIsDragging(false);
    setDragOffset(0);
    activePointerIdRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    
    // Find sibling products (same category)
    const directSiblings = getProductsByCategory(product.category_id)
        .filter(p => p.product_id !== product.product_id);
    
    if (directSiblings.length >= 4) return directSiblings.slice(0, 4);

    // If not enough direct siblings, find products in parent category
    const category = categories.find(c => c.category_id === product.category_id);
    if (category && category.parent_id) {
        const subCategoryIds = categories
            .filter(c => c.parent_id === category.parent_id)
            .map(c => c.category_id);
        
        const parentSiblings = getProductsByCategory(0) // hack to get all or use filter on all products if hook allows
            .filter(p => subCategoryIds.includes(p.category_id) && p.product_id !== product.product_id);
        
        return [...directSiblings, ...parentSiblings].slice(0, 4);
    }

    return directSiblings.slice(0, 4);
  }, [product, getProductsByCategory, categories]);

  const favorite = product ? isAuthenticated && isFavorite(product.product_id) : false;

  const toggleFavorite = () => {
    if (!product) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/product/${product.product_code.toLowerCase()}`)}`);
      return;
    }

    if (favorite) removeFavorite(product.product_id);
    else addFavorite(product);
  };

  const loading = productsLoading || categoriesLoading;

  if (loading) {
    return (
        <div className="pt-28 md:pt-40 pb-16 md:pb-20 container mx-auto px-4 flex flex-col items-center">
            <div className="w-full max-w-6xl bg-slate-50 h-[600px] animate-pulse rounded-[40px]"></div>
        </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-28 md:pt-40 pb-16 md:pb-20 container mx-auto px-4 text-center">
        <h1 className="text-4xl font-black mb-6 uppercase">Không tìm thấy sản phẩm</h1>
        <Link href="/products" className="text-brand-primary font-bold hover:underline uppercase text-xs tracking-widest flex items-center justify-center gap-2">
            <ArrowLeft size={14} />
            Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-white">
      {/* Breadcrumbs */}
      <div className="pt-24 md:pt-32 pb-5 md:pb-6 bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4">
          <nav className="flex flex-wrap items-center gap-2 md:gap-3 text-slate-400 text-[10px] font-black uppercase tracking-wider md:tracking-widest">
            <Link href="/" className="hover:text-brand-primary transition-colors">Trang chủ</Link>
            <ChevronRight size={10} />
            <Link href="/products" className="hover:text-brand-primary transition-colors">Sản phẩm</Link>
            <ChevronRight size={10} />
            <span className="text-slate-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-16">
            
            {/* PRODUCT IMAGERY */}
            <div className="flex-1 space-y-6">
                <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-inner md:rounded-[40px]">
                    <div
                        className={`aspect-square overflow-hidden group relative touch-pan-y select-none ${
                            productImages.length > 1 ? "cursor-grab active:cursor-grabbing" : ""
                        }`}
                        onPointerDown={handleImagePointerDown}
                        onPointerMove={handleImagePointerMove}
                        onPointerUp={finishImageDrag}
                        onPointerCancel={finishImageDrag}
                    >
                        {productImages.map((image, index) => (
                            <img
                                key={image}
                                src={image}
                                alt={`${product.name} - ảnh ${index + 1}`}
                                draggable={false}
                                style={{
                                    transform:
                                        selectedImageIndex === index
                                            ? `translateX(${dragOffset}px) scale(${isDragging ? 0.985 : 1})`
                                            : "translateX(0) scale(1.05)",
                                }}
                                className={`absolute inset-0 h-full w-full object-cover transition-all ease-out group-hover:scale-105 ${
                                    isDragging && selectedImageIndex === index ? "duration-0" : "duration-700"
                                } ${
                                    selectedImageIndex === index
                                        ? "opacity-100"
                                        : "opacity-0"
                                }`}
                            />
                        ))}

                        <div className="absolute top-4 right-4 md:top-8 md:right-8 flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={toggleFavorite}
                                className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center transition-all ${favorite ? "text-red-500" : "text-slate-400 hover:text-brand-accent-alt"}`}
                                aria-label={favorite ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
                                onPointerDown={(event) => event.stopPropagation()}
                            >
                                <Heart size={20} fill={favorite ? "currentColor" : "none"} />
                            </button>
                            <button className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center text-slate-400 hover:text-brand-primary transition-all" aria-label="Chia sẻ sản phẩm" onPointerDown={(event) => event.stopPropagation()}>
                                <Share2 size={20} />
                            </button>
                        </div>

                        {productImages.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={goToPreviousImage}
                                    onPointerDown={(event) => event.stopPropagation()}
                                    className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/90 text-slate-700 shadow-xl backdrop-blur-md transition-all hover:bg-brand-primary hover:text-white"
                                    aria-label="Ảnh trước"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    type="button"
                                    onClick={goToNextImage}
                                    onPointerDown={(event) => event.stopPropagation()}
                                    className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/90 text-slate-700 shadow-xl backdrop-blur-md transition-all hover:bg-brand-primary hover:text-white"
                                    aria-label="Ảnh sau"
                                >
                                    <ChevronRight size={20} />
                                </button>

                                <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-xl backdrop-blur-md">
                                    {productImages.map((image, index) => (
                                        <button
                                            key={`${image}-dot`}
                                            type="button"
                                            onClick={() => goToImage(index)}
                                            onPointerDown={(event) => event.stopPropagation()}
                                            className={`h-2 rounded-full transition-all ${
                                                selectedImageIndex === index
                                                    ? "w-6 bg-brand-primary"
                                                    : "w-2 bg-slate-300 hover:bg-slate-400"
                                            }`}
                                            aria-label={`Xem ảnh ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {productImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                        {productImages.map((image, index) => (
                            <button
                                key={`${image}-thumb`}
                                type="button"
                                onClick={() => goToImage(index)}
                                className={`aspect-square overflow-hidden rounded-2xl border-2 bg-slate-50 transition-all ${
                                    selectedImageIndex === index
                                        ? "border-brand-primary shadow-lg shadow-brand-primary/15"
                                        : "border-slate-100 opacity-70 hover:opacity-100"
                                }`}
                                aria-label={`Chọn ảnh ${index + 1}`}
                            >
                                <img
                                    src={image}
                                    alt={`${product.name} thumbnail ${index + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* PRODUCT INFO */}
            <div className="flex-1 space-y-7 md:space-y-10">
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <span className="px-3 py-1 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-brand-primary/20">
                            Chính hãng
                        </span>
                        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                            Mã SP: {product.product_code}
                        </span>
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-normal md:tracking-tighter leading-[1.15] mb-5 md:mb-6 uppercase">
                        {product.name}
                    </h1>

                    <div className="flex items-baseline gap-4 mb-8">
                        {product.is_contact_price ? (
                            <span className="text-3xl font-black text-brand-primary uppercase tracking-tighter">Giá liên hệ</span>
                        ) : (
                            <>
                                <span className="text-4xl font-black text-brand-primary tracking-tighter">
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.base_price)}
                                </span>
                                <span className="text-slate-400 text-sm line-through font-bold">
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.base_price * 1.1)}
                                </span>
                            </>
                        )}
                    </div>

                    <p className="text-slate-600 leading-relaxed text-base md:text-lg max-w-xl">
                        Sản phẩm chất lượng cao được thiết kế cho các ứng dụng công nghiệp nặng, đảm bảo độ bền và hiệu suất tối ưu trong mọi điều kiện vận hành khắc nghiệt.
                    </p>
                </div>

                {/* Purchase Actions */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
                    <button className="flex-1 min-h-12 bg-brand-primary text-white py-4 md:py-5 px-6 md:px-8 rounded-2xl font-black uppercase tracking-wider md:tracking-widest text-sm flex items-center justify-center gap-4 hover:bg-blue-800 transition-all shadow-xl shadow-brand-primary/20 group">
                        <Phone size={20} className="animate-icon-pulse fill-white" />
                        Liên hệ ngay
                    </button>
                    <button
                        type="button"
                        onClick={toggleFavorite}
                        className={`min-h-12 py-4 md:py-5 px-8 md:px-10 rounded-2xl font-black uppercase tracking-wider md:tracking-widest text-sm transition-all shadow-xl flex items-center justify-center gap-3 ${favorite ? "bg-red-50 text-red-500 shadow-red-100" : "bg-brand-accent text-brand-primary hover:bg-brand-accent-hover shadow-brand-accent/20"}`}
                    >
                        <Heart size={20} fill={favorite ? "currentColor" : "none"} />
                        {favorite ? "Đã yêu thích" : "Yêu thích"}
                    </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 md:gap-6 pt-8 md:pt-10 border-t border-slate-100">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-primary">
                            <ShieldCheck size={24} />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Bảo hành 12 tháng</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-primary">
                            <Truck size={24} />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Giao hàng tận nơi</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-primary">
                            <RefreshCcw size={24} />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Đổi trả 7 ngày</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs Placeholder */}
      <section className="py-12 md:py-20 bg-slate-50/50">
          <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                  <div className="flex items-center gap-5 md:gap-8 overflow-x-auto border-b border-slate-200 mb-8 md:mb-10 scrollbar-hide">
                      <button className="shrink-0 pb-4 text-xs md:text-sm font-black uppercase tracking-wider md:tracking-widest border-b-2 border-brand-primary text-brand-primary">Thông số kỹ thuật</button>
                      <button className="shrink-0 pb-4 text-xs md:text-sm font-black uppercase tracking-wider md:tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Mô tả sản phẩm</button>
                      <button className="shrink-0 pb-4 text-xs md:text-sm font-black uppercase tracking-wider md:tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Đánh giá (0)</button>
                  </div>
                  
                  <div className="bg-white p-5 md:p-10 rounded-3xl md:rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm">
                          <div className="text-slate-400 font-bold uppercase tracking-wider">Vật liệu:</div>
                          <div className="text-slate-900 font-black">Thép không gỉ 304 / Inox 316</div>
                          
                          <div className="text-slate-400 font-bold uppercase tracking-wider">Tiêu chuẩn:</div>
                          <div className="text-slate-900 font-black">DIN / JIS / ISO 9001</div>
                          
                          <div className="text-slate-400 font-bold uppercase tracking-wider">Xuất xứ:</div>
                          <div className="text-slate-900 font-black">Chính hãng / Hưng Thịnh nhập khẩu</div>
                          
                          <div className="text-slate-400 font-bold uppercase tracking-wider">Độ bền kéo:</div>
                          <div className="text-slate-900 font-black">800 - 1000 N/mm²</div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4">
            <ScrollReveal animation="reveal" className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <div className="inline-flex items-center gap-3 mb-4 text-brand-primary">
                        <div className="w-10 h-px bg-brand-primary"></div>
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Có thể bạn quan tâm</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 uppercase">
                        Sản phẩm <span className="text-gradient">Liên quan</span>
                    </h2>
                </div>
                
                <Link 
                    href="/products" 
                    className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary transition-all"
                >
                    Tất cả sản phẩm
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((p, idx) => (
                    <ScrollReveal key={p.product_id} animation="reveal-scale" delay={idx * 100}>
                        <ProductCard product={p} />
                    </ScrollReveal>
                ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}








