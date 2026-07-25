'use client';

import React from 'react';
import ServiceList from '@/features/portal/services/ServiceList';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ServicesPage() {
  return (
    <main>
      {/* Hero Section - Luxurious "Dark-Bright" Theme */}
      <section className="bg-[#020617] pt-32 md:pt-40 pb-12 md:pb-16 overflow-hidden relative border-b border-white/5">
        {/* Intensified Deep Glow Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-brand-primary/25 rounded-full blur-[180px] animate-pulse"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-brand-accent/15 rounded-full blur-[180px]"></div>
        </div>

        <div className="absolute inset-0 z-0 opacity-[0.05]">
          <div className="grid grid-cols-6 h-full">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="border-r border-white h-full"></div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 font-montserrat">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-5 md:mb-8">
                <span className="h-1 w-12 bg-brand-accent rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)]"></span>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.18em] md:tracking-[0.4em] text-brand-accent drop-shadow-lg">Giải pháp kỹ thuật</span>
                <span className="h-1 w-12 bg-brand-accent rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)]"></span>
            </div>
            <h1 className="text-3xl md:text-6xl font-black font-montserrat text-white tracking-normal mb-6 md:mb-8 leading-tight uppercase drop-shadow-2xl">
              DỊCH VỤ <span className="text-gradient">CHUYÊN NGHIỆP</span>
            </h1>
            <p className="text-slate-300 md:text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
              Đồng hành cùng doanh nghiệp bằng các dịch vụ bảo trì, gia công và hỗ trợ kỹ thuật <span className="text-white font-bold">tiêu chuẩn cao</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-16 md:py-32 bg-white relative z-20">
        <div className="container mx-auto px-4 md:px-12">
            <ServiceList />
        </div>
      </section>

      {/* Quality Standards Section */}
      <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-100">
          <div className="container mx-auto px-4 md:px-12 text-center">
              <ScrollReveal animation="reveal">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-16">
                      Tiêu chuẩn <span className="text-brand-primary">Chất lượng & Cam kết</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                      <div className="space-y-4">
                          <div className="text-brand-primary font-black text-4xl mb-2">01.</div>
                          <h4 className="font-bold text-slate-900 uppercase text-sm tracking-widest">Đội ngũ chuyên gia</h4>
                          <p className="text-slate-500 text-sm leading-relaxed">Kỹ thuật viên giàu kinh nghiệm, am hiểu sâu sắc về hệ thống cơ khí và thủy lực.</p>
                      </div>
                      <div className="space-y-4">
                          <div className="text-brand-primary font-black text-4xl mb-2">02.</div>
                          <h4 className="font-bold text-slate-900 uppercase text-sm tracking-widest">Thiết bị hiện đại</h4>
                          <p className="text-slate-500 text-sm leading-relaxed">Sử dụng máy móc gia công và đo lường tiên tiến nhất để đảm bảo độ chính xác tuyệt đối.</p>
                      </div>
                      <div className="space-y-4">
                          <div className="text-brand-primary font-black text-4xl mb-2">03.</div>
                          <h4 className="font-bold text-slate-900 uppercase text-sm tracking-widest">Phản ứng nhanh</h4>
                          <p className="text-slate-500 text-sm leading-relaxed">Hỗ trợ kỹ thuật 24/7, xử lý sự cố tận nơi để giảm thiểu thời gian dừng máy của khách hàng.</p>
                      </div>
                  </div>
              </ScrollReveal>
          </div>
      </section>
    </main>
  );
}

