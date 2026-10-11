"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight, FolderKanban, ShieldCheck, Handshake, Layers } from "lucide-react";
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
      default: return "/products";
    }
  };

  const getTypeNameLabel = (categoryType: string) => {
    switch (categoryType) {
      case "product": return "Sản phẩm";
      case "service": return "Dịch vụ kỹ thuật";
      case "partner": return "Mạng lưới đối tác";
      default: return "Danh mục";
    }
  };

  const getTypeIcon = (categoryType: string) => {
    switch (categoryType) {
      case "service": return ShieldCheck;
      case "partner": return Handshake;
      default: return FolderKanban;
    }
  };

  const baseUrl = getBaseUrl(type);
  const typeLabel = getTypeNameLabel(type);
  const HeaderIcon = getTypeIcon(type);

  // Filter & sort Root categories (Level 1)
  const rootCategories = categories
    .filter((c) => !c.parent_id)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  
  const isCurrentActiveRootValid = rootCategories.some(c => c.category_id === activeRootId);
  const effectiveActiveRootId = isCurrentActiveRootValid 
    ? activeRootId 
    : (rootCategories[0]?.category_id ?? null);

  // Level 2 Subcategories
  const activeSubCategories = categories
    .filter((c) => c.parent_id === effectiveActiveRootId)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  // Level 3 Child elements
  const getLevel3 = (parentId: number) => 
    categories
      .filter((c) => c.parent_id === parentId)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const activeRoot = rootCategories.find(c => c.category_id === effectiveActiveRootId);

  if (!isOpen) return null;

  return (
    <div 
      className={`absolute top-full left-0 mt-0 pt-3 z-50 transition-all duration-300 ${
        isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
      }`}
      onMouseLeave={onClose}
    >
      <div className="bg-white shadow-2xl rounded-2xl border border-slate-200/80 overflow-hidden flex min-w-[820px] max-w-[940px] h-[480px]">
        
        {/* Left Pane: Level 1 Categories (Sidebar) */}
        <div className="w-[34%] min-w-[260px] bg-slate-50/80 border-r border-slate-100 py-3 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            <div className="px-5 py-2 mb-1 flex items-center gap-2 text-slate-400">
              <HeaderIcon size={14} className="text-brand-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {typeLabel}
              </span>
            </div>

            {rootCategories.map((root) => {
              const isActive = effectiveActiveRootId === root.category_id;
              return (
                <Link
                  key={root.category_id}
                  href={`${baseUrl}/${root.slug}`}
                  onMouseEnter={() => setActiveRootId(root.category_id)}
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                  className={`px-5 py-3 cursor-pointer transition-all flex items-center justify-between group border-l-4 ${
                    isActive
                      ? "bg-white text-brand-primary border-brand-primary shadow-sm font-bold" 
                      : "border-transparent text-slate-600 hover:bg-white hover:text-brand-primary hover:border-slate-300 font-semibold"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                      isActive ? "bg-brand-primary" : "bg-slate-300 group-hover:bg-brand-primary"
                    }`} />
                    <span className="text-xs uppercase tracking-tight truncate leading-normal">
                      {root.name}
                    </span>
                  </div>
                  <ChevronRight 
                    size={14} 
                    className={`shrink-0 transition-transform ${
                      isActive 
                        ? "opacity-100 translate-x-0 text-brand-primary" 
                        : "opacity-0 -translate-x-1.5 text-slate-400 group-hover:opacity-60 group-hover:translate-x-0"
                    }`} 
                  />
                </Link>
              );
            })}
          </div>

          {/* Quick link at bottom of sidebar */}
          <div className="p-3 border-t border-slate-200/60 mt-2 bg-slate-100/40">
            <Link
              href={baseUrl}
              onClick={() => { if (onClose) onClose(); }}
              className="text-[11px] font-bold text-slate-500 hover:text-brand-primary transition-colors flex items-center justify-between px-2 py-1 rounded-lg hover:bg-white"
            >
              <span>Xem toàn bộ {typeLabel.toLowerCase()}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Right Pane: Level 2 & Level 3 Categories */}
        <div className="flex-1 bg-white p-7 overflow-y-auto custom-scrollbar flex flex-col">
          {activeRoot ? (
            <div className="space-y-6 animate-fade-in flex-1">
              {/* Header for Active Root */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="pr-4">
                  <h3 className="font-black text-brand-primary uppercase tracking-tight text-base leading-snug">
                    {activeRoot.name}
                  </h3>
                  {activeRoot.description && (
                    <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-1 max-w-[460px] leading-relaxed">
                      {activeRoot.description}
                    </p>
                  )}
                </div>
                <Link 
                  href={`${baseUrl}/${activeRoot.slug}`}
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                  className="text-[11px] font-black uppercase text-brand-accent hover:text-amber-600 transition-colors flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-lg bg-amber-50/80 hover:bg-amber-100/80 group"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              
              {/* Grid of L2 and L3 */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-7 pb-2">
                {activeSubCategories.length > 0 ? (
                  activeSubCategories.map((l2) => {
                    const l3List = getLevel3(l2.category_id);
                    return (
                      <div key={l2.category_id} className="space-y-2.5">
                        {/* Level 2 Title */}
                        <Link 
                          href={`${baseUrl}/${l2.slug}`}
                          className="text-brand-primary font-black text-xs uppercase tracking-tight hover:text-brand-accent transition-colors block leading-tight pb-1 border-b border-slate-100 flex items-center justify-between group/title"
                          onClick={() => {
                            if (onClose) onClose();
                          }}
                        >
                          <span className="truncate pr-2">{l2.name}</span>
                          <ChevronRight size={12} className="opacity-0 group-hover/title:opacity-100 group-hover/title:translate-x-0.5 transition-all text-brand-accent shrink-0" />
                        </Link>
                        
                        {/* Level 3 List */}
                        {l3List.length > 0 ? (
                          <ul className="space-y-1.5 pt-0.5">
                            {l3List.map((l3) => (
                              <li key={l3.category_id}>
                                <Link 
                                  href={`${baseUrl}/${l3.slug}`}
                                  className="text-slate-600 hover:text-brand-primary font-semibold text-xs transition-colors flex items-center gap-2 group/item py-0.5"
                                  onClick={() => {
                                    if (onClose) onClose();
                                  }}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/item:bg-brand-accent transition-colors shrink-0"></span>
                                  <span className="truncate">{l3.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          /* Fallback when no L3 exists */
                          <div className="space-y-1.5 pt-0.5">
                            {l2.description && (
                              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                                {l2.description}
                              </p>
                            )}
                            <Link 
                              href={`${baseUrl}/${l2.slug}`}
                              className="text-[11px] font-bold text-brand-accent hover:underline inline-flex items-center gap-1 pt-0.5"
                              onClick={() => {
                                if (onClose) onClose();
                              }}
                            >
                              <span>Khám phá chi tiết</span>
                              <ChevronRight size={12} />
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 py-12 flex flex-col items-center justify-center text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
                      <Layers size={20} />
                    </div>
                    <p className="text-sm font-bold text-slate-700 mb-1">Nội dung đang được cập nhật</p>
                    <p className="text-xs text-slate-400 max-w-xs mb-3">
                      Các danh mục chi tiết thuộc nhóm này đang được bổ sung và hoàn thiện.
                    </p>
                    <Link
                      href={`${baseUrl}/${activeRoot.slug}`}
                      onClick={() => { if (onClose) onClose(); }}
                      className="text-xs font-bold uppercase tracking-wider text-brand-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Xem trang tổng quan</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-300 italic text-sm">
              Rê chuột vào danh mục bên trái để xem chi tiết
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
