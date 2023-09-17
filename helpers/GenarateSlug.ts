export default function generateSlug(title: string): string {
    // Paso 1: Convierte el título en minúsculas
    const lowercaseTitle = title.toLowerCase();
  
    // Paso 2: Reemplaza los espacios con guiones
    const slug = lowercaseTitle.replace(/\s+/g, '-');
  
    // Paso 3: Elimina caracteres especiales usando una expresión regular
    const cleanSlug = slug.replace(/[^\w-]+/g, '');
  
    // Paso 4: Asegúrate de que el slug sea único
    // Aquí puedes agregar lógica adicional para garantizar la unicidad si es necesario
  
    return cleanSlug;
  }
  
