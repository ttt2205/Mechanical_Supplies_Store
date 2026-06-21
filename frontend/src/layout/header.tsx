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
import FavoriteBadge from "@/features/layout/header/favorite-badge";
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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(frame);
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

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "h-16 lg:h-20 shadow-lg" : "h-16 lg:h-28"
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
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen((value) => !value)}
            className="text-white p-2 min-h-11 min-w-11 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Mở tìm kiếm"
            aria-expanded={isMobileSearchOpen}
          >
            <Search size={24} />
          </button>
        </div>

        {/* Logo Section */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0 transition-all duration-300 flex items-center ${isScrolled ? "h-11 lg:h-full lg:w-56" : "h-12 lg:h-full lg:w-72"}`}
        >
          <Link
            href="/"
            className="h-full w-36 sm:w-40 lg:w-full bg-white text-brand-primary flex items-center px-3 lg:pl-2 lg:pr-16 transition-all duration-300 [clip-path:none] lg:[clip-path:polygon(0%_0%,_85%_0%,_100%_50%,_85%_100%,_0%_100%)] shadow-xl rounded-lg lg:rounded-none"
            aria-label="Về trang chủ"
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
              <FavoriteBadge isMobile={false} />
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
          <FavoriteBadge isMobile={true} />
          <button
            onClick={() => {
              setIsMobileSearchOpen(false);
              setIsMobileMenuOpen(true);
            }}
            className="text-white p-2 min-h-11 min-w-11 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Mở menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      <div
        className={`absolute left-0 right-0 top-full z-20 lg:hidden bg-white px-4 py-3 shadow-xl border-t border-slate-100 transition-all duration-300 ${
          isMobileSearchOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible"
        }`}
      >
        <SearchHeader />
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
          className={`absolute top-0 right-0 w-[min(88vw,24rem)] h-full bg-white shadow-2xl transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-5 border-b flex items-center justify-between bg-brand-primary text-white">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="h-11 w-40 max-w-[70%] rounded-xl bg-white px-3 py-1.5 shadow-lg"
              aria-label="Về trang chủ"
            >
              <img
                src="/Logo.png"
                alt="Logo"
                className="h-full w-full object-contain"
              />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 min-h-11 min-w-11 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Đóng menu"
            >
              <X size={28} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-5 px-5">
            <div className="mb-5">
              <SearchHeader />
            </div>
            <div className="space-y-1">
              {list_nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex min-h-12 items-center justify-between py-3 px-2 border-b border-slate-100 text-brand-primary font-semibold text-base tracking-normal hover:text-brand-accent transition-all group leading-relaxed"
                >
                  {item.name}
                  <ChevronRight
                    size={18}
                    className="text-brand-accent opacity-50 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t space-y-6">
              <Link
                href={isHydrated && isAuthenticated ? (user?.role_id === 'admin' ? "/admin/dashboard" : "/account") : "/login"}
                className="flex items-center gap-4 text-brand-primary font-semibold px-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-brand-primary">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {isHydrated && isAuthenticated ? (user?.role_id === 'admin' ? "Quản trị viên" : "Khách hàng") : "Khách hàng"}
                  </p>
                  <p className="text-base">
                    {isHydrated && isAuthenticated
                      ? (user?.username || user?.email)
                      : "Đăng nhập ngay"}
                  </p>
                </div>
              </Link>
            </div>
          </div>
          <div className="p-5 bg-muted border-t">
            <a
              href="tel:0123456789"
              className="w-full min-h-12 bg-brand-accent text-white p-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-base shadow-lg active:scale-95 transition-all"
            >
              <Phone size={20} fill="currentColor" />
              0123.456.789
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
