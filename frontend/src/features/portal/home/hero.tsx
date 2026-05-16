"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Phone, FileText, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: "01",
    title: "MÁY VÀ THIẾT BỊ",
    subtitle: "GIẢI PHÁP THỦY LỰC",
    description: "Chuyên cung cấp máy bấm ống thủy lực P32 và các dòng máy công nghiệp hiệu suất cao. Sẵn hàng tại kho, hỗ trợ kỹ thuật tận tâm.",
    image: "/heros/hero_1_img.jpg",
    label: "Máy Bấm Ống P32",
    badge: "THIẾT BỊ CHỦ LỰC"
  },
  {
    id: "02",
    title: "MÁY VÀ THIẾT BỊ",
    subtitle: "BƠM VÀ PHỤ KIỆN",
    description: "Cung cấp đa dạng các loại bơm thủy lực, đầu nối và linh kiện áp suất cao chính hãng. Đảm bảo độ bền và an toàn tuyệt đối cho hệ thống.",
    image: "/heros/hero_2_img.jpg",
    label: "Bơm Thủy Lực",
    badge: "DÒNG CAO CẤP"
  }
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextIndex = (activeIndex + 1) % slides.length;

  const handleSwitch = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating]);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(handleSwitch, 10000);
    return () => clearInterval(timer);
  }, [handleSwitch]);

  return (
    <section className="relative w-full min-h-screen lg:h-[800px] flex items-center overflow-hidden bg-white pt-24">
      {/* BACKGROUND DECORATION - SUBTLE GRID */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(#1e40af 1px, transparent 1px), linear-gradient(90deg, #1e40af 1px, transparent 1px)', 
          backgroundSize: '100px 100px' 
        }}></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-4 items-center">
          
          {/* LEFT CONTENT SIDE (6 COLS) */}
          <div className="lg:col-span-6 space-y-10 text-center lg:text-left">
            <div className={`space-y-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              
              {/* HOTLINE BADGE - FLAT DESIGN */}
              <div className="inline-flex items-center rounded-sm overflow-hidden shadow-sm border border-brand-primary/10">
                <div className="bg-brand-accent-alt px-4 py-1.5 flex items-center gap-2">
                  <Phone size={14} className="text-white fill-white" />
                  <span className="text-white font-bold text-xs tracking-tight">HOTLINE:</span>
                </div>
                <div className="bg-white px-4 py-1.5 border-l border-brand-primary/10">
                  <span className="text-brand-primary font-black text-sm tracking-widest">0123.456.789</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center lg:justify-start gap-4">
                    <span className="text-brand-accent-alt font-black text-sm tracking-widest">{slides[activeIndex].id}</span>
                    <div className="h-[1px] w-12 bg-slate-200"></div>
                    <span className="text-slate-400 font-bold text-[10px] tracking-[0.3em] uppercase">{slides[activeIndex].subtitle}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-primary leading-tight tracking-tight uppercase transition-all duration-700">
                  CÔNG TY TNHH <br />
                  <span className="text-brand-accent-alt">{slides[activeIndex].title}</span> <br />
                  HƯNG THỊNH
                </h1>
                <div className="h-1.5 w-24 bg-brand-accent mx-auto lg:mx-0"></div>
              </div>

              <p className="text-slate-500 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal min-h-[3em]">
                {slides[activeIndex].description}
              </p>
            </div>

            {/* CTA SECTION */}
            <div className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <button className="w-full sm:w-auto px-8 py-3.5 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-md font-bold uppercase tracking-widest text-sm transition-all active:scale-95 flex items-center justify-center gap-2">
                <FileText size={18} />
                XEM CATALOGUE
              </button>
              
              <button className="w-full sm:w-auto px-8 py-4 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-md font-bold uppercase tracking-widest text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                LIÊN HỆ NGAY
                <ArrowRight size={18} />
              </button>
            </div>

            {/* NAV CONTROLS */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4">
                <button 
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-primary hover:border-brand-primary transition-all"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2">
                    {slides.map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1 transition-all duration-500 rounded-full ${i === activeIndex ? 'w-8 bg-brand-accent-alt' : 'w-2 bg-slate-200'}`}
                        />
                    ))}
                </div>
                <button 
                  onClick={handleSwitch}
                  className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-primary hover:border-brand-primary transition-all"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
          </div>

          {/* RIGHT VISUAL SIDE - FLOATING OVERLAPPING PRODUCTS */}
          <div className="lg:col-span-6 relative h-[400px] sm:h-[500px] lg:h-full mt-8 md:mt-16 lg:mt-0">
            <div className="relative w-full h-full flex items-center justify-center pt-8 md:pt-12 lg:pt-0">
              
              {/* SHADOW BASE FOR DEPTH */}
              <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-2/3 h-10 bg-slate-900/5 blur-[40px] rounded-full -z-10"></div>

              {/* BACKGROUND PRODUCT (SECONDARY) - CLICKABLE TO SWAP */}
              <div 
                className={`absolute top-4 md:top-8 right-0 w-[55%] md:w-[60%] aspect-square transition-all duration-[1000ms] ease-out z-10 cursor-pointer group/bg ${
                  isAnimating ? 'opacity-0 scale-95 translate-x-10' : 'opacity-60 translate-x-0 translate-y-0 scale-100 rotate-6 hover:opacity-100 hover:scale-105'
                }`}
                onClick={handleSwitch}
              >
                <div className="relative w-full h-full">
                  <img 
                    src={slides[nextIndex].image} 
                    alt="Next product" 
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                  {/* DATA TAG */}
                  <div className="absolute top-1/4 -left-4 bg-brand-primary text-white text-[9px] font-bold px-2 py-1 rounded-sm shadow-lg tracking-widest uppercase opacity-0 group-hover/bg:opacity-100 transition-opacity">
                    Xem {slides[nextIndex].label}
                  </div>
                </div>
              </div>

              {/* FOREGROUND PRODUCT (PRIMARY) */}
              <div className={`relative z-20 w-[80%] md:w-[85%] aspect-square transition-all duration-[1000ms] ease-out ${
                isAnimating ? 'opacity-0 scale-110 -translate-x-10' : 'opacity-100 translate-x-0 translate-y-0 scale-100'
              }`}>
                <div className="relative w-full h-full">
                  <img 
                    src={slides[activeIndex].image} 
                    alt={slides[activeIndex].label} 
                    className="relative z-10 w-full h-full object-contain drop-shadow-[0_50px_50px_rgba(0,0,0,0.15)]"
                  />
                  
                  {/* PRODUCT INFO BADGE */}
                  <div className={`absolute bottom-6 md:bottom-10 -right-4 z-30 bg-white border border-slate-100 shadow-2xl p-3 md:p-4 min-w-[150px] md:min-w-[180px] rounded-lg transition-all duration-700 ${
                    isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                  }`}>
                    <p className="text-[9px] md:text-[10px] font-bold text-brand-accent-alt uppercase tracking-[0.2em] mb-1">{slides[activeIndex].badge}</p>
                    <p className="text-sm md:text-base font-black text-brand-primary uppercase">{slides[activeIndex].label}</p>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500"></div>
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">Sẵn hàng tại kho</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DECORATIVE ELEMENTS */}
              <div className="absolute top-1/2 left-0 w-32 h-32 border border-slate-100 rounded-full -z-10 animate-pulse"></div>
              <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-brand-accent rotate-45 opacity-20"></div>
              <div className="absolute bottom-1/4 right-1/4 w-8 h-8 border-2 border-brand-accent-alt opacity-10 rounded-full"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
