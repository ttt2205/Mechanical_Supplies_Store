'use client';

import React from 'react';
import PartnerList from '@/features/portal/partners/PartnerList';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function PartnersPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-[#0f172a] pt-24 md:pt-40 pb-14 md:pb-24 overflow-hidden relative border-b border-white/5">
        {/* Background Glow */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-brand-primary/20 rounded-full blur-[180px] animate-pulse"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-brand-accent/10 rounded-full blur-[180px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 font-montserrat">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-5 md:mb-8">
                <span className="h-1 w-12 bg-brand-accent rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)]"></span>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.18em] md:tracking-[0.4em] text-brand-accent drop-shadow-lg">Hệ sinh thái chiến lược</span>
                <span className="h-1 w-12 bg-brand-accent rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)]"></span>
            </div>
            <h1 className="text-4xl md:text-8xl font-black font-montserrat text-white tracking-normal mb-6 md:mb-8 leading-tight uppercase drop-shadow-2xl">
              MẠNG LƯỚI <span className="text-gradient">ĐỐI TÁC</span>
            </h1>
            <p className="text-slate-300 md:text-slate-400 text-base md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
              Kết nối và cung cấp giải pháp kỹ thuật thông qua hệ thống đại lý và <span className="text-white font-bold">đối tác chiến lược</span> trên toàn quốc.
            </p>
          </div>
        </div>
      </section>

      {/* Partners List Section */}
      <section className="py-16 md:py-32 bg-white relative z-20">
        <div className="container mx-auto px-4 md:px-12">
            <PartnerList />
        </div>
      </section>

      {/* Cooperation Section */}
      <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-100">
          <div className="container mx-auto px-4 md:px-12 text-center">
              <ScrollReveal animation="reveal">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-16">
                      Giá trị <span className="text-brand-primary">Hợp tác & Đồng hành</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                      <div className="space-y-4">
                          <div className="text-brand-primary font-black text-4xl mb-2">01.</div>
                          <h4 className="font-bold text-slate-900 uppercase text-sm tracking-widest">Tin cậy tuyệt đối</h4>
                          <p className="text-slate-500 text-sm leading-relaxed">Xây dựng mối quan hệ dựa trên sự minh bạch và cam kết chất lượng bền vững.</p>
                      </div>
                      <div className="space-y-4">
                          <div className="text-brand-primary font-black text-4xl mb-2">02.</div>
                          <h4 className="font-bold text-slate-900 uppercase text-sm tracking-widest">Hỗ trợ tối đa</h4>
                          <p className="text-slate-500 text-sm leading-relaxed">Cung cấp tài liệu kỹ thuật, đào tạo và chính sách ưu đãi tốt nhất cho đối tác.</p>
                      </div>
                      <div className="space-y-4">
                          <div className="text-brand-primary font-black text-4xl mb-2">03.</div>
                          <h4 className="font-bold text-slate-900 uppercase text-sm tracking-widest">Phát triển bền vững</h4>
                          <p className="text-slate-500 text-sm leading-relaxed">Cùng nhau mở rộng thị trường và gia tăng giá trị cho khách hàng cuối cùng.</p>
                      </div>
                  </div>
              </ScrollReveal>
          </div>
      </section>
    </main>
  );
}

