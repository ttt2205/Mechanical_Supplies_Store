import { fetchApi } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/product";

const mapProduct = (p: any) => ({
  id: p.id,
  product_id: p.id,
  categoryId: p.categoryId,
  category_id: p.categoryId,
  productCode: p.productCode,
  product_code: p.productCode,
  name: p.name,
  slug: p.slug || (p.productCode ? p.productCode.toLowerCase() : 'sp'),
  isFeatured: p.isFeatured,
  is_featured: p.isFeatured,
  isContactPrice: p.isContactPrice,
  is_contact_price: p.isContactPrice,
  basePrice: p.basePrice || 0,
  base_price: p.basePrice || 0,
  salePrice: p.salePrice || null,
  sale_price: p.salePrice || null,
  status: p.status,
  thumbnail: p.thumbnail || '',
  viewCount: p.viewCount,
  view_count: p.viewCount,
  soldCount: p.soldCount,
  sold_count: p.soldCount,
  stockQuantity: p.stockQuantity || 0,
  stock_quantity: p.stockQuantity || 0,
  brand: p.brand,
  origin: p.origin,
  shortDescription: p.shortDescription,
  short_description: p.shortDescription,
  content: p.content || '',
  created_at: p.creationTime || new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_deleted: false,
});

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await fetchApi<any[]>('/Products?limit=100');
      if (data) {
        const mapped = data.map(mapProduct);
        setProducts(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await loadData();
  }, []);

  const createProduct = async (payload: any) => {
    const res = await fetchApi<any>('/Products', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
    if (res) await refresh();
    return res;
  };

  const updateProduct = async (id: number, payload: any) => {
    const res = await fetchApi<any>(`/Products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
    if (res) await refresh();
    return res;
  };

  const deleteProduct = async (id: number) => {
    const res = await fetchApi<any>(`/Products/${id}`, {
        method: 'DELETE'
    });
    if (res) await refresh();
    return res;
  };

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
      return products.find(
        (product) => 
          (product.product_code || "").trim().toLowerCase() === slugStr.toLowerCase() ||
          (product.slug || "").trim().toLowerCase() === slugStr.toLowerCase()
      );
    },
    [products],
  );

  return { products, loading, getProductsByCategory, getProductBySlug, refresh, createProduct, updateProduct, deleteProduct };
};
