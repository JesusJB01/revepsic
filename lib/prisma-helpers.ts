/**
 * Type utilities for converting Prisma types to API types
 * This helps maintain consistency between database and API layer
 */

import { Prisma } from "@/app/generated/prisma";

/**
 * Helper type to convert Pris ma JsonValue to typed arrays
 */
export type JsonArray = Prisma.JsonArray;
export type JsonValue = Prisma.JsonValue;

/**
 * Helper to safely convert JsonArray to string[]
 */
export function toStringArray(val: JsonValue | null | undefined): string[] {
  if (Array.isArray(val)) {
    return val.filter((item): item is string => typeof item === 'string');
  }
  return [];
}

/**
 * Helper to safely convert JsonArray to any[]
 */
export function toTypedArray<T = any>(val: JsonValue | null | undefined): T[] {
  if (Array.isArray(val)) {
    return val as T[];
  }
  return [];
}

/**
 * Helper to safely convert JsonValue to an object
 */
export function toObject<T = Record<string, any>>(val: JsonValue | null | undefined): T | null {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as T;
  }
  return null;
}
