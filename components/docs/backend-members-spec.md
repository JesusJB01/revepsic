# Backend Implementation: Members Module

## Objetivo

Implementar el sistema completo de gestión de miembros REVEPSIC, incluyendo modelo de datos, API RESTful, y endpoints para el panel de administración.

---

## 1. Modelo Prisma

```prisma
// prisma/schema.prisma

model Member {
  id          String   @id @default(uuid())
  slug        String   @unique // URL amigable: "jesus-jimenez"
  name        String
  position    String
  department  Department @default(MIEMBROS)
  bio         String   @db.Text
  image       String   // URL de la imagen
  
  // Contact
  whatsapp    String?  // Format: "+58412XXXXXXX"
  website     String?  // Full URL
  
  // Social Media
  facebook    String?
  instagram   String?
  twitter     String?
  
  // Metadata
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([department])
  @@index([isActive])
}

enum Department {
  DIRECTIVA
  TECNICO
  MIEMBROS
}
```

### Migración

```bash
npx prisma migrate dev --name add_members_table
npx prisma generate
```

---

## 2. API Endpoints

Base URL: `/api/members`

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/members` | Listar todos los miembros activos | Público |
| GET | `/api/members/:slug` | Obtener miembro por slug | Público |
| GET | `/api/members/slugs` | Obtener lista de slugs (para SSG) | Público |
| POST | `/api/members` | Crear nuevo miembro | Admin |
| PUT | `/api/members/:id` | Actualizar miembro | Admin |
| DELETE | `/api/members/:id` | Eliminar miembro (soft delete) | Admin |
| PATCH | `/api/members/:id/toggle` | Activar/desactivar miembro | Admin |

---

## 3. DTOs y Validaciones

### CreateMemberDto

```typescript
import { z } from "zod";

export const createMemberSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  position: z.string().min(2, "El cargo debe tener al menos 2 caracteres"),
  department: z.enum(["DIRECTIVA", "TECNICO", "MIEMBROS"]),
  bio: z.string().min(10, "La biografía debe tener al menos 10 caracteres"),
  image: z.string().url("Debe ser una URL válida"),
  whatsapp: z.string().regex(/^\+?[0-9]{10,15}$/, "Formato de WhatsApp inválido").optional(),
  website: z.string().url("Debe ser una URL válida").optional(),
  facebook: z.string().url("Debe ser una URL válida").optional(),
  instagram: z.string().url("Debe ser una URL válida").optional(),
  twitter: z.string().url("Debe ser una URL válida").optional(),
});

export type CreateMemberDto = z.infer<typeof createMemberSchema>;
```

### UpdateMemberDto

```typescript
export const updateMemberSchema = createMemberSchema.partial();
export type UpdateMemberDto = z.infer<typeof updateMemberSchema>;
```

---

## 4. Servicio (members.service.ts)

```typescript
import { PrismaClient, Department } from "@prisma/client";

const prisma = new PrismaClient();

// Generar slug único desde el nombre
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remover acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Asegurar slug único
async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existing = await prisma.member.findFirst({
      where: { 
        slug,
        ...(excludeId && { id: { not: excludeId } })
      }
    });
    
    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export const membersService = {
  // Listar todos los miembros activos
  async findAll(department?: Department) {
    return prisma.member.findMany({
      where: {
        isActive: true,
        ...(department && { department })
      },
      orderBy: { createdAt: "asc" }
    });
  },

  // Obtener por slug
  async findBySlug(slug: string) {
    return prisma.member.findUnique({
      where: { slug, isActive: true }
    });
  },

  // Obtener todos los slugs (para SSG)
  async getAllSlugs() {
    const members = await prisma.member.findMany({
      where: { isActive: true },
      select: { slug: true }
    });
    return members.map(m => m.slug);
  },

  // Crear miembro
  async create(data: CreateMemberDto) {
    const slug = await ensureUniqueSlug(generateSlug(data.name));
    
    return prisma.member.create({
      data: {
        ...data,
        slug,
        department: data.department as Department
      }
    });
  },

  // Actualizar miembro
  async update(id: string, data: UpdateMemberDto) {
    let slug: string | undefined;
    
    if (data.name) {
      slug = await ensureUniqueSlug(generateSlug(data.name), id);
    }
    
    return prisma.member.update({
      where: { id },
      data: {
        ...data,
        ...(slug && { slug }),
        ...(data.department && { department: data.department as Department })
      }
    });
  },

  // Eliminar (soft delete)
  async delete(id: string) {
    return prisma.member.update({
      where: { id },
      data: { isActive: false }
    });
  },

  // Toggle activo/inactivo
  async toggle(id: string) {
    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) throw new Error("Member not found");
    
    return prisma.member.update({
      where: { id },
      data: { isActive: !member.isActive }
    });
  }
};
```

---

## 5. Controlador (members.controller.ts)

```typescript
import { Router, Request, Response } from "express";
import { membersService } from "./members.service";
import { createMemberSchema, updateMemberSchema } from "./members.dto";
import { authMiddleware, adminMiddleware } from "../auth/auth.middleware";

const router = Router();

// GET /api/members - Listar todos
router.get("/", async (req: Request, res: Response) => {
  try {
    const { department } = req.query;
    const members = await membersService.findAll(department as any);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: "Error fetching members" });
  }
});

// GET /api/members/slugs - Lista de slugs para SSG
router.get("/slugs", async (req: Request, res: Response) => {
  try {
    const slugs = await membersService.getAllSlugs();
    res.json(slugs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching slugs" });
  }
});

// GET /api/members/:slug - Obtener por slug
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const member = await membersService.findBySlug(req.params.slug);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Error fetching member" });
  }
});

// POST /api/members - Crear (Admin)
router.post("/", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const data = createMemberSchema.parse(req.body);
    const member = await membersService.create(data);
    
    // Trigger revalidation on frontend
    await triggerRevalidation("/equipo");
    await triggerRevalidation(`/m/${member.slug}`);
    
    res.status(201).json(member);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: "Error creating member" });
  }
});

// PUT /api/members/:id - Actualizar (Admin)
router.put("/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const data = updateMemberSchema.parse(req.body);
    const member = await membersService.update(req.params.id, data);
    
    // Trigger revalidation
    await triggerRevalidation("/equipo");
    await triggerRevalidation(`/m/${member.slug}`);
    
    res.json(member);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: "Error updating member" });
  }
});

// DELETE /api/members/:id - Eliminar (Admin)
router.delete("/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    await membersService.delete(req.params.id);
    
    // Trigger revalidation
    await triggerRevalidation("/equipo");
    
    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting member" });
  }
});

// PATCH /api/members/:id/toggle - Toggle activo (Admin)
router.patch("/:id/toggle", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const member = await membersService.toggle(req.params.id);
    
    // Trigger revalidation
    await triggerRevalidation("/equipo");
    await triggerRevalidation(`/m/${member.slug}`);
    
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Error toggling member" });
  }
});

// Helper para trigger revalidation en frontend
async function triggerRevalidation(path: string) {
  try {
    await fetch(`${process.env.FRONTEND_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": process.env.REVALIDATION_SECRET!
      },
      body: JSON.stringify({ path })
    });
  } catch (error) {
    console.error("Failed to trigger revalidation:", error);
  }
}

export default router;
```

---

## 6. Respuestas API

### GET /api/members

```json
[
  {
    "id": "uuid",
    "slug": "jesus-jimenez",
    "name": "Jesus Jimenez",
    "position": "Vicepresidente",
    "department": "DIRECTIVA",
    "bio": "Estratega y coordinador...",
    "image": "/jesus.jpg",
    "whatsapp": "+584129876543",
    "website": null,
    "facebook": null,
    "instagram": "https://instagram.com/jesusjimenez",
    "twitter": "https://twitter.com/jesusjimenez",
    "isActive": true,
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
]
```

### GET /api/members?department=DIRECTIVA

Filtra por departamento.

### GET /api/members/slugs

```json
["jesus-jimenez", "alejandro-becerra", "maria-perez"]
```

---

## 7. Variables de Entorno

```env
# Backend
DATABASE_URL="postgresql://..."
FRONTEND_URL="https://revepsic.com"
REVALIDATION_SECRET="your-secret-token"

# Frontend (ya existe)
REVALIDATION_SECRET="your-secret-token"
```

---

## 8. Checklist de Implementación

- [ ] Crear modelo Prisma `Member`
- [ ] Ejecutar migración
- [ ] Implementar `members.service.ts`
- [ ] Implementar `members.controller.ts`
- [ ] Registrar rutas en `app.ts`
- [ ] Agregar middleware de autenticación
- [ ] Implementar trigger de revalidación
- [ ] Seed inicial con datos de prueba
- [ ] Tests de endpoints

---

## 9. Consumo desde Frontend Admin

Una vez implementados los endpoints, el frontend consumirá así:

```typescript
// lib/api/members.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const membersApi = {
  getAll: () => fetch(`${API_URL}/members`).then(r => r.json()),
  
  getBySlug: (slug: string) => 
    fetch(`${API_URL}/members/${slug}`).then(r => r.json()),
  
  create: (data: CreateMemberDto, token: string) =>
    fetch(`${API_URL}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  
  update: (id: string, data: UpdateMemberDto, token: string) =>
    fetch(`${API_URL}/members/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  
  delete: (id: string, token: string) =>
    fetch(`${API_URL}/members/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    }).then(r => r.json())
};
```
