'use client';

import React from 'react';
import { 
    Phone, 
    Mail, 
    MapPin, 
    MessageSquare, 
    Clock, 
    Send,
    ChevronRight,
    BadgeCheck,
    Smartphone
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ContactPage() {
  return (
    <main className="bg-white">
      {/* Hero Section - Professional & Trustworthy */}
      <section className="bg-[#0f172a] pt-32 pb-12 md:pt-40 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-brand-primary/20 rounded-full blur-[180px]"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-brand-accent/10 rounded-full blur-[180px]"></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl mx-auto md:ml-0 text-center md:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-accent text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-6 md:mb-8">
              <MessageSquare size={14} />
              <span>Sẵn sàng hỗ trợ 24/7</span>
            </div>
            <h1 className="text-3xl md:text-6xl font-black font-montserrat text-white tracking-normal uppercase mb-6 md:mb-8 leading-tight md:leading-none">
              LIÊN HỆ VỚI <br className="hidden md:block" />
              <span className="text-gradient">HƯNG THỊNH</span>
            </h1>
            <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed">
              Bạn cần tư vấn kỹ thuật hoặc báo giá sản phẩm? Hãy kết nối với chúng tôi qua các kênh trực tiếp dưới đây để được hỗ trợ nhanh nhất.
            </p>
          </div>
        </div>
      </section>

      {/* Direct Action Buttons - High Visibility */}
      <section className="py-12 md:py-20 relative z-20 mt-[-60px] md:mt-[-100px] overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* HOTLINE CARD */}
                <ScrollReveal animation="reveal-scale" delay={0}>
                    <a 
                        href="tel:0123456789"
                        className="group relative flex flex-col items-center text-center p-8 md:p-10 bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border-2 border-transparent hover:border-brand-accent transition-all duration-500 overflow-hidden h-full mx-auto w-full max-w-sm sm:max-w-none"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-bl-full -z-10 transition-transform group-hover:scale-150 duration-700"></div>
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-brand-accent flex items-center justify-center text-white mb-6 md:mb-8 shadow-xl shadow-brand-accent/20 animate-phone-vibrate">
                            <Phone size={32} className="md:w-9 md:h-9" fill="white" />
                        </div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Gọi trực tiếp</h3>
                        <p className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-brand-accent transition-colors">0123.456.789</p>
                        <div className="mt-4 md:mt-6 px-6 py-2 bg-slate-50 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-brand-accent group-hover:text-white transition-all">
                            Bấm để gọi ngay
                        </div>
                    </a>
                </ScrollReveal>

                {/* ZALO CARD */}
                <ScrollReveal animation="reveal-scale" delay={100}>
                    <a 
                        href="https://zalo.me/0123456789"
                        target="_blank"
                        className="group relative flex flex-col items-center text-center p-8 md:p-10 bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border-2 border-transparent hover:border-[#0068ff] transition-all duration-500 overflow-hidden h-full mx-auto w-full max-w-sm sm:max-w-none"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0068ff]/5 rounded-bl-full -z-10 transition-transform group-hover:scale-150 duration-700"></div>
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-[#0068ff] flex items-center justify-center text-white mb-6 md:mb-8 shadow-xl shadow-[#0068ff]/20">
                            <Smartphone size={32} className="md:w-9 md:h-9" />
                        </div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Nhắn tin Zalo</h3>
                        <p className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-[#0068ff] transition-colors uppercase">Zalo Hưng Thịnh</p>
                        <div className="mt-4 md:mt-6 px-6 py-2 bg-slate-50 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-[#0068ff] group-hover:text-white transition-all">
                            Chat trực tiếp
                        </div>
                    </a>
                </ScrollReveal>

                {/* EMAIL CARD */}
                <ScrollReveal animation="reveal-scale" delay={200}>
                    <a 
                        href="mailto:contact@hungthinh-hydraulics.vn"
                        className="group relative flex flex-col items-center text-center p-8 md:p-10 bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border-2 border-transparent hover:border-brand-primary transition-all duration-500 overflow-hidden h-full mx-auto w-full max-w-sm sm:max-w-none"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-full -z-10 transition-transform group-hover:scale-150 duration-700"></div>
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-brand-primary flex items-center justify-center text-white mb-6 md:mb-8 shadow-xl shadow-brand-primary/20">
                            <Mail size={32} className="md:w-9 md:h-9" />
                        </div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Gửi Email</h3>
                        <p className="text-xs md:text-sm font-black text-slate-900 group-hover:text-brand-primary transition-colors break-all">contact@hungthinh.vn</p>
                        <div className="mt-4 md:mt-6 px-6 py-2 bg-slate-50 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-all">
                            Phản hồi nhanh
                        </div>
                    </a>
                </ScrollReveal>

                {/* ADDRESS CARD */}
                <ScrollReveal animation="reveal-scale" delay={300}>
                    <div className="group relative flex flex-col items-center text-center p-8 md:p-10 bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border-2 border-transparent hover:border-slate-900 transition-all duration-500 overflow-hidden h-full mx-auto w-full max-w-sm sm:max-w-none">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/5 rounded-bl-full -z-10 transition-transform group-hover:scale-150 duration-700"></div>
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-slate-900 flex items-center justify-center text-white mb-6 md:mb-8 shadow-xl shadow-slate-900/20">
                            <MapPin size={32} className="md:w-9 md:h-9" />
                        </div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Văn phòng</h3>
                        <p className="text-xs md:text-sm font-bold text-slate-900 leading-tight">208 Lò Siêu, P. 12, Q. 11, TP. HCM</p>
                        <div className="mt-4 md:mt-6 px-6 py-2 bg-slate-50 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                            Chỉ đường
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
      </section>

      {/* Main Content: Form & Process */}
      <section className="py-12 md:py-24 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                {/* Left: Contact Form */}
                <div className="lg:col-span-7">
                    <ScrollReveal animation="reveal-left">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">
                            Gửi yêu cầu <span className="text-gradient">Tư vấn</span>
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base font-medium mb-8 md:mb-12">Hãy để lại thông tin, đội ngũ kỹ thuật của chúng tôi sẽ liên hệ lại với bạn trong vòng 30 phút.</p>
                        
                        <form className="space-y-4 md:space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Họ và tên</label>
                                    <input 
                                        type="text" 
                                        placeholder="Nguyễn Văn A"
                                        className="w-full px-6 md:px-8 py-4 md:py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-slate-900" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Số điện thoại</label>
                                    <input 
                                        type="tel" 
                                        placeholder="0123.456.789"
                                        className="w-full px-6 md:px-8 py-4 md:py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-slate-900" 
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Dịch vụ quan tâm</label>
                                <div className="relative">
                                    <select className="w-full px-6 md:px-8 py-4 md:py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-slate-900 appearance-none">
                                        <option>Tư vấn mua máy bấm ống</option>
                                        <option>Bảo trì hệ thống thủy lực</option>
                                        <option>Gia công ống thành phẩm</option>
                                        <option>Khác</option>
                                    </select>
                                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Nội dung tin nhắn</label>
                                <textarea 
                                    rows={5}
                                    placeholder="Mô tả chi tiết nhu cầu của bạn..."
                                    className="w-full px-6 md:px-8 py-4 md:py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-slate-900 resize-none"
                                ></textarea>
                            </div>

                            <button className="w-full py-4 md:py-5 bg-brand-primary hover:bg-slate-900 text-white rounded-2xl text-xs md:text-sm font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-4 group">
                                Gửi yêu cầu ngay
                                <Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </form>
                    </ScrollReveal>
                </div>

                {/* Right: Work Flow & Support Info */}
                <div className="lg:col-span-5 space-y-8 md:space-y-12 mt-12 lg:mt-0">
                    <ScrollReveal animation="reveal-right" className="space-y-8 md:space-y-12">
                        {/* Working Hours */}
                        <div className="p-8 md:p-10 bg-slate-900 rounded-[32px] md:rounded-[40px] text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-brand-accent flex items-center justify-center mb-6 md:mb-8">
                                    <Clock size={24} className="text-white" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4 md:mb-6">Giờ làm việc</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <span className="text-slate-400 font-bold uppercase text-[10px] md:text-xs tracking-widest">Thứ 2 - Thứ 7</span>
                                        <span className="font-black text-sm md:text-base">08:00 - 17:30</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <span className="text-slate-400 font-bold uppercase text-[10px] md:text-xs tracking-widest">Chủ nhật</span>
                                        <span className="text-brand-accent font-black text-sm md:text-base">Hỗ trợ hotline</span>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-slate-500 pt-2 leading-relaxed font-medium italic">
                                        * Đối với các sự cố kỹ thuật khẩn cấp, vui lòng gọi trực tiếp vào hotline để được hỗ trợ ngoài giờ hành chính.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Why Contact Us Flow */}
                        <div className="space-y-6 md:space-y-8">
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Quy trình hỗ trợ</h3>
                            <div className="space-y-4 md:space-y-6">
                                {[
                                    { step: "01", title: "Tiếp nhận thông tin", desc: "Xác nhận nhu cầu và tình trạng kỹ thuật hiện tại của khách hàng." },
                                    { step: "02", title: "Tư vấn chuyên sâu", desc: "Kỹ thuật viên đưa ra giải pháp và thiết bị tối ưu nhất." },
                                    { step: "03", title: "Báo giá & Thực hiện", desc: "Cung cấp báo giá minh bạch và triển khai dịch vụ nhanh chóng." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 md:gap-6 group">
                                        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-primary font-black group-hover:bg-brand-primary group-hover:text-white transition-all text-sm md:text-base">
                                            {item.step}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-black text-slate-900 uppercase tracking-wide text-xs md:text-sm">{item.title}</h4>
                                            <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 md:p-8 bg-brand-primary/5 rounded-3xl border border-brand-primary/10 flex items-center gap-4 md:gap-6">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand-primary flex items-center justify-center text-white flex-shrink-0">
                                <BadgeCheck size={24} className="md:w-7 md:h-7" />
                            </div>
                            <div>
                                <h4 className="font-black text-brand-primary uppercase text-[10px] md:text-xs tracking-widest mb-1">Cam kết 100%</h4>
                                <p className="text-xs md:text-sm text-slate-600 font-bold">Mọi yêu cầu đều được xử lý bởi chuyên gia kỹ thuật có trên 10 năm kinh nghiệm.</p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="h-[400px] md:h-[500px] bg-slate-100 relative grayscale hover:grayscale-0 transition-all duration-1000">
          <div className="absolute inset-0 flex items-center justify-center px-6">
              <div className="text-center space-y-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                      <MapPin size={24} className="text-brand-primary md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-widest">Bản đồ vị trí</h3>
                  <p className="text-sm md:text-base text-slate-50 font-bold [text-shadow:_0_1px_2px_rgba(0,0,0,0.8)] md:text-slate-500 md:[text-shadow:none]">208 Lò Siêu, Phường 12, Quận 11, TP. Hồ Chí Minh</p>
                  <button className="mt-4 md:mt-6 px-6 md:px-8 py-3 bg-brand-primary text-white rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest shadow-lg">
                      Xem trên Google Maps
                  </button>
              </div>
          </div>
          {/* Overlay to simulate depth */}
          <div className="absolute inset-0 bg-slate-900/20 md:bg-slate-900/5 pointer-events-none"></div>
      </section>
    </main>
  );
}

