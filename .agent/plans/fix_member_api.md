# Plan de Solución Error 400 en API Miembros

El objetivo es resolver el error 400 Bad Request asegurando formato exacto de datos.

## Cambios Requeridos

### 1. Formato de Fechas
El formulario usa `YYYY-MM-DD`. La API espera ISO String (`YYYY-MM-DDTHH:mm:ss.sssZ`).
**Acción**: En `cleanFormData`, transformar las fechas:
```typescript
if (data.birthDate) cleaned.birthDate = new Date(data.birthDate).toISOString();
```
(Y lo mismo para `subscriptionStart`, `subscriptionEnd`, `memberSince` si se envían).

### 2. Validación de Precios
Asegurar que `priceRange` tenga `currency` y que `notes` no sea string vacío.

### 3. Validación de Horarios
Asegurar que `notes` no sea string vacío.

### 4. Limpieza de Arrays
Asegurar que no se envíen arrays vacíos si son opcionales.

## Archivos
- `app/(dashboard)/admin/miembros/page.tsx`
