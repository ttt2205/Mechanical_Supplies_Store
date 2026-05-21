'use client';

import React from 'react';
import { useAboutUs } from '@/hooks/useAboutUs';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Link from 'next/link';
import { Loader2, ChevronRight, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function AboutUsPage() {
  const { data, loading } = useAboutUs();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 font-bold">Không tìm thấy nội dung giới thiệu.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-28">
      {/* Banner / Header Section */}
      <div className="relative h-[450px] md:h-[550px] overflow-hidden bg-slate-900">
        <img 
          src={data.thumbnail} 
          alt={data.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
        />
        {/* Multi-layer overlay for maximum readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/90 via-brand-primary/40 to-transparent"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative container mx-auto px-6 lg:px-12 h-full flex flex-col justify-center">
          <ScrollReveal animation="reveal-left" className="max-w-4xl">
            <nav className="flex items-center gap-2 text-brand-accent text-sm mb-8 font-black uppercase tracking-[0.3em]">
              <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
              <ChevronRight size={14} className="opacity-50" />
              <span className="text-white/60">Về chúng tôi</span>
            </nav>
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl">
              {data.title.split(' - ')[0]} <br/>
              <span className="text-brand-accent italic">{data.title.split(' - ')[1]}</span>
            </h1>
            <div className="w-24 h-2 bg-brand-accent mb-8"></div>
            <p className="text-white text-xl md:text-2xl max-w-2xl font-bold leading-relaxed drop-shadow-lg border-l-4 border-brand-accent pl-6">
              {data.excerpt}
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Dynamic Content (Admin Friendly) */}
          <div className="lg:col-span-8">
            <ScrollReveal animation="reveal">
              <div 
                className="rich-content-wrapper prose prose-xl max-w-none 
                  prose-headings:text-brand-primary prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-strong:text-brand-primary prose-strong:font-bold
                  prose-img:rounded-3xl prose-img:shadow-2xl
                  prose-ul:list-disc prose-li:marker:text-brand-accent"
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            </ScrollReveal>
          </div>

          {/* Sidebar / Contact Info */}
          <div className="lg:col-span-4 space-y-12">
            <ScrollReveal animation="reveal-right">
              <div className="bg-slate-50 p-10 rounded-3xl border-2 border-slate-100 shadow-sm sticky top-32">
                <h3 className="text-2xl font-black text-brand-primary uppercase mb-8 tracking-tight">Thông tin liên hệ</h3>
                
                <ul className="space-y-8">
                  <li className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center shrink-0">
                      <MapPin size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Địa chỉ</p>
                      <p className="text-slate-800 font-bold leading-snug">208 Lò Siêu, Phường 12, Quận 11, TP. Hồ Chí Minh</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-accent flex items-center justify-center shrink-0">
                      <Phone size={24} className="text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Hotline</p>
                      <p className="text-brand-primary font-black text-xl">0123.456.789</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0">
                      <Mail size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                      <p className="text-slate-800 font-bold">info@hungthinh.vn</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center shrink-0">
                      <Clock size={24} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Giờ làm việc</p>
                      <p className="text-slate-800 font-bold">Thứ 2 - Thứ 7: 08:00 - 17:30</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-12">
                  <Link 
                    href="/contact"
                    className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-lg active:scale-95"
                  >
                    Gửi yêu cầu báo giá
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </div>
  );
}
