/**
 * Team Members Data - Prisma Direct Access
 * 
 * These functions query the database directly using Prisma for Server Components.
 * Uses unstable_cache for optimized caching with on-demand revalidation.
 */

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { Member as PrismaMember, MemberCategory as PrismaMemberCategory, Comment } from "@/app/generated/prisma";

// Re-export types for convenience
export type MemberCategory = PrismaMemberCategory;

// Type for directory filters
export interface DirectoryFilters {
  city?: string;
  specialty?: string;
  therapy?: string;
  category?: MemberCategory;
  consultationType?: string;
  acceptsInsurance?: boolean;
}

// Helper types for JSON fields
export interface Education {
  degree: string;
  field: string;
  institution: string;
  country?: string;
  year?: number;
}

export interface ServiceItem {
  name: string;
  price: number;
  currency?: string;
  duration?: string;
}

export interface MemberLocation {
  name: string;
  type: "PRESENCIAL" | "ONLINE" | "DOMICILIO";
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  services?: ServiceItem[];
}

export interface PriceRange {
  min: number;
  max: number;
  currency?: string;
  notes?: string;
}

export interface ScheduleSlot {
  start: string;
  end: string;
}

export interface Schedule {
  timezone?: string;
  notes?: string;
  slots?: Record<string, ScheduleSlot[]>;
}

export interface MemberComment {
  id: string;
  memberId: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  content: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Legacy type alias for backwards compatibility with existing components
export type TeamMember = PrismaMember & {
  department?: MemberCategory; // Legacy alias for category
  social?: {
    facebook?: string | null;
    instagram?: string | null;
    twitter?: string | null;
  };
};

// DirectoryMember with properly typed JSON fields
export interface DirectoryMember extends Omit<PrismaMember, 'specialties' | 'therapies' | 'disorders' | 'languages' | 'targetAges' | 'certifications' | 'education' | 'consultationTypes' | 'insuranceProviders' | 'priceRange' | 'schedule' | 'locations'> {
  specialties?: string[] | null;
  therapies?: string[] | null;
  disorders?: string[] | null;
  languages?: string[] | null;
  targetAges?: string[] | null;
  certifications?: string[] | null;
  education?: Education[] | null;
  consultationTypes?: ("PRESENCIAL" | "ONLINE" | "DOMICILIO")[] | null;
  insuranceProviders?: string[] | null;
  priceRange?: PriceRange | null;
  schedule?: Schedule | null;
  locations?: MemberLocation[] | null;
  comments?: MemberComment[];
}


// Transform Prisma Member to TeamMember format for existing components
function toTeamMember(member: PrismaMember): TeamMember {
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

// Transform Prisma Member to DirectoryMember with properly typed JSON fields
function toDirectoryMember(member: PrismaMember & { comments?: Comment[] }): DirectoryMember {
  return {
    ...member,
    specialties: member.specialties as string[] | null,
    therapies: member.therapies as string[] | null,
    disorders: member.disorders as string[] | null,
    languages: member.languages as string[] | null,
    targetAges: member.targetAges as string[] | null,
    certifications: member.certifications as string[] | null,
    education: member.education as Education[] | null,
    consultationTypes: member.consultationTypes as ("PRESENCIAL" | "ONLINE" | "DOMICILIO")[] | null,
    insuranceProviders: member.insuranceProviders as string[] | null,
    priceRange: member.priceRange as PriceRange | null,
    schedule: member.schedule as Schedule | null,
    locations: member.locations as MemberLocation[] | null,
    comments: member.comments as MemberComment[] | undefined,
  };
}

// =============================================================================
// CACHED DATA FETCHING FUNCTIONS (using unstable_cache)
// =============================================================================

/**
 * Get all active members with optional category filter
 * Cached for 1 hour with on-demand revalidation via tags
 */
export const getAllMembers = unstable_cache(
  async (category?: MemberCategory): Promise<TeamMember[]> => {
    try {
      const members = await prisma.member.findMany({
        where: {
          isActive: true,
          ...(category && { category }),
        },
        orderBy: { createdAt: "desc" },
      });

      return members.map(toTeamMember);
    } catch (error) {
      console.error("Error fetching members:", error);
      return [];
    }
  },
  ["members"],
  {
    tags: ["members"],
    revalidate: 3600, // 1 hour
  }
);

/**
 * Get member by slug
 * Cached per member with on-demand revalidation
 */
export async function getMemberBySlug(slug: string): Promise<TeamMember | null> {
  const getCachedMember = unstable_cache(
    async () => {
      try {
        const member = await prisma.member.findUnique({
          where: { slug, isActive: true },
        });

        return member ? toTeamMember(member) : null;
      } catch (error) {
        console.error("Error fetching member:", error);
        return null;
      }
    },
    [`member-${slug}`],
    {
      tags: ["members", `member-${slug}`],
      revalidate: 3600,
    }
  );

  return getCachedMember();
}

/**
 * Get all member slugs (for static generation)
 */
export const getAllMemberSlugs = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const members = await prisma.member.findMany({
        where: { isActive: true },
        select: { slug: true },
      });

      return members.map((m) => m.slug);
    } catch (error) {
      console.error("Error fetching slugs:", error);
      return [];
    }
  },
  ["members-slugs"],
  {
    tags: ["members"],
    revalidate: 3600,
  }
);

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

/**
 * Helper to get members grouped by category
 */
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

// =============================================================================
// DIRECTORY DATA FETCHING FUNCTIONS
// For the public psychologist directory with full profile data
// =============================================================================

/**
 * Get all members from the directory (full data) with optional filters
 */
export async function getDirectoryMembers(filters?: DirectoryFilters): Promise<DirectoryMember[]> {
  const getCachedDirectory = unstable_cache(
    async () => {
      try {
        // Build where clause from filters
        const where: Record<string, unknown> = { isActive: true };
        
        if (filters?.category) where.category = filters.category;
        if (filters?.city) where.city = { contains: filters.city, mode: "insensitive" };
        if (filters?.acceptsInsurance !== undefined) where.acceptsInsurance = filters.acceptsInsurance;

        const members = await prisma.member.findMany({
          where,
          orderBy: [
            { isVerified: "desc" },
            { createdAt: "desc" },
          ],
        });

        // Filter by specialty, therapy, consultationType (JSON fields)
        let filtered = members;

        if (filters?.specialty) {
          filtered = filtered.filter((m) => {
            const specs = m.specialties as string[] | null;
            return specs?.some((s) => 
              s.toLowerCase().includes(filters.specialty!.toLowerCase())
            );
          });
        }

        if (filters?.therapy) {
          filtered = filtered.filter((m) => {
            const therapies = m.therapies as string[] | null;
            return therapies?.some((t) => 
              t.toLowerCase().includes(filters.therapy!.toLowerCase())
            );
          });
        }

        if (filters?.consultationType) {
          filtered = filtered.filter((m) => {
            const types = m.consultationTypes as string[] | null;
            return types?.includes(filters.consultationType!);
          });
        }

        return filtered.map(toDirectoryMember);
      } catch (error) {
        console.error("Error fetching directory:", error);
        return [];
      }
    },
    ["directory", JSON.stringify(filters || {})],
    {
      tags: ["directory", "members"],
      revalidate: 3600,
    }
  );

  return getCachedDirectory();
}

/**
 * Get a single member from directory by slug (full data with comments)
 */
export async function getDirectoryMemberBySlug(slug: string): Promise<DirectoryMember | null> {
  const getCachedDirectoryMember = unstable_cache(
    async () => {
      try {
        const member = await prisma.member.findUnique({
          where: { slug, isActive: true },
          include: {
            comments: {
              where: { isApproved: true },
              orderBy: { createdAt: "desc" },
            },
          },
        });

        return member ? toDirectoryMember(member) : null;
      } catch (error) {
        console.error("Error fetching directory member:", error);
        return null;
      }
    },
    [`directory-${slug}`],
    {
      tags: ["directory", `directory-${slug}`, "members"],
      revalidate: 3600,
    }
  );

  return getCachedDirectoryMember();
}
