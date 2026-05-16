"use client";

import Link from "next/link";

const list_nav = [
    { name: "Giới thiệu", href: "/about" },
    { name: "Sản phẩm", href: "/products" },
    { name: "Dịch vụ", href: "/services" },
    { name: "Đối tác", href: "/partners" },
    { name: "Tin tức", href: "/news" },
    { name: "Liên hệ", href: "/contact" }
];

export default function Navigation() {
  return (
    <nav className="flex items-center gap-1">
      {list_nav.map((item) => (
        <Link 
          key={item.href}
          href={item.href}
          className="px-4 py-2 text-white/90 hover:text-white text-[15px] font-bold uppercase tracking-wider transition-all relative group"
        >
          {item.name}
          <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </Link>
      ))}
    </nav>
  );
}
