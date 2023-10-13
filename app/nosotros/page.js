import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <div>
      <header>
        <div className="relative mx-auto h-96 w-full max-w-screen-xl md:my-4">
          <div className="absolute bottom-0 left-0 z-10 h-full w-full bg-gradient-to-t from-gray-700 xl:rounded-lg">
            <Image
              width={1000}
              height={1000}
              src="/nosotros2.svg"
              alt="Picture of the author"
              className="absolute left-0 top-0 z-0 h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 z-20 p-4">
              <h2 className="text-xl font-bold italic text-purple-300">
                Sobre Revepsic
              </h2>
            </div>
          </div>
        </div>
      </header>

      <div className="py-10 pb-20 ">
        <section className="container mx-auto flex justify-center px-10 text-justify  ">
          
            <div className="max-w-2xl mx-auto flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-yellow-500 mb-6">
                Acerca de Revepsic
              </h1>
              <p className="text-gray-600 mb-4 dark:text-white">
                En Revepsic, creemos en la promoción y avance de la psicología
                científica como un pilar fundamental para el bienestar de la
                sociedad venezolana y, en última instancia, para el mundo
                entero. Nuestra red se compone de apasionados profesionales de
                la psicología que se han unido con el objetivo de compartir
                conocimientos, fomentar la investigación, y difundir información
                relevante que contribuya al crecimiento de esta disciplina
                vital.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4 dark:text-yellow-500">
                Nuestra Misión
              </h2>
              <p className="text-gray-600 dark:text-white">
                Nuestra misión es clara: fortalecer la psicología científica en
                Venezuela y más allá, promoviendo la investigación rigurosa, la
                educación de calidad y el acceso a recursos psicológicos
                confiables. Creemos en el poder de la psicología para
                transformar vidas y comunidades, y estamos comprometidos a hacer
                una diferencia positiva en nuestra sociedad.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4 dark:text-yellow-500">
                Lo Que Nos Impulsa
              </h2>
              <p className="text-gray-600 dark:text-white">
                En el corazón de Revepsic se encuentra nuestra pasión por la
                psicología científica y su capacidad para abordar desafíos
                humanos fundamentales. Nos impulsan los siguientes valores y
                objetivos:
              </p>

              <ul className="list-disc list-inside text-gray-600 pl-6 mt-4 dark:text-white">
                <li>Excelencia en Investigación</li>
                <li>Educación Accesible</li>
                <li>Comunidad Colaborativa</li>
                <li>Ética y Responsabilidad Profesional</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4 dark:text-yellow-500">
                Nuestra Visión para el Futuro
              </h2>
              <p className="text-gray-600 dark:text-white">
                Visualizamos un futuro en el que la psicología científica sea un
                recurso ampliamente disponible y respetado en Venezuela, donde
                las personas puedan acceder a apoyo psicológico de calidad y
                donde los profesionales de la psicología sean reconocidos por su
                contribución al bienestar social.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4 dark:text-yellow-500">
                Únete a Nuestra Comunidad
              </h2>
              <p className="text-gray-600 dark:text-white">
                Si compartes nuestra pasión por la psicología científica y
                nuestros valores, te invitamos a unirte a nuestra comunidad en
                Revepsic. Juntos, podemos avanzar en la promoción de la
                psicología científica y hacer una diferencia positiva en la
                sociedad venezolana. Acompáñanos en esta emocionante jornada de
                descubrimiento y crecimiento.
              </p>
            </div>
          
        </section>
      </div>
    </div>
  );
}
