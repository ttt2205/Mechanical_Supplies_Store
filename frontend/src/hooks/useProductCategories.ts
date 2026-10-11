import { fetchApi } from "@/lib/api";
import { useState, useEffect } from "react";
import { Category } from "@/types/category";

const mapCategory = (c: any): Category => ({
    category_id: c.id ?? c.Id,
    parent_id: (c.parentId ?? c.ParentId) ?? null,
    code: c.code ?? c.Code,
    name: c.name ?? c.Name,
    slug: c.slug ?? c.Slug,
    type: c.type ?? c.Type ?? 'PRODUCT',
    description: c.description ?? c.Description ?? '',
    icon: c.icon ?? c.Icon ?? 'Package',
    display_order: c.displayOrder ?? c.DisplayOrder ?? 0,
    status: c.status ?? c.Status ?? 'ACTIVE'
});

export const useProductCategories = (type?: string) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const url = type ? `/Categories?type=${encodeURIComponent(type)}` : '/Categories';
        const data = await fetchApi<any[]>(url);
        if (isMounted) {
          if (Array.isArray(data)) {
            const mapped = data.map(mapCategory);
            setCategories(mapped);
          } else {
            setCategories([]);
          }
        }
      } catch (err) {
        console.error("useProductCategories load error:", err);
        if (isMounted) {
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [tick, type]);

  const getCategoryBySlug = (slug: string) => {
    return categories.find(c => c.slug === slug || c.code?.toLowerCase() === slug.toLowerCase());
  };

  const getSubCategories = (parentId: number) => {
    return categories.filter(c => c.parent_id === parentId);
  };

  const createCategory = async (payload: any) => {
    try {
      await fetchApi('/Categories', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      refresh();
      return true;
    } catch {
      return false;
    }
  };

  const updateCategory = async (id: number, payload: any) => {
    try {
      await fetchApi(`/Categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      refresh();
      return true;
    } catch {
      return false;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await fetchApi(`/Categories/${id}`, {
        method: 'DELETE'
      });
      refresh();
      return true;
    } catch {
      return false;
    }
  };

  return { 
    categories, 
    loading, 
    refresh, 
    getCategoryBySlug, 
    getSubCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
  };
};
