// Team Members Data - Server-side API functions
// These functions fetch data from the backend API for use in Server Components

import type { Member, MemberCategory } from "@/lib/api";

// Use API_URL (server-only) first, then fall back to NEXT_PUBLIC_API_URL
// This ensures server-side fetches use the correct backend URL
const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
const isDev = process.env.NODE_ENV === "development";

// Re-export types from api.ts for convenience
export type { Member, MemberCategory };

// Legacy type alias for backwards compatibility with existing components
export type TeamMember = Member & {
  department?: MemberCategory; // Legacy alias for category
  social?: {
    facebook?: string | null;
    instagram?: string | null;
    twitter?: string | null;
  };
};

// Transform API Member to TeamMember format for existing components
function toTeamMember(member: Member): TeamMember {
  return {
    ...member,
    department: member.category, // Legacy alias
    social: {
      facebook: member.facebook,
      instagram: member.instagram,
      twitter: member.twitter,
    },
  };
}

// =============================================================================
// FETCH OPTIONS
// Development: no-store (always fresh data, no cache)
// Production: cache with tags for on-demand revalidation (1 day default)
// =============================================================================
function getFetchOptions(tags: string[]): RequestInit & { next?: { tags?: string[]; revalidate?: number } } {
  if (isDev) {
    // In development, always fetch fresh data
    return { cache: "no-store" };
  }
  // In production, use cache with tags for on-demand revalidation
  return {
    next: {
      tags,
      revalidate: 86400, // 1 day fallback if on-demand revalidation fails
    },
  };
}

// =============================================================================
// SERVER-SIDE DATA FETCHING FUNCTIONS
// =============================================================================

/**
 * Get all active members
 * @param category Optional filter by category
 */
export async function getAllMembers(category?: MemberCategory): Promise<TeamMember[]> {
  try {
    const query = category ? `?category=${category}` : "";
    const res = await fetch(
      `${API_BASE_URL}/members${query}`,
      getFetchOptions(["members", category ? `members-${category}` : "members-all"])
    );

    if (!res.ok) {
      console.error("Failed to fetch members:", res.status);
      return [];
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data.map(toTeamMember);
    }
    return [];
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}

/**
 * Get member by slug
 */
export async function getMemberBySlug(slug: string): Promise<TeamMember | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/members/${slug}`,
      getFetchOptions(["members", `member-${slug}`])
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data.success && data.data) {
      return toTeamMember(data.data);
    }
    return null;
  } catch (error) {
    console.error("Error fetching member:", error);
    return null;
  }
}

/**
 * Get all member slugs (for static generation)
 */
export async function getAllMemberSlugs(): Promise<string[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/members/slugs`,
      getFetchOptions(["members", "members-slugs"])
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching slugs:", error);
    return [];
  }
}

// Convenience functions by category
export function getFundadores() {
  return getAllMembers("FUNDADORES");
}

export function getTitulares() {
  return getAllMembers("TITULARES");
}

export function getAsociados() {
  return getAllMembers("ASOCIADOS");
}

// Legacy aliases for backwards compatibility
export const getDirectiva = getFundadores;
export const getTecnico = getTitulares;
export const getMiembros = getAsociados;

// Helper to get members grouped by category
export async function getMembersGrouped(): Promise<{
  fundadores: TeamMember[];
  titulares: TeamMember[];
  asociados: TeamMember[];
}> {
  const allMembers = await getAllMembers();
  
  return {
    fundadores: allMembers.filter((m) => m.category === "FUNDADORES"),
    titulares: allMembers.filter((m) => m.category === "TITULARES"),
    asociados: allMembers.filter((m) => m.category === "ASOCIADOS"),
  };
}
