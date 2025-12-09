"use client";
import React from "react";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";

const team = [
  { name: "Alejandro Becerra", position: "Presidente", src: "/alejandrobecerra.png" },
  { name: "Jesus Jimenez", position: "Vicepresidente", src: "/jesus.jpg" },
  { name: "Adonis Solis", position: "Secretaria", src: "/adonis.jpg" },
  { name: "Maria Perez", position: "CEO", src: "/maria.jpg" },
  { name: "Nelson Ledezma", position: "Developer", src: "/nelson.jpg" },
  { name: "Luis Madera", position: "Developer", src: "/luismadera.jpg" },
  { name: "Jhonnathan Sulbaran", position: "Developer", src: "/jonnathansulbaran.jpg" },
  { name: "Wilfredo Diaz", position: "Developer", src: "/wilfredodiaz.jpg" },
  { name: "Ana Rodriguez", position: "Developer", src: "/anarodriguez.jpg" },
  { name: "Lady Molina", position: "Developer", src: "/lady.jpg" },
];

export default function EquipoPage() {
  return (
    <>
      <PageHeader
        title="Nuestro Equipo"
        subtitle="Conoce a las personas detrás de REVEPSIC"
        imageSrc="/team2.svg"
        imageAlt="Equipo REVEPSIC"
      />

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              El <span className="text-primary">Equipo</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Profesionales comprometidos con el avance de la psicología científica en Venezuela.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="group text-center"
              >
                <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-border group-hover:border-primary transition-colors">
                  <Image
                    src={member.src}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{member.name}</h3>
                <p className="text-xs text-muted-foreground">{member.position}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
