"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  CheckCircle2,
  Eye,
  FileText,
  Image as ImageIcon,
  Loader2,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  RotateCw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Type,
  Upload,
} from "lucide-react";
import { AdminInput, AdminTextarea } from "@/components/admin/AdminUI";
import type {
  IntroducePageContent,
  IntroduceReason,
  IntroduceTextBlock,
} from "@/types/introduce";

type EditorTab = "hero" | "main" | "images" | "reasons" | "contact";

const tabs: { id: EditorTab; label: string; icon: React.ElementType }[] = [
  { id: "hero", label: "Banner", icon: Sparkles },
  { id: "main", label: "Nội dung chính", icon: FileText },
  { id: "images", label: "Quản lý hình ảnh", icon: ImageIcon },
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadContent = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/introduce-content", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Không thể tải nội dung trang giới thiệu.");
      }

      const data = (await response.json()) as IntroducePageContent;
      setContent(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Không thể tải nội dung trang giới thiệu.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleReload = async () => {
    setIsRefreshing(true);
    setMessage("");
    setError("");
    try {
      await loadContent();
    } finally {
      setIsRefreshing(false);
    }
  };

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

  const handleSaveImmediate = async (newContent: IntroducePageContent) => {
    try {
      await fetch("/api/admin/introduce-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContent),
      });
      setMessage("Đã cập nhật và lưu thay đổi thành công.");
    } catch {
      // silent
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            QUẢN LÝ TRANG GIỚI THIỆU
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Cập nhật nội dung, số liệu thống kê và đổi hình ảnh hiển thị trên trang Giới thiệu công ty
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleReload}
            disabled={isLoading || isRefreshing || isSaving}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            title="Tải lại nội dung"
          >
            <RotateCw
              size={15}
              className={`text-slate-600 ${isLoading || isRefreshing ? "animate-spin text-brand-primary" : ""}`}
            />
            <span>{isLoading || isRefreshing ? "Đang tải..." : "Tải lại"}</span>
          </button>
          <LinkButton />
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-brand-primary px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
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
                <div className="md:col-span-2">
                  <ImageFieldUploader
                    label="Ảnh nền Banner (Hero Background)"
                    description="Ảnh lớn hiển thị trên cùng của trang Giới thiệu, tạo ấn tượng đầu tiên cho khách hàng."
                    value={content.hero.thumbnail}
                    onChange={(url) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, thumbnail: url },
                      })
                    }
                    aspectRatio="banner"
                    recommendation="Kích thước khuyến nghị: 1920x1080px (16:9), dung lượng < 5MB"
                  />
                </div>
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
                
                <div className="md:col-span-2 mt-4">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">Các con số thống kê</h3>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {(content.hero.stats || [{ number: "", label: "" }, { number: "", label: "" }, { number: "", label: "" }]).slice(0, 3).map((stat, idx) => (
                      <div key={idx} className="space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <AdminInput
                          label={`Số liệu ${idx + 1}`}
                          value={stat.number || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newStats = [...(content.hero.stats || [{ number: "", label: "" }, { number: "", label: "" }, { number: "", label: "" }])];
                            newStats[idx] = { ...newStats[idx], number: e.target.value };
                            setContent({
                              ...content,
                              hero: { ...content.hero, stats: newStats as { number: string; label: string }[] },
                            });
                          }}
                        />
                        <AdminInput
                          label={`Nhãn ${idx + 1}`}
                          value={stat.label || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newStats = [...(content.hero.stats || [{ number: "", label: "" }, { number: "", label: "" }, { number: "", label: "" }])];
                            newStats[idx] = { ...newStats[idx], label: e.target.value };
                            setContent({
                              ...content,
                              hero: { ...content.hero, stats: newStats as { number: string; label: string }[] },
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
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
                <AdminTextarea
                  label="Trích dẫn (Quote)"
                  rows={3}
                  value={content.quote || ""}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setContent({
                      ...content,
                      quote: event.target.value,
                    })
                  }
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
                <div className="mt-8 border-t border-slate-100 pt-6 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Hình ảnh câu chuyện thương hiệu (Showcase Image)</h3>
                    <p className="text-xs text-slate-500 mt-1">Hình ảnh thực tế hiển thị cạnh câu chuyện doanh nghiệp và trích dẫn người sáng lập.</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <ImageFieldUploader
                      label="Ảnh minh họa câu chuyện"
                      value={content.showcase.image}
                      onChange={(url) =>
                        setContent({
                          ...content,
                          showcase: { ...content.showcase, image: url },
                        })
                      }
                      aspectRatio="showcase"
                      recommendation="Kích thước khuyến nghị: 800x1000px (4:5) hoặc 1200x800px"
                    />
                    <div className="space-y-4">
                      <AdminInput
                        label="Văn bản thay thế (Alt text)"
                        value={content.showcase.alt || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setContent({
                            ...content,
                            showcase: { ...content.showcase, alt: e.target.value },
                          })
                        }
                      />
                      <AdminTextarea
                        label="Chú thích trên hình ảnh (Caption)"
                        rows={4}
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
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "images" && (
            <section className={cardClass}>
              <SectionTitle
                icon={ImageIcon}
                title="Quản lý hình ảnh trang Giới thiệu"
                description="Tải ảnh mới từ máy tính hoặc cập nhật đường dẫn cho các vị trí hình ảnh trên trang Giới thiệu. Ảnh tải lên được lưu trực tiếp vào thư mục public của website."
              />
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
                      1
                    </span>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                      Ảnh nền Banner đầu trang (Hero Background)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Hiển thị ở khu vực trên cùng của trang Giới thiệu với các dòng chữ tiêu đề và dãy số liệu thống kê.
                  </p>
                  <ImageFieldUploader
                    label="Ảnh nền Banner đầu trang"
                    value={content.hero.thumbnail}
                    onChange={(url) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, thumbnail: url },
                      })
                    }
                    aspectRatio="banner"
                    recommendation="Kích thước khuyến nghị: 1920x1080px (tỉ lệ 16:9), dung lượng < 5MB"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
                      2
                    </span>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                      Ảnh câu chuyện thương hiệu (Showcase Image)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Hiển thị bên cạnh bài viết Câu chuyện của chúng tôi và câu trích dẫn của người sáng lập.
                  </p>
                  <ImageFieldUploader
                    label="Ảnh câu chuyện thương hiệu"
                    value={content.showcase.image}
                    onChange={(url) =>
                      setContent({
                        ...content,
                        showcase: { ...content.showcase, image: url },
                      })
                    }
                    aspectRatio="showcase"
                    recommendation="Kích thước khuyến nghị: 800x1000px (tỉ lệ 4:5) hoặc 1200x800px"
                  />
                  <div className="mt-4 space-y-4">
                    <AdminInput
                      label="Văn bản thay thế (Alt text)"
                      value={content.showcase.alt || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setContent({
                          ...content,
                          showcase: { ...content.showcase, alt: e.target.value },
                        })
                      }
                    />
                    <AdminTextarea
                      label="Chú thích trên ảnh (Caption)"
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
                </div>
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


function ImageFieldUploader({
  label,
  description,
  value,
  onChange,
  aspectRatio = "banner",
  recommendation = "Kích thước khuyến nghị: 1920x1080px (hoặc tỉ lệ 16:9), dung lượng < 5MB",
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: "banner" | "showcase";
  recommendation?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Vui lòng chọn file hình ảnh (JPG, PNG, WEBP, GIF)");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (value) {
        formData.append("oldUrl", value);
      }

      const res = await fetch("/api/admin/introduce-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Tải ảnh thất bại. Vui lòng thử lại.");
      }

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else {
        throw new Error(data.error || "Không nhận được đường dẫn ảnh từ server.");
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Lỗi khi tải ảnh.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <ImageIcon size={15} className="text-brand-primary" />
            {label}
          </label>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
        {value && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            <CheckCircle2 size={12} />
            Đã có ảnh
          </span>
        )}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-all ${
          isDragOver
            ? "border-brand-primary bg-blue-50/50"
            : "border-slate-200 bg-white hover:border-slate-300"
        } ${aspectRatio === "banner" ? "aspect-[21/9] sm:aspect-[16/7]" : "aspect-[4/3] sm:aspect-[16/10]"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {value ? (
          <div className="group relative h-full w-full">
            <img
              src={value}
              alt={label}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-slate-900/60 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-900 shadow-lg hover:bg-slate-100 transition-transform hover:scale-105"
              >
                <Upload size={14} className="text-brand-primary" />
                Đổi ảnh mới
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={isUploading}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-black uppercase tracking-wider text-white shadow-lg hover:bg-red-700 transition-transform hover:scale-105"
                title="Xóa ảnh"
              >
                <Trash2 size={14} />
                Xóa
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-6 text-center"
          >
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 group-hover:text-brand-primary transition-colors">
              <Upload size={24} />
            </div>
            <p className="text-sm font-bold text-slate-700">
              Kéo thả ảnh vào đây, hoặc{" "}
              <span className="text-brand-primary underline">click để chọn file</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">{recommendation}</p>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/90 backdrop-blur-xs z-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            <p className="text-xs font-bold text-slate-700">
              Đang tải ảnh lên thư mục public...
            </p>
          </div>
        )}
      </div>

      {uploadError && (
        <p className="text-xs font-bold text-red-600">{uploadError}</p>
      )}

      <div className="flex items-center gap-2 pt-1">
        <div className="relative flex-1">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Hoặc dán đường dẫn ảnh URL (https://... hoặc /images/...)"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 text-[11px] font-bold text-slate-600 hover:border-brand-primary hover:text-brand-primary transition-colors"
            title="Mở ảnh gốc trong tab mới"
          >
            <Eye size={13} />
            Xem
          </a>
        )}
      </div>
    </div>
  );
}
