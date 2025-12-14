/**
 * Posts Data Access Layer
 * 
 * Direct database access for posts using Prisma.
 * Uses unstable_cache for optimized caching with on-demand revalidation.
 */

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { Post as PrismaPost, Author, Tag } from "@/app/generated/prisma";

// =============================================================================
// TYPES
// =============================================================================

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  status: "DRAFT" | "PUBLISHED" | "REVIEW" | "ARCHIVED";
  isPremium: boolean;
  viewCount: number;
  readTime: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
  } | null;
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export interface PostsFilters {
  status?: "DRAFT" | "PUBLISHED" | "REVIEW" | "ARCHIVED";
  tag?: string;
  authorId?: string;
  page?: number;
  limit?: number;
}

export interface PostsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// =============================================================================
// TRANSFORM FUNCTIONS
// =============================================================================

// Type for the Prisma query result with nested relations
type PrismaPostWithRelations = PrismaPost & {
  author: Author | null;
  tags: { tag: Tag }[];
};

function toPost(post: PrismaPostWithRelations): Post {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    status: post.status as Post["status"],
    isPremium: post.isPremium,
    viewCount: post.viewCount,
    readTime: post.readTime,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: post.author ? {
      id: post.author.id,
      name: post.author.name,
      slug: post.author.slug,
      avatarUrl: post.author.avatarUrl,
    } : null,
    tags: post.tags.map(pt => ({
      id: pt.tag.id,
      name: pt.tag.name,
      slug: pt.tag.slug,
    })),
  };
}

// =============================================================================
// DATA FETCHING FUNCTIONS
// =============================================================================

/**
 * Get all posts with filters and pagination
 * This is NOT cached because it's used in admin with filters
 */
export async function getAllPosts(filters?: PostsFilters): Promise<{
  posts: Post[];
  pagination: PostsPagination;
}> {
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const skip = (page - 1) * limit;

  try {
    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.authorId) {
      where.authorId = filters.authorId;
    }
    
    if (filters?.tag) {
      where.tags = {
        some: {
          tag: {
            slug: filters.tag,
          },
        },
      };
    }

    // Execute queries in parallel
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
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts: posts.map(toPost),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      posts: [],
      pagination: { page: 1, limit, total: 0, totalPages: 0 },
    };
  }
}

/**
 * Get post by slug (cached)
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const getCachedPost = unstable_cache(
    async (postSlug: string) => {
      try {
        const post = await prisma.post.findUnique({
          where: { slug: postSlug },
          include: {
            author: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        });
        
        return post ? toPost(post) : null;
      } catch (error) {
        console.error("Error fetching post:", error);
        return null;
      }
    },
    [`post-${slug}`],
    { tags: ["posts", `post-${slug}`], revalidate: 3600 }
  );
  
  return getCachedPost(slug);
}

/**
 * Get post by ID (for editing)
 */
export async function getPostById(id: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    
    return post ? toPost(post) : null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

/**
 * Get all tags (cached)
 */
export const getAllTags = unstable_cache(
  async () => {
    try {
      const tags = await prisma.tag.findMany({
        orderBy: { name: "asc" },
      });
      
      return tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        description: tag.description,
        color: tag.color,
      }));
    } catch (error) {
      console.error("Error fetching tags:", error);
      return [];
    }
  },
  ["tags"],
  { tags: ["tags"], revalidate: 3600 }
);

/**
 * Get all authors (cached)
 */
export const getAllAuthors = unstable_cache(
  async () => {
    try {
      const authors = await prisma.author.findMany({
        orderBy: { name: "asc" },
      });
      
      return authors.map(author => ({
        id: author.id,
        name: author.name,
        slug: author.slug,
        email: author.email,
        bio: author.bio,
        avatarUrl: author.avatarUrl,
      }));
    } catch (error) {
      console.error("Error fetching authors:", error);
      return [];
    }
  },
  ["authors"],
  { tags: ["authors"], revalidate: 3600 }
);
