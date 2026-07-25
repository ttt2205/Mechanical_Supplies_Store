"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Category } from "@/types/category";

interface CategoryPopupProps {
  categories: Category[];
  isOpen: boolean;
  onClose?: () => void;
  type?: string;
}

export default function CategoryPopup({ categories, isOpen, onClose, type = "product" }: CategoryPopupProps) {
  const [activeRootId, setActiveRootId] = useState<number | null>(null);

  const getBaseUrl = (categoryType: string) => {
    switch (categoryType) {
      case "product": return "/products";
      case "service": return "/services";
      case "partner": return "/partners";
      default: return "/category";
    }
  };

  const baseUrl = getBaseUrl(type);

  // Filter levels
  const rootCategories = categories.filter((c) => c.parent_id === null);
  
  const effectiveActiveRootId = activeRootId ?? rootCategories[0]?.category_id ?? null;
  const activeSubCategories = categories.filter((c) => c.parent_id === effectiveActiveRootId);
  const getLevel3 = (parentId: number) => categories.filter((c) => c.parent_id === parentId);

  const activeRoot = rootCategories.find(c => c.category_id === effectiveActiveRootId);

  if (!isOpen) return null;

  return (
    <div 
      className={`absolute top-full left-0 mt-0 pt-4 z-50 transition-all duration-300 ${
        isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
      }`}
      onMouseLeave={onClose}
    >
      <div className="bg-white shadow-2xl rounded-xl border border-slate-100 overflow-hidden flex min-w-[750px] h-[450px]">
        
        {/* Left Pane: Level 1 Categories (Sidebar) */}
        <div className="w-1/3 bg-slate-50 border-r border-slate-100 py-4 overflow-y-auto custom-scrollbar">
          {rootCategories.map((root) => (
            <Link
              key={root.category_id}
              href={`${baseUrl}/${root.slug}`}
              onMouseEnter={() => setActiveRootId(root.category_id)}
              onClick={() => {
                if (onClose) onClose();
              }}
              className={`px-6 py-4 cursor-pointer transition-colors flex items-center justify-between group block ${
                effectiveActiveRootId === root.category_id 
                  ? "bg-white text-brand-primary" 
                  : "text-slate-600 hover:bg-white hover:text-brand-primary"
              }`}
            >
              <span className="font-bold text-sm uppercase tracking-tight">{root.name}</span>
              <ChevronRight 
                size={14} 
                className={`transition-transform ${
                  effectiveActiveRootId === root.category_id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                }`} 
              />
            </Link>
          ))}
        </div>

        {/* Right Pane: Level 2 & 3 Categories */}
        <div className="w-2/3 bg-white p-8 overflow-y-auto custom-scrollbar">
          {activeRoot ? (
            <div className="space-y-8 animate-fade-in">
              {/* Header for Active Root */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h3 className="font-black text-brand-primary uppercase tracking-tight">
                  {activeRoot.name}
                </h3>
                <Link 
                  href={`${baseUrl}/${activeRoot.slug}`}
                  className="text-[10px] font-black uppercase text-brand-accent-alt hover:underline"
                >
                  Xem tất cả
                </Link>
              </div>
              
              {/* Grid of L2 and L3 */}
              <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                {activeSubCategories.length > 0 ? (
                  activeSubCategories.map((l2) => (
                    <div key={l2.category_id} className="space-y-3">
                      {/* Level 2 Title */}
                      <Link 
                        href={`${baseUrl}/${l2.slug}`}
                        className="text-brand-primary font-black text-sm uppercase tracking-tight hover:text-brand-accent-alt transition-colors block"
                        onClick={() => {
                          if (onClose) onClose();
                        }}
                      >
                        {l2.name}
                      </Link>
                      
                      {/* Level 3 List */}
                      <ul className="space-y-2">
                        {getLevel3(l2.category_id).map((l3) => (
                          <li key={l3.category_id}>
                            <Link 
                              href={`${baseUrl}/${l3.slug}`}
                              className="text-slate-500 hover:text-brand-primary font-bold text-sm transition-colors flex items-center gap-2 group/item"
                              onClick={() => {
                                if (onClose) onClose();
                              }}
                            >
                              <span className="w-1 h-1 rounded-full bg-slate-300 group-hover/item:bg-brand-accent transition-colors"></span>
                              {l3.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic text-sm col-span-2">Không có danh mục con</p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-300 italic text-sm">
              Rê chuột vào danh mục để xem chi tiết
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
