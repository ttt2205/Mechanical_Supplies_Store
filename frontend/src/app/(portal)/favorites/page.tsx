'use client';

import React from 'react';
import { Heart, ShoppingBag, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function FavoritesPage() {
  const { favorites, clearFavorites, removeFavorite, addFavorite } = useFavoritesStore();

  // Mock data initialization for testing
  React.useEffect(() => {
    if (favorites.length === 0) {
      const mockItems = [
        {
          product_id: 1,
          category_id: 101,
          product_code: "MS-BOLT-S304",
          name: "Bu lông lục giác inox 304 - M8x50mm",
          is_featured: true,
          is_contact_price: false,
          base_price: 15000,
          status: "active",
          thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
        },
        {
          product_id: 4,
          category_id: 103,
          product_code: "MS-WELD-E6013",
          name: "Que hàn điện Kim Tín KT-421 (E6013) - 3.2mm",
          is_featured: true,
          is_contact_price: false,
          base_price: 320000,
          status: "active",
          thumbnail: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
        },
        {
          product_id: 5,
          category_id: 104,
          product_code: "MS-BEAR-6205",
          name: "Vòng bi SKF 6205-2Z chính hãng",
          is_featured: true,
          is_contact_price: false,
          base_price: 125000,
          status: "active",
          thumbnail: "https://images.unsplash.com/photo-1590959651373-a3db0f38a961?q=80&w=800&auto=format&fit=crop",
        }
      ];
      mockItems.forEach(item => addFavorite(item as any));
    }
  }, [favorites.length, addFavorite]);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <ScrollReveal animation="reveal-left">
            <nav className="flex items-center gap-2 text-slate-500 text-sm mb-4">
              <Link href="/" className="hover:text-brand-primary transition-colors">Trang chủ</Link>
              <span>/</span>
              <span className="text-brand-primary font-bold">Danh sách yêu thích</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-black text-brand-primary uppercase tracking-tight flex items-center gap-4">
              Sản phẩm yêu thích
              <span className="bg-brand-accent text-brand-primary text-xl px-4 py-1 rounded-full">
                {favorites.length}
              </span>
            </h1>
          </ScrollReveal>

          {favorites.length > 0 && (
            <ScrollReveal animation="reveal-right">
              <button 
                onClick={clearFavorites}
                className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors font-bold uppercase text-xs tracking-widest border-b border-transparent hover:border-red-500 pb-1"
              >
                <Trash2 size={16} />
                Xóa tất cả
              </button>
            </ScrollReveal>
          )}
        </div>

        {favorites.length === 0 ? (
          /* Empty State */
          <ScrollReveal animation="reveal-scale" className="bg-white rounded-3xl p-20 text-center shadow-xl border-2 border-slate-100 max-w-2xl mx-auto mt-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart size={48} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Danh sách trống</h2>
            <p className="text-slate-500 mb-10 leading-relaxed">
              Bạn chưa có sản phẩm nào trong danh sách yêu thích. Hãy khám phá kho hàng của chúng tôi và nhấn vào biểu tượng trái tim để lưu lại nhé!
            </p>
            <Link 
              href="/products"
              className="inline-flex items-center gap-3 bg-brand-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <ShoppingBag size={20} />
              Tiếp tục mua sắm
            </Link>
          </ScrollReveal>
        ) : (
          /* List Format */
          <div className="flex flex-col gap-6">
            {favorites.map((product, index) => (
              <ScrollReveal 
                key={product.product_id} 
                animation="reveal-left" 
                delay={index * 100}
                className="bg-white rounded-3xl overflow-hidden border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-primary/10 transition-all duration-500 group"
              >
                <div className="flex flex-col md:flex-row items-center p-6 gap-8">
                  {/* Image Section */}
                  <div className="w-full md:w-48 h-48 bg-slate-50 rounded-2xl overflow-hidden shrink-0 relative">
                    <img 
                      src={product.thumbnail || '/placeholder-product.jpg'} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {product.is_featured && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-brand-accent text-brand-primary text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                          Nổi bật
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="flex-grow space-y-3 text-center md:text-left">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">
                      {product.product_code}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      {product.is_contact_price ? (
                        <span className="text-xl font-black text-brand-accent-alt">Liên hệ</span>
                      ) : (
                        <span className="text-2xl font-black text-brand-primary">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.base_price)}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                        Còn hàng
                      </span>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
                    <Link 
                      href={`/product/${product.product_id}`}
                      className="inline-flex items-center justify-center gap-3 bg-brand-primary text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-blue-800 transition-all shadow-md active:scale-95"
                    >
                      Chi tiết
                    </Link>
                    <button 
                      onClick={() => removeFavorite(product.product_id)}
                      className="inline-flex items-center justify-center gap-3 border-2 border-slate-100 text-slate-400 px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:border-red-100 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
                    >
                      <Trash2 size={16} />
                      Xóa
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}

            {/* "Add More" List Item */}
            <ScrollReveal animation="reveal-left" delay={favorites.length * 100}>
              <Link 
                href="/products"
                className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-3xl hover:border-brand-accent hover:bg-brand-accent/5 transition-all group"
              >
                <Plus size={20} className="text-slate-400 group-hover:text-brand-primary mr-3" />
                <p className="font-bold text-slate-400 group-hover:text-brand-primary uppercase tracking-widest text-xs">
                  Thêm sản phẩm khác vào danh sách
                </p>
              </Link>
            </ScrollReveal>
          </div>
        )}
      </div>
    </div>
  );
}
