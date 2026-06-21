'use client';

import React from 'react';
import { 
  ChevronUp, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle
} from 'lucide-react';
import { FacebookIcon, YoutubeIcon, InstagramIcon, TwitterIcon } from '@/components/ui/icons';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white pt-12 md:pt-20 pb-24 md:pb-0 relative overflow-hidden">
      {/* Top Tier: 4 Columns */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 pb-10 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {/* Column 1: About */}
          <div className="space-y-6">
            <h3 className="text-lg md:text-xl font-bold uppercase tracking-wide md:tracking-wider text-brand-accent leading-tight">CÔNG TY TNHH MÁY VÀ THIẾT BỊ HƯNG THỊNH</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Chuyên cung cấp các giải pháp máy móc công nghiệp, ống thủy lực và phụ kiện chất lượng cao. Chúng tôi cam kết mang lại giá trị bền vững cho doanh nghiệp của bạn qua từng sản phẩm.
            </p>
            <div className="pt-4">
              <button className="px-6 py-2 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-black transition-all duration-300 font-bold text-xs uppercase tracking-widest">
                Xem thêm
              </button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-accent shrink-0"></div>
              <h3 className="text-lg font-bold uppercase tracking-widest">Liên kết nhanh</h3>
            </div>
            <ul className="space-y-3">
              {['Trang chủ', 'Về chúng tôi', 'Sản phẩm', 'Dịch vụ', 'Tin tức', 'Liên hệ'].map((item) => (
                <li key={item}>
                  <a href="#" className="min-h-8 text-slate-400 hover:text-brand-accent transition-colors text-sm flex items-center gap-2">
                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-accent shrink-0"></div>
              <h3 className="text-lg font-bold uppercase tracking-widest">Danh mục</h3>
            </div>
            <ul className="space-y-3">
              {['Ống thủy lực', 'Máy bấm ống', 'Đầu nối & Phụ kiện', 'Thiết bị truyền động', 'Dụng cụ cầm tay'].map((item) => (
                <li key={item}>
                  <a href="#" className="min-h-8 text-slate-400 hover:text-brand-accent transition-colors text-sm flex items-center gap-2">
                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-accent shrink-0"></div>
              <h3 className="text-lg font-bold uppercase tracking-widest">Liên hệ</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-brand-accent shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-slate-400 text-sm leading-relaxed">208 Lò Siêu, Phường 12, Quận 11, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-brand-accent shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-slate-400 text-sm">0123.456.789</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-brand-accent shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-slate-400 text-sm">info@hungthinh.vn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Separator with Overlapping Icon */}
      <div className="relative border-t border-slate-800">
        <div className="absolute -top-8 left-6 lg:left-12 z-10">
          <div className="bg-brand-accent p-4 rounded-xl shadow-[0_10px_30px_rgba(250,204,21,0.3)] rotate-3 hover:rotate-0 transition-all duration-300 cursor-pointer group">
            <FacebookIcon size={32} className="text-black fill-black group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {/* Bottom Tier */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Social Cluster */}
          <div className="flex items-center gap-8 lg:pl-28">
            <YoutubeIcon className="text-slate-500 hover:text-white cursor-pointer transition-all hover:-translate-y-1" />
            <InstagramIcon className="text-slate-500 hover:text-white cursor-pointer transition-all hover:-translate-y-1" />
            <TwitterIcon className="text-slate-500 hover:text-white cursor-pointer transition-all hover:-translate-y-1" />
            <MessageCircle className="w-6 h-6 text-slate-500 hover:text-white cursor-pointer transition-all hover:-translate-y-1" />
          </div>

          {/* Nav Menu */}
          <nav className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map((item) => (
              <a key={item} href="#" className="text-[10px] uppercase font-black tracking-widest text-slate-600 hover:text-brand-accent transition-colors">{item}</a>
            ))}
          </nav>

          {/* Back to Top & Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button 
              onClick={scrollToTop}
              className="w-12 h-12 bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-brand-accent transition-all duration-300 group shadow-lg"
              aria-label="Back to top"
            >
              <ChevronUp className="w-6 h-6 group-hover:text-black group-hover:-translate-y-1 transition-transform" />
            </button>
            
            {/* Beveled Copyright Block */}
            <div 
              className="bg-brand-primary px-6 md:px-10 py-4 relative shadow-2xl sm:[clip-path:polygon(20px_0,100%_0,100%_100%,0_100%)]"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-normal sm:whitespace-nowrap text-center sm:text-left">
                © 2026 HƯNG THỊNH MACHINERY. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
