import React from "react";
import Link from "next/link";
import NewsList from "@/features/portal/news/NewsList";

export const metadata = {
  title: "Tin tức & Sự kiện | Hưng Thịnh Mechanical Supplies",
  description: "Cập nhật các tin tức mới nhất về ngành cơ khí, thủy lực và các sự kiện tại Hưng Thịnh.",
};

export default function NewsPage() {
  return (
    <main>
      {/* Hero Section for News Page - Luxurious "Dark-Bright" Theme */}
      <section className="bg-[#020617] pt-24 md:pt-40 pb-14 md:pb-20 overflow-hidden relative border-b border-white/5">
        {/* Intensified Deep Glow Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-brand-primary/25 rounded-full blur-[180px] animate-pulse"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-brand-accent/15 rounded-full blur-[180px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center font-montserrat">
          <div className="flex items-center justify-center gap-3 mb-5 md:mb-6">
              <span className="h-1 w-8 bg-brand-accent rounded-full shadow-[0_0_15px_rgba(245,158,11,0.6)]"></span>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.18em] md:tracking-[0.3em] text-brand-accent drop-shadow-lg">Trung tâm thông tin</span>
              <span className="h-1 w-8 bg-brand-accent rounded-full shadow-[0_0_15px_rgba(245,158,11,0.6)]"></span>
          </div>
          <h1 className="text-4xl md:text-8xl font-black font-montserrat text-white tracking-normal mb-6 md:mb-8 leading-tight uppercase drop-shadow-2xl">
            TIN TỨC <span className="text-gradient">&</span> SỰ KIỆN
          </h1>
          <nav className="flex justify-center items-center gap-3 text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
            <Link href="/" className="hover:text-brand-accent transition-colors">Trang chủ</Link>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <span className="text-white">Tin tức</span>
          </nav>
        </div>
      </section>

      <NewsList />
    </main>
  );
}

