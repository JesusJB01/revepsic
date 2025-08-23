
import React from "react";
import NextImage from "next/image";


export const metadata = {
  title: "Jornada Venezolana de Psicología Basada en Evidencia 2025",
  description:
    "Inscripción y postulación de trabajos para la 2da Jornada Venezolana de Psicología Basada en Evidencia 2025. Envía tu síntesis curricular y participa.",
  keywords: [
    "Psicología",
    "Psicología Basada en Evidencia",
    "Jornada Científica",
    "Investigación",
    "Venezuela",
  ],
  openGraph: {
    title: "JVPBE 2025 - Postulación",
    description:
      "Participa en la 2da Jornada Venezolana de Psicología Basada en Evidencia 2025.",
    url: "https://www.revepsic.com/postulacion",
    siteName: "JVPBE",
    images: [
      {
        url: "https://www.revepsic.com/flyer.jpg",
        width: 1200,
        height: 630,
        alt: "Jornada Científica",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="py-10">
      {/* HEADER */}
      <header>
        <div className="relative mx-auto h-96 w-full max-w-screen-xl md:my-4">
          <div className="absolute bottom-0 left-0 z-10 h-full w-full bg-gradient-to-t from-gray-700 xl:rounded-lg">
            <NextImage
              width={1000}
              height={1000}
              src="/undraw_preparation_59f0.svg"
              alt="Jornada Científica"
              className="absolute left-0 top-0 z-0 h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 z-20 p-4">
              <h2 className="text-xl font-bold italic text-purple-300">
                Postulación JVPBE 2025
              </h2>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-yellow-500">
          Jornada Venezolana de Psicología Basada en Evidencia
        </h1>
        <h2 className="text-xl font-semibold text-center mb-8 text-gray-700 dark:text-gray-300">
          Inscripción y Postulación de Trabajos
        </h2>

<div>
          <NextImage
              width={1000}
              height={1000}
              src="/flyer.jpg"
              alt="Jornada Científica"
              className="p-1 mt-2 rounded-lg"
            />
        </div>


        {/* INSTRUCCIONES */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-yellow-500">
            📌 Instrucciones
          </h3>
          <p className="mb-2 text-gray-700 dark:text-gray-300">
            Para participar en la{" "}
            <strong>2da Jornada Venezolana de Psicología Basada en Evidencia 2025</strong>, 
            debes completar el formulario oficial y enviarlo junto con tu síntesis curricular en PDF al siguiente correo:
          </p>
          <p className="font-semibold text-blue-700 dark:text-blue-400">
            📧 revepsic@gmail.com
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Recuerda que solo se aceptarán los trabajos que cumplan con el{" "}
            <span className="font-semibold">Reglamento de Postulación</span>.
          </p>
        </div>

        {/* BOTONES DE DESCARGA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a
            href="/FORMULARIO_DE_INSCRIPCION.doc"
            download
            className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
          >
            📥 Descargar Formulario de Inscripción
          </a>
          <a
            href="/Reglamento_JVPBE_2025.docx"
            download
            className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition"
          >
            📑 Ver Reglamento de Postulación
          </a>
        </div>

        {/* REGLAMENTO RESUMEN */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-yellow-500">
            📖 Tipos de Trabajos Aceptados
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>Revisión Bibliográfica:</strong> Análisis crítico de fuentes documentales.
            </li>
            <li>
              <strong>Casos Clínicos:</strong> Incluye antecedentes, diagnóstico, intervención y conclusiones.
            </li>
            <li>
              <strong>Investigación:</strong> Debe incluir introducción, metodología, resultados y discusión.
            </li>
          </ul>

          <h3 className="text-lg font-bold mt-6 mb-2 text-gray-900 dark:text-yellow-500">
            ✅ Requisitos
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              Estar inscrito en el Colegio de Psicólogos y en la Federación de Psicólogos de Venezuela.
            </li>
            <li>
              Enviar <strong>síntesis curricular en PDF</strong> junto al formulario.
            </li>
            <li>
              Respetar las normas de redacción y formato establecidas.
            </li>
          </ul>
        </div>

        
      </div>
    </div>
  );
}
