import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Trash2, Image as ImageIcon, Plus, Info, Settings, AlertCircle } from 'lucide-react';

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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-[95vw]'
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Backdrop - High Contrast & Blur */}
            <div 
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-md animate-fade-in duration-300" 
                onClick={onClose}
            ></div>
            
            {/* Modal Content - 'Pop-out' Effect */}
            <div className={`relative bg-white w-full ${sizeClasses[size]} rounded-[48px] shadow-[0_30px_100px_-10px_rgba(0,0,0,0.5)] border border-white/20 flex flex-col max-h-[90vh] overflow-hidden animate-reveal-scale duration-500`}>
                {/* Header */}
                <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between shrink-0 bg-slate-50/80 backdrop-blur-xl">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{title}</h3>
                        <div className="h-1 w-12 bg-brand-primary rounded-full mt-2"></div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-10 py-6 border-t border-slate-50 shrink-0 bg-slate-50/30 flex justify-end items-center gap-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export const AdminInput: React.FC<any> = ({ label, icon: Icon, error, ...props }) => (
    <div className="space-y-2">
        {label && (
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                {label} {props.required && <span className="text-red-500">*</span>}
            </label>
        )}
        <div className="relative group">
            {Icon && (
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors">
                    <Icon size={18} />
                </div>
            )}
            <input 
                {...props}
                className={`w-full ${Icon ? 'pl-14' : 'px-8'} pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 ${error ? 'border-red-200 focus:border-red-500' : ''}`} 
            />
        </div>
        {error && <p className="text-[10px] font-bold text-red-500 ml-4 italic">{error}</p>}
    </div>
);

export const AdminSelect: React.FC<any> = ({ label, options, icon: Icon, ...props }) => (
    <div className="space-y-2">
        {label && (
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-4">
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
                className={`w-full ${Icon ? 'pl-14' : 'px-8'} pr-12 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer`}
            >
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Settings size={14} className="rotate-90" />
            </div>
        </div>
    </div>
);

export const AdminTextarea: React.FC<any> = ({ label, ...props }) => (
    <div className="space-y-2">
        {label && (
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-4">
                {label} {props.required && <span className="text-red-500">*</span>}
            </label>
        )}
        <textarea 
            {...props}
            className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-3xl focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 resize-none" 
        />
    </div>
);
