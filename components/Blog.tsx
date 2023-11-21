import Link from "next/link";
import Article from "./Article";
import ImagesComponent from "./ImagesComponent";
import JustArticle from "./JustoArticle";

interface ArticleData {
  title: string;
  description: string;
  slug: string;
  // Otras propiedades si las tienes
}

export async function getData() {
  const api = process.env.URL_VERCEL;

  try {
    const response = await fetch(`${api}/api/blog`, { cache: "no-store" });

    if (!response.ok) {
      console.error("Error al obtener datos de la API");
      return null;
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

  if (!data) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-10 py-20 dark:text-white">
        <p>No se encontraron datos.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex justify-center">
      <section className="py-20">
        <div className="mx-auto px-4 max-w-6xl">
          <h1 className="text-center font-normal lg:text-[56px]">
            Últimas Entradas
          </h1>

          <div className="flex flex-col justify-center items-center pt-10">
            <div className="flex flex-col p-6 justify-center  gap-5 md:flex-row">
              <div className="bg-gray-200 p-10 rounded-lg">
                <ImagesComponent
                  width={500}
                  height={500}
                  src="/pich.svg"
                  alt="NextUI hero Image"
                />
              </div>
              <div className="flex flex-col md:w-[40%]">
                <h2 className="pb-5 text-start font-bold">
                  Revepsic estara Prensente en el IV congreso Venezolano de
                  Psicologia
                </h2>
                <p className="text-justify  pb-10">
                 REVEPSIC presentará una mesa de trabajo sobre <br />
                  <strong>
                  Psicología Basada en Evidencia: Promoviendo la Práctica  Psicológica Fundamentada
                  </strong>
                </p>
                <div>
                  <Link
                    href={"/ponencia"}
                    className="bg-violet-600 text-white p-3 rounded-lg"
                  >
                    Leer mas
                  </Link>
                </div>
              </div>
            </div>

            {/* Articulos */}
            <div className="grid grid-cols-1 pt-20 gap-10 md:grid-cols-3">
              {/* {data.data.map((article: ArticleData, index:number) => (
                <Article
                  key={index}
                  title={article.title}
                  imageSrc="/blog.jpg"
                  summary={article.description}
                  slug={article.slug}                 
                  
                />
              ))} */}

              <JustArticle/>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
