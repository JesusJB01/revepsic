"use client";
import React from "react";
import { FlaskConical, BookOpen, GraduationCap, Handshake, ShieldCheck, Gavel } from "lucide-react";

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
    <section className="py-20 md:py-28 bg-muted">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Qué nos <span className="text-primary">define</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Somos una red comprometida con el avance de la psicología científica en Venezuela.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
