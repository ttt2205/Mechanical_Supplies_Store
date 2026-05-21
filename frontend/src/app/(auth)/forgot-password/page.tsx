'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    Mail, 
    ArrowRight, 
    Loader2,
    CheckCircle2,
    ShieldQuestion,
    User,
    KeyRound,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type ResetStep = 'IDENTIFY' | 'VERIFY' | 'RESET' | 'SUCCESS';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<ResetStep>('IDENTIFY');
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleIdentify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate checking username and sending OTP
        setTimeout(() => {
            setIsLoading(false);
            setStep('VERIFY');
        }, 1500);
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate OTP verification
        setTimeout(() => {
            setIsLoading(false);
            setStep('RESET');
        }, 1500);
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate password update
        setTimeout(() => {
            setIsLoading(false);
            setStep('SUCCESS');
            setTimeout(() => router.push('/login'), 3000);
        }, 1500);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'IDENTIFY':
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-primary">
                                <User size={32} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight mb-2">Quên mật khẩu?</h1>
                            <p className="text-slate-600 text-sm font-semibold leading-relaxed px-4">Nhập tên đăng nhập của bạn để nhận mã xác thực OTP.</p>
                        </div>

                        <form onSubmit={handleIdentify} className="space-y-6">
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
                            <button 
                                disabled={isLoading}
                                className="w-full py-5 bg-slate-950 hover:bg-brand-primary text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-4 group disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>Nhận mã xác thực <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </form>
                    </div>
                );

            case 'VERIFY':
                return (
                    <div className="space-y-8 text-center">
                        <div>
                            <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-accent">
                                <KeyRound size={32} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight mb-2">Xác thực OTP</h1>
                            <p className="text-slate-600 text-sm font-semibold leading-relaxed">Mã OTP đã được gửi đến số điện thoại/Email liên kết với tài khoản <span className="text-brand-primary font-black">@{username}</span></p>
                        </div>

                        <form onSubmit={handleVerify} className="space-y-8">
                            <div className="flex justify-center gap-3">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        id={`otp-${idx}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                                        className="w-12 h-14 text-center text-xl font-black bg-white border-2 border-slate-200 rounded-xl focus:border-brand-primary outline-none text-slate-950"
                                    />
                                ))}
                            </div>
                            
                            <div className="space-y-4">
                                <button 
                                    disabled={isLoading || otp.some(d => !d)}
                                    className="w-full py-5 bg-slate-950 hover:bg-brand-primary text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-4 group disabled:opacity-70"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Xác nhận mã OTP"}
                                </button>
                                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary transition-colors">Gửi lại mã (59s)</button>
                            </div>
                        </form>
                    </div>
                );

            case 'RESET':
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-500">
                                <Lock size={32} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight mb-2">Mật khẩu mới</h1>
                            <p className="text-slate-600 text-sm font-semibold leading-relaxed">Thiết lập mật khẩu mới cho tài khoản của bạn.</p>
                        </div>

                        <form onSubmit={handleReset} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-4">Mật khẩu mới</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
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
                            <button 
                                disabled={isLoading}
                                className="w-full py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-4 group"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Cập nhật mật khẩu"}
                            </button>
                        </form>
                    </div>
                );

            case 'SUCCESS':
                return (
                    <div className="text-center space-y-6 py-4">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 mb-4 animate-bounce-subtle">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight">Thành công!</h2>
                        <p className="text-slate-600 font-semibold leading-relaxed">Mật khẩu của bạn đã được thay đổi thành công. Đang chuyển hướng về trang đăng nhập...</p>
                        <div className="pt-4">
                            <Loader2 className="animate-spin mx-auto text-green-500" size={24} />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="w-full sm:max-w-md animate-fade-in min-h-screen sm:min-h-0 flex flex-col justify-center">
            <div className="bg-slate-50 sm:rounded-[40px] sm:shadow-2xl sm:shadow-black/20 sm:border border-white/20 p-8 md:p-12 overflow-hidden relative flex-grow sm:flex-grow-0">
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary to-brand-accent"></div>
                
                {/* Step Back Button */}
                {step !== 'IDENTIFY' && step !== 'SUCCESS' && (
                    <button 
                        onClick={() => setStep(step === 'VERIFY' ? 'IDENTIFY' : 'VERIFY')}
                        className="absolute left-6 top-8 text-slate-400 hover:text-brand-primary transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
                    >
                        <ArrowLeft size={14} /> Quay lại
                    </button>
                )}

                {renderStep()}

                {step === 'IDENTIFY' && (
                    <div className="mt-10 text-center">
                        <Link href="/login" className="text-brand-primary font-black uppercase tracking-widest text-[10px] hover:underline flex items-center justify-center gap-2">
                            <ArrowLeft size={12} /> Quay lại đăng nhập
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
