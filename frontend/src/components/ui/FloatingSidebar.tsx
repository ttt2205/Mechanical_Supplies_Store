'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Phone, 
  ChevronUp, 
} from 'lucide-react';
import Link from 'next/link';

// Custom Messenger SVG
const MessengerIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.5 3.734 7.22.195.147.312.378.312.625l-.01 2.305c-.004.836.883 1.373 1.626.985l2.56-1.34c.184-.097.395-.125.602-.08 1.144.252 2.344.39 3.578.39 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm1.2 12.06L10.7 11.5l-4.5 2.4 4.94-5.24 2.5 2.56 4.5-2.4-4.94 5.24z"/>
  </svg>
);

const FloatingSidebar = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const actions = [
    { 
      icon: <Heart size={28} />, 
      label: 'Yêu thích', 
      color: 'bg-red-500',
      animation: 'animate-heart-beat',
      href: '/favorites',
      mobile: false
    },
    { 
      icon: <Phone size={28} />, 
      label: 'Hotline', 
      color: 'bg-brand-primary',
      animation: 'animate-phone-vibrate',
      href: 'tel:0123456789',
      mobile: true
    },
    { 
      icon: <img src="/icons/icon_zalo.png" alt="Zalo" className="w-10 h-10 object-contain" />, 
      label: 'Zalo', 
      color: 'bg-[#0068FF]',
      animation: 'animate-icon-pulse',
      href: '#',
      mobile: true
    },
    { 
      icon: <MessengerIcon size={28} />, 
      label: 'Messenger', 
      color: 'bg-sky-500',
      animation: 'animate-icon-pulse',
      href: '#',
      mobile: false
    },
  ];

  return (
    <>
      <div className="fixed right-3 bottom-4 md:right-8 md:bottom-24 z-[60] flex flex-col gap-2 md:gap-6">
        {actions.map((action, index) => (
          <div 
            key={index}
            className={`group relative items-center justify-end ${action.mobile ? 'flex' : 'hidden md:flex'}`}
          >
            {/* Wave Effect Background */}
            <div className={`hidden md:block absolute inset-0 rounded-full ${action.color} opacity-40 animate-ping-slow scale-90`}></div>
            
            {/* Label */}
            <div className="absolute right-full mr-5 bg-white text-brand-primary px-5 py-2.5 rounded-xl shadow-2xl font-black text-xs uppercase tracking-widest opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap pointer-events-none border border-slate-100 hidden md:block">
              {action.label}
            </div>

            {/* Icon Button */}
            <Link 
              href={action.href}
              className={`relative w-11 h-11 md:w-16 md:h-16 ${action.color} text-white flex items-center justify-center rounded-full shadow-xl md:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/30 z-10 overflow-hidden`}
              aria-label={action.label}
            >
              <div className="flex items-center justify-center scale-[0.75] md:scale-100">
                {action.icon}
              </div>
            </Link>
          </div>
        ))}

        {/* Back to Top Arrow */}
        {showBackToTop && (
          <button 
            onClick={scrollToTop}
            className="w-11 h-11 md:w-16 md:h-16 bg-slate-900 text-white flex items-center justify-center rounded-full shadow-xl md:shadow-2xl hover:bg-brand-accent hover:text-black transition-all duration-300 md:animate-bounce-subtle group border-2 border-white/20"
            aria-label="Lên đầu trang"
          >
            <ChevronUp size={24} className="md:w-8 md:h-8 group-hover:-translate-y-1 transition-transform" />
          </button>
        )}
      </div>
    </>
  );
};

export default FloatingSidebar;
