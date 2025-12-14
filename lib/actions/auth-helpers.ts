/**
 * Authentication Helper for Server Actions
 * 
 * Provides secure authentication verification for Server Actions.
 * Only ADMIN users can access protected actions.
 */

import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://localhost:3001/api/v1";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
}

/**
 * Get authentication token from cookies
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || null;
}

/**
 * Verify user is authenticated and return user data
 * Calls backend /auth/me endpoint to validate token
 */
export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  const token = await getAuthToken();
  
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store", // Don't cache auth requests
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data as AuthUser;
    }

    return null;
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}

/**
 * Verify user is authenticated AND has ADMIN role
 * Throws error if not authorized (for use in Server Actions)
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    throw new Error("No autorizado. Por favor, inicia sesión.");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Acceso denegado. Se requiere rol de administrador.");
  }

  return user;
}

/**
 * Verify user is authenticated (any role)
 * Throws error if not authorized
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    throw new Error("No autorizado. Por favor, inicia sesión.");
  }

  return user;
}
