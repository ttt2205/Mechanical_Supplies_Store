export interface Post {
    post_id: number;
    category_id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    thumbnail: string;
    post_type: 'blog' | 'news' | 'guide';
    status: 'draft' | 'published' | 'hidden';
    author?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    is_deleted: boolean;
}

export interface PostCategory {
    category_id: number;
    name: string;
    slug: string;
}
