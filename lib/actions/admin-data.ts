"use server";

/**
 * Admin Data Fetching Server Actions
 * 
 * These actions fetch data from Prisma for admin pages.
 * All actions require ADMIN role for security.
 * Write operations (create, update, delete) still use the backend API.
 */

import { prisma } from "@/lib/db";
import { requireAdmin } from "./auth-helpers";

// ============ TAGS ============

export async function fetchTagsFromDb() {
  // Verify admin access
  await requireAdmin();
  
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
    
    return tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      description: tag.description || undefined,
      color: tag.color || undefined,
      postCount: tag._count.posts,
      createdAt: tag.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

// ============ SUBSCRIBERS ============

export async function fetchSubscribersFromDb() {
  // Verify admin access
  await requireAdmin();
  
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    return subscribers.map(sub => ({
      id: sub.id,
      email: sub.email,
      name: sub.name || undefined,
      tier: sub.tier,
      status: sub.status,
      confirmedAt: sub.confirmedAt?.toISOString() || undefined,
      unsubscribedAt: sub.unsubscribedAt?.toISOString() || undefined,
      createdAt: sub.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return [];
  }
}

export async function fetchSubscriberStatsFromDb() {
  // Verify admin access
  await requireAdmin();
  
  try {
    const [total, active, pending] = await Promise.all([
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: { status: "ACTIVE" } }),
      prisma.subscriber.count({ where: { status: "PENDING" } }),
    ]);
    
    return {
      total,
      active,
      pending,
      unsubscribed: total - active - pending,
    };
  } catch (error) {
    console.error("Error fetching subscriber stats:", error);
    return { total: 0, confirmed: 0, pending: 0, unsubscribed: 0 };
  }
}

// ============ USERS ============

export async function fetchUsersFromDb() {
  // Verify admin access
  await requireAdmin();
  
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
    
    return users.map(user => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// ============ DASHBOARD ============

export async function fetchDashboardOverviewFromDb() {
  // Verify admin access
  await requireAdmin();
  
  try {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalAuthors,
      totalSubscribers,
      confirmedSubscribers,
      totalMembers,
      activeMembers,
      totalViews,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.author.count(),
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: { status: "ACTIVE" } }),
      prisma.member.count(),
      prisma.member.count({ where: { isActive: true } }),
      prisma.post.aggregate({ _sum: { viewCount: true } }),
    ]);
    
    return {
      posts: {
        total: totalPosts,
        published: publishedPosts,
        draft: draftPosts,
      },
      authors: {
        total: totalAuthors,
      },
      subscribers: {
        total: totalSubscribers,
        confirmed: confirmedSubscribers,
      },
      members: {
        total: totalMembers,
        active: activeMembers,
      },
      views: {
        total: totalViews._sum.viewCount || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    return null;
  }
}

export async function fetchRecentPostsFromDb(limit = 5) {
  // Verify admin access
  await requireAdmin();
  
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    
    // Map to a Post-compatible format
    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      coverImage: post.coverImage || undefined,
      status: post.status,
      isPremium: post.isPremium,
      metaTitle: post.metaTitle || undefined,
      metaDescription: post.metaDescription || undefined,
      viewCount: post.viewCount,
      publishedAt: post.publishedAt?.toISOString() || undefined,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      author: {
        id: post.author.id,
        name: post.author.name,
        slug: post.author.slug,
        avatar: post.author.avatarUrl || undefined,
      },
      tags: post.tags.map(pt => ({
        id: pt.tag.id,
        name: pt.tag.name,
        slug: pt.tag.slug,
      })),
    }));
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  }
}

// ============ MEMBERS ============

export async function fetchMembersFromDb() {
  // Verify admin access
  await requireAdmin();
  
  // Helper to safely convert JsonArray to string[]
  const toStringArray = (val: any): string[] => {
    if (Array.isArray(val)) {
      return val.filter((item): item is string => typeof item === 'string');
    }
    return [];
  };

  // Helper to convert JsonArray to typed array (any[])
  const toTypedArray = (val: any): any[] => {
    if (Array.isArray(val)) {
      return val;
    }
    return [];
  };

  // Helper to convert JsonArray to ConsultationType[]
  const toConsultationTypes = (val: any): any[] => {
    if (Array.isArray(val)) {
      return val.filter((item): item is string => 
        typeof item === 'string' && ['PRESENCIAL', 'ONLINE', 'DOMICILIO'].includes(item)
      );
    }
    return [];
  };
  
  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    // Map to DirectoryMember format
    return members.map(member => ({
      // Basic Member fields
      id: member.id,
      slug: member.slug,
      name: member.name,
      position: member.position,
      category: member.category,
      bio: member.bio,
      image: member.image,
      whatsapp: member.whatsapp,
      website: member.website,
      facebook: member.facebook,
      instagram: member.instagram,
      twitter: member.twitter,
      isActive: member.isActive,
      createdAt: member.createdAt.toISOString(),
      updatedAt: member.updatedAt.toISOString(),
      
      // Additional DirectoryMember fields
      phone: member.phone,
      email: member.email,
      linkedin: member.linkedin,
      city: member.city,
      state: member.state,
      country: member.country,
      subscriptionPlan: member.subscriptionPlan,
      subscriptionType: member.subscriptionType,
      subscriptionStart: member.subscriptionStart?.toISOString() || null,
      subscriptionEnd: member.subscriptionEnd?.toISOString() || null,
      isVerified: member.isVerified,
      memberSince: member.memberSince?.toISOString() || null,
      gender: member.gender,
      birthDate: member.birthDate?.toISOString() || null,
      licenseNumber: member.licenseNumber,
      experienceYears: member.experienceYears,
      profileDescription: member.profileDescription,
      
      // JSON array fields - convert to proper types
      specialties: toStringArray(member.specialties),
      therapies: toStringArray(member.therapies),
      disorders: toStringArray(member.disorders),
      languages: toStringArray(member.languages),
      targetAges: toStringArray(member.targetAges),
      certifications: toStringArray(member.certifications),
      education: toTypedArray(member.education),
      consultationTypes: toConsultationTypes(member.consultationTypes),
      insuranceProviders: toStringArray(member.insuranceProviders),
      locations: toTypedArray(member.locations),
      
      // Boolean and object fields
      acceptsInsurance: member.acceptsInsurance,
      priceRange: member.priceRange as any,
      firstSessionFree: member.firstSessionFree,
      schedule: member.schedule as any,
      videoUrl: member.videoUrl,
    }));
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}
