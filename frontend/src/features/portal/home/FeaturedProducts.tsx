'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { useFeaturedProducts } from '@/hooks/useFeaturedProducts';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useUIStore } from '@/store/useUIStore';

const FeaturedProducts: React.FC = () => {
    const { products, loading } = useFeaturedProducts();
    const { featuredSliderIndex: currentIndex, setFeaturedSliderIndex: setCurrentIndex } = useUIStore();
    
    const [itemsPerView, setItemsPerView] = useState(4);
    const [isPaused, setIsPaused] = useState(false);
    const [isInteractionPaused, setIsInteractionPaused] = useState(false);
    const interactionTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const updateItemsPerView = () => {
            if (window.innerWidth < 640) setItemsPerView(1);
            else if (window.innerWidth < 1024) setItemsPerView(2);
            else setItemsPerView(4); // Fixed to 4 items as requested
        };

        updateItemsPerView();
        window.addEventListener('resize', updateItemsPerView);
        return () => window.removeEventListener('resize', updateItemsPerView);
    }, []);

    const maxIndex = Math.max(0, products.length - itemsPerView);

    useEffect(() => {
        if (currentIndex > maxIndex && maxIndex >= 0) {
            setCurrentIndex(0);
        }
    }, [maxIndex, currentIndex, setCurrentIndex]);

    const nextSlide = useCallback(() => {
        setCurrentIndex(currentIndex >= maxIndex ? 0 : Math.min(currentIndex + itemsPerView, maxIndex));
    }, [maxIndex, itemsPerView, currentIndex, setCurrentIndex]);

    const prevSlide = useCallback(() => {
        setCurrentIndex(currentIndex <= 0 ? maxIndex : Math.max(currentIndex - itemsPerView, 0));
    }, [maxIndex, itemsPerView, currentIndex, setCurrentIndex]);

    const handleManualInteraction = useCallback(() => {
        setIsInteractionPaused(true);
        if (interactionTimerRef.current) {
            clearTimeout(interactionTimerRef.current);
        }
        interactionTimerRef.current = setTimeout(() => {
            setIsInteractionPaused(false);
        }, 10000);
    }, []);

    const handlePrev = () => {
        prevSlide();
        handleManualInteraction();
    };

    const handleNext = () => {
        nextSlide();
        handleManualInteraction();
    };

    useEffect(() => {
        if (isPaused || isInteractionPaused || loading || products.length <= itemsPerView) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [isPaused, isInteractionPaused, loading, products.length, itemsPerView, nextSlide]);

    const totalPages = Math.ceil(products.length / itemsPerView);
    const currentPage = Math.floor(currentIndex / itemsPerView);

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Minimum distance for a swipe to be registered
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }
    };

    return (
        <section className="relative py-6 md:py-8 bg-[#0f172a] overflow-hidden border-y border-white/5">
            {/* Background Decorative Elements - Luxurious Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-60">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-brand-primary/20 rounded-full blur-[160px]"></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-brand-accent/20 rounded-full blur-[160px]"></div>
            </div>

            <div className="container mx-auto px-4 md:px-12 relative z-10">
                <ScrollReveal animation="reveal" className="text-center mb-4 md:mb-6">
                    <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-brand-accent text-[10px] md:text-xs font-black uppercase tracking-[0.16em] md:tracking-[0.4em] mb-3 shadow-2xl">
                        <Sparkles className="w-4 h-4" />
                        <span>BST SẢN PHẨM ƯU VIỆT</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 tracking-normal md:tracking-tighter text-white uppercase leading-tight md:leading-none">
                        Sản Phẩm <span className="text-gradient">Nổi Bật</span>
                    </h2>
                    
                    <div className="section-divider max-w-lg mx-auto mb-4">
                        <div className="h-1.5 w-16 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full mx-auto shadow-[0_0_20px_rgba(30,64,175,0.5)]"></div>
                    </div>
                    
                    <p className="max-w-2xl mx-auto text-slate-200 md:text-slate-200 text-base md:text-xl font-medium leading-relaxed">
                        Khám phá những thiết bị cơ khí đột phá và vật tư công nghiệp 
                        <span className="text-white font-bold"> tiêu chuẩn quốc tế</span>, được tinh tuyển cho hiệu suất tối đa.
                    </p>
                </ScrollReveal>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white/5 rounded-3xl h-[360px] animate-pulse border border-white/10"></div>
                        ))}
                    </div>
                ) : (
                    <div 
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        className="relative group/slider max-w-7xl mx-auto"
                    >
                        <ScrollReveal 
                            animation="reveal-scale" 
                            delay={200} 
                            className="relative group/slider"
                        >


                            <div className="spotlight-container relative">
                                {/* Subtle inner glow for the container */}
                                <div className="absolute inset-0 bg-brand-primary/5 rounded-[3rem] blur-3xl"></div>
                                
                                <div className="bg-slate-900/40 backdrop-blur-sm rounded-3xl md:rounded-[2.5rem] border border-white/5 overflow-hidden px-2 md:px-4 py-3 md:py-4 relative z-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                                    <div 
                                        className="flex transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] gap-4"
                                        style={{ 
                                            transform: `translateX(calc(-${currentIndex * (100 / itemsPerView)}% - ${currentIndex * (16 / itemsPerView)}px))` 
                                        }}
                                    >
                                        {products.map((product) => (
                                            <div 
                                                key={product.product_id} 
                                                className="flex-shrink-0 transform scale-[0.98] md:scale-95 md:origin-top-left transition-transform duration-500 hover:scale-100"
                                                style={{ 
                                                    width: `calc(${100 / itemsPerView}% - ${(16 * (itemsPerView - 1)) / itemsPerView}px)` 
                                                }}
                                            >
                                                <ProductCard product={product} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div> 
                )}
                
                {!loading && totalPages > 1 && (
                    <div className="flex flex-col justify-center items-center gap-4 mt-4">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handlePrev}
                                className="p-3 md:p-4 rounded-full bg-white/10 backdrop-blur-2xl border border-white/10 text-white hover:bg-brand-primary transition-all active:scale-90"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            
                            <div className="flex gap-3 mx-2 md:mx-4">
                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const targetIndex = Math.min(i * itemsPerView, maxIndex);
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setCurrentIndex(targetIndex);
                                                handleManualInteraction();
                                            }}
                                            className={`h-2 rounded-full transition-all duration-700 ${
                                                currentPage === i 
                                                ? 'w-16 bg-brand-accent shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
                                                : 'w-2 bg-white/20 hover:bg-white/40'
                                            }`}
                                            aria-label={`Go to frame ${i + 1}`}
                                        />
                                    );
                                })}
                            </div>

                            <button 
                                onClick={handleNext}
                                className="p-3 md:p-4 rounded-full bg-white/10 backdrop-blur-2xl border border-white/10 text-white hover:bg-brand-primary transition-all active:scale-90"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <span className="text-xs font-black tracking-widest text-slate-300">
                            {String(currentPage + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedProducts;
