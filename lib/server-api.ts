/**
 * Server API - Prisma Direct Access
 * 
 * Direct database access for blog pages using Prisma.
 * Replaces the previous fetch-based API calls for better performance.
 */

import { cache } from 'react';
import 'server-only';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';
import type { Post as PrismaPost, Tag as PrismaTag, Author as PrismaAuthor } from '@/app/generated/prisma';

// =============================================================================
// TYPES (compatible with blog-utils)
// =============================================================================

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  status: string;
  isPremium: boolean;
  viewCount: number;
  readTime: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: Author | null;
  tags: Tag[];
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  color?: string | null;
}

export interface Author {
  id: string;
  slug: string;
  name: string;
  email?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  specialty?: string | null;
  profession?: string | null;
  website?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Response types (compatible with old API)
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

// =============================================================================
// TRANSFORM FUNCTIONS
// =============================================================================

type PrismaPostWithRelations = PrismaPost & {
  author: PrismaAuthor | null;
  tags: { tag: PrismaTag }[];
};

function transformPost(post: PrismaPostWithRelations): Post {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    status: post.status,
    isPremium: post.isPremium,
    viewCount: post.viewCount,
    readTime: post.readTime,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    publishedAt: post.publishedAt?.toISOString() || null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    author: post.author ? {
      id: post.author.id,
      slug: post.author.slug,
      name: post.author.name,
      email: post.author.email,
      avatarUrl: post.author.avatarUrl,
      bio: post.author.bio,
      specialty: post.author.specialty,
      profession: post.author.profession,
      website: post.author.website,
      twitter: post.author.twitter,
      linkedin: post.author.linkedin,
    } : null,
    tags: post.tags.map(pt => ({
      id: pt.tag.id,
      slug: pt.tag.slug,
      name: pt.tag.name,
      description: pt.tag.description,
      color: pt.tag.color,
    })),
  };
}

function transformTag(tag: PrismaTag): Tag {
  return {
    id: tag.id,
    slug: tag.slug,
    name: tag.name,
    description: tag.description,
    color: tag.color,
  };
}

function transformAuthor(author: PrismaAuthor): Author {
  return {
    id: author.id,
    slug: author.slug,
    name: author.name,
    email: author.email,
    avatarUrl: author.avatarUrl,
    bio: author.bio,
    specialty: author.specialty,
    profession: author.profession,
    website: author.website,
    twitter: author.twitter,
    linkedin: author.linkedin,
  };
}

// =============================================================================
// POSTS
// =============================================================================

export const getPosts = cache(async (params?: {
  page?: number;
  limit?: number;
  tag?: string;
  status?: string;
  author?: string;
}): Promise<PostsResponse | null> => {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  try {
    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (params?.status) {
      where.status = params.status;
    }
    
    if (params?.tag) {
      where.tags = {
        some: {
          tag: {
            slug: params.tag,
          },
        },
      };
    }
    
    if (params?.author) {
      where.author = {
        slug: params.author,
      };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return {
      success: true,
      data: {
        data: posts.map(transformPost),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error('[server-api] Error fetching posts:', error);
    return null;
  }
});

export const getPostBySlug = cache(async (slug: string): Promise<PostResponse | null> => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) return null;

    // Increment view count (fire and forget)
    prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    return {
      success: true,
      data: transformPost(post),
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
});

// =============================================================================
// TAGS
// =============================================================================

export const getTags = cache(async (): Promise<TagsResponse | null> => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });

    return {
      success: true,
      data: tags.map(transformTag),
    };
  } catch (error) {
    console.error('Error fetching tags:', error);
    return null;
  }
});

export const getTagBySlug = cache(async (slug: string): Promise<{ success: boolean; data: Tag } | null> => {
  try {
    const tag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (!tag) return null;

    return {
      success: true,
      data: transformTag(tag),
    };
  } catch (error) {
    console.error('Error fetching tag:', error);
    return null;
  }
});

// =============================================================================
// AUTHORS
// =============================================================================

export const getAuthorBySlug = cache(async (slug: string): Promise<AuthorResponse | null> => {
  try {
    const author = await prisma.author.findUnique({
      where: { slug },
    });

    if (!author) return null;

    return {
      success: true,
      data: transformAuthor(author),
    };
  } catch (error) {
    console.error('Error fetching author:', error);
    return null;
  }
});

export const getAuthorPosts = cache(async (slug: string, page = 1): Promise<AuthorPostsResponse | null> => {
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const author = await prisma.author.findUnique({
      where: { slug },
    });

    if (!author) return null;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          authorId: author.id,
          status: 'PUBLISHED',
        },
        include: {
          author: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({
        where: {
          authorId: author.id,
          status: 'PUBLISHED',
        },
      }),
    ]);

    return {
      success: true,
      data: {
        data: posts.map(transformPost),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error('Error fetching author posts:', error);
    return null;
  }
});

// =============================================================================
// PRELOAD FUNCTIONS
// =============================================================================

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

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Re-export types
export type { PostsResponse, TagsResponse, AuthorResponse, AuthorPostsResponse };
