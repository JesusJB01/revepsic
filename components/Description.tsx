"use client";
import React from "react";
import { FlaskConical, BookOpen, GraduationCap, Handshake, ShieldCheck, Gavel } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations";

const features = [
  {
    title: "Rigor científico",
    description: "Promovemos la investigación rigurosa en psicología, siempre basada en la evidencia y respaldada por la metodología científica.",
    icon: FlaskConical,
  },
  {
    title: "Difusión del conocimiento",
    description: "Facilitamos la difusión de conocimientos mediante publicaciones científicas, conferencias y simposios.",
    icon: BookOpen,
  },
  {
    title: "Formación y educación",
    description: "Ofrecemos oportunidades de formación continua para profesionales de la psicología.",
    icon: GraduationCap,
  },
  {
    title: "Fomento de la colaboración",
    description: "Promovemos la colaboración entre profesionales a nivel nacional e internacional.",
    icon: Handshake,
  },
  {
    title: "Ética profesional",
    description: "Establecemos y promovemos rigurosos estándares éticos para los profesionales de la psicología.",
    icon: ShieldCheck,
  },
  {
    title: "Representación y defensa",
    description: "Representamos los intereses de la comunidad de psicólogos ante instituciones y organizaciones.",
    icon: Gavel,
  },
];

export default function Description() {
  return (
    <section className="py-20 md:py-28 bg-muted relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Qué nos <span className="gradient-text">define</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Somos una red comprometida con el avance de la psicología científica en Venezuela.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <div className="group p-6 bg-card/80 backdrop-blur-sm rounded-2xl border-2 border-transparent hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 h-full relative overflow-hidden">
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:from-primary/40 group-hover:to-secondary/40 transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-primary group-hover:text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
