"use server";

import { cookies } from "next/headers";

/**
 * Save authentication token to cookies (server-side)
 * This should be called after successful login
 */
export async function saveAuthToken(token: string) {
  const cookieStore = await cookies();
  
  // Set token cookie with appropriate settings
  cookieStore.set("token", token, {
    httpOnly: false, // Need to be readable by client for API calls
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Clear authentication token from cookies
 */
export async function clearAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
