
import TablArticle from "@/components/Table";
import React, { useEffect, useState } from "react";

async function getData() {
  const apiUrl = process.env.URL_VERCEL 

  try {
    const response = await fetch(`${apiUrl}/api/blog`);

    if (!response) {
      console.log("Error al obtener datos de la API");
      return null;
    }

    const data = await response.json();
   
    
    return data;
  } catch (error) {
   
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

