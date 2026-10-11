import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { fetchApi } from "@/lib/api";
import { useProducts } from "./useProducts";

export const useFeaturedProducts = () => {
  const { products, loading } = useProducts();
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    if (products) {
      setFeatured(products.filter(p => p.is_featured));
    }
  }, [products]);

  return { products: featured, loading };
};
