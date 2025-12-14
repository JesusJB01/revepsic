/**
 * Validation Schemas - Zod
 * 
 * Centralized validation schemas for all forms in the admin panel.
 * These schemas can be used both client-side and in Server Actions.
 */

import { z } from "zod";

// =============================================================================
// POST VALIDATION
// =============================================================================

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(200, "El título no puede exceder 200 caracteres"),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones")
    .optional(),
  content: z
    .string()
    .min(10, "El contenido debe tener al menos 10 caracteres"),
  excerpt: z
    .string()
    .max(500, "El extracto no puede exceder 500 caracteres")
    .optional(),
  authorId: z
    .string()
    .min(1, "Debes seleccionar un autor"),
  status: z
    .enum(["DRAFT", "PUBLISHED", "REVIEW", "ARCHIVED"])
    .default("DRAFT"),
  isPremium: z.boolean().default(false),
  tagIds: z.array(z.string()).optional(),
  coverImage: z.string().url("URL de imagen inválida").optional().or(z.literal("")),
  metaTitle: z.string().max(70, "El meta título no puede exceder 70 caracteres").optional(),
  metaDescription: z.string().max(160, "La meta descripción no puede exceder 160 caracteres").optional(),
});

export type PostFormData = z.infer<typeof postSchema>;

// =============================================================================
// MEMBER VALIDATION
// =============================================================================

export const memberSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  position: z
    .string()
    .min(2, "El cargo debe tener al menos 2 caracteres")
    .max(100, "El cargo no puede exceder 100 caracteres"),
  category: z.enum(["FUNDADORES", "TITULARES", "ASOCIADOS"]),
  bio: z
    .string()
    .min(10, "La biografía debe tener al menos 10 caracteres"),
  image: z
    .string()
    .url("URL de imagen inválida")
    .or(z.literal("")),
  whatsapp: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  facebook: z.string().url("URL inválida").optional().or(z.literal("")),
  instagram: z.string().url("URL inválida").optional().or(z.literal("")),
  twitter: z.string().url("URL inválida").optional().or(z.literal("")),
  linkedin: z.string().url("URL inválida").optional().or(z.literal("")),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type MemberFormData = z.infer<typeof memberSchema>;

// =============================================================================
// AUTHOR VALIDATION
// =============================================================================

export const authorSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: z
    .string()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(1000, "La biografía no puede exceder 1000 caracteres")
    .optional(),
  avatarUrl: z
    .string()
    .url("URL de imagen inválida")
    .optional()
    .or(z.literal("")),
  specialty: z.string().optional(),
  profession: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  twitter: z.string().optional(),
  linkedin: z.string().url("URL inválida").optional().or(z.literal("")),
  github: z.string().optional(),
});

export type AuthorFormData = z.infer<typeof authorSchema>;

// =============================================================================
// NEWSLETTER VALIDATION
// =============================================================================

export const newsletterSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: z
    .string()
    .email("Por favor, ingresa un correo válido"),
  source: z.string().optional(),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// =============================================================================
// LOGIN VALIDATION
// =============================================================================

export const loginSchema = z.object({
  email: z
    .string()
    .email("Por favor, ingresa un correo válido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// =============================================================================
// USER VALIDATION
// =============================================================================

export const userSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z
    .string()
    .email("Por favor, ingresa un correo válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]).default("EDITOR"),
});

export type UserFormData = z.infer<typeof userSchema>;

// =============================================================================
// IMAGE VALIDATION
// =============================================================================

export const imageValidation = {
  maxSize: 5 * 1024 * 1024, // 5MB
  validTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  
  validateFile: (file: File): { valid: boolean; error?: string } => {
    if (!imageValidation.validTypes.includes(file.type)) {
      return { valid: false, error: "Formato no válido. Usa JPG, PNG, GIF o WEBP." };
    }
    if (file.size > imageValidation.maxSize) {
      return { valid: false, error: "La imagen es muy grande. Máximo 5MB." };
    }
    return { valid: true };
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Safely parse form data with a Zod schema
 * Returns either the validated data or formatted error messages
 */
export function parseFormData<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Format errors into a simple object
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  });

  return { success: false, errors };
}
