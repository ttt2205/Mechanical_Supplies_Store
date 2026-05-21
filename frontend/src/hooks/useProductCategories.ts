import { useState, useEffect } from "react";
import { Category } from "@/types/category";

const MOCK_CATEGORIES: Category[] = [
  {
    category_id: 1,
    parent_id: null,
    name: "Vật tư tiêu hao",
    slug: "vat-tu-tieu-hao",
    description: "Các loại vật tư tiêu hao trong công nghiệp như bu lông, que hàn...",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    level: 1,
    display_order: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 2,
    parent_id: null,
    name: "Thiết bị truyền động",
    slug: "thiet-bi-truyen-dong",
    description: "Vòng bi, dây curoa, xích tải và các linh kiện truyền động khác.",
    image: "https://images.unsplash.com/photo-1590959651373-a3db0f38a961?q=80&w=400&auto=format&fit=crop",
    level: 1,
    display_order: 2,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 3,
    parent_id: null,
    name: "Kim loại & Ống",
    slug: "kim-loai-va-ong",
    description: "Ống thép, inox, thép hình và các loại vật liệu kim loại.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    level: 1,
    display_order: 3,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 4,
    parent_id: null,
    name: "Dụng cụ & Máy móc",
    slug: "dung-cu-va-may-moc",
    description: "Dụng cụ cầm tay, máy hàn, máy mài và thiết bị thi công.",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=400&auto=format&fit=crop",
    level: 1,
    display_order: 4,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 5,
    parent_id: null,
    name: "Bảo hộ lao động",
    slug: "bao-ho-lao-dong",
    description: "Quần áo, găng tay, giày và các thiết bị bảo vệ cá nhân.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    level: 1,
    display_order: 5,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Level 2 Subcategories
  {
    category_id: 101,
    parent_id: 1,
    name: "Bu lông & Đai ốc",
    slug: "bu-long-va-dai-oc",
    level: 2,
    display_order: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 102,
    parent_id: 3,
    name: "Ống thép đúc",
    slug: "ong-thep-duc",
    level: 2,
    display_order: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Level 3 Categories
  {
    category_id: 1011,
    parent_id: 101,
    name: "Bu lông inox 304",
    slug: "bu-long-inox-304",
    level: 3,
    display_order: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 1012,
    parent_id: 101,
    name: "Bu lông lục giác",
    slug: "bu-long-luc-giac",
    level: 3,
    display_order: 2,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 1013,
    parent_id: 101,
    name: "Đai ốc lục giác",
    slug: "dai-oc-luc-giac",
    level: 3,
    display_order: 3,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 201,
    parent_id: 2,
    name: "Vòng bi chính hãng",
    slug: "vong-bi-chinh-hang",
    level: 2,
    display_order: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 2011,
    parent_id: 201,
    name: "Vòng bi SKF",
    slug: "vong-bi-skf",
    level: 3,
    display_order: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 2012,
    parent_id: 201,
    name: "Vòng bi NSK",
    slug: "vong-bi-nsk",
    level: 3,
    display_order: 2,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const useProductCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCategories(MOCK_CATEGORIES);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { categories, loading };
};
