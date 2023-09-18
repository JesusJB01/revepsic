
import TablArticle from "@/components/Table";
import React, { useEffect, useState } from "react";

async function getData() {
  const apiUrl = process.env.URL_VERCEL 

  try {
    const response = await fetch(`${apiUrl}/api/blog`);

    if (!response) {
      throw new Error("Error al obtener datos de la API");
    }

    const data = await response.json();
    console.log("Datos obtenidos:", data);
    
    return data;
  } catch (error) {
    console.error("Error al obtener datos:", error);
    throw error;
  }
}


export default async function page() {
  const data = await getData()

  return (
    <div>
      <TablArticle response={data}/>
    </div>
  )
}

