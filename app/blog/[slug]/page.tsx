import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import React from "react";

// Declara un tipo para los resultados de LoadPost
type LoadPostResult = {
  data: {
    title: string;
    content: string;
    // Otros campos que puedas tener
  };
  error: any; // Puedes definir un tipo más específico para los errores si lo deseas
};

async function LoadPost({ slug }: { slug: string }): Promise<LoadPostResult> {
  const supabase = createClientComponentClient();
  const { data, error } = await supabase
    .from("blog")
    .select("*")
    .eq("slug", slug)
    .single();
  return { data, error };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params; // Accede directamente al valor slug
  const { data, error } = await LoadPost(slug);

  if (error) {
    // Maneja el caso de error aquí
    console.error("Error cargando el post:", error);
    return <div>Error al cargar el post.</div>;
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-10 py-20 dark:text-white">
      
      <div className="">
        <article className="prose lg:prose-xl text-justify">
          <Image
            src={"/blog.jpg"}
            width={1000}
            height={1000}
            alt="Lo que sea"
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
