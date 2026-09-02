import { useState, useEffect, useCallback } from "react";
import { MOCK_PRODUCTS } from "@/data/mock-products";
import { Product } from "@/types/product";

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

  const getProductsByCategory = useCallback(
    (categoryId: number) =>
      products.filter((product) => product.category_id === categoryId),
    [products],
  );

  const getProductBySlug = useCallback(
    (slug: string | string[] | undefined | null) => {
      if (!slug) return undefined;
      let slugStr = Array.isArray(slug) ? slug[0] : slug;
      if (!slugStr) return undefined;
      slugStr = decodeURIComponent(slugStr).trim();
      return products.find(
        (product) => (product.product_code || "").trim().toLowerCase() === slugStr.toLowerCase(),
      );
    },
    [products],
  );

  return { products, loading, getProductsByCategory, getProductBySlug };
};
