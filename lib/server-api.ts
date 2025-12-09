import { cache } from 'react';
import 'server-only';
import { Post, Tag, Author, Pagination } from './blog-utils';

const API_URL = process.env.API_URL || 'http://localhost:3001/api/v1';

// Response types
interface PostsResponse {
  success: boolean;
  data: {
    data: Post[];
    pagination: Pagination;
  };
}

interface PostResponse {
  success: boolean;
  data: Post;
}

interface TagsResponse {
  success: boolean;
  data: Tag[];
}

interface AuthorResponse {
  success: boolean;
  data: Author;
}

interface AuthorPostsResponse {
  success: boolean;
  data: {
    data: Post[];
    pagination: Pagination;
  };
}

// Fetch wrapper con manejo de errores
async function serverFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      console.error(`[Server API] Error fetching ${url}: ${res.status}`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error(`[Server API] Error:`, error);
    return null;
  }
}

// ============ POSTS ============
export const getPosts = cache(async (params?: {
  page?: number;
  limit?: number;
  tag?: string;
  status?: string;
  author?: string;
}): Promise<PostsResponse | null> => {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.tag) query.set('tag', params.tag);
  if (params?.status) query.set('status', params.status);
  if (params?.author) query.set('author', params.author);

  return serverFetch<PostsResponse>(`${API_URL}/posts?${query.toString()}`, {
    cache: 'force-cache',
    next: { tags: ['posts'] },
  });
});

export const getPostBySlug = cache(async (slug: string): Promise<PostResponse | null> => {
  return serverFetch<PostResponse>(`${API_URL}/posts/${slug}`, {
    cache: 'force-cache',
    next: { tags: ['posts', `post-${slug}`] },
  });
});

// ============ TAGS ============
export const getTags = cache(async (): Promise<TagsResponse | null> => {
  return serverFetch<TagsResponse>(`${API_URL}/tags`, {
    cache: 'force-cache',
    next: { tags: ['tags'] },
  });
});

export const getTagBySlug = cache(async (slug: string): Promise<{ success: boolean; data: Tag } | null> => {
  return serverFetch(`${API_URL}/tags/${slug}`, {
    cache: 'force-cache',
    next: { tags: ['tags', `tag-${slug}`] },
  });
});

// ============ AUTHORS ============
export const getAuthorBySlug = cache(async (slug: string): Promise<AuthorResponse | null> => {
  return serverFetch<AuthorResponse>(`${API_URL}/authors/${slug}`, {
    cache: 'force-cache',
    next: { tags: ['authors', `author-${slug}`] },
  });
});

export const getAuthorPosts = cache(async (slug: string, page = 1): Promise<AuthorPostsResponse | null> => {
  return serverFetch<AuthorPostsResponse>(`${API_URL}/authors/${slug}/posts?page=${page}`, {
    cache: 'force-cache',
    next: { tags: ['posts', `author-${slug}-posts`] },
  });
});

// ============ PRELOAD FUNCTIONS ============
// Usado para iniciar fetches temprano (preload pattern)
export const preloadPost = (slug: string) => {
  void getPostBySlug(slug);
};

export const preloadPosts = (params?: Parameters<typeof getPosts>[0]) => {
  void getPosts(params);
};

export const preloadTags = () => {
  void getTags();
};

export const preloadAuthor = (slug: string) => {
  void getAuthorBySlug(slug);
};

// Re-export types from blog-utils for convenience
export type { Post, Tag, Author, Pagination } from './blog-utils';
export type { PostsResponse, TagsResponse };
