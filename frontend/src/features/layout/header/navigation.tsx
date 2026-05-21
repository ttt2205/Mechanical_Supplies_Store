"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import CategoryPopup from "@/components/ui/CategoryPopup";
import { useProductCategories } from "@/hooks/useProductCategories";
import { useServiceCategories } from "@/hooks/useServiceCategories";
import { usePartnerCategories } from "@/hooks/usePartnerCategories";

const list_nav = [
    { name: "Giới thiệu", href: "/about" },
    { name: "Sản phẩm", href: "/products", type: "product" },
    { name: "Dịch vụ", href: "/services", type: "service" },
    { name: "Đối tác", href: "/partners", type: "partner" },
    { name: "Tin tức", href: "/news" },
    { name: "Liên hệ", href: "/contact" }
];

export default function Navigation() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { categories: productCategories } = useProductCategories();
  const { services: serviceCategories } = useServiceCategories();
  const { partners: partnerCategories } = usePartnerCategories();

  const getCategoriesByType = (type: string) => {
    switch (type) {
      case "product": return productCategories;
      case "service": return serviceCategories;
      case "partner": return partnerCategories;
      default: return [];
    }
  };

  return (
    <nav className="flex items-center gap-1 h-full">
      {list_nav.map((item) => (
        <div 
          key={item.href}
          className="relative h-full flex items-center"
          onMouseEnter={() => setActiveMenu(item.type || null)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <Link 
            href={item.href}
            className="px-4 py-2 text-white/90 hover:text-white text-[15px] font-bold uppercase tracking-wider transition-all relative group flex items-center gap-1.5"
          >
            {item.name}
            {item.type && (
              <ChevronDown 
                size={14} 
                className="transition-transform duration-300 group-hover:rotate-180 opacity-70 group-hover:opacity-100" 
              />
            )}
            <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>

          {item.type && (
            <CategoryPopup 
              isOpen={activeMenu === item.type}
              categories={getCategoriesByType(item.type)}
              type={item.type}
              onClose={() => setActiveMenu(null)}
            />
          )}
        </div>
      ))}
    </nav>
  );
}
