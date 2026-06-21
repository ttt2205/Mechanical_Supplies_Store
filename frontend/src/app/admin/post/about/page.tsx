"use client";

import React, { useEffect, useState } from "react";
import {
  Eye,
  FileText,
  Loader2,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  Type,
} from "lucide-react";
import { AdminInput, AdminTextarea } from "@/components/admin/AdminUI";
import type {
  IntroducePageContent,
  IntroduceReason,
  IntroduceTextBlock,
} from "@/types/introduce";

type EditorTab = "hero" | "main" | "reasons" | "contact";

const tabs: { id: EditorTab; label: string; icon: React.ElementType }[] = [
  { id: "hero", label: "Banner", icon: Sparkles },
  { id: "main", label: "Nội dung chính", icon: FileText },
  { id: "reasons", label: "Lý do chọn", icon: ShieldCheck },
  { id: "contact", label: "Liên hệ", icon: Phone },
];

const cardClass =
  "rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:p-8";

export default function AboutManagementPage() {
  const [activeTab, setActiveTab] = useState<EditorTab>("hero");
  const [content, setContent] = useState<IntroducePageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      try {
        const response = await fetch("/api/admin/introduce-content", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Không thể tải nội dung trang giới thiệu.");
        }

        const data = (await response.json()) as IntroducePageContent;
        if (isMounted) {
          setContent(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Không thể tải nội dung trang giới thiệu.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateTextBlock = (
    key: "story" | "vision" | "mission",
    patch: Partial<IntroduceTextBlock>,
  ) => {
    setContent((current) =>
      current
        ? {
            ...current,
            [key]: {
              ...current[key],
              ...patch,
            },
          }
        : current,
    );
  };

  const updateReason = (index: number, patch: Partial<IntroduceReason>) => {
    setContent((current) =>
      current
        ? {
            ...current,
            reasons: current.reasons.map((reason, reasonIndex) =>
              reasonIndex === index ? { ...reason, ...patch } : reason,
            ),
          }
        : current,
    );
  };

  const handleSave = async () => {
    if (!content) return;

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/introduce-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        throw new Error("Không thể lưu nội dung trang giới thiệu.");
      }

      const savedContent = (await response.json()) as IntroducePageContent;
      setContent(savedContent);
      setMessage("Đã lưu vào src/data/introduce-page-content.json.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Không thể lưu nội dung trang giới thiệu.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className={cardClass}>
        <p className="font-bold text-red-500">
          {error || "Không tìm thấy nội dung trang giới thiệu."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 sm:space-y-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-brand-primary">
            Trang giới thiệu
          </p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 sm:text-3xl">
            Cập nhật nội dung giới thiệu công ty
          </h1>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-slate-500 sm:text-base">
            Người dùng chỉ nhập text. Hình ảnh và bố cục hiển thị được giữ cố
            định trong cấu trúc JSON để trang public render chính xác.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <LinkButton />
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-brand-primary px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Lưu nội dung
          </button>
        </div>
      </div>

      {(message || error) && (
        <div
          className={`rounded-2xl border px-5 py-4 text-sm font-bold ${
            error
              ? "border-red-100 bg-red-50 text-red-600"
              : "border-emerald-100 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="space-y-5">
          <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
            <div className="flex min-w-max gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex min-h-11 items-center gap-2 rounded-xl px-4 text-xs font-black uppercase tracking-widest transition-all ${
                      isActive
                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab === "hero" && (
            <section className={cardClass}>
              <SectionTitle
                icon={Type}
                title="Banner đầu trang"
                description="Các text này hiển thị trong banner lớn ở đầu trang giới thiệu."
              />
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <AdminInput
                  label="Tiêu đề chính"
                  value={content.hero.title}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, title: event.target.value },
                    })
                  }
                />
                <AdminInput
                  label="Dòng nhấn mạnh"
                  value={content.hero.highlight}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, highlight: event.target.value },
                    })
                  }
                />
                <div className="md:col-span-2">
                  <AdminTextarea
                    label="Mô tả banner"
                    rows={5}
                    value={content.hero.excerpt}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, excerpt: event.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </section>
          )}

          {activeTab === "main" && (
            <section className={cardClass}>
              <SectionTitle
                icon={MessageSquareText}
                title="Nội dung chính"
                description="Mỗi khung tương ứng với một section cố định trên giao diện public."
              />
              <div className="mt-6 space-y-6">
                <TextBlockEditor
                  title="Khung câu chuyện"
                  value={content.story}
                  onChange={(patch) => updateTextBlock("story", patch)}
                />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <TextBlockEditor
                    title="Khung tầm nhìn"
                    value={content.vision}
                    onChange={(patch) => updateTextBlock("vision", patch)}
                  />
                  <TextBlockEditor
                    title="Khung sứ mệnh"
                    value={content.mission}
                    onChange={(patch) => updateTextBlock("mission", patch)}
                  />
                </div>
                <AdminTextarea
                  label="Caption trên hình ảnh cuối nội dung"
                  rows={3}
                  value={content.showcase.caption}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setContent({
                      ...content,
                      showcase: {
                        ...content.showcase,
                        caption: event.target.value,
                      },
                    })
                  }
                />
              </div>
            </section>
          )}

          {activeTab === "reasons" && (
            <section className={cardClass}>
              <SectionTitle
                icon={ShieldCheck}
                title="Khối lý do chọn Hưng Thịnh"
                description="Các mục này hiển thị thành danh sách lợi ích trên trang giới thiệu."
              />
              <div className="mt-6 space-y-6">
                <AdminInput
                  label="Tiêu đề khối"
                  value={content.reasonsHeading}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setContent({
                      ...content,
                      reasonsHeading: event.target.value,
                    })
                  }
                />
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                  {content.reasons.map((reason, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5"
                    >
                      <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-brand-primary">
                        Lý do {index + 1}
                      </p>
                      <div className="space-y-4">
                        <AdminInput
                          label="Tiêu đề"
                          value={reason.title}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                          ) => updateReason(index, { title: event.target.value })}
                        />
                        <AdminTextarea
                          label="Mô tả"
                          rows={5}
                          value={reason.body}
                          onChange={(
                            event: React.ChangeEvent<HTMLTextAreaElement>,
                          ) => updateReason(index, { body: event.target.value })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === "contact" && (
            <section className={cardClass}>
              <SectionTitle
                icon={Phone}
                title="Khung thông tin liên hệ"
                description="Các text này hiển thị trong sidebar liên hệ của trang giới thiệu."
              />
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <AdminInput
                  label="Tiêu đề khung"
                  value={content.contact.heading}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setContent({
                      ...content,
                      contact: {
                        ...content.contact,
                        heading: event.target.value,
                      },
                    })
                  }
                />
                <AdminInput
                  label="Nút kêu gọi hành động"
                  value={content.contact.cta}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, cta: event.target.value },
                    })
                  }
                />
                <ContactField
                  icon={MapPin}
                  label="Địa chỉ"
                  value={content.contact.address}
                  onChange={(value) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, address: value },
                    })
                  }
                />
                <ContactField
                  icon={Phone}
                  label="Hotline"
                  value={content.contact.hotline}
                  onChange={(value) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, hotline: value },
                    })
                  }
                />
                <ContactField
                  icon={Mail}
                  label="Email"
                  value={content.contact.email}
                  onChange={(value) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, email: value },
                    })
                  }
                />
                <ContactField
                  icon={MessageSquareText}
                  label="Giờ làm việc"
                  value={content.contact.hours}
                  onChange={(value) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, hours: value },
                    })
                  }
                />
              </div>
            </section>
          )}
      </div>
    </div>
  );
}

function LinkButton() {
  return (
    <a
      href="/about"
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-700 transition-all hover:border-brand-primary hover:text-brand-primary"
    >
      <Eye size={18} />
      Xem trang
    </a>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-white">
        <Icon size={22} />
      </div>
      <div>
        <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function TextBlockEditor({
  title,
  value,
  onChange,
}: {
  title: string;
  value: IntroduceTextBlock;
  onChange: (patch: Partial<IntroduceTextBlock>) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
      <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-brand-primary">
        {title}
      </p>
      <div className="space-y-4">
        <AdminInput
          label="Tiêu đề"
          value={value.heading}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ heading: event.target.value })
          }
        />
        <AdminTextarea
          label="Nội dung"
          rows={7}
          value={value.body}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
            onChange({ body: event.target.value })
          }
        />
      </div>
    </div>
  );
}

function ContactField({
  icon,
  label,
  value,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <AdminInput
      label={label}
      icon={icon}
      value={value}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        onChange(event.target.value)
      }
    />
  );
}
