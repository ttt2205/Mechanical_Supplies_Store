import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/product";

// Extended mock data for products across different categories
const MOCK_PRODUCTS: Product[] = [
  // Category 101: Bu lông & Đai ốc
  {
    product_id: 1,
    category_id: 101,
    product_code: "MS-BOLT-S304",
    name: "Bu lông lục giác inox 304 - M8x50mm",
    is_featured: false,
    is_contact_price: false,
    base_price: 15000,
    status: "active",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
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
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    view_count: 840,
    sold_count: 520,
    brand: "Hung Thinh",
    origin: "Đức",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  },
  // Category 102: Ống thép đúc
  {
    product_id: 3,
    category_id: 102,
    product_code: "MS-PIPE-C45",
    name: "Ống thép đúc phi 60 độ dày 5mm - Thép C45",
    is_featured: true,
    is_contact_price: true,
    base_price: 0,
    status: "active",
    thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
    view_count: 2100,
    sold_count: 340,
    brand: "Hung Thinh",
    origin: "Hàn Quốc",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  },
  // More products...
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const getProductsByCategory = useCallback((categoryId: number) => {
    return products.filter(p => p.category_id === categoryId);
  }, [products]);

  const getProductBySlug = useCallback((slug: string) => {
    // For mock purposes, using product_code as slug
    return products.find(p => p.product_code.toLowerCase() === slug.toLowerCase());
  }, [products]);

  return { products, loading, getProductsByCategory, getProductBySlug };
};
