export interface Category {
    category_id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    icon?: string;
    level: number;
    display_order: number;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}
