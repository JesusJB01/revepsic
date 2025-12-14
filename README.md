# REVEPSIC - Frontend

Plataforma web para la Red Venezolana de Psicología basada en Evidencia (REVEPSIC).

## 🚀 Stack Tecnológico

- **Framework**: [Next.js 16](https://nextjs.org/) con App Router
- **React**: React 19 con Server Components
- **Base de Datos**: PostgreSQL (Supabase) via Prisma 7
- **Estilos**: Tailwind CSS 4
- **Animaciones**: Framer Motion + Lottie
- **Validación**: Zod
- **Notificaciones**: Sonner
- **Temas**: next-themes (light/dark mode)

## 📁 Estructura del Proyecto

```
project-revepsic/
├── app/                          # App Router de Next.js
│   ├── (dashboard)/admin/        # Panel de administración
│   ├── (public)/                 # Páginas públicas
│   │   ├── blog/                 # Blog con posts
│   │   ├── directorio/           # Directorio de psicólogos
│   │   ├── equipo/               # Página del equipo
│   │   └── planes/               # Planes de membresía
│   ├── api/                      # API Routes
│   └── generated/prisma/         # Cliente Prisma generado
├── components/                   # Componentes React
│   ├── ui/                       # Componentes UI reutilizables
│   └── animations/               # Componentes de animación
├── lib/                          # Utilidades y lógica compartida
│   ├── actions/                  # Server Actions
│   ├── data/                     # Funciones de acceso a datos
│   └── validations/              # Esquemas de validación Zod
├── prisma/                       # Schema de Prisma
└── public/                       # Assets estáticos
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# Base de datos (Supabase PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database"

# API Backend
API_URL="http://localhost:4000/api/v1"

# Próximamente
# NEXT_PUBLIC_SITE_URL="https://revepsic.org"
```

### Instalación

```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npx prisma generate

# Ejecutar en desarrollo
npm run dev
```

## 📦 Características Principales

### 🗄️ Acceso a Datos

El proyecto usa **Prisma 7** con acceso directo a Supabase para operaciones de lectura, eliminando el hop al backend Express:

```typescript
// lib/data/team.ts - Ejemplo de uso
import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getAllMembers = unstable_cache(
  async () => prisma.member.findMany({ where: { isActive: true } }),
  ["members"],
  { tags: ["members"], revalidate: 3600 }
);
```

### 🎯 Server Actions

Los formularios usan Server Actions para operaciones de escritura:

```typescript
// lib/actions/newsletter.ts
"use server";
import { newsletterSchema } from "@/lib/validations";

export async function subscribeToNewsletter(prevState, formData) {
  const validation = newsletterSchema.safeParse({...});
  // ...
}
```

**Acciones disponibles**:
- `lib/actions/newsletter.ts` - Suscripción al newsletter
- `lib/actions/posts.ts` - CRUD de posts
- `lib/actions/authors.ts` - CRUD de autores
- `lib/actions/members.ts` - CRUD de miembros

### ✅ Validación

Esquemas Zod centralizados en `lib/validations/index.ts`:

```typescript
import { postSchema, memberSchema, newsletterSchema } from "@/lib/validations";

// Validar datos antes de enviar
const result = postSchema.safeParse(formData);
if (!result.success) {
  // Manejar errores
}
```

### 🔔 Notificaciones

Sistema de notificaciones toast con Sonner:

```typescript
import { toast } from "sonner";

// Éxito
toast.success("Operación completada");

// Error con descripción
toast.error("Error al guardar", { 
  description: "El servidor no respondió" 
});
```

### 🖼️ Componentes UI

Componentes animados con Framer Motion:

- `FadeIn` - Animación de entrada con fade
- `TeamMemberCard` - Tarjeta de miembro del equipo
- `DirectoryCard` - Tarjeta de psicólogo en directorio
- `Newsletter` - Formulario de suscripción
- `Navbar` - Navegación principal con soporte móvil

## 🛠️ Comandos

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm run start

# Generar cliente Prisma
npx prisma generate

# Ver base de datos
npx prisma studio
```

## 📱 Páginas Principales

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal |
| `/blog` | Lista de artículos |
| `/blog/[slug]` | Artículo individual |
| `/equipo` | Equipo de REVEPSIC |
| `/directorio` | Directorio de psicólogos |
| `/directorio/[slug]` | Perfil de psicólogo |
| `/planes` | Planes de membresía |
| `/admin/*` | Panel de administración |

## 🔐 Panel de Administración

Acceso en `/admin` (requiere autenticación):

- **Posts**: Crear, editar, eliminar artículos
- **Autores**: Gestionar autores del blog
- **Tags**: Categorías de artículos
- **Miembros**: Gestionar equipo y directorio
- **Suscriptores**: Ver suscriptores del newsletter
- **Usuarios**: Administrar usuarios del sistema

## 🎨 Temas

El proyecto soporta tema claro y oscuro via `next-themes`:

```tsx
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();
setTheme("dark"); // o "light" o "system"
```

## 📊 Caching

Estrategia de caching implementada:

1. **React `cache()`**: Deduplicación de requests en SSR
2. **`unstable_cache`**: Cache con tags para Prisma queries
3. **`force-cache`**: Cache de fetch para API externa
4. **Tags de revalidación**: `posts`, `members`, `authors`, `tags`

Revalidación on-demand via Server Actions:

```typescript
import { revalidateTag } from "next/cache";

revalidateTag("posts", "max"); // Next.js 16 syntax
```

## 📝 Licencia

Proyecto privado de REVEPSIC.

---

Desarrollado con ❤️ para la Red Venezolana de Psicología basada en Evidencia.
