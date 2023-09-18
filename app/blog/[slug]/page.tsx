import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import React from "react";

// Define la interfaz para los datos
interface BlogData {
  title: string;
  content: string;
  // Otros campos de tu tabla
}

async function LoadPost({ slug }: any): Promise<BlogData | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClientComponentClient({ supabaseUrl, supabaseKey });

  try {
    const { data, error } = await supabase
      .from("blog")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      throw error;
    }

    return data as BlogData | null;
  } catch (error) {
    console.error("Error al cargar datos desde Supabase:", error);
    throw error;
  }
}

export default async function Page({ params }: any) {
  const slug = params.slug;
  const data = await LoadPost({ slug });

  if (!data) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-10 py-20 dark:text-white">
        <p>No se encontraron datos.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-10 py-20 dark:text-white">
      <div className="">
        <article className="text-justify prose lg:prose-xl">
          <Image
            src={"/blog.jpg"} // Reemplaza con el campo correcto de tu tabla que contiene la URL de la imagen
            width={1000}
            height={1000}
            alt={data.title} // Reemplaza con el campo correcto de tu tabla que contiene el texto alternativo de la imagen
            className="pb-10"
          />
          <h1 className="text-sm text-center font-semibold pb-5 dark:text-white">
            {data.title}
          </h1>
          <div
            className="dark:text-white"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </article>
      </div>
    </div>
  );
}
