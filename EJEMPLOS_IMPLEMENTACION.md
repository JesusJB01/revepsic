# 💻 EJEMPLOS DE IMPLEMENTACIÓN - MEJORAS REVEPSIC

Este documento contiene ejemplos de código listos para usar para implementar las mejoras sugeridas.

---

## 1. Sistema de Notificaciones con Sonner

### Instalación
```bash
npm install sonner
```

### Configuración en `app/layout.tsx`
```typescript
import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
```

### Uso en Formularios
```typescript
// ❌ Antes
alert("Error al crear el post");

// ✅ Después
import { toast } from 'sonner';

// Éxito
toast.success("Post creado exitosamente");

// Error
toast.error("Error al crear el post", {
  description: "Verifica los datos e intenta de nuevo"
});

// Carga
const toastId = toast.loading("Guardando...");
// ... operación
toast.success("Guardado", { id: toastId });
```

---

## 2. WhatsApp Inteligente

### Componente Mejorado
```typescript
// components/MemberProfile.tsx
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  member: {
    name: string;
    whatsapp: string;
  };
  defaultMessage?: string;
}

export function WhatsAppButton({ member, defaultMessage }: WhatsAppButtonProps) {
  const message = defaultMessage || 
    `Hola Dr/a. ${member.name}, le vi en REVEPSIC y quisiera consultar por...`;
  
  const whatsappUrl = `https://wa.me/${member.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      <MessageCircle className="w-5 h-5" />
      Contactar por WhatsApp
    </a>
  );
}
```

---

## 3. Server Action para Newsletter

### Crear `app/actions/newsletter.ts`
```typescript
'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const newsletterSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  source: z.string().optional(),
});

export async function subscribeNewsletter(formData: FormData) {
  const rawData = {
    email: formData.get('email'),
    name: formData.get('name'),
    source: formData.get('source') || 'homepage',
  };

  // Validar
  const result = newsletterSchema.safeParse(rawData);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  try {
    // Llamar a tu API backend
    const response = await fetch(`${process.env.API_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || 'Error al suscribirse',
      };
    }

    return {
      success: true,
      message: '¡Revisa tu email para confirmar tu suscripción!',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error de conexión. Intenta de nuevo.',
    };
  }
}
```

### Actualizar `components/Newsletter.tsx`
```typescript
'use client';

import { useActionState } from 'react';
import { subscribeNewsletter } from '@/app/actions/newsletter';
import { toast } from 'sonner';

export default function Newsletter() {
  const [state, formAction, isPending] = useActionState(subscribeNewsletter, null);

  // Mostrar notificaciones basadas en el estado
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.error) {
      toast.error("Error de validación", {
        description: Object.values(state.error).flat().join(', ')
      });
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <input name="name" required />
      <input name="source" type="hidden" value="homepage_newsletter" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Suscribiendo...' : 'Suscribirse'}
      </button>
    </form>
  );
}
```

---

## 4. Validación con Zod + React Hook Form

### Instalación
```bash
npm install zod react-hook-form @hookform/resolvers
```

### Esquema de Validación
```typescript
// lib/validations/post.ts
import { z } from 'zod';

export const postSchema = z.object({
  title: z.string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(200, "El título es demasiado largo"),
  slug: z.string()
    .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones")
    .min(3, "El slug debe tener al menos 3 caracteres"),
  excerpt: z.string()
    .max(500, "El extracto es demasiado largo")
    .optional(),
  content: z.string()
    .min(50, "El contenido debe tener al menos 50 caracteres"),
  authorId: z.string().uuid("Selecciona un autor válido"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  isPremium: z.boolean(),
  tagIds: z.array(z.string().uuid()).optional(),
});

export type PostFormData = z.infer<typeof postSchema>;
```

### Uso en Formulario
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, type PostFormData } from '@/lib/validations/post';
import { toast } from 'sonner';

export default function NewPostPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      status: 'DRAFT',
      isPremium: false,
      tagIds: [],
    },
  });

  const onSubmit = async (data: PostFormData) => {
    try {
      const response = await postsApi.create(data);
      if (response.success) {
        toast.success("Post creado exitosamente");
        router.push("/admin/posts");
      } else {
        toast.error(response.message || "Error al crear el post");
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('title')} />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>
      {/* ... más campos */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
```

---

## 5. Cross-Linking Blog ↔ Directorio

### En Artículo del Blog
```typescript
// app/(public)/blog/[slug]/page.tsx
import Link from 'next/link';

export default async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  
  return (
    <article>
      {/* Contenido del artículo */}
      
      {/* Sidebar con autor */}
      <aside>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3>Escrito por</h3>
          <div className="flex items-center gap-4">
            <Image 
              src={post.author.image} 
              alt={post.author.name}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <h4>{post.author.name}</h4>
              <p className="text-sm text-gray-600">{post.author.bio}</p>
              <Link 
                href={`/directorio/${post.author.slug}`}
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Ver perfil completo →
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </article>
  );
}
```

### En Perfil del Directorio
```typescript
// app/(public)/directorio/[slug]/page.tsx
import { getPostsByAuthor } from '@/lib/data/posts';

export default async function MemberProfilePage({ params }) {
  const member = await getDirectoryMemberBySlug(params.slug);
  const articles = await getPostsByAuthor(member.id);
  
  return (
    <div>
      {/* Perfil del miembro */}
      
      {/* Sección de artículos */}
      {articles.length > 0 && (
        <section>
          <h2>Publicaciones y Artículos</h2>
          <div className="grid gap-4">
            {articles.map(article => (
              <Link 
                key={article.id}
                href={`/blog/${article.slug}`}
                className="block p-4 border rounded-lg hover:shadow-md transition"
              >
                <h3>{article.title}</h3>
                <p className="text-sm text-gray-600">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

---

## 6. Configuración React Compiler

### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true, // ✅ Activar React Compiler
  },
  images: {
    // ... configuración existente
  },
}

module.exports = nextConfig
```

---

## 7. Mejora de Manejo de Errores Global

### Crear `components/ErrorBoundary.tsx`
```typescript
'use client';

import { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error capturado:', error, errorInfo);
    // Aquí puedes enviar el error a un servicio de monitoreo (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Algo salió mal</h1>
            <p className="text-gray-600 mb-4">
              Ha ocurrido un error inesperado. Por favor, recarga la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Usar en `app/layout.tsx`
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

## 8. Crear `.env.example`

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/revepsic"

# API
API_URL="http://localhost:3001/api/v1"
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"

# Auth
JWT_SECRET="your-secret-key-here"

# Revalidation
REVALIDATION_SECRET="your-revalidation-secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 📝 Notas de Implementación

1. **Server Actions**: Requieren Next.js 14+ (ya tienes 16, perfecto)
2. **Zod**: Ya está en `node_modules`, solo necesitas instalarlo explícitamente
3. **Sonner**: Alternativa ligera a react-hot-toast, muy recomendada
4. **React Hook Form**: Mejor rendimiento que formularios controlados manualmente

---

**Siguiente paso:** Comenzar con las mejoras de "Quick Win" (notificaciones, WhatsApp, React Compiler)

