import { MOCK_CATEGORIES } from "@/data/mock-product-categories";
import { MOCK_PRODUCTS } from "@/data/mock-products";
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

export function getProducts() {
  return MOCK_PRODUCTS.filter(
    (product) => product.status === "active" && !product.is_deleted,
  );
}

export function getProductCategories() {
  return MOCK_CATEGORIES.filter((category) => category.status === "active");
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

export function getCategoryBySlug(slug: string) {
  return getProductCategories().find((category) => category.slug === slug);
}

export function getDirectChildren(parentId: number) {
  return getProductCategories().filter(
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
