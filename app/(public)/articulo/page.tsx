import React from "react";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareButtons from "@/components/ShareButtons";

export default function ArticuloPage() {
  return (
    <article className="py-16 md:py-24">
      <div className="container max-w-3xl">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: "Psicología Basada en Evidencia" },
          ]}
        />

        {/* Header */}
        <header className="mb-12">
          <p className="text-sm font-medium text-primary mb-4">Psicología Basada en Evidencia</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
            Descubriendo la Importancia de la Psicología Basada en Evidencia en Nuestra Vida Cotidiana
          </h1>

          {/* Share buttons */}
          <ShareButtons title="Descubriendo la Importancia de la Psicología Basada en Evidencia" />
        </header>

        {/* Featured Image */}
        <div className="mb-12 rounded-2xl overflow-hidden">
          <Image
            src="/pbe2.jpg"
            alt="Psicología Basada en Evidencia"
            width={800}
            height={400}
            className="w-full h-auto"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            Bienvenidos a un viaje fascinante a través de la Psicología Basada en Evidencia (PBE), un enfoque que ilumina el panorama de la mente humana con la luz brillante de la ciencia.
          </p>

          <h2>¿Qué es la Psicología Basada en Evidencia?</h2>
          <p>
            La Psicología Basada en Evidencia es un enfoque que integra la práctica clínica con la investigación científica. En lugar de depender únicamente de la intuición o las experiencias pasadas, los profesionales de la psicología basada en evidencia se guían por la investigación rigurosa y los datos empíricos.
          </p>

          <h2>La Importancia de la PBE en Nuestra Vida Cotidiana</h2>

          <h3>Decisiones Informadas</h3>
          <p>
            La PBE nos permite tomar decisiones informadas sobre nuestra salud mental. Un enfoque basado en evidencia garantiza que las estrategias recomendadas estén respaldadas por investigaciones que demuestran su efectividad.
          </p>

          <h3>Tratamientos Efectivos</h3>
          <p>
            Al aplicar la PBE, los profesionales pueden seleccionar tratamientos que han demostrado ser eficaces para problemas específicos.
          </p>

          <h3>Prevención de Problemas Futuros</h3>
          <p>
            La PBE no solo aborda los problemas actuales, sino que también ayuda a prevenir problemas futuros. Un enfoque proactivo basado en la evidencia puede equiparnos con las herramientas necesarias para manejar el estrés, la ansiedad y otros desafíos antes de que se intensifiquen.
          </p>

          <h2>Manejo de la Ansiedad y Depresión</h2>
          <p>
            La terapia cognitivo-conductual (TCC) es una modalidad respaldada por evidencia que ha demostrado ser altamente efectiva en el manejo de los síntomas de ansiedad. Esta terapia se enfoca en identificar y cambiar patrones de pensamiento negativos.
          </p>

          <p>
            En conclusión, la Psicología Basada en Evidencia no solo es un enfoque profesional, sino una brújula confiable para navegar por los desafíos de nuestra mente.
          </p>
        </div>

        {/* Bottom share */}
        <div className="mt-12 pt-8 border-t border-border">
          <ShareButtons title="Descubriendo la Importancia de la Psicología Basada en Evidencia" />
        </div>
      </div>
    </article>
  );
}
