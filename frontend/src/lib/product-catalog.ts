import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export type ProductSearchParams = Record<
  string,
  string | string[] | undefined
>;

export interface ProductFilters {
  q: string;
  sub: number | null;
  maxPrice: number;
  sort: "newest" | "az" | "price-asc" | "price-desc";
  page: number;
  limit: 50 | 100;
}

export interface ProductListingResult {
  products: Product[];
  totalResults: number;
  totalPages: number;
  filters: ProductFilters;
}

const MAX_PRICE = 10000000;

const readParam = (
  params: ProductSearchParams,
  key: string,
): string | undefined => {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
};

const parsePositiveNumber = (
  value: string | undefined,
  fallback: number,
) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0
    ? Math.floor(numberValue)
    : fallback;
};

if (typeof process !== "undefined" && process.env) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { API_BASE_URL } from "./api";

export async function fetchProductsFromApi(): Promise<Product[]> {
  try {
    let res: Response | null = null;
    try {
      res = await fetch(`${API_BASE_URL}/Products?limit=200`, {
        cache: "no-store",
      });
    } catch (primaryErr) {
      // If primary URL failed (e.g. self-signed SSL on 7001 or port change), try http on 5117
      const fallbackUrl = API_BASE_URL.includes("7001")
        ? API_BASE_URL.replace("https://localhost:7001", "http://localhost:5117").replace("http://localhost:7001", "http://localhost:5117")
        : "http://localhost:5117/api";
      try {
        res = await fetch(`${fallbackUrl}/Products?limit=200`, {
          cache: "no-store",
        });
      } catch (fallbackErr) {
        console.error("fetchProductsFromApi fallback error:", fallbackErr);
        throw primaryErr;
      }
    }

    if (!res || !res.ok) {
      throw new Error(`HTTP error ${res?.status}`);
    }

    const json = await res.json();
    const data = json.data !== undefined ? json.data : json;
    if (Array.isArray(data)) {
      return data
        .map((p: any) => ({
          id: p.id,
          product_id: p.id,
          categoryId: p.categoryId,
          category_id: p.categoryId,
          productCode: p.productCode,
          product_code: p.productCode,
          name: p.name,
          slug: p.slug || (p.productCode ? p.productCode.toLowerCase() : "sp"),
          isFeatured: Boolean(p.isFeatured),
          is_featured: Boolean(p.isFeatured),
          isContactPrice: Boolean(p.isContactPrice),
          is_contact_price: Boolean(p.isContactPrice),
          basePrice: p.basePrice || 0,
          base_price: p.basePrice || 0,
          salePrice: p.salePrice || null,
          sale_price: p.salePrice || null,
          status: (p.status || "active").toLowerCase(),
          thumbnail: p.thumbnail || "",
          viewCount: p.viewCount || 0,
          view_count: p.viewCount || 0,
          soldCount: p.soldCount || 0,
          sold_count: p.soldCount || 0,
          stockQuantity: p.stockQuantity || 0,
          stock_quantity: p.stockQuantity || 0,
          brand: p.brand || "",
          origin: p.origin || "",
          shortDescription: p.shortDescription || "",
          short_description: p.shortDescription || "",
          content: p.content || "",
          created_at: p.creationTime || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_deleted: Boolean(p.isDeleted),
        }))
        .filter((p: any) => !p.is_deleted && (p.status === "active" || p.status === "ACTIVE"));
    }
  } catch (err) {
    console.error("fetchProductsFromApi error:", err);
  }
  return [];
}

export async function fetchCategoriesFromApi(type: string = "PRODUCT"): Promise<Category[]> {
  try {
    let res: Response | null = null;
    const path = type ? `/Categories?type=${encodeURIComponent(type)}` : '/Categories';
    try {
      res = await fetch(`${API_BASE_URL}${path}`, {
        cache: "no-store",
      });
    } catch (primaryErr) {
      const fallbackUrl = API_BASE_URL.includes("7001")
        ? API_BASE_URL.replace("https://localhost:7001", "http://localhost:5117").replace("http://localhost:7001", "http://localhost:5117")
        : "http://localhost:5117/api";
      try {
        res = await fetch(`${fallbackUrl}${path}`, {
          cache: "no-store",
        });
      } catch (fallbackErr) {
        console.error("fetchCategoriesFromApi fallback error:", fallbackErr);
        throw primaryErr;
      }
    }

    if (!res || !res.ok) {
      throw new Error(`HTTP error ${res?.status}`);
    }

    const json = await res.json();
    const data = json.data !== undefined ? json.data : json;
    if (Array.isArray(data)) {
      return data
        .map((c: any) => ({
          category_id: c.id ?? c.Id,
          parent_id: (c.parentId ?? c.ParentId) ?? null,
          code: c.code ?? c.Code,
          name: c.name ?? c.Name,
          slug: c.slug ?? c.Slug,
          type: c.type ?? c.Type ?? type,
          description: c.description ?? c.Description ?? "",
          icon: c.icon ?? c.Icon ?? "Package",
          display_order: c.displayOrder ?? c.DisplayOrder ?? 0,
          status: (c.status || c.Status || "active").toLowerCase() as "active" | "inactive",
        }))
        .filter((c: any) => c.status === "active");
    }
  } catch (err) {
    console.error("fetchCategoriesFromApi error:", err);
  }
  return [];
}

export function getProducts() {
  return [];
}

export function getProductCategories() {
  return [];
}

export function parseProductFilters(
  searchParams: ProductSearchParams,
): ProductFilters {
  const limit = parsePositiveNumber(readParam(searchParams, "limit"), 50);
  const maxPrice = parsePositiveNumber(
    readParam(searchParams, "maxPrice"),
    MAX_PRICE,
  );
  const sub = parsePositiveNumber(readParam(searchParams, "sub"), 0);
  const sortParam = readParam(searchParams, "sort");
  const sort =
    sortParam === "az" ||
    sortParam === "price-asc" ||
    sortParam === "price-desc"
      ? sortParam
      : "newest";

  return {
    q: (readParam(searchParams, "q") || "").trim(),
    sub: sub > 0 ? sub : null,
    maxPrice: Math.min(maxPrice, MAX_PRICE),
    sort,
    page: parsePositiveNumber(readParam(searchParams, "page"), 1),
    limit: limit === 100 ? 100 : 50,
  };
}

export function getCategoryBySlug(slug: string, categories: Category[] = []) {
  return categories.find((category) => category.slug === slug || category.code?.toLowerCase() === slug.toLowerCase());
}

export function getDirectChildren(parentId: number, categories: Category[] = []) {
  return categories.filter(
    (category) => category.parent_id === parentId,
  );
}

export function getDescendantCategoryIds(
  categories: Category[],
  categoryId: number,
): number[] {
  const children = categories.filter(
    (category) => category.parent_id === categoryId,
  );

  return [
    categoryId,
    ...children.flatMap((child) =>
      getDescendantCategoryIds(categories, child.category_id),
    ),
  ];
}

export function filterAndPaginateProducts(
  products: Product[],
  categories: Category[],
  filters: ProductFilters,
  baseCategoryIds?: number[],
): ProductListingResult {
  const selectedCategoryIds = filters.sub
    ? getDescendantCategoryIds(categories, filters.sub)
    : baseCategoryIds;
  const allowedCategoryIds = selectedCategoryIds
    ? new Set(selectedCategoryIds)
    : null;
  const query = filters.q.toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !allowedCategoryIds || allowedCategoryIds.has(product.category_id);
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.product_code.toLowerCase().includes(query);
    const matchesPrice =
      product.is_contact_price ||
      (product.base_price >= 0 && product.base_price <= filters.maxPrice);

    return matchesCategory && matchesSearch && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sort === "az") {
      return a.name.localeCompare(b.name, "vi");
    }

    if (filters.sort === "price-asc") {
      if (a.is_contact_price && !b.is_contact_price) return 1;
      if (!a.is_contact_price && b.is_contact_price) return -1;
      return a.base_price - b.base_price;
    }

    if (filters.sort === "price-desc") {
      if (a.is_contact_price && !b.is_contact_price) return 1;
      if (!a.is_contact_price && b.is_contact_price) return -1;
      return b.base_price - a.base_price;
    }

    return (
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime() ||
      b.product_id - a.product_id
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / filters.limit),
  );
  const safePage = Math.min(filters.page, totalPages);
  const start = (safePage - 1) * filters.limit;

  return {
    products: sortedProducts.slice(start, start + filters.limit),
    totalResults: sortedProducts.length,
    totalPages,
    filters: {
      ...filters,
      page: safePage,
    },
  };
}
