# 🔐 Guía de Variables de Entorno - REVEPSIC Frontend

## 📚 Diferencia entre `API_URL` y `NEXT_PUBLIC_API_URL`

### 🎯 **Resumen Rápido**

```typescript
// ✅ En Server Actions (lib/actions/*.ts)
const API_URL = process.env.API_URL;  // Solo servidor - MÁS SEGURO

// ✅ En código del cliente (lib/api.ts, componentes "use client")
const API_URL = process.env.NEXT_PUBLIC_API_URL;  // Cliente + Servidor
```

---

## 🔒 **API_URL** (Sin prefijo NEXT_PUBLIC_)

### Características:
- ✅ **Solo disponible en el servidor**
- ✅ **MÁS SEGURA** - Nunca se expone al cliente
- ✅ No aparece en el bundle de JavaScript del navegador
- ✅ Perfecta para Server Actions, API Routes, `getServerSideProps`

### Usalá en:
- ✅ **Server Actions** (`"use server"`)
- ✅ **API Routes** (`app/api/**/*.ts`)
- ✅ **Server Components** (componentes async sin `"use client"`)

### Archivos que la usan:
```
lib/actions/
  ├── posts.ts       ✅ Server Action
  ├── members.ts     ✅ Server Action
  ├── authors.ts     ✅ Server Action
  ├── auth-helpers.ts ✅ Server Action
  └── newsletter.ts  ✅ Server Action
```

### Ejemplo:
```typescript
"use server";

// ✅ CORRECTO - Solo en servidor
const API_URL = process.env.API_URL || "http://localhost:3001/api/v1";

export async function createPost(data) {
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    body: JSON.stringify(data)
  });
  // ...
}
```

---

## 🌐 **NEXT_PUBLIC_API_URL**

### Características:
- ⚠️ **Se expone al cliente** (navegador)
- ⚠️ Aparece en el bundle de JavaScript
- ✅ Necesaria cuando el navegador hace fetch directamente
- ⚠️ Visible en las DevTools del navegador

### Usalá en:
- ✅ **Client Components** (`"use client"`)
- ✅ Código que se ejecuta en el navegador
- ✅ Funciones de `lib/api.ts` que llamas desde componentes cliente

### Archivos que la usan:
```
lib/
  └── api.ts                              ✅ Cliente
app/(dashboard)/admin/posts/
  └── posts-table.tsx                     ✅ Client Component
```

### Ejemplo:
```typescript
"use client";

// ✅ CORRECTO - Código del cliente
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const postsApi = {
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "DELETE"
    });
    // ...
  }
};
```

---

## ⚙️ **Configuración Actual del Proyecto**

### Desarrollo (`.env` o `.env.local`):
```env
# Backend API - Solo servidor (MÁS SEGURA)
API_URL=http://localhost:3001/api/v1

# Backend API - Cliente + Servidor (necesaria para cliente)
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Frontend URL (opcional - Vercel la detecta automáticamente)
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Producción (Vercel):
```env
# Backend API - Solo servidor
API_URL=https://api.revepsic.com/api/v1

# Backend API - Cliente
NEXT_PUBLIC_API_URL=https://api.revepsic.com/api/v1

# Secret de revalidación
REVALIDATE_SECRET=<tu-secreto-seguro>
```

---

## 🎯 **¿Cuándo usar cada una?**

### Usa `API_URL` cuando:
- ✅ Estás en un Server Action (`"use server"`)
- ✅ Estás en una API Route (`app/api/**`)
- ✅ Estás en un Server Component (async, sin `"use client"`)
- ✅ Quieres máxima seguridad (no exponer la URL)

### Usa `NEXT_PUBLIC_API_URL` cuando:
- ✅ Estás en un Client Component (`"use client"`)
- ✅ El fetch se ejecuta en el navegador
- ✅ Necesitas acceder a la variable desde JavaScript del cliente

---

## 🔍 **Verificación Rápida del Código**

### ❌ INCORRECTO:
```typescript
"use server";

// ❌ MAL - Usando variable pública en servidor
const API_URL = process.env.NEXT_PUBLIC_API_URL;
```

```typescript
"use client";

// ❌ MAL - Usando variable privada en cliente
const API_URL = process.env.API_URL;  // Siempre será undefined
```

### ✅ CORRECTO:
```typescript
"use server";

// ✅ BIEN - Variable privada en servidor
const API_URL = process.env.API_URL;
```

```typescript
"use client";

// ✅ BIEN - Variable pública en cliente
const API_URL = process.env.NEXT_PUBLIC_API_URL;
```

---

## 📊 **Resumen de Seguridad**

| Variable | Servidor | Cliente | Bundle JS | Seguridad |
|----------|----------|---------|-----------|-----------|
| `API_URL` | ✅ | ❌ | ❌ | 🔒 Alta |
| `NEXT_PUBLIC_API_URL` | ✅ | ✅ | ✅ | ⚠️ Media |

---

## 🚀 **Best Practices**

1. **Prefiere Server Actions cuando sea posible**
   - Usa `API_URL` (más segura)
   - El cliente llama a la Server Action
   - La Server Action llama al backend

2. **Usa NEXT_PUBLIC solo cuando sea necesario**
   - Solo cuando el navegador necesita hacer fetch directamente
   - Por ejemplo: delete de posts desde la tabla

3. **Nunca expongas secretos con NEXT_PUBLIC_**
   - ❌ `NEXT_PUBLIC_SECRET_KEY` - NUNCA
   - ✅ `SECRET_KEY` - Solo en servidor

4. **Mantén ambas variables sincronizadas**
   - Deben apuntar a la misma URL del backend
   - En desarrollo: `http://localhost:3001/api/v1`
   - En producción: `https://api.revepsic.com/api/v1`

---

## ✅ **Checklist de Configuración**

- [x] `API_URL` configurada en `.env`
- [x] `NEXT_PUBLIC_API_URL` configurada en `.env`
- [x] Ambas apuntan al mismo backend
- [x] Server Actions usan `API_URL`
- [x] Client Components usan `NEXT_PUBLIC_API_URL`
- [x] `.env` está en `.gitignore`
- [ ] Variables configuradas en Vercel para producción

---

**Última actualización:** 14/12/2024
**Versión:** 1.0
