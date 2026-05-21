'use client';

import React, { useState } from 'react';
import { Phone } from 'lucide-react';

const HotlineButton = () => {
  return (
    <div className="fixed left-6 bottom-6 z-50 group">
      {/* Pulse Waves (Hidden on group-hover) */}
      <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
        <div className="absolute w-14 h-14 bg-brand-accent rounded-full animate-ripple opacity-0"></div>
        <div className="absolute w-14 h-14 bg-brand-accent rounded-full animate-ripple opacity-0 animation-delay-700"></div>
      </div>

      {/* Main Button Container */}
      <a
        href="tel:0123456789"
        className="relative flex items-center bg-brand-accent text-black rounded-full h-14 min-w-[3.5rem] shadow-[0_10px_25px_rgba(250,204,21,0.4)] transition-all duration-500 ease-in-out group-hover:pr-6 overflow-hidden"
      >
        {/* Icon Wrapper (Stays circular) */}
        <div className="w-14 h-14 flex items-center justify-center shrink-0">
          <div className="animate-phone-vibrate">
            <Phone size={24} fill="currentColor" />
          </div>
        </div>

        {/* Number Text (Slides out) */}
        <span className="max-w-0 opacity-0 whitespace-nowrap font-black text-lg tracking-wider transition-all duration-500 ease-in-out group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-2">
          0123.456.789
        </span>
      </a>
    </div>
  );
};

export default HotlineButton;
