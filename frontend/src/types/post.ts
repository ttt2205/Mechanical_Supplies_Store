export interface PostSection {
    id?: number;
    postId?: number;
    heading: string;
    content: string;
    orderIndex?: number;
    order?: number;
}

export interface Post {
    id: number;
    categoryId?: number;
    category_id?: number | string;
    postType: string;
    authorId?: number;
    title: string;
    slug: string;
    excerpt: string;
    thumbnail: string;
    status: string;
    creationTime: string;
    sections?: PostSection[];
}
