"use client"

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import DeleteIcon from "@/app/(dashboard)/articulos/DeleteIcon";

interface BlogPost {
  id: number;
  title: string;
  created_at: string;
  description: string;
}

export default function TablArticle({ response }: any) {
  const supabase = createClientComponentClient();
  const [data, setData] = useState<BlogPost[]>([]);

  useEffect(() => {
    setData(response.data)
  }, [response]);

  const handleDeleteClick = async (id: number) => {
    try {
      // Intenta eliminar el registro correspondiente en la base de datos
      const { error } = await supabase.from('blog').delete().eq('id', id);

      if (error) {
        // Manejar errores de eliminación aquí
        console.error('Error al eliminar el registro:', error.message);
      } else {
        // Eliminación exitosa, actualiza el estado o realiza cualquier acción necesaria
        console.log(`Elemento con ID ${id} eliminado correctamente`);

        // Actualiza los datos si es necesario
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
      }
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
    }
  };

  return (
    <div className="p-4">
      <Table aria-label="Tabla de artículos">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>
                {/* Agregamos un Tooltip al ícono de eliminación */}
                <Tooltip color="danger" content="Delete user">
                  <DeleteIcon
                    onClick={() => handleDeleteClick(item.id)}
                    className="cursor-pointer"
                  />
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
