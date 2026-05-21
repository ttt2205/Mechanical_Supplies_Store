import { useState, useEffect } from "react";
import { Category } from "@/types/category";

const MOCK_SERVICES: Category[] = [
  {
    category_id: 2001,
    parent_id: null,
    name: "Bảo hành & Bảo trì",
    slug: "bao-hanh-va-bao-tri",
    description: "Dịch vụ hậu mãi và duy trì hiệu suất thiết bị chuyên nghiệp.",
    level: 1,
    display_order: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 2002,
    parent_id: null,
    name: "Gia công kỹ thuật",
    slug: "gia-cong-ky-thuat",
    description: "Gia công và sản xuất linh kiện theo yêu cầu kỹ thuật cao.",
    level: 1,
    display_order: 2,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Level 2
  {
    category_id: 20011,
    parent_id: 2001,
    name: "Bảo hành máy",
    slug: "bao-hanh-may",
    level: 2,
    display_order: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 20021,
    parent_id: 2002,
    name: "Gia công ống thành phẩm",
    slug: "gia-cong-ong-thanh-pham-ong-thuy-luc",
    level: 2,
    display_order: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Level 3
  {
    category_id: 200111,
    parent_id: 20011,
    name: "Bảo hành định kỳ",
    slug: "bao-hanh-dinh-ky",
    level: 3,
    display_order: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 200112,
    parent_id: 20011,
    name: "Sửa chữa tận nơi",
    slug: "sua-chua-tan-noi",
    level: 3,
    display_order: 2,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 200211,
    parent_id: 20021,
    name: "Bấm đầu ống thủy lực",
    slug: "bam-dau-ong-thuy-luc",
    level: 3,
    display_order: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 200212,
    parent_id: 20021,
    name: "Thử áp suất cao",
    slug: "thu-ap-suat-cao",
    level: 3,
    display_order: 2,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const useServiceCategories = () => {
  const [services, setServices] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setServices(MOCK_SERVICES);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getCategoryBySlug = (slug: string) => {
    return services.find(s => s.slug === slug);
  };

  const getSubCategories = (parentId: number) => {
    return services.filter(s => s.parent_id === parentId);
  };

  return { services, loading, getCategoryBySlug, getSubCategories };
};
