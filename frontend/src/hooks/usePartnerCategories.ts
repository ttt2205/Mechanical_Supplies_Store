import { useState, useEffect } from "react";
import { Category } from "@/types/category";

const MOCK_PARTNERS: Category[] = [
  {
    category_id: 3001,
    parent_id: null,
    name: "Miền Nam",
    slug: "mien-nam",
    description: "Khu vực kinh tế trọng điểm phía Nam với hệ thống đối tác rộng khắp.",
    level: 1,
    display_order: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 3002,
    parent_id: null,
    name: "Miền Trung",
    slug: "mien-trung",
    description: "Kết nối các đối tác tại khu vực duyên hải và Tây Nguyên.",
    level: 1,
    display_order: 2,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 3003,
    parent_id: null,
    name: "Miền Bắc",
    slug: "mien-bac",
    description: "Mạng lưới đối tác tại thủ đô Hà Nội và các tỉnh phía Bắc.",
    level: 1,
    display_order: 3,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Level 2 - Miền Nam
  {
    category_id: 30011,
    parent_id: 3001,
    name: "TP. Hồ Chí Minh",
    slug: "tp-ho-chi-minh",
    level: 2,
    display_order: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 30012,
    parent_id: 3001,
    name: "Bình Dương",
    slug: "binh-duong",
    level: 2,
    display_order: 2,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 30013,
    parent_id: 3001,
    name: "Đồng Nai",
    slug: "dong-nai",
    level: 2,
    display_order: 3,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Level 2 - Miền Trung
  {
    category_id: 30021,
    parent_id: 3002,
    name: "Đà Nẵng",
    slug: "da-nang",
    level: 2,
    display_order: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 30022,
    parent_id: 3002,
    name: "Khánh Hòa",
    slug: "khanh-hoa",
    level: 2,
    display_order: 2,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Level 2 - Miền Bắc
  {
    category_id: 30031,
    parent_id: 3003,
    name: "Hà Nội",
    slug: "ha-noi",
    level: 2,
    display_order: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 30032,
    parent_id: 3003,
    name: "Hải Phòng",
    slug: "hai-phong",
    level: 2,
    display_order: 2,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Level 3 - TP.HCM (Ví dụ)
  {
    category_id: 300111,
    parent_id: 30011,
    name: "Quận 1",
    slug: "quan-1",
    level: 3,
    display_order: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: 300112,
    parent_id: 30011,
    name: "Quận 7",
    slug: "quan-7",
    level: 3,
    display_order: 2,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const usePartnerCategories = () => {
  const [partners, setPartners] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPartners(MOCK_PARTNERS);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getCategoryBySlug = (slug: string) => {
    return partners.find(s => s.slug === slug);
  };

  const getSubCategories = (parentId: number) => {
    return partners.filter(s => s.parent_id === parentId);
  };

  return { partners, loading, getCategoryBySlug, getSubCategories };
};
