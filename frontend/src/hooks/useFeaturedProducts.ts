import { useState, useEffect } from "react";
import { Product } from "@/types/product";

// Mock data based on the database structure
const MOCK_FEATURED_PRODUCTS: Product[] = [
  {
    product_id: 1,
    category_id: 101,
    product_code: "MS-BOLT-S304",
    name: "Bu lông lục giác inox 304 - M8x50mm",
    is_featured: true,
    is_contact_price: false,
    base_price: 15000,
    status: "active",
    thumbnail:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  },
  {
    product_id: 2,
    category_id: 101,
    product_code: "MS-NUT-S316",
    name: "Đai ốc inox 316 chống ăn mòn cao cấp - M12",
    is_featured: true,
    is_contact_price: false,
    base_price: 8500,
    status: "active",
    thumbnail:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  },
  {
    product_id: 4,
    category_id: 103,
    product_code: "MS-WELD-E6013",
    name: "Que hàn điện Kim Tín KT-421 (E6013) - 3.2mm",
    is_featured: true,
    is_contact_price: false,
    base_price: 320000,
    status: "active",
    thumbnail:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  },
  {
    product_id: 5,
    category_id: 104,
    product_code: "MS-BEAR-6205",
    name: "Vòng bi SKF 6205-2Z chính hãng",
    is_featured: true,
    is_contact_price: false,
    base_price: 125000,
    status: "active",
    thumbnail:
      "https://images.unsplash.com/photo-1590959651373-a3db0f38a961?q=80&w=800&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  },
  {
    product_id: 6,
    category_id: 105,
    product_code: "MS-TOOL-SET",
    name: "Bộ dụng cụ cầm tay 120 chi tiết đa năng",
    is_featured: true,
    is_contact_price: false,
    base_price: 1850000,
    status: "active",
    thumbnail:
      "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=800&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  },
  {
    product_id: 7,
    category_id: 101,
    product_code: "MS-WASH-M10",
    name: "Long đền phẳng inox 304 - M10 (Bịch 100 con)",
    is_featured: true,
    is_contact_price: false,
    base_price: 45000,
    status: "active",
    thumbnail:
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=800&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  },
  {
    product_id: 8,
    category_id: 106,
    product_code: "MS-GLOV-PRO",
    name: "Găng tay bảo hộ chống cắt cấp độ 5",
    is_featured: true,
    is_contact_price: false,
    base_price: 95000,
    status: "active",
    thumbnail:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  },
];

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProducts(MOCK_FEATURED_PRODUCTS);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return { products, loading };
};
