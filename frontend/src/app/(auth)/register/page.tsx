'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    ArrowRight, 
    User,
    Phone,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate registration process
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="w-full sm:max-w-md animate-fade-in min-h-screen sm:min-h-0 flex flex-col justify-center">
                <div className="bg-white sm:rounded-[40px] sm:shadow-2xl sm:shadow-slate-200/60 sm:border border-slate-100 p-8 md:p-12 text-center space-y-6 overflow-hidden relative flex-grow sm:flex-grow-0 flex flex-col justify-center">
                    <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 mb-4">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Đăng ký thành công!</h2>
                    <p className="text-slate-500 font-medium">Tài khoản của bạn đã được khởi tạo. Hệ thống đang chuyển hướng bạn đến trang đăng nhập...</p>
                    <div className="pt-4">
                        <Loader2 className="animate-spin mx-auto text-green-500" size={24} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full sm:max-w-md animate-fade-in min-h-screen sm:min-h-0 flex flex-col justify-center">
            <div className="bg-slate-50 sm:rounded-[40px] sm:shadow-2xl sm:shadow-black/20 sm:border border-white/20 p-6 md:p-12 overflow-hidden relative flex-grow sm:flex-grow-0">
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-accent to-brand-primary"></div>
                
                <div className="text-center mb-10 mt-20 sm:mt-0">
                    <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight mb-2">Tạo tài khoản</h1>
                    <p className="text-slate-600 text-sm font-semibold">Gia nhập cộng đồng Hưng Thịnh ngay hôm nay</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-4">
                            Tên đăng nhập <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                                <User size={18} />
                            </div>
                            <input 
                                type="text" 
                                required
                                placeholder="hungthinh_user"
                                className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-slate-950 placeholder:text-slate-400" 
                            />
                        </div>
                    </div>

                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-4">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                                <User size={18} />
                            </div>
                            <input 
                                type="text" 
                                required
                                placeholder="Nguyễn Văn A"
                                className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-slate-950 placeholder:text-slate-400" 
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-4">
                            Địa chỉ Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                                <Mail size={18} />
                            </div>
                            <input 
                                type="email" 
                                required
                                placeholder="name@example.com"
                                className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-slate-950 placeholder:text-slate-400" 
                            />
                        </div>
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-4">
                            Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                                <Phone size={18} />
                            </div>
                            <input 
                                type="tel" 
                                required
                                placeholder="0123.456.789"
                                className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-slate-950 placeholder:text-slate-400" 
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-4">
                            Mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                                <Lock size={18} />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required
                                placeholder="••••••••"
                                className="w-full pl-14 pr-14 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-slate-950 placeholder:text-slate-400" 
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Terms Acceptance */}
                    <div className="flex items-start gap-3 ml-4 py-2">
                        <input 
                            type="checkbox" 
                            id="terms" 
                            required
                            className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer" 
                        />
                        <label htmlFor="terms" className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed cursor-pointer">
                            Tôi đồng ý với các <Link href="/terms" className="text-brand-primary underline font-black">Điều khoản</Link> và <Link href="/privacy" className="text-brand-primary underline font-black">Chính sách</Link> của công ty. <span className="text-red-500">*</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button 
                        disabled={isLoading}
                        className="w-full py-5 bg-slate-950 hover:bg-brand-primary text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Đăng ký tài khoản
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-slate-600 text-sm font-semibold">
                        Đã có tài khoản?{' '}
                        <Link href="/login" className="text-brand-primary font-black uppercase tracking-widest text-[10px] hover:underline">Đăng nhập ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
