'use client';

import React, { useEffect, useState } from 'react';
import { ArticleDisplayContent } from '@/types/article';
import { List } from 'lucide-react';

interface ArticleLayoutProps {
  data: ArticleDisplayContent;
}

export default function ArticleLayout({ data }: ArticleLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    data.sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [data.sections]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="bg-white min-h-screen pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header Section */}
        <header className="max-w-6xl mx-auto mb-10 md:mb-14 border-b border-slate-100 pb-8 md:pb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight mb-4 md:mb-6">
            {data.title}
          </h1>
          {data.excerpt && (
            <div className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium max-w-4xl">
              {data.excerpt}
            </div>
          )}
        </header>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-16 max-w-6xl mx-auto">
          
          {/* Table of Contents - Right Sidebar */}
          {data.sections.length > 0 && (
            <aside className="lg:w-1/4 flex-shrink-0">
              <div className="sticky top-28 bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                  <List className="text-brand-primary" size={20} />
                  <h3 className="font-black uppercase tracking-wider text-slate-800 text-sm">
                    Tóm tắt danh mục
                  </h3>
                </div>
                <nav className="space-y-1">
                  {data.sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={(e) => scrollToSection(e, section.id)}
                      className={`block py-2.5 px-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                        activeSection === section.id
                          ? 'bg-brand-primary/10 text-brand-primary'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                      }`}
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Article Sections - Right Content */}
          <article className="lg:w-3/4 flex-1">
            <div className="bg-white">
              {data.sections.map((section, index) => (
                <section 
                  key={section.id} 
                  id={section.id} 
                  className={`scroll-mt-28 ${index > 0 ? 'mt-16 pt-16 border-t border-slate-100' : ''}`}
                >
                  <h2 className="text-2xl md:text-3xl font-black text-brand-primary uppercase tracking-tight mb-8 flex items-center gap-4">
                    <span className="w-2 h-8 md:h-10 bg-brand-accent rounded-full shadow-sm"></span>
                    {section.title}
                  </h2>
                  <div className="prose prose-slate prose-base md:prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-brand-primary prose-a:font-bold prose-img:rounded-2xl prose-p:text-slate-600 prose-li:text-slate-600 text-slate-600">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>
          </article>

        </div>
      </div>
    </div>
  );
}
