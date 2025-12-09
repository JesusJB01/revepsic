"use client";

// import { urlApi } from "@/helpers/getUrl";
import NextImage from "next/image";
import Link from "next/link";

export default function JustArticle() {
  return (
    <div className="bg-white rounded-lg p-6 dark:text-black">
      <NextImage
        width={700}
        height={700}
        src={"/pbe2.jpg"}
        alt={`Imagen de referencia al congreso`}
        className="shadow-lg rounded-xl" // Agregué rounded para que se vea mejor
      />
      <h2 className="pt-4 pb-2 text-lg font-bold">¿Cual es la importancia de la Psicología basada en Evidencia en la vida cotidiana?</h2>
      <p className="text-justify text-base pb-4 whitespace-normal"> La PBE emerge como una guía fundamental para comprender y abordar desafíos cotidianos.</p>
      <div>
        <Link
          href={"/articulo"} // Cambié a ruta relativa
          className="bg-violet-600 px-4 py-2 rounded-lg text-white hover:bg-violet-700 transition"
        >
          Leer más
        </Link>
      </div>
    </div>
  );
}
