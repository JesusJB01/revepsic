"use server";

import { revalidateTag, revalidatePath } from "next/cache";

/**
 * Revalidate authors cache
 */
export async function revalidateAuthors(slug?: string) {
  revalidateTag("authors", "max");
  
  if (slug) {
    revalidateTag(`author-${slug}`, "max");
    revalidateTag(`author-${slug}-posts`, "max");
    revalidatePath(`/blog/autor/${slug}`, "page");
  }
}

/**
 * Revalidate posts cache
 */
export async function revalidatePosts(slug?: string) {
  revalidateTag("posts", "max");
  
  if (slug) {
    revalidateTag(`post-${slug}`, "max");
    revalidatePath(`/blog/${slug}`, "page");
  }
  
  revalidatePath("/blog", "page");
  revalidatePath("/", "page");
}

/**
 * Revalidate members cache
 */
export async function revalidateMembers(slug?: string) {
  revalidateTag("members", "max");
  revalidateTag("members-all", "max");
  
  if (slug) {
    revalidateTag(`member-${slug}`, "max");
    revalidatePath(`/m/${slug}`, "page");
    revalidatePath(`/directorio/${slug}`, "page");
  }
  
  revalidatePath("/equipo", "page");
  revalidatePath("/directorio", "page");
}

/**
 * Revalidate tags cache
 */
export async function revalidateTags(slug?: string) {
  revalidateTag("tags", "max");
  
  if (slug) {
    revalidateTag(`tag-${slug}`, "max");
    revalidatePath(`/blog/categoria/${slug}`, "page");
  }
  
  revalidatePath("/blog", "page");
}

/**
 * Revalidate all caches
 */
export async function revalidateAll() {
  revalidateTag("posts", "max");
  revalidateTag("tags", "max");
  revalidateTag("authors", "max");
  revalidateTag("members", "max");
  
  revalidatePath("/blog", "page");
  revalidatePath("/equipo", "page");
  revalidatePath("/directorio", "page");
  revalidatePath("/", "page");
}
