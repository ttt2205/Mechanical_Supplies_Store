import type { Product } from "@/types/product";

export const MOCK_PRODUCTS: Product[] = [
  {
    product_id: 1,
    category_id: 101,
    product_code: "MS-BOLT-S304",
    name: "Bu lông lục giác inox 304 - M8x50mm",
    is_featured: false,
    is_contact_price: false,
    base_price: 15000,
    status: "active",
    thumbnail:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    images: [
      { attachment_id: 1001, url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop', order: 1, is_current: true },
      { attachment_id: 1002, url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop', order: 2, is_current: true },
      { attachment_id: 1003, url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop', order: 3, is_current: true },
      { attachment_id: 1004, url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop', order: 4, is_current: true }
    ],
    view_count: 1250,
    sold_count: 850,
    brand: "Hung Thinh",
    origin: "Việt Nam",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  },
  {
    product_id: 2,
    category_id: 101,
    product_code: "MS-NUT-S316",
    name: "Đai ốc inox 316 chống ăn mòn - M12",
    is_featured: false,
    is_contact_price: false,
    base_price: 8500,
    status: "active",
    thumbnail:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    images: [
      { attachment_id: 1005, url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop', order: 1, is_current: true },
      { attachment_id: 1006, url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200&auto=format&fit=crop', order: 2, is_current: true },
      { attachment_id: 1007, url: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=1200&auto=format&fit=crop', order: 3, is_current: true }
    ],
    view_count: 840,
    sold_count: 520,
    brand: "Hung Thinh",
    origin: "Đức",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  },
  {
    product_id: 3,
    category_id: 102,
    product_code: "MS-PIPE-C45",
    name: "Ống thép đúc phi 60 độ dày 5mm - Thép C45",
    is_featured: true,
    is_contact_price: true,
    base_price: 0,
    status: "active",
    thumbnail:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
    images: [
      { attachment_id: 1008, url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop', order: 1, is_current: true },
      { attachment_id: 1009, url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop', order: 2, is_current: true },
      { attachment_id: 1010, url: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=1200&auto=format&fit=crop', order: 3, is_current: true },
      { attachment_id: 1011, url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop', order: 4, is_current: true }
    ],
    view_count: 2100,
    sold_count: 340,
    brand: "Hung Thinh",
    origin: "Hàn Quốc",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  },
];
