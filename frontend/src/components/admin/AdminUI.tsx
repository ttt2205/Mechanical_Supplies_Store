import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Settings } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const AdminModal: React.FC<ModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    footer,
    size = 'md' 
}) => {

    useEffect(() => {        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-[95vw]'
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center overflow-hidden p-0 sm:items-center sm:p-6">
            {/* Backdrop - High Contrast & Blur */}
            <div 
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-md animate-fade-in duration-300" 
                onClick={onClose}
            ></div>
            
            {/* Modal Content - 'Pop-out' Effect */}
            <div className={`relative bg-white w-full ${sizeClasses[size]} rounded-t-[28px] sm:rounded-[40px] lg:rounded-[48px] shadow-[0_30px_100px_-10px_rgba(0,0,0,0.5)] border border-white/20 flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden animate-reveal-scale duration-500`}>
                {/* Header */}
                <div className="px-5 py-5 sm:px-8 sm:py-7 lg:px-12 lg:py-10 border-b border-slate-50 flex items-center justify-between gap-4 shrink-0 bg-slate-50/80 backdrop-blur-xl">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">{title}</h3>
                        <div className="h-1 w-12 bg-brand-primary rounded-full mt-2"></div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="flex h-11 w-11 shrink-0 items-center justify-center bg-white text-slate-400 hover:text-red-500 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100"
                        aria-label="Đóng"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-8 lg:p-10">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-5 py-4 sm:px-8 lg:px-10 lg:py-6 border-t border-slate-50 shrink-0 bg-slate-50/30 flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

type AdminIcon = React.ElementType<{ size?: number; className?: string }>;

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: AdminIcon;
    error?: string;
}

interface AdminSelectOption {
    value: string | number;
    label: string;
}

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: AdminSelectOption[];
    icon?: AdminIcon;
}

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export const AdminInput: React.FC<AdminInputProps> = ({ label, icon: Icon, error, ...props }) => (
    <div className="space-y-2">
        {label && (
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-[0.16em] sm:tracking-[0.2em] text-slate-700 ml-2 sm:ml-4 flex items-center gap-2">
                {label} {props.required && <span className="text-red-500">*</span>}
            </label>
        )}
        <div className="relative group">
            {Icon && (
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                    <Icon size={18} />
                </div>
            )}
            <input 
                {...props}
                className={`w-full ${Icon ? 'pl-14' : 'px-5 sm:px-8'} pr-5 sm:pr-6 py-3.5 sm:py-4 bg-slate-50 border-2 border-slate-200 shadow-sm rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-base text-slate-900 placeholder:text-slate-400 ${error ? 'border-red-200 focus:border-red-500' : ''}`} 
            />
        </div>
        {error && <p className="text-[10px] font-bold text-red-500 ml-4 italic">{error}</p>}
    </div>
);

export const AdminSelect: React.FC<AdminSelectProps> = ({ label, options, icon: Icon, ...props }) => (
    <div className="space-y-2">
        {label && (
            <label className="text-[10px] sm:text-xs font-black uppercase tracking-[0.16em] sm:tracking-[0.2em] text-slate-700 ml-2 sm:ml-4 flex items-center gap-2">
                {label} {props.required && <span className="text-red-500">*</span>}
            </label>
        )}
        <div className="relative group">
            {Icon && (
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors pointer-events-none">
                    <Icon size={18} />
                </div>
            )}
            <select 
                {...props}
                className={`w-full ${Icon ? 'pl-14' : 'px-5 sm:px-8'} pr-12 py-3.5 sm:py-4 bg-slate-50 border-2 border-slate-200 shadow-sm rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-base text-slate-900 appearance-none cursor-pointer`}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Settings size={14} className="rotate-90" />
            </div>
        </div>
    </div>
);

export const AdminTextarea: React.FC<AdminTextareaProps> = ({ label, ...props }) => (
    <div className="space-y-2">
        {label && (
            <label className="text-[10px] sm:text-xs font-black uppercase tracking-[0.16em] sm:tracking-[0.2em] text-slate-700 ml-2 sm:ml-4 flex items-center gap-2">
                {label} {props.required && <span className="text-red-500">*</span>}
            </label>
        )}
        <textarea 
            {...props}
            className="w-full px-5 py-4 sm:px-8 sm:py-5 bg-slate-50 border-2 border-slate-200 shadow-sm rounded-2xl sm:rounded-3xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-base text-slate-900 placeholder:text-slate-400 resize-none" 
        />
    </div>
);



