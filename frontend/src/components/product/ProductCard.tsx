"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { Heart, Star, ShoppingCart, Package } from 'lucide-react';
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
    const [imageError, setImageError] = useState(false);

    const productCode = product.product_code || product.productCode || "";
    const productUrl = `/product/${(product.slug || productCode || "").toLowerCase()}`;
    const favorite = isAuthenticated && isFavorite(product.product_id ?? product.id ?? 0);

    const isContactPrice = Boolean(product.is_contact_price ?? product.isContactPrice);
    const basePrice = Number(product.base_price ?? product.basePrice ?? 0);
    const salePrice = (product.sale_price ?? product.salePrice) != null ? Number(product.sale_price ?? product.salePrice) : null;
    const isFeatured = Boolean(product.is_featured ?? product.isFeatured);

    // Has discount if salePrice > 0 and salePrice < basePrice and not contact price
    const hasDiscount = !isContactPrice && salePrice !== null && salePrice > 0 && salePrice < basePrice;
    const discountPercent = hasDiscount ? Math.round(((basePrice - salePrice!) / basePrice) * 100) : 0;

    // Check if new (created within 30 days)
    const isNew = Boolean(
        product.created_at &&
        Date.now() - new Date(product.created_at).getTime() < 30 * 24 * 60 * 60 * 1000
    );

    // MAX 1 badge per card: GIẢM GIÁ > BEST SELLER > MỚI
    let badge = null;
    if (hasDiscount) {
        badge = (
            <div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                -{discountPercent}%
            </div>
        );
    } else if (isFeatured) {
        badge = (
            <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 uppercase tracking-wider">
                <Star size={10} fill="currentColor" />
                Best Seller
            </div>
        );
    } else if (isNew) {
        badge = (
            <div className="bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                Mới
            </div>
        );
    }

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            router.push(`/login?redirect=${encodeURIComponent(productUrl)}`);
            return;
        }

        const id = product.product_id ?? product.id ?? 0;
        if (favorite) removeFavorite(id);
        else addFavorite(product);
    };

    const isLandscapePlaceholder = !product.thumbnail || product.thumbnail.includes("photo-1518709268805-4e9042af9f23");
    const showPlaceholder = isLandscapePlaceholder || imageError;

    return (
        <div className={`group relative bg-white rounded-[12px] border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full ${isLarge ? 'md:flex-row' : ''}`}>
            {/* Click overlay for entire card */}
            <Link 
                href={productUrl}
                className="absolute inset-0 z-10"
                aria-label={`Xem chi tiết ${product.name}`}
            />

            {/* Badge (Top Left) - Max 1 badge */}
            {badge && (
                <div className="absolute top-3 left-3 z-20 pointer-events-none">
                    {badge}
                </div>
            )}

            {/* Wishlist Button (Top Right) */}
            <button 
                type="button"
                onClick={toggleFavorite}
                className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center border border-slate-200/80 bg-white/90 backdrop-blur-md transition-all duration-200 shadow-sm hover:scale-105 ${favorite ? 'text-rose-500 border-rose-200 bg-rose-50/90' : 'text-slate-400 hover:text-rose-500 hover:border-slate-300'}`}
                aria-label={favorite ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
            >
                <Heart size={15} fill={favorite ? "currentColor" : "none"} strokeWidth={favorite ? 0 : 2} />
            </button>

            {/* Product Image Container */}
            <div className={`relative overflow-hidden bg-slate-50 ${isLarge ? 'md:w-1/2 aspect-square md:aspect-auto' : 'aspect-square'}`}>
                {showPlaceholder ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100/80 text-slate-400 p-4 select-none">
                        <Package size={36} strokeWidth={1.5} className="text-slate-400 mb-1.5" />
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">Vật tư cơ khí</span>
                    </div>
                ) : (
                    <Image 
                        src={product.thumbnail} 
                        alt={product.name}
                        fill
                        sizes={isLarge ? "800px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImageError(true)}
                    />
                )}
            </div>

            {/* Product Info */}
            <div className={`p-4 flex flex-col flex-1 min-w-0 ${isLarge ? 'md:w-1/2 md:p-6 justify-center' : ''}`}>
                <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate">
                        {productCode}
                    </span>
                    {(product.brand || product.origin) && (
                        <span className="text-[10px] font-medium text-slate-500 truncate max-w-[120px]">
                            {product.brand || product.origin}
                        </span>
                    )}
                </div>

                <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-2 group-hover:text-brand-primary transition-colors line-clamp-2">
                    {product.name}
                </h3>

                {/* Price Display */}
                <div className="mt-auto pt-2 border-t border-slate-100 flex flex-col gap-0.5">
                    {isContactPrice ? (
                        <div className="text-sm font-bold text-brand-primary">
                            Liên hệ báo giá
                        </div>
                    ) : hasDiscount ? (
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-base font-bold text-brand-primary">
                                {new Intl.NumberFormat('vi-VN').format(salePrice!)}₫
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                                {new Intl.NumberFormat('vi-VN').format(basePrice)}₫
                            </span>
                        </div>
                    ) : (
                        <div className="text-base font-bold text-brand-primary">
                            {new Intl.NumberFormat('vi-VN').format(basePrice)}₫
                        </div>
                    )}

                    {/* Bottom Action Button: Full width at bottom */}
                    <Link 
                        href={productUrl}
                        className="relative z-20 mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-brand-primary transition-colors shadow-sm"
                        aria-label={`Xem chi tiết ${product.name}`}
                    >
                        <ShoppingCart size={14} />
                        <span>{isContactPrice ? "Liên hệ báo giá" : "Thêm vào giỏ hàng"}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
