export function formatDate(apiDate:string) {
    const date = new Date(apiDate);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const year = date.getFullYear();
    
    // Formatea la fecha en el formato deseado (dd/mm/yyyy)
    return `${day}/${month}/${year}`;
  }