import React from "react";
import Image from "next/image";
import { readIntroduceContent } from "@/lib/introduce-content";
import Link from "next/link";
import { Shield, Star, CheckCircle, Zap, Target, Lightbulb, Users, Hexagon } from "lucide-react";

export const dynamic = "force-dynamic";

const ICONS = [Shield, Star, CheckCircle, Zap];

export default async function AboutUsPage() {
  const data = await readIntroduceContent();

  const renderParagraphs = (text: string) =>
    text
      .split(/\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph, index) => (
        <p key={index} className="mb-4 text-slate-700 leading-relaxed">
          {paragraph}
        </p>
      ));

  return (
    <div className="bg-[#FAFAF8] text-slate-900 pt-16 lg:pt-28">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={data.hero.thumbnail || "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1"}
            alt="Hero Background"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {data.hero.eyebrow && (
            <span className="text-white/80 uppercase tracking-[0.2em] text-sm font-semibold mb-6 block">
              {data.hero.eyebrow}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
            {data.hero.title}
            {data.hero.highlight && (
              <span className="block text-amber-500 mt-2">{data.hero.highlight}</span>
            )}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mt-6 font-medium leading-relaxed">
            {data.hero.excerpt}
          </p>

          {data.hero.stats && data.hero.stats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-white/20 w-full">
              {data.hero.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <span className="block text-3xl md:text-4xl font-bold text-amber-400 mb-2">{stat.number}</span>
                  <span className="text-sm text-white/80 uppercase tracking-wider font-semibold">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 md:py-28 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 tracking-tight">
              {data.story.heading}
            </h2>
            <div className="text-lg text-slate-700 space-y-6">
              {renderParagraphs(data.story.body)}
            </div>
            {data.quote && (
              <blockquote className="mt-10 pl-6 border-l-4 border-amber-500 italic text-2xl text-slate-800 font-serif">
                {data.quote}
              </blockquote>
            )}
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative w-full h-[450px] sm:h-[520px] lg:h-[600px] rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-black/5">
              <Image
                src={data.showcase.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"}
                alt={data.showcase.alt || "Brand Story"}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {data.showcase.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur py-4 px-6 border-t border-slate-200 z-10">
                  <p className="font-semibold text-slate-900 text-center">{data.showcase.caption}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            <div className="group">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{data.vision.heading}</h3>
              <div className="text-slate-600 leading-relaxed text-lg">
                {renderParagraphs(data.vision.body)}
              </div>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Lightbulb className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{data.mission.heading}</h3>
              <div className="text-slate-600 leading-relaxed text-lg">
                {renderParagraphs(data.mission.body)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
            {data.reasonsHeading}
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto mt-8"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.reasons.map((reason, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <div 
                key={idx}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-start"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 text-slate-700">
                  <Icon className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <h4 className="text-xl font-bold mb-3">{reason.title}</h4>
                <p className="text-slate-600 leading-relaxed">
                  {reason.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-10">
            Được tin tưởng bởi các đối tác hàng đầu
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-2xl text-slate-800">
              <Hexagon className="w-8 h-8" />
              <span>INDUSCORP</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-2xl text-slate-800">
              <Zap className="w-8 h-8" />
              <span>TECHMACH</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-2xl text-slate-800">
              <Shield className="w-8 h-8" />
              <span>GUARDIAN</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-2xl text-slate-800">
              <Star className="w-8 h-8" />
              <span>STEELPRO</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-2xl text-slate-800">
              <Users className="w-8 h-8" />
              <span>BUILDCO</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-slate-900 py-24 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Sẵn sàng hợp tác cùng chúng tôi?
          </h2>
          <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Liên hệ ngay để nhận tư vấn chi tiết về các giải pháp cơ khí và thiết bị công nghiệp phù hợp nhất cho doanh nghiệp của bạn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/contact"
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-8 py-4 rounded-full transition-colors text-lg inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              {data.contact.cta}
            </Link>
            <div className="text-white/80 mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:items-start text-center sm:text-left">
              <span className="text-sm uppercase tracking-wider text-slate-400">Hotline hỗ trợ</span>
              <span className="text-xl font-bold text-white">{data.contact.hotline}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
