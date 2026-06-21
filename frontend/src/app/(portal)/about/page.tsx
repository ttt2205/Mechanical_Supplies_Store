import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { readIntroduceContent } from "@/lib/introduce-content";

export const dynamic = "force-dynamic";

const renderParagraphs = (text: string, className = "") =>
  text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={`${paragraph}-${index}`} className={className}>
        {paragraph}
      </p>
    ));

export default async function AboutUsPage() {
  const data = await readIntroduceContent();

  return (
    <div className="min-h-screen bg-white pt-16 lg:pt-20">
      <section className="relative h-[420px] overflow-hidden bg-slate-900 sm:h-[500px] lg:h-[540px]">
        <img
          src={data.hero.thumbnail}
          alt={data.hero.highlight}
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/95 via-brand-primary/55 to-slate-950/20" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="container relative mx-auto flex h-full flex-col justify-center px-4 sm:px-6 lg:px-12">
          <ScrollReveal animation="reveal-left" className="max-w-4xl">
            <nav className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-brand-accent sm:mb-7 sm:text-sm sm:tracking-[0.26em]">
              <Link href="/" className="transition-colors hover:text-white">
                Trang chủ
              </Link>
              <ChevronRight size={14} className="opacity-50" />
              <span className="text-white/70">Về chúng tôi</span>
            </nav>
            <h1 className="mb-5 text-4xl font-black uppercase leading-[0.96] tracking-tight font-montserrat text-white drop-shadow-2xl sm:text-6xl lg:text-8xl">
              {data.hero.title}
              <span className="mt-2 block text-3xl italic text-brand-accent sm:text-5xl lg:text-7xl">
                {data.hero.highlight}
              </span>
            </h1>
            <div className="mb-5 h-1.5 w-20 bg-brand-accent sm:mb-7 sm:h-2 sm:w-24" />
            <p className="max-w-2xl border-l-4 border-brand-accent pl-4 text-base font-bold leading-relaxed text-white drop-shadow-lg sm:pl-6 sm:text-xl lg:text-2xl">
              {data.hero.excerpt}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          <div className="lg:col-span-8">
            <ScrollReveal animation="reveal">
              <article className="space-y-10 sm:space-y-12">
                <section>
                  <h2 className="mb-4 text-2xl font-black uppercase tracking-tight text-brand-primary sm:text-3xl">
                    {data.story.heading}
                  </h2>
                  <div className="space-y-4 text-base font-medium leading-7 text-slate-600 sm:text-lg sm:leading-8">
                    {renderParagraphs(data.story.body)}
                  </div>
                </section>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-8">
                  <section className="rounded-2xl bg-brand-primary p-6 text-white shadow-sm sm:p-8">
                    <h3 className="mb-3 text-xl font-black uppercase sm:text-2xl">
                      {data.vision.heading}
                    </h3>
                    <div className="space-y-3 text-sm font-medium leading-7 text-white/90 sm:text-base">
                      {renderParagraphs(data.vision.body)}
                    </div>
                  </section>
                  <section className="rounded-2xl bg-brand-accent p-6 text-brand-primary shadow-sm sm:p-8">
                    <h3 className="mb-3 text-xl font-black uppercase sm:text-2xl">
                      {data.mission.heading}
                    </h3>
                    <div className="space-y-3 text-sm font-bold leading-7 text-brand-primary/90 sm:text-base">
                      {renderParagraphs(data.mission.body)}
                    </div>
                  </section>
                </div>

                <section>
                  <h2 className="mb-5 text-2xl font-black uppercase tracking-tight text-brand-primary sm:text-3xl">
                    {data.reasonsHeading}
                  </h2>
                  <ul className="space-y-4">
                    {data.reasons.map((reason) => (
                      <li key={reason.title} className="flex items-start gap-3 sm:gap-4">
                        <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-emerald-500" />
                        <div>
                          <h4 className="text-base font-black text-slate-800 sm:text-lg">
                            {reason.title}
                          </h4>
                          <p className="mt-1 text-sm font-medium leading-6 text-slate-500 sm:text-base">
                            {reason.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <figure className="relative h-[280px] overflow-hidden rounded-2xl shadow-2xl sm:h-[360px] lg:h-[400px]">
                  <img
                    src={data.showcase.image}
                    alt={data.showcase.alt}
                    className="h-full w-full object-cover"
                  />
                  <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-brand-primary/85 to-transparent p-6 sm:p-10 lg:p-12">
                    <p className="text-2xl font-black uppercase italic tracking-tight text-white sm:text-3xl">
                      {data.showcase.caption}
                    </p>
                  </figcaption>
                </figure>
              </article>
            </ScrollReveal>
          </div>

          <aside className="lg:col-span-4">
            <ScrollReveal animation="reveal-right">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 shadow-sm sm:p-8 lg:sticky lg:top-28">
                <h3 className="mb-6 text-xl font-black uppercase tracking-tight text-brand-primary sm:text-2xl">
                  {data.contact.heading}
                </h3>

                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-primary sm:h-12 sm:w-12">
                      <MapPin size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-400">
                        {data.contact.addressLabel}
                      </p>
                      <p className="font-bold leading-snug text-slate-800">
                        {data.contact.address}
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-accent sm:h-12 sm:w-12">
                      <Phone size={22} className="text-brand-primary" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-400">
                        {data.contact.hotlineLabel}
                      </p>
                      <p className="text-lg font-black text-brand-primary sm:text-xl">
                        {data.contact.hotline}
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-800 sm:h-12 sm:w-12">
                      <Mail size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-400">
                        {data.contact.emailLabel}
                      </p>
                      <p className="break-all font-bold text-slate-800">
                        {data.contact.email}
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-200 sm:h-12 sm:w-12">
                      <Clock size={22} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-400">
                        {data.contact.hoursLabel}
                      </p>
                      <p className="font-bold text-slate-800">{data.contact.hours}</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-8 sm:mt-10">
                  <Link
                    href="/contact"
                    className="flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-brand-primary px-4 py-4 text-center text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-blue-800 active:scale-95 sm:text-sm"
                  >
                    {data.contact.cta}
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </aside>
        </div>
      </section>
    </div>
  );
}

