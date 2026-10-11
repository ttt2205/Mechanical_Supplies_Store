import { useState, useEffect } from "react";
import { Category } from "@/types/category";
import { fetchApi } from "@/lib/api";

const mapCategory = (c: any): Category => ({
  category_id: c.id ?? c.Id,
  parent_id: (c.parentId ?? c.ParentId) ?? null,
  code: c.code ?? c.Code,
  name: c.name ?? c.Name,
  slug: c.slug ?? c.Slug,
  type: c.type ?? c.Type ?? 'SERVICE',
  description: c.description ?? c.Description ?? '',
  icon: c.icon ?? c.Icon ?? 'Package',
  display_order: c.displayOrder ?? c.DisplayOrder ?? 0,
  status: c.status ?? c.Status ?? 'ACTIVE'
});

export const useServiceCategories = () => {
  const [services, setServices] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchApi<any[]>('/Categories?type=SERVICE');
        if (isMounted) {
          if (Array.isArray(data)) {
            setServices(data.map(mapCategory));
          } else {
            setServices([]);
          }
        }
      } catch (err) {
        console.error("useServiceCategories load error:", err);
        if (isMounted) {
          setServices([]);
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
  }, [tick]);

  const getCategoryBySlug = (slug: string) => {
    return services.find(s => s.slug === slug || s.code?.toLowerCase() === slug.toLowerCase());
  };

  const getSubCategories = (parentId: number) => {
    return services.filter(s => s.parent_id === parentId);
  };

  return { services, loading, refresh, getCategoryBySlug, getSubCategories };
};
