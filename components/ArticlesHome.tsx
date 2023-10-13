import Link from "next/link";
import CustomCard from "./CardHome";
import ImageUi from "./Image";




interface BlogEntry {
  id: number;
  created_at: string;
  title: string;
  description: string;
  content: string;
  slug: string;
}

export async function getData() {
  const apiUrl = process.env.URL_VERCEL || "http://localhost:3000";

  try {
    const response = await fetch(`${apiUrl}/api/blog`, {cache: "no-store"});

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

export default async function ArticlesHome() {
  const data = await getData();
  const ultimosArticulos: BlogEntry[] = data?.data.slice(-4) || [];

  return (
    <div className="bg-gray-100 w-full pb-10 dark:bg-slate-500">
      <div className="container mx-auto flex py-8 px-10 sm:py-12 lg:py-16">
        {/* Botones superiores */}
        <div className="flex flex-row items-center">
          <h2 className="text-2xl font-extrabold md:text-4xl">
            Últimas Entradas
          </h2>
          <Link
            href={"/"}
            className="ml-4 mt-2 inline-block rounded-md bg-slate-600 px-2 py-2 text-base font-bold text-white hover:bg-slate-800  md:px-6 md:py-3 md:text-lg"
          >
            Todas las Entradas
          </Link>
          <Link
            href={"/"}
            className="ml-4 mt-2 inline-block rounded-md bg-slate-600 px-2 py-2 text-base font-bold text-white hover:bg-slate-800   md:px-6 md:py-3 md:text-lg"
          >
            tags
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 container mx-auto px-10">
        <section className="w-full ">
          <ImageUi />
          <span className="inline-block rounded bg-gray-300 px-3 py-1 text-xs font-medium uppercase tracking-tight text-black hover:bg-gray-400 my-5">
            Tag
          </span>
          <p className=" text-gray-400 ">TItulo</p>
          <span className="mb-5 text-gray-600 dark:text-gray-400">Fecha</span>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Texto descriptivo del articulo
          </p>
          <Link
            href={"/"}
            className="mt-2 inline-block rounded-md bg-purple-600 px-6 py-3 text-white hover:bg-pink-600 dark:bg-purple-300 dark:text-black dark:hover:bg-pink-300"
          >
            Leer mas
          </Link>
        </section>

        {/* Cuatro tarjetas adicionales */}
        <section className="grid grid-cols-2 gap-x-3 gap-y-3">
          {ultimosArticulos.map((user) => (
            <CustomCard
              key={user.id}
              title={user.title}
              imageSrc={"/imageHome.svg"}
              creationDate={user.created_at}
              slug={user.slug}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
