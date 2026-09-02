import { AttachmentData } from './attachment';

export interface Product {
    product_id: number;
    category_id: number;
    product_code: string;
    name: string;
    is_featured: boolean;
    is_contact_price: boolean;
    base_price: number;
    status: 'active' | 'inactive';
    thumbnail: string;
    images?: AttachmentData[];
    view_count?: number;
    sold_count?: number;
    brand?: string;
    origin?: string;
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
