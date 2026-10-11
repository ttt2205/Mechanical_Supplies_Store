import { AttachmentData } from './attachment';

export interface Product {
    id?: number;
    product_id: number;
    category_id: number;
    categoryId?: number;
    product_code: string;
    productCode?: string;
    name: string;
    slug: string;
    stock_quantity: number;
    stockQuantity?: number;
    is_featured: boolean;
    isFeatured?: boolean;
    is_contact_price: boolean;
    isContactPrice?: boolean;
    base_price: number;
    basePrice?: number;
    sale_price?: number | null;
    salePrice?: number | null;
    status: 'active' | 'inactive' | 'ACTIVE' | 'INACTIVE' | 'DRAFT' | string;
    thumbnail: string;
    images?: AttachmentData[];
    view_count?: number;
    sold_count?: number;
    brand?: string;
    origin?: string;
    short_description?: string;
    shortDescription?: string;
    content?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    is_deleted: boolean;
}

export interface ProductVariant {
    product_variant_id: number;
    product_id: number;
    sku: string;
    attributes: Record<string, string | number | boolean | null>;
    is_contact_price: boolean;
    price_override?: number;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductDetail extends Product {
    description: string;
    details_content: string;
    images: AttachmentData[];
    variants: ProductVariant[];
}
