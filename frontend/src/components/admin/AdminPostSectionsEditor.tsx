"use client";

import React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Layers, FileText, Type } from 'lucide-react';
import { AdminRichText } from '@/components/admin/AdminRichText';

export interface FormSection {
    id?: number | string;
    heading: string;
    content: string;
    order?: number;
}

interface AdminPostSectionsEditorProps {
    sections: FormSection[];
    onChange: (sections: FormSection[]) => void;
}

export function AdminPostSectionsEditor({ sections, onChange }: AdminPostSectionsEditorProps) {
    const handleAddSection = () => {
        const nextOrder = sections.length + 1;
        const newSection: FormSection = {
            heading: `${nextOrder}. `,
            content: '',
            order: nextOrder
        };
        onChange([...sections, newSection]);
    };

    const handleRemoveSection = (index: number) => {
        const section = sections[index];
        if (section.heading?.trim() || section.content?.trim()) {
            if (!confirm(`Bạn có chắc chắn muốn xóa đoạn mục "${section.heading || `Mục #${index + 1}`}" không?`)) {
                return;
            }
        }
        const updated = sections.filter((_, i) => i !== index).map((s, i) => ({
            ...s,
            order: i + 1
        }));
        onChange(updated);
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const updated = [...sections];
        const temp = updated[index];
        updated[index] = updated[index - 1];
        updated[index - 1] = temp;
        onChange(updated.map((s, i) => ({ ...s, order: i + 1 })));
    };

    const handleMoveDown = (index: number) => {
        if (index === sections.length - 1) return;
        const updated = [...sections];
        const temp = updated[index];
        updated[index] = updated[index + 1];
        updated[index + 1] = temp;
        onChange(updated.map((s, i) => ({ ...s, order: i + 1 })));
    };

    const handleHeadingChange = (index: number, heading: string) => {
        const updated = [...sections];
        updated[index] = { ...updated[index], heading };
        onChange(updated);
    };

    const handleContentChange = (index: number, content: string) => {
        const updated = [...sections];
        updated[index] = { ...updated[index], content };
        onChange(updated);
    };

    return (
        <div className="space-y-6">
            {/* Header toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <Layers size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                                Các đoạn mục nội dung (Sections)
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-200 text-slate-700">
                                {sections.length} mục
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                            Phân chia bài viết thành các đề mục rõ ràng kèm nội dung định dạng phong phú.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleAddSection}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-brand-primary transition-all shadow-md shrink-0"
                >
                    <Plus size={16} /> Thêm đoạn mục
                </button>
            </div>

            {/* Empty state */}
            {sections.length === 0 ? (
                <div className="text-center py-16 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 p-8">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-sm">
                        <FileText size={28} />
                    </div>
                    <h5 className="text-sm font-bold text-slate-700 mb-1">Chưa có đoạn mục nào</h5>
                    <p className="text-xs text-slate-400 mb-5 max-w-sm mx-auto">
                        Bài viết cần ít nhất 1 đoạn mục để thể hiện nội dung chi tiết. Nhấp bên dưới để thêm.
                    </p>
                    <button
                        type="button"
                        onClick={handleAddSection}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-brand-primary/20 hover:bg-blue-800 transition-all"
                    >
                        <Plus size={16} /> Thêm đoạn mục đầu tiên
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <div
                            key={section.id || index}
                            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            {/* Section Card Header */}
                            <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <span className="px-2.5 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                                        Mục #{index + 1}
                                    </span>
                                    <span className="text-xs font-bold text-slate-600 truncate max-w-xs sm:max-w-md">
                                        {section.heading || '(Chưa đặt tiêu đề)'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        title="Chuyển lên trên"
                                        disabled={index === 0}
                                        onClick={() => handleMoveUp(index)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                    >
                                        <ChevronUp size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        title="Chuyển xuống dưới"
                                        disabled={index === sections.length - 1}
                                        onClick={() => handleMoveDown(index)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                    >
                                        <ChevronDown size={16} />
                                    </button>
                                    <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                                    <button
                                        type="button"
                                        title="Xóa đoạn mục này"
                                        onClick={() => handleRemoveSection(index)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Section Card Body */}
                            <div className="p-5 sm:p-6 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 flex items-center gap-1.5">
                                        <Type size={12} className="text-brand-primary" />
                                        Tiêu đề đoạn mục <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={section.heading}
                                        onChange={(e) => handleHeadingChange(index, e.target.value)}
                                        placeholder="Ví dụ: 1. Giới thiệu tổng quan & Nguyên lý hoạt động..."
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 shadow-sm rounded-xl focus:bg-white focus:border-brand-primary outline-none transition-all font-medium text-sm text-slate-700 placeholder:text-slate-400"
                                    />
                                </div>

                                <AdminRichText
                                    label="Nội dung đoạn mục"
                                    value={section.content}
                                    onChange={(val) => handleContentChange(index, val)}
                                    placeholder="Soạn thảo nội dung cho mục này bằng các công cụ văn bản phong phú (in đậm, nghiêng, danh sách, ảnh, link...)"
                                    minHeight="180px"
                                    required
                                />
                            </div>
                        </div>
                    ))}

                    {/* Quick Add Section Button */}
                    <button
                        type="button"
                        onClick={handleAddSection}
                        className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-primary hover:bg-brand-primary/5 text-slate-500 hover:text-brand-primary font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Thêm đoạn mục tiếp theo
                    </button>
                </div>
            )}
        </div>
    );
}
