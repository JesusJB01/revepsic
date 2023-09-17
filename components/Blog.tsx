import Link from "next/link";
import Article from "./Article";
import ImagesComponent from "./ImagesComponent";

interface ArticleData {
  title: string;
  description: string;
  slug: string;
  // Otras propiedades si las tienes
}

export async function getData() {
  try {
    const response = await fetch("https://revepsic-r10ywalrw-jesusjb01.vercel.app/api/blog");

    if (!response.ok) {
      throw new Error("Error al obtener datos de la API");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error al obtener datos:", error);
    throw error; // Propaga el error para que pueda ser manejado más arriba si es necesario.
  }
}

export default async function Blog() {
  const data = await getData();

  return (
    <div className="container mx-auto flex justify-center">
      <section className="py-20">
        <div className="mx-auto px-4 max-w-6xl">
          <h1 className="text-center font-normal lg:text-[56px]">
            Últimas Entradas
          </h1>

          <div className="flex flex-col justify-center items-center pt-10">
            <div className="flex flex-col p-6 justify-center  gap-5 md:flex-row">
              <ImagesComponent
                width={700}
                height={700}
                src="/blog.jpg"
                alt="NextUI hero Image"
              />
              <div className="flex flex-col md:w-[40%]">
                <h2 className="pb-5 text-start font-bold">
                  Título del Articulo
                </h2>
                <p className="text-justify pb-10">
                  Nemo vel ad consectetur namut rutrum ex, venenatis
                  sollicitudin urna. Aliquam erat volutpat. Integer eu ipsum
                  sem. Ut bibendum lacus vestibulum maximus suscipit. Quisque
                  vitae nibh iaculis neque blan
                </p>
                <div>
                  <Link
                    href={"/"}
                    className="bg-violet-600 text-white p-3 rounded-lg"
                  >
                    Leer mas
                  </Link>
                </div>
              </div>
            </div>

            {/* Articulos */}
              <div className="grid grid-cols-1 pt-20 gap-10 md:grid-cols-3">
              {data.data.map((article: ArticleData, index:number) => (
                <Article
                  key={index}
                  title={article.title}
                  imageSrc="/blog.jpg"
                  summary={article.description}
                  slug={article.slug}                 
                  
                />
              ))}
            </div> 
          </div>
        </div>
      </section>
    </div>
  );
}
