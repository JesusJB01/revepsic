import React from "react";
import PageHeader from "@/components/PageHeader";
import { Calendar, MapPin, Users } from "lucide-react";

const ponentes = [
  {
    name: "Licdo. Jhonnathan Sulbarán",
    bio: "Psicólogo de la UCAB, Maestrante de Psicología Clínica y Comunitaria de la UCAB. Miembro profesional y representante del grupo de afiliación para Venezuela de la ACBS.",
    ponencia: "Una mirada contextual funcional a las prácticas basadas en evidencia: historia y evolución",
  },
  {
    name: "Licdo. Luis Madera",
    bio: "Psicólogo Clínico de la UBA. Miembro de la Red Venezolana para el Avance de la Psicología Científica.",
    ponencia: "Metodología y Criterios de la Psicología Basada en Evidencia",
  },
  {
    name: "Licdo. Alejandro Becerra",
    bio: "Psicólogo de la UNY, Esp. En Gestión en Salud Pública del IAE, Doctorando del Doctorado en Ciencias Sociales de la UNELLEZ. Presidente de REVEPSIC.",
    ponencia: "Decisiones clínicas fundamentadas en evidencia científica",
  },
];

export default function PonenciaPage() {
  return (
    <>
      <PageHeader
        title="IV Congreso Venezolano de Psicología"
        subtitle="REVEPSIC presente en el evento"
        imageSrc="/nosotros3.svg"
        imageAlt="Ponencia"
      />

      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          {/* Event Info */}
          <div className="p-8 bg-card rounded-2xl border border-border mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Mesa de Trabajo: <span className="text-primary">Psicología Basada en Evidencia</span>
            </h2>

            <div className="grid sm:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-medium text-foreground">23 de Noviembre, 2023</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Lugar</p>
                  <p className="font-medium text-foreground">Aula 4, UCV</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Hora</p>
                  <p className="font-medium text-foreground">2:30 PM</p>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground">
              Promoviendo la Práctica Psicológica Fundamentada en el IV Congreso Venezolano de Psicología: La Salud Mental, un camino para el buen vivir.
            </p>
          </div>

          {/* Ponentes */}
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            Nuestros <span className="text-primary">Ponentes</span>
          </h3>

          <div className="space-y-6">
            {ponentes.map((ponente, index) => (
              <div key={index} className="p-6 bg-muted rounded-2xl">
                <h4 className="text-lg font-bold text-foreground mb-2">{ponente.name}</h4>
                <p className="text-sm text-muted-foreground mb-4">{ponente.bio}</p>
                <div className="p-4 bg-card rounded-xl border border-border">
                  <p className="text-sm font-medium text-primary">"{ponente.ponencia}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
