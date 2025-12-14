"use server";
/**
 * Authors Server Actions
 * 
 * Server-side actions for author management.
 * Uses Zod for validation and calls the backend API.
 */

import { revalidateTag } from "next/cache";
import { authorSchema } from "@/lib/validations";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

// API base URL from environment
const API_URL = process.env.API_URL || "http://localhost:3001/api/v1";

/**
 * Fetch all authors from database (for admin)
 */
export async function fetchAuthorsFromDb() {
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
      specialty: author.specialty,
      profession: author.profession,
      website: author.website,
      twitter: author.twitter,
      linkedin: author.linkedin,
      createdAt: author.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}

// Action state type
export type AuthorActionState = {
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
 * Create a new author
 */
export async function createAuthor(
  prevState: AuthorActionState,
  formData: FormData
): Promise<AuthorActionState> {
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
    email: formData.get("email") as string || undefined,
    bio: formData.get("bio") as string || undefined,
    avatarUrl: formData.get("avatarUrl") as string || undefined,
  };

  // Validate with Zod
  const validation = authorSchema.safeParse(rawData);
  
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
    const response = await fetch(`${API_URL}/authors`, {
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
      revalidateTag("authors", "max");
      
      return {
        success: true,
        message: "Autor creado correctamente.",
        data: { id: data.data.id, slug: data.data.slug },
      };
    }

    return {
      success: false,
      message: data.message || "Error al crear el autor.",
    };
  } catch (error) {
    console.error("Create author error:", error);
    return {
      success: false,
      message: "Error de conexión. Por favor, intenta de nuevo más tarde.",
    };
  }
}

/**
 * Update an existing author
 */
export async function updateAuthor(
  authorId: string,
  prevState: AuthorActionState,
  formData: FormData
): Promise<AuthorActionState> {
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
    email: formData.get("email") as string || undefined,
    bio: formData.get("bio") as string || undefined,
    avatarUrl: formData.get("avatarUrl") as string || undefined,
  };

  // Validate with Zod
  const validation = authorSchema.safeParse(rawData);
  
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
    const response = await fetch(`${API_URL}/authors/${authorId}`, {
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
      revalidateTag("authors", "max");
      
      return {
        success: true,
        message: "Autor actualizado correctamente.",
        data: { id: authorId, slug: data.data.slug },
      };
    }

    return {
      success: false,
      message: data.message || "Error al actualizar el autor.",
    };
  } catch (error) {
    console.error("Update author error:", error);
    return {
      success: false,
      message: "Error de conexión. Por favor, intenta de nuevo más tarde.",
    };
  }
}

/**
 * Delete an author
 */
export async function deleteAuthor(authorId: string): Promise<AuthorActionState> {
  const token = await getAuthToken();
  
  if (!token) {
    return {
      success: false,
      message: "No autorizado. Por favor, inicia sesión.",
    };
  }

  try {
    const response = await fetch(`${API_URL}/authors/${authorId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Revalidate cache
      revalidateTag("authors", "max");
      
      return {
        success: true,
        message: "Autor eliminado correctamente.",
      };
    }

    return {
      success: false,
      message: data.message || "Error al eliminar el autor.",
    };
  } catch (error) {
    console.error("Delete author error:", error);
    return {
      success: false,
      message: "Error de conexión. Por favor, intenta de nuevo más tarde.",
    };
  }
}
