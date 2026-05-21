"use client";

import React from "react";
import {
  ShieldCheck,
  Truck,
  BadgeDollarSign,
  Headphones,
  Star,
  Settings,
  Handshake,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const reasons = [
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    text: "SẢN PHẨM CHÍNH HÃNG 100%",
  },
  {
    icon: <Star className="w-8 h-8" />,
    text: "ĐẢM BẢO CHẤT LƯỢNG",
  },
  {
    icon: <Truck className="w-8 h-8" />,
    text: "GIAO HÀNG NHANH TOÀN QUỐC",
  },
  {
    icon: <BadgeDollarSign className="w-8 h-8" />,
    text: "GIÁ CẢ CẠNH TRANH NHẤT",
  },
  {
    icon: <Settings className="w-8 h-8" />,
    text: "DỊCH VỤ CHUYÊN NGHIỆP",
  },
  {
    icon: <Headphones className="w-8 h-8" />,
    text: "HỖ TRỢ KỸ THUẬT 24/7",
  },
  {
    icon: <Handshake className="w-8 h-8" />,
    text: "UY TÍN KHÁCH HÀNG",
  },
];

// Duplicate items to create a seamless loop
const marqueeItems = [...reasons, ...reasons];

const WhyChooseUs = () => {
  return (
    <section className="bg-white overflow-hidden py-12">
      <div className="container mx-auto px-8 lg:px-12 mb-8">
        {/* Title Section */}
        <ScrollReveal animation="reveal" className="text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-brand-primary uppercase">
            Vì sao chọn chúng tôi
          </h2>
          <div className="flex justify-center">
            <div className="h-1.5 w-16 bg-brand-accent rounded-full"></div>
          </div>
        </ScrollReveal>
      </div>

      {/* Continuous Marquee Container */}
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee flex whitespace-nowrap gap-12 py-10 px-4 group-hover:[animation-play-state:paused]">
          {marqueeItems.map((reason, index) => (
            <div
              key={index}
              className="flex-shrink-0 relative pt-6 pl-6 w-[300px] md:w-[350px]"
            >
              <div className="bg-white p-8 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-primary/20 transition-all duration-500 group/card min-h-32 flex items-center">
                {/* Overlapping Icon Block */}
                <div className="absolute top-0 left-0 w-16 h-16 bg-brand-primary shadow-lg rounded-xl flex items-center justify-center z-10 group-hover/card:bg-brand-accent group-hover/card:rotate-6 transition-all duration-500">
                  <div className="text-white group-hover/card:text-brand-primary transition-colors duration-500">
                    {reason.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="ml-10">
                  <p className="text-lg font-black text-brand-primary leading-tight uppercase group-hover/card:translate-x-1 transition-transform duration-300 whitespace-normal text-wrap">
                    {reason.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Marquee (for seamless loop) */}
        <div className="animate-marquee flex whitespace-nowrap gap-12 py-10 px-4 group-hover:[animation-play-state:paused]">
          {marqueeItems.map((reason, index) => (
            <div
              key={index}
              className="flex-shrink-0 relative pt-6 pl-6 w-[300px] md:w-[350px]"
            >
              <div className="bg-white p-8 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-primary/20 transition-all duration-500 group/card min-h-32 flex items-center">
                {/* Overlapping Icon Block */}
                <div className="absolute top-0 left-0 w-16 h-16 bg-brand-primary shadow-lg rounded-xl flex items-center justify-center z-10 group-hover/card:bg-brand-accent group-hover/card:rotate-6 transition-all duration-500">
                  <div className="text-white group-hover/card:text-brand-primary transition-colors duration-500">
                    {reason.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="ml-10">
                  <p className="text-lg font-black text-brand-primary leading-tight uppercase group-hover/card:translate-x-1 transition-transform duration-300 whitespace-normal text-wrap">
                    {reason.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient Fades for Smooth Edge Transition */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>
      </div>

      {/* Custom Keyframes in Style Tag (Tailwind 4 compatibility) */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes marquee2 {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 60s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;
