"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Phone,
  Menu,
  X,
  Search,
  ChevronRight,
  User,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import SearchHeader from "@/features/layout/header/search";
import Navigation from "@/features/layout/header/navigation";
import AccountInfo from "@/features/layout/header/account-info";
import CartBadge from "@/features/layout/header/cart-badge";
import { useAuthStore } from "@/store/useAuthStore";

const list_nav = [
  { name: "Giới thiệu", href: "/about" },
  { name: "Sản phẩm", href: "/products" },
  { name: "Dịch vụ", href: "/services" },
  { name: "Đối tác", href: "/partners" },
  { name: "Tin tức", href: "/news" },
  { name: "Liên hệ", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "h-16 lg:h-20 shadow-lg" : "h-20 lg:h-28"
      }`}
    >
      {/* Background Layers */}
      <div
        className={`absolute inset-0 flex flex-col transition-opacity duration-500 z-0 ${isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <div className="h-full lg:h-1/2 bg-brand-primary"></div>
        <div className="hidden lg:block lg:h-1/2 bg-brand-secondary"></div>
      </div>
      <div
        className={`absolute inset-0 transition-opacity duration-500 z-0 bg-brand-primary/95 backdrop-blur-md ${isScrolled ? "opacity-100" : "opacity-0"}`}
      ></div>

      <div className="relative z-10 w-full h-full flex items-center justify-between px-4 lg:px-0">
        {/* MOBILE SEARCH ICON (LEFT) */}
        <div className="flex lg:hidden items-center">
          <button className="text-white p-2" aria-label="Search">
            <Search size={24} />
          </button>
        </div>

        {/* Logo Section */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0 transition-all duration-500 flex items-center ${isScrolled ? "h-12 lg:h-full lg:w-56" : "h-16 lg:h-full lg:w-72"}`}
        >
          <Link
            href="/"
            className="h-full w-40 lg:w-full bg-white text-brand-primary flex items-center px-4 lg:pl-2 lg:pr-16 transition-all duration-500 [clip-path:none] lg:[clip-path:polygon(0%_0%,_85%_0%,_100%_50%,_85%_100%,_0%_100%)] shadow-xl rounded-lg lg:rounded-none"
          >
            <div className="relative w-full h-full flex items-center justify-center lg:justify-start py-1 lg:py-2">
              <img
                src="/Logo.png"
                alt="CSH Group Logo"
                className="object-cover w-full h-full"
              />
            </div>
          </Link>
        </div>

        {/* Desktop Layout (Right Side) */}
        <div className="hidden lg:flex flex-col flex-1 h-full items-end pr-8">
          <div
            className={`flex items-center w-full transition-all duration-500 origin-top pr-2 ${
              isScrolled
                ? "h-0 opacity-0 overflow-hidden"
                : "h-1/2 opacity-100 py-2"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              {/* Address */}
              <div className="hidden lg:flex items-center gap-3 min-w-[300px]">
                {/* Box chứa Icon: Sử dụng màu vàng thương hiệu (accent) ở độ trong suốt 10% để tạo nền sáng, nhẹ nhàng */}
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/20">
                  <MapPin className="w-5 h-5 text-brand-accent" />
                </div>

                <div className="leading-tight">

                  {/* Nội dung chính: Sử dụng màu Foreground đậm để đạt độ tương phản cao nhất trên nền trắng */}
                  <p className="text-lg font-semibold text-white">
                    208 Lò Siêu, Phường 12, Quận 11, TP. Hồ Chí Minh
                  </p>
                </div>
              </div>

              {/* Search + Account */}
              <div className="flex items-center gap-6 flex-1 justify-end">
                <div className="w-full max-w-2xl">
                  <SearchHeader />
                </div>

                <AccountInfo />
              </div>
            </div>
          </div>

          <div
            className={`${isScrolled ? "h-full" : "h-1/2"} w-full flex items-center justify-between pl-8`}
          >
            <Navigation />
            <div className="flex items-center gap-6">
              <CartBadge isMobile={false} />
              <a
                href="tel:0123456789"
                className="bg-brand-accent hover:bg-brand-accent-hover text-white px-5 py-2 rounded-full font-black text-[15px] uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center gap-3"
              >
                <Phone size={18} fill="currentColor" />
                <span>0123.456.789</span>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Controls (Right Side) */}
        <div className="flex lg:hidden items-center gap-2">
          <CartBadge isMobile={true} />
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-white p-2"
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        <div
          className="absolute inset-0 bg-brand-primary/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        <div
          className={`absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl transition-transform duration-500 flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-6 border-b flex items-center justify-between bg-brand-primary text-white">
            <img
              src="/Logo.png"
              alt="Logo"
              className="h-8 brightness-0 invert"
            />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={28} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-8 px-6">
            <div className="space-y-2">
              {list_nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-6 rounded-2xl text-brand-primary font-black text-5xl md:text-6xl tracking-tighter hover:bg-brand-muted transition-all group"
                >
                  {item.name}
                  <ChevronRight
                    size={20}
                    className="text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              ))}
            </div>
            <div className="mt-10 pt-10 border-t space-y-6">
              <Link
                href="/account"
                className="flex items-center gap-4 text-brand-primary font-bold px-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-12 h-12 rounded-full bg-brand-muted flex items-center justify-center text-brand-primary">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-sm text-brand-muted-foreground font-medium">
                    {isHydrated && isAuthenticated ? "Xin chào," : "Khách hàng"}
                  </p>
                  <p className="text-lg">
                    {isHydrated && isAuthenticated
                      ? user?.email
                      : "Chưa đăng nhập"}
                  </p>
                </div>
              </Link>
            </div>
          </div>
          <div className="p-6 bg-brand-muted border-t">
            <a
              href="tel:0123456789"
              className="w-full bg-brand-accent text-white p-4 rounded-2xl flex items-center justify-center gap-3 font-black text-lg shadow-lg"
            >
              <Phone size={24} fill="currentColor" />
              0123.456.789
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
