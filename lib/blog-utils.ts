// Utilidades compartidas entre Server y Client Components

export function estimateReadTime(content: string): number {
  if (!content) return 1;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200);
}

// Types compartidos
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  status: 'DRAFT' | 'PUBLISHED';
  isPremium: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  author: { id: string; name: string; slug: string; avatar?: string };
  tags: { id: string; name: string; slug: string }[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatar?: string;
  email?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
