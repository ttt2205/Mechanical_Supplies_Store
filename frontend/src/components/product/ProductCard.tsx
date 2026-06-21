"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { Heart, Eye, ArrowRight, Star, MapPin } from 'lucide-react';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useAuthStore } from '@/store/useAuthStore';

interface ProductCardProps {
    product: Product;
    isLarge?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isLarge = false }) => {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
    const productUrl = `/product/${product.product_code.toLowerCase()}`;
    const favorite = isAuthenticated && isFavorite(product.product_id);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            router.push(`/login?redirect=${encodeURIComponent(productUrl)}`);
            return;
        }

        if (favorite) removeFavorite(product.product_id);
        else addFavorite(product);
    };

    return (
        <div className={`group relative bg-white rounded-2xl md:rounded-[20px] border border-slate-100 shadow-sm hover:shadow-xl md:hover:shadow-2xl md:hover:-translate-y-2 transition-all duration-300 md:duration-500 overflow-hidden flex flex-col h-full ${isLarge ? 'md:flex-row' : ''}`}>
            <Link 
                href={productUrl}
                className="absolute inset-0 z-10"
                aria-label={`Xem chi tiết ${product.name}`}
            />

            {product.is_featured && (
                <div className="absolute top-4 left-4 z-20">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.1em] shadow-lg shadow-amber-500/30 flex items-center gap-1.5 animate-pulse">
                        <Star size={10} fill="currentColor" />
                        Best Seller
                    </div>
                </div>
            )}

            <button 
                type="button"
                onClick={toggleFavorite}
                className={`absolute top-3 right-3 md:top-4 md:right-4 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${favorite ? 'bg-red-50 text-red-500 shadow-red-200' : 'bg-white/90 backdrop-blur-md text-slate-400 hover:text-red-500 shadow-xl'} shadow-lg`}
                aria-label={favorite ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
            >
                <Heart size={18} fill={favorite ? "currentColor" : "none"} strokeWidth={favorite ? 0 : 2} />
            </button>

            <div className={`relative overflow-hidden bg-slate-50 ${isLarge ? 'md:w-1/2 aspect-square md:aspect-auto' : 'aspect-square'}`}>
                <Image 
                    src={product.thumbnail} 
                    alt={product.name}
                    fill
                    sizes={isLarge ? "800px" : "400px"}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            <div className={`p-4 md:p-6 flex flex-col flex-1 min-w-0 ${isLarge ? 'md:w-1/2 justify-center' : ''}`}>
                <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] md:tracking-[0.2em] text-brand-primary/60 truncate">
                        {product.product_code}
                    </span>
                    <div className="flex shrink-0 items-center gap-2 md:gap-3 text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Eye size={12} />
                            <span className="text-[10px] font-bold">{product.view_count || 0}</span>
                        </div>
                    </div>
                </div>

                <h3 className={`font-bold text-slate-900 leading-snug mb-2 group-hover:text-brand-primary transition-colors line-clamp-2 ${isLarge ? 'text-3xl md:text-4xl' : 'text-lg md:text-xl'}`}>
                    {product.name}
                </h3>

                {(product.brand || product.origin) && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                        {product.brand && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                <Star size={10} className="text-amber-500" />
                                {product.brand}
                            </div>
                        )}
                        {product.origin && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                <MapPin size={10} className="text-blue-500" />
                                {product.origin}
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-auto flex items-end justify-between gap-3 md:gap-4 pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-wider md:tracking-widest text-slate-400 mb-1">Giá từ</span>
                        <div className="text-base md:text-lg font-black text-brand-primary leading-tight">
                            {product.is_contact_price ? (
                                "Liên hệ ngay"
                            ) : (
                                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.base_price)
                            )}
                        </div>
                    </div>

                    <Link 
                        href={productUrl}
                        className={`group/btn relative z-20 flex shrink-0 items-center gap-2 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] transition-all hover:bg-brand-primary hover:shadow-xl hover:shadow-brand-primary/20 ${isLarge ? 'px-8 md:px-10 py-4 md:py-5 rounded-2xl' : 'w-12 h-12 rounded-xl justify-center'}`}
                        aria-label={`Xem sản phẩm ${product.name}`}
                    >
                        {isLarge && <span>Xem sản phẩm</span>}
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
