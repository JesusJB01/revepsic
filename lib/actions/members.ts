"use server";
/**
 * Members Server Actions
 * 
 * Server-side actions for team member management.
 * Uses Zod for validation and calls the backend API.
 */

import { revalidateTag } from "next/cache";
import { memberSchema } from "@/lib/validations";
import { cookies } from "next/headers";

// API base URL from environment
const API_URL = process.env.API_URL || "http://localhost:3001/api/v1";

// Action state type
export type MemberActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  data?: { id: string; slug: string };
};

/**
 * Get auth token from cookies
 */
async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || null;
}

/**
 * Generate slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Create a new member
 */
export async function createMember(
  prevState: MemberActionState,
  formData: FormData
): Promise<MemberActionState> {
  const token = await getAuthToken();
  
  if (!token) {
    return {
      success: false,
      message: "No autorizado. Por favor, inicia sesión.",
    };
  }

  // Extract form data
  const name = formData.get("name") as string;
  const rawData = {
    name,
    slug: (formData.get("slug") as string) || generateSlug(name),
    position: formData.get("position") as string,
    category: formData.get("category") as string,
    bio: formData.get("bio") as string,
    image: formData.get("image") as string || "",
    whatsapp: formData.get("whatsapp") as string || undefined,
    phone: formData.get("phone") as string || undefined,
    email: formData.get("email") as string || undefined,
    website: formData.get("website") as string || undefined,
    facebook: formData.get("facebook") as string || undefined,
    instagram: formData.get("instagram") as string || undefined,
    twitter: formData.get("twitter") as string || undefined,
    linkedin: formData.get("linkedin") as string || undefined,
    city: formData.get("city") as string || undefined,
    state: formData.get("state") as string || undefined,
    country: formData.get("country") as string || undefined,
    isActive: formData.get("isActive") === "true",
  };

  // Validate with Zod
  const validation = memberSchema.safeParse(rawData);
  
  if (!validation.success) {
    const errors: Record<string, string> = {};
    validation.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!errors[path]) {
        errors[path] = issue.message;
      }
    });
    
    return {
      success: false,
      message: "Por favor, corrige los errores del formulario.",
      errors,
    };
  }

  try {
    const response = await fetch(`${API_URL}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(validation.data),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Revalidate cache
      revalidateTag("members", "max");
      
      return {
        success: true,
        message: "Miembro creado correctamente.",
        data: { id: data.data.id, slug: data.data.slug },
      };
    }

    return {
      success: false,
      message: data.message || "Error al crear el miembro.",
    };
  } catch (error) {
    console.error("Create member error:", error);
    return {
      success: false,
      message: "Error de conexión. Por favor, intenta de nuevo más tarde.",
    };
  }
}

/**
 * Update an existing member
 */
export async function updateMember(
  memberId: string,
  prevState: MemberActionState,
  formData: FormData
): Promise<MemberActionState> {
  const token = await getAuthToken();
  
  if (!token) {
    return {
      success: false,
      message: "No autorizado. Por favor, inicia sesión.",
    };
  }

  // Extract form data
  const rawData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    position: formData.get("position") as string,
    category: formData.get("category") as string,
    bio: formData.get("bio") as string,
    image: formData.get("image") as string || "",
    whatsapp: formData.get("whatsapp") as string || undefined,
    phone: formData.get("phone") as string || undefined,
    email: formData.get("email") as string || undefined,
    website: formData.get("website") as string || undefined,
    facebook: formData.get("facebook") as string || undefined,
    instagram: formData.get("instagram") as string || undefined,
    twitter: formData.get("twitter") as string || undefined,
    linkedin: formData.get("linkedin") as string || undefined,
    city: formData.get("city") as string || undefined,
    state: formData.get("state") as string || undefined,
    country: formData.get("country") as string || undefined,
    isActive: formData.get("isActive") === "true",
  };

  // Validate with Zod
  const validation = memberSchema.safeParse(rawData);
  
  if (!validation.success) {
    const errors: Record<string, string> = {};
    validation.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!errors[path]) {
        errors[path] = issue.message;
      }
    });
    
    return {
      success: false,
      message: "Por favor, corrige los errores del formulario.",
      errors,
    };
  }

  try {
    const response = await fetch(`${API_URL}/members/${memberId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(validation.data),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Revalidate cache
      revalidateTag("members", "max");
      revalidateTag(`member-${memberId}`, "max");
      
      return {
        success: true,
        message: "Miembro actualizado correctamente.",
        data: { id: memberId, slug: data.data.slug },
      };
    }

    return {
      success: false,
      message: data.message || "Error al actualizar el miembro.",
    };
  } catch (error) {
    console.error("Update member error:", error);
    return {
      success: false,
      message: "Error de conexión. Por favor, intenta de nuevo más tarde.",
    };
  }
}

/**
 * Delete a member
 */
export async function deleteMember(memberId: string): Promise<MemberActionState> {
  const token = await getAuthToken();
  
  if (!token) {
    return {
      success: false,
      message: "No autorizado. Por favor, inicia sesión.",
    };
  }

  try {
    const response = await fetch(`${API_URL}/members/${memberId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Revalidate cache
      revalidateTag("members", "max");
      
      return {
        success: true,
        message: "Miembro eliminado correctamente.",
      };
    }

    return {
      success: false,
      message: data.message || "Error al eliminar el miembro.",
    };
  } catch (error) {
    console.error("Delete member error:", error);
    return {
      success: false,
      message: "Error de conexión. Por favor, intenta de nuevo más tarde.",
    };
  }
}
