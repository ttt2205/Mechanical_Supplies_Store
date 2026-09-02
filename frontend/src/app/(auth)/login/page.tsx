'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { 
    User, 
    Lock, 
    Eye, 
    EyeOff, 
    ArrowRight, 
    Globe, 
    MessageCircle,
    Loader2
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const { login } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            login({
                account_id: '1',
                username: username || 'admin',
                email: 'admin@mechanical.com',
                role_id: 'admin', // Changed to admin for testing
                status: 'active'
            });
            setIsLoading(false);
            const redirect = searchParams.get('redirect');
            const safeRedirect = redirect?.startsWith('/') && !redirect.startsWith('//') ? redirect : '/';
            router.push(safeRedirect);
        }, 1500);
    };

    return (
        <div className="w-full sm:max-w-md animate-fade-in min-h-screen sm:min-h-0 flex flex-col justify-center">
            <div className="bg-slate-50 sm:rounded-[40px] sm:shadow-2xl sm:shadow-black/20 sm:border border-white/20 p-6 md:p-12 overflow-hidden relative flex-grow sm:flex-grow-0">
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary to-brand-accent"></div>
                
                <div className="text-center mb-10 mt-20 sm:mt-0">
                    <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight mb-2">Đăng nhập</h1>
                    <p className="text-slate-600 text-sm font-semibold">Chào mừng bạn quay trở lại với Hưng Thịnh</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-4">Tên đăng nhập</label>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                                <User size={18} />
                            </div>
                            <input 
                                type="text" 
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="hungthinh_user"
                                className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-slate-950 placeholder:text-slate-400" 
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Mật khẩu</label>
                            <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline">Quên mật khẩu?</Link>                        </div>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                                <Lock size={18} />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-14 pr-14 py-5 bg-white border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-slate-950 placeholder:text-slate-400" 
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

                    {/* Submit Button */}
                    <button 
                        disabled={isLoading}
                        className="w-full py-5 bg-slate-950 hover:bg-brand-primary text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Đăng nhập ngay
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Social Login */}
                <div className="mt-10">
                    <div className="relative flex items-center justify-center mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <span className="relative px-4 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Hoặc tiếp tục với</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all font-bold text-slate-700 text-sm">
                            <Globe size={18} className="text-red-600" />
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all font-bold text-slate-700 text-sm">
                            <MessageCircle size={18} className="text-blue-700" />
                            Facebook
                        </button>
                    </div>
                </div>

                <div className="mt-10 text-center mb-6 sm:mb-0">
                    <p className="text-slate-600 text-sm font-semibold">
                        Chưa có tài khoản?{' '}
                        <Link href="/register" className="text-brand-primary font-black uppercase tracking-widest text-[10px] hover:underline">Đăng ký ngay</Link>
                    </p>
                </div>
            </div>
            
            <p className="text-center mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-loose px-8 pb-10 sm:pb-0">
                Bằng cách đăng nhập, bạn đồng ý với <Link href="/terms" className="text-slate-300 underline">Điều khoản dịch vụ</Link> và <Link href="/privacy" className="text-slate-300 underline">Chính sách bảo mật</Link> của chúng tôi.
            </p>
        </div>
    );
}
export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}
