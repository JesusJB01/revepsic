
import TablArticle from "@/components/Table";
import React, { useEffect, useState } from "react";
async function getData() {
  const apiUrl = process.env.URL_VERCEL;

  try {
    const response = await fetch(`${apiUrl}/api/blog`);

    if (!response.ok) {
      console.log("Error al obtener datos de la API. Estado de la respuesta:", response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error al obtener datos de la API:", error);
    return null;
  }
}


export default async function page() {
  const data = await getData()

  if (!data) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-10 py-20 dark:text-white">
        <p>No se encontraron datos.</p>
      </div>
    );
  }

  return (
    <div>
      <TablArticle response={data}/>
    </div>
  )
}

