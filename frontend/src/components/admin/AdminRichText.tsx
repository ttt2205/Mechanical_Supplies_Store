"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamic import with SSR false is required for React Quill in Next.js
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface AdminRichTextProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    minHeight?: string;
}

export function AdminRichText({ 
    label, 
    value, 
    onChange, 
    placeholder = "Nhập nội dung...", 
    required = false,
    minHeight = "180px"
}: AdminRichTextProps) {
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    }), []);

    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="bg-white rounded-xl border border-slate-200 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all overflow-hidden shadow-sm">
                <ReactQuill 
                    theme="snow"
                    value={value || ''}
                    onChange={onChange}
                    modules={modules}
                    placeholder={placeholder}
                    style={{ minHeight }}
                />
            </div>
            {/* Quick override for Quill border styles to match our admin theme */}
            <style jsx global>{`
                .ql-toolbar.ql-snow {
                    border: none !important;
                    border-bottom: 1px solid #e2e8f0 !important;
                    background-color: #f8fafc;
                    padding: 8px 12px !important;
                }
                .ql-container.ql-snow {
                    border: none !important;
                    font-size: 14px;
                }
                .ql-editor {
                    min-height: ${minHeight};
                    font-family: inherit;
                    color: #1e293b;
                }
                .ql-editor.ql-blank::before {
                    color: #94a3b8;
                    font-style: normal;
                }
            `}</style>
        </div>
    );
}
