import type { Metadata } from "next";
import SessionInitializer from "@/components/ui/SessionInitializer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Đăng nhập | Hưng Thịnh Hydraulics",
  description: "Đăng nhập tài khoản Hưng Thịnh để theo dõi đơn hàng và nhận ưu đãi.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#0f172a] relative flex flex-col items-center justify-center font-sans overflow-x-hidden">
        <SessionInitializer />
        
        {/* Simple Header */}
        <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
            <Link 
                href="/" 
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-all font-black uppercase text-[10px] tracking-[0.2em] group"
            >
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md shadow-sm flex items-center justify-center group-hover:bg-white/20 transition-all">
                    <ArrowLeft size={14} />
                </div>
                <span className="hidden sm:inline">Quay lại trang chủ</span>
            </Link>
        </header>

        <div className="w-full flex-grow flex items-center justify-center sm:p-4 z-10">
            {children}
        </div>

        {/* Decorative Background Elements - High Contrast for Dark Theme */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-brand-primary/20 rounded-full blur-[160px]"></div>
            <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-brand-accent/10 rounded-full blur-[160px]"></div>
        </div>
    </div>
  );
}
