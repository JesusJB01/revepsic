import React from "react";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { Download, FileText, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Jornada Venezolana de Psicología Basada en Evidencia 2025",
  description: "Inscripción y postulación de trabajos para la 2da Jornada Venezolana de Psicología Basada en Evidencia 2025.",
};

const requisitos = [
  "Estar inscrito en el Colegio de Psicólogos y en la Federación de Psicólogos de Venezuela.",
  "Enviar síntesis curricular en PDF junto al formulario.",
  "Respetar las normas de redacción y formato establecidas.",
];

const tiposTrabajo = [
  { title: "Revisión Bibliográfica", desc: "Análisis crítico de fuentes documentales." },
  { title: "Casos Clínicos", desc: "Incluye antecedentes, diagnóstico, intervención y conclusiones." },
  { title: "Investigación", desc: "Debe incluir introducción, metodología, resultados y discusión." },
];

export default function PostulacionPage() {
  return (
    <>
      <PageHeader
        title="Postulación JVPBE 2025"
        subtitle="Inscripción y Postulación de Trabajos"
        imageSrc="/undraw_preparation_59f0.svg"
        imageAlt="Postulación"
      />

      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          {/* Flyer */}
          <div className="mb-12 rounded-2xl overflow-hidden border border-border">
            <Image
              src="/flyer.jpg"
              alt="Jornada Científica"
              width={1000}
              height={500}
              className="w-full h-auto"
            />
          </div>

          {/* Instructions */}
          <div className="p-8 bg-card rounded-2xl border border-border mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Instrucciones</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Para participar en la <strong className="text-foreground">2da Jornada Venezolana de Psicología Basada en Evidencia 2025</strong>,
              debes completar el formulario oficial y enviarlo junto con tu síntesis curricular en PDF al siguiente correo:
            </p>
            <p className="text-lg font-semibold text-primary">📧 revepsic@gmail.com</p>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a
              href="/FORMULARIO_DE_INSCRIPCION.doc"
              download
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all"
            >
              <Download className="h-5 w-5" />
              Descargar Formulario
            </a>
            <a
              href="/Reglamento_JVPBE_2025.docx"
              download
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-card border border-border font-semibold text-foreground rounded-xl hover:bg-muted transition-all"
            >
              <FileText className="h-5 w-5" />
              Ver Reglamento
            </a>
          </div>

          {/* Tipos de Trabajo */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-foreground mb-6">
              Tipos de Trabajos Aceptados
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {tiposTrabajo.map((tipo, index) => (
                <div key={index} className="p-6 bg-muted rounded-xl">
                  <h4 className="font-semibold text-foreground mb-2">{tipo.title}</h4>
                  <p className="text-sm text-muted-foreground">{tipo.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Requisitos */}
          <div className="p-8 bg-card rounded-2xl border border-border">
            <h3 className="text-xl font-bold text-foreground mb-6">Requisitos</h3>
            <ul className="space-y-4">
              {requisitos.map((req, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
