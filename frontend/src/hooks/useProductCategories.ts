import { useState, useEffect } from "react";
import { MOCK_CATEGORIES } from "@/data/mock-product-categories";
import { Category } from "@/types/category";

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
