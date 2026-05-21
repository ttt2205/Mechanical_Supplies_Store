import { useState, useEffect } from "react";
import { Post } from "@/types/post";

const MOCK_POSTS: Post[] = [
  {
    post_id: 1,
    category_id: 1,
    title: "Hướng dẫn lựa chọn ống thủy lực phù hợp cho hệ thống máy công nghiệp",
    slug: "huong-dan-lua-chon-ong-thuy-luc-phu-hop",
    excerpt: "Lựa chọn đúng loại ống thủy lực không chỉ giúp hệ thống vận hành ổn định mà còn tiết kiệm chi phí bảo trì đáng kể. Khám phá các tiêu chí quan trọng tại đây.",
    content: "<p>Nội dung chi tiết về cách chọn ống thủy lực...</p>",
    thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
    post_type: "guide",
    status: "published",
    author: "Admin",
    created_at: "2024-03-15T08:30:00Z",
    updated_at: "2024-03-15T08:30:00Z",
    is_deleted: false,
  },
  {
    post_id: 2,
    category_id: 2,
    title: "Hưng Thịnh chính thức trở thành đối tác chiến lược của tập đoàn SKF",
    slug: "hung-thinh-doi-tac-chien-luoc-skf",
    excerpt: "Sự kiện đánh dấu bước tiến quan trọng trong việc cung cấp các giải pháp vòng bi và truyền động chính hãng chất lượng cao tại thị trường Việt Nam.",
    content: "<p>Nội dung về sự hợp tác giữa Hưng Thịnh và SKF...</p>",
    thumbnail: "https://images.unsplash.com/photo-1504384308090-c89eecdcbf7a?q=80&w=800&auto=format&fit=crop",
    post_type: "news",
    status: "published",
    author: "Ban Biên Tập",
    created_at: "2024-03-10T14:20:00Z",
    updated_at: "2024-03-10T14:20:00Z",
    is_deleted: false,
  },
  {
    post_id: 3,
    category_id: 1,
    title: "5 Dấu hiệu cho thấy hệ thống thủy lực của bạn đang gặp vấn đề",
    slug: "5-dau-hieu-he-thong-thuy-luc-gap-van-de",
    excerpt: "Tiếng ồn lạ, nhiệt độ tăng cao hay áp suất không ổn định? Đừng bỏ qua những dấu hiệu cảnh báo sớm để tránh các sự cố hư hỏng nghiêm trọng.",
    content: "<p>Chi tiết về các dấu hiệu hỏng hóc hệ thống thủy lực...</p>",
    thumbnail: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=800&auto=format&fit=crop",
    post_type: "blog",
    status: "published",
    author: "Kỹ thuật viên",
    created_at: "2024-03-05T09:15:00Z",
    updated_at: "2024-03-05T09:15:00Z",
    is_deleted: false,
  },
  {
    post_id: 4,
    category_id: 200211,
    title: "Công nghệ bấm đầu ống thủy lực hiện đại nhất năm 2024",
    slug: "cong-nghe-bam-dau-ong-thuy-luc-2024",
    excerpt: "Tìm hiểu về quy trình và thiết bị bấm đầu ống tự động giúp tăng độ chính xác và độ bền cho các sản phẩm ống thành phẩm.",
    content: "<p>Nội dung về công nghệ bấm đầu ống...</p>",
    thumbnail: "https://images.unsplash.com/photo-1565608438257-fac3c27beb36?q=80&w=800&auto=format&fit=crop",
    post_type: "news",
    status: "published",
    author: "Admin",
    created_at: "2024-03-01T16:45:00Z",
    updated_at: "2024-03-01T16:45:00Z",
    is_deleted: false,
  },
  {
    post_id: 5,
    category_id: 2001,
    title: "Quy trình bảo trì hệ thống thủy lực định kỳ",
    slug: "quy-trinh-bao-tri-he-thong-thuy-luc",
    excerpt: "Hướng dẫn chi tiết các bước kiểm tra và bảo trì hệ thống thủy lực để đảm bảo hiệu suất tối ưu và kéo dài tuổi thọ máy móc.",
    content: "<p>Chi tiết quy trình bảo trì...</p>",
    thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
    post_type: "guide",
    status: "published",
    author: "Kỹ sư Hưng Thịnh",
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
    is_deleted: false,
  },
];

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts(MOCK_POSTS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const getPostBySlug = (slug: string) => {
    return MOCK_POSTS.find(p => p.slug === slug);
  };

  const getPostsByCategory = (categoryId: number) => {
    return posts.filter(p => p.category_id === categoryId);
  };

  return { posts, loading, getPostBySlug, getPostsByCategory };
};
