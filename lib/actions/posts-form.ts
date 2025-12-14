"use server";

import { getAllTags as getTags, getAllAuthors as getAuthors } from "@/lib/data/posts";

/**
 * Server Action to get all tags
 * Can be called from client components
 */
export async function getTagsForForm() {
  try {
    const tags = await getTags();
    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

/**
 * Server Action to get all authors
 * Can be called from client components
 */
export async function getAuthorsForForm() {
  try {
    const authors = await getAuthors();
    return authors;
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}
