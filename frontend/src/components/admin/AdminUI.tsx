import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, Minus, Plus } from 'lucide-react';

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
    useEffect(() => {
        if (isOpen) {
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
        <div className="fixed inset-0 z-[9999] flex items-end justify-center overflow-hidden p-0 sm:items-center sm:p-4 md:p-6">
            {/* Backdrop - Soft, natural overlay */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity animate-fade-in duration-200" 
                onClick={onClose}
            />
            
            {/* Modal Dialog - Clean, modern, crisp */}
            <div className={`relative bg-white w-full ${sizeClasses[size]} rounded-t-2xl sm:rounded-2xl shadow-xl border border-slate-200/80 flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden animate-reveal-scale duration-300`}>
                {/* Header */}
                <div className="px-6 py-4.5 sm:px-8 sm:py-5 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0 bg-white">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
                        <div className="h-0.5 w-10 bg-brand-primary rounded-full mt-1.5"></div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Đóng"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 sm:px-8 border-t border-slate-100 shrink-0 bg-slate-50/60 flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-2.5 sm:gap-3">
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

export const AdminInput: React.FC<AdminInputProps> = ({ label, icon: Icon, error, type, ...props }) => {
    if (type === 'number') {
        const handleMinus = (e: any) => {
            e.preventDefault();
            const val = Number(props.value || 0);
            if (props.onChange && !props.disabled) {
                // @ts-ignore
                props.onChange({ target: { value: Math.max(0, val - 1) } });
            }
        };
        const handlePlus = (e: any) => {
            e.preventDefault();
            const val = Number(props.value || 0);
            if (props.onChange && !props.disabled) {
                // @ts-ignore
                props.onChange({ target: { value: val + 1 } });
            }
        };
        
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-xs font-semibold text-slate-700 ml-0.5">
                        {label} {props.required && <span className="text-red-500 font-bold">*</span>}
                    </label>
                )}
                <div className={`relative flex items-center bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all ${props.disabled ? 'bg-slate-50 opacity-60 cursor-not-allowed' : ''} ${error ? 'border-red-300 focus-within:border-red-500 focus-within:ring-red-100' : ''}`}>
                    {Icon && (
                        <div className="pl-3.5 text-slate-400 shrink-0 pointer-events-none">
                            <Icon size={16} />
                        </div>
                    )}
                    <button 
                        type="button" 
                        onClick={handleMinus} 
                        disabled={props.disabled} 
                        className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 active:bg-slate-200 rounded-md my-0.5 ml-0.5 transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0"
                        title="Giảm"
                    >
                        <Minus size={15} />
                    </button>
                    <input 
                        {...props}
                        type="number"
                        className="flex-1 w-full min-w-0 py-2 px-2 bg-transparent outline-none text-center font-medium text-sm text-slate-800 placeholder:text-slate-400 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    />
                    <button 
                        type="button" 
                        onClick={handlePlus} 
                        disabled={props.disabled} 
                        className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 active:bg-slate-200 rounded-md my-0.5 mr-0.5 transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0"
                        title="Tăng"
                    >
                        <Plus size={15} />
                    </button>
                </div>
                {error && <p className="text-xs font-medium text-red-500 ml-1">{error}</p>}
            </div>
        );
    }

    return (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-xs font-semibold text-slate-700 ml-0.5">
                    {label} {props.required && <span className="text-red-500 font-bold">*</span>}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors pointer-events-none">
                        <Icon size={16} />
                    </div>
                )}
                <input 
                    {...props}
                    className={`w-full ${Icon ? 'pl-10' : 'px-3.5'} pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''} ${props.className || ''}`} 
                />
            </div>
            {error && <p className="text-xs font-medium text-red-500 ml-1">{error}</p>}
        </div>
    );
};

export const AdminSelect: React.FC<AdminSelectProps> = ({ label, options, icon: Icon, ...props }) => (
    <div className="space-y-1.5">
        {label && (
            <label className="block text-xs font-semibold text-slate-700 ml-0.5">
                {label} {props.required && <span className="text-red-500 font-bold">*</span>}
            </label>
        )}
        <div className="relative group">
            {Icon && (
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors pointer-events-none">
                    <Icon size={16} />
                </div>
            )}
            <select 
                {...props}
                className={`w-full ${Icon ? 'pl-10' : 'px-3.5'} pr-10 py-2.5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all text-sm font-medium text-slate-800 appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${props.className || ''}`}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
                <ChevronDown size={16} />
            </div>
        </div>
    </div>
);

export const AdminTextarea: React.FC<AdminTextareaProps> = ({ label, ...props }) => (
    <div className="space-y-1.5">
        {label && (
            <label className="block text-xs font-semibold text-slate-700 ml-0.5">
                {label} {props.required && <span className="text-red-500 font-bold">*</span>}
            </label>
        )}
        <textarea 
            {...props}
            className={`w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all text-sm font-normal text-slate-800 placeholder:text-slate-400 resize-y min-h-[96px] disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${props.className || ''}`} 
        />
    </div>
);
