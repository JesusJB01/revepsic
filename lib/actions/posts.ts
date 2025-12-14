"use server";
/**
 * Posts Server Actions
 * 
 * Server-side actions for blog post management.
 * Uses Zod for validation and calls the backend API.
 */

import { revalidateTag } from "next/cache";
import { postSchema } from "@/lib/validations";
import { cookies } from "next/headers";

// API base URL from environment
const API_URL = process.env.API_URL || "http://localhost:3001/api/v1";

// Action state type
export type PostActionState = {
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
 * Create a new post
 */
export async function createPost(
  prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  const token = await getAuthToken();
  
  if (!token) {
    return {
      success: false,
      message: "No autorizado. Por favor, inicia sesión.",
    };
  }

  // Extract form data
  const rawData = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string || undefined,
    content: formData.get("content") as string,
    excerpt: formData.get("excerpt") as string || undefined,
    authorId: formData.get("authorId") as string,
    status: formData.get("status") as string || "DRAFT",
    isPremium: formData.get("isPremium") === "true",
    tagIds: JSON.parse(formData.get("tagIds") as string || "[]"),
    coverImage: formData.get("coverImage") as string || undefined,
  };

  // Validate with Zod
  const validation = postSchema.safeParse(rawData);
  
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
    const response = await fetch(`${API_URL}/posts`, {
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
      revalidateTag("posts", "max");
      
      return {
        success: true,
        message: "Post creado correctamente.",
        data: { id: data.data.id, slug: data.data.slug },
      };
    }

    return {
      success: false,
      message: data.message || "Error al crear el post.",
    };
  } catch (error) {
    console.error("Create post error:", error);
    return {
      success: false,
      message: "Error de conexión. Por favor, intenta de nuevo más tarde.",
    };
  }
}

/**
 * Update an existing post
 */
export async function updatePost(
  postId: string,
  prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  const token = await getAuthToken();
  
  if (!token) {
    return {
      success: false,
      message: "No autorizado. Por favor, inicia sesión.",
    };
  }

  // Extract form data
  const rawData = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string || undefined,
    content: formData.get("content") as string,
    excerpt: formData.get("excerpt") as string || undefined,
    authorId: formData.get("authorId") as string,
    status: formData.get("status") as string || "DRAFT",
    isPremium: formData.get("isPremium") === "true",
    tagIds: JSON.parse(formData.get("tagIds") as string || "[]"),
    coverImage: formData.get("coverImage") as string || undefined,
  };

  // Validate with Zod
  const validation = postSchema.safeParse(rawData);
  
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
    const response = await fetch(`${API_URL}/posts/${postId}`, {
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
      revalidateTag("posts", "max");
      revalidateTag(`post-${postId}`, "max");
      
      return {
        success: true,
        message: "Post actualizado correctamente.",
        data: { id: postId, slug: data.data.slug },
      };
    }

    return {
      success: false,
      message: data.message || "Error al actualizar el post.",
    };
  } catch (error) {
    console.error("Update post error:", error);
    return {
      success: false,
      message: "Error de conexión. Por favor, intenta de nuevo más tarde.",
    };
  }
}

/**
 * Delete a post
 */
export async function deletePost(postId: string): Promise<PostActionState> {
  const token = await getAuthToken();
  
  if (!token) {
    return {
      success: false,
      message: "No autorizado. Por favor, inicia sesión.",
    };
  }

  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Revalidate cache
      revalidateTag("posts", "max");
      
      return {
        success: true,
        message: "Post eliminado correctamente.",
      };
    }

    return {
      success: false,
      message: data.message || "Error al eliminar el post.",
    };
  } catch (error) {
    console.error("Delete post error:", error);
    return {
      success: false,
      message: "Error de conexión. Por favor, intenta de nuevo más tarde.",
    };
  }
}
