import { useState, useEffect, useCallback } from "react";
import { Post } from "@/types/post";
import { fetchApi } from "@/lib/api";

export const usePosts = (postType?: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const url = postType ? `/posts?type=${postType}&limit=100` : '/posts?limit=100';
      const data = await fetchApi<Post[]>(url);
      setPosts(data || []);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: Partial<Post>) => {
    const newPost = await fetchApi<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
    if (newPost) {
      setPosts(prev => [newPost, ...prev]);
    }
    return newPost;
  };

  const updatePost = async (id: number, postData: Partial<Post>) => {
    const updatedPost = await fetchApi<Post>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData)
    });
    if (updatedPost) {
      setPosts(prev => prev.map(p => p.id === id ? updatedPost : p));
    }
    return updatedPost;
  };

  const deletePost = async (id: number) => {
    const success = await fetchApi<boolean>(`/posts/${id}`, {
      method: 'DELETE'
    });
    if (success) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
    return success;
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const getPostBySlug = useCallback(
    (slug: string | string[] | undefined | null) => {
      if (!slug) return undefined;
      let slugStr = Array.isArray(slug) ? slug[0] : slug;
      if (!slugStr) return undefined;
      slugStr = decodeURIComponent(slugStr).trim();
      return posts.find((p) => p.slug === slugStr);
    },
    [posts],
  );

  const getPostsByCategory = useCallback(
    (categoryId: number) => {
      return posts.filter(p => p.categoryId === categoryId);
    },
    [posts],
  );

  return { posts, loading, fetchPosts, getPostBySlug, getPostsByCategory, createPost, updatePost, deletePost };
};
