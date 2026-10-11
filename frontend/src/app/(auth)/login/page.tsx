'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { 
    User, 
    Lock, 
    Eye, 
    EyeOff, 
    ArrowRight, 
    Loader2,
    AlertCircle,
    ShieldAlert
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const { login } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();

    const errorParam = searchParams.get('error');
    let warningMessage = '';
    if (errorParam === 'unauthorized') {
        warningMessage = 'Tài khoản của bạn không có quyền truy cập trang quản trị. Vui lòng đăng nhập bằng tài khoản Quản trị viên.';
    } else if (errorParam === 'unauthenticated') {
        warningMessage = 'Vui lòng đăng nhập để truy cập trang quản trị.';
    } else if (errorParam === 'expired') {
        warningMessage = 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.';
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        
        try {
            const res = await fetchApi<any>('/Authentication/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password })
            });
            
            if (res && res.accessToken) {
                const roleCode = res.user?.roleCode || 'ADMIN';
                const isCustomer = roleCode.toUpperCase() === 'CUSTOMER';

                login({
                    account_id: res.user?.id?.toString() || '1',
                    username: res.user?.username || username.trim(),
                    email: res.user?.email || username.trim(),
                    role_id: roleCode,
                    roleCode: roleCode,
                    roleId: res.user?.roleId,
                    status: res.user?.status || 'active'
                }, res.permissions || ['admin'], { accessToken: res.accessToken, refreshToken: res.refreshToken });
                
                const redirect = searchParams.get('redirect');
                
                let targetUrl = '/';
                if (!isCustomer) {
                    targetUrl = '/admin/dashboard';
                }

                if (redirect?.startsWith('/') && !redirect.startsWith('//')) {
                    if (redirect.startsWith('/admin') && isCustomer) {
                        setErrorMessage('Tài khoản này là Khách hàng, không có quyền truy cập vào trang quản trị.');
                        setIsLoading(false);
                        return;
                    }
                    targetUrl = redirect;
                }
                
                router.push(targetUrl);
            } else {
                setErrorMessage('Tên đăng nhập hoặc mật khẩu không chính xác.');
            }
        } catch (error: any) {
            console.error('Login error', error);
            setErrorMessage(error?.response?.data?.message || error?.message || 'Đăng nhập không thành công. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full sm:max-w-md animate-fade-in min-h-screen sm:min-h-0 flex flex-col justify-center">
            <div className="bg-slate-50 sm:rounded-[40px] sm:shadow-2xl sm:shadow-black/20 sm:border border-white/20 p-6 md:p-12 overflow-hidden relative flex-grow sm:flex-grow-0">
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary to-brand-accent"></div>
                
                <div className="text-center mb-8 mt-16 sm:mt-0">
                    <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight mb-2">Đăng nhập</h1>
                    <p className="text-slate-600 text-sm font-semibold">Chào mừng bạn quay trở lại với Hưng Thịnh</p>
                </div>

                {/* Warning / Error Banner */}
                {(errorMessage || warningMessage) && (
                    <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 text-xs font-bold ${
                        errorMessage 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                        {errorMessage ? (
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                        ) : (
                            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                        )}
                        <span className="leading-relaxed">{errorMessage || warningMessage}</span>
                    </div>
                )}

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
                                placeholder="username"
                                className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-slate-950 placeholder:text-slate-400" 
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-4">Mật khẩu</label>
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
                                <span>Đăng nhập ngay</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
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
