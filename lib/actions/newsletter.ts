"use server";
/**
 * Newsletter Server Actions
 * 
 * Server-side actions for newsletter subscription.
 * Uses Zod for validation and returns typed results.
 */

import { newsletterSchema } from "@/lib/validations";

// API base URL from environment
const API_URL = process.env.API_URL || "http://localhost:3001/api/v1";

// Action state type for useActionState
export type NewsletterActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

/**
 * Subscribe to newsletter
 * 
 * This action validates the input, calls the backend API,
 * and returns a structured response for the form.
 */
export async function subscribeToNewsletter(
  prevState: NewsletterActionState,
  formData: FormData
): Promise<NewsletterActionState> {
  // Extract form data
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    source: formData.get("source") as string || "homepage_newsletter",
  };

  // Validate with Zod
  const validation = newsletterSchema.safeParse(rawData);
  
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
    // Call backend API
    const response = await fetch(`${API_URL}/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Check if already subscribed
      const msg = data.message?.toLowerCase() || "";
      if (msg.includes("already subscribed") || msg.includes("ya suscrito")) {
        return {
          success: true,
          message: "Este correo ya está suscrito a nuestro newsletter. ¡Gracias por tu interés!",
        };
      }
      
      return {
        success: true,
        message: "¡Revisa tu email para confirmar tu suscripción!",
      };
    }

    return {
      success: false,
      message: data.message || "Error al suscribirse. Intenta de nuevo.",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: "Error de conexión. Por favor, intenta de nuevo más tarde.",
    };
  }
}
