"use client";
import React from "react";
import { Users, BookOpen, Award, Calendar } from "lucide-react";
import { FadeIn, AnimatedCounter, StaggerContainer, StaggerItem } from "./animations";

// TODO: Connect to API - these will be fetched from backend
const stats = [
    { label: "Miembros Activos", value: 500, suffix: "+", icon: Users },
    { label: "Publicaciones", value: 50, suffix: "+", icon: BookOpen },
    { label: "Eventos Realizados", value: 25, suffix: "+", icon: Calendar },
    { label: "Años de Experiencia", value: 10, suffix: "+", icon: Award },
];

export default function Statistics() {
    return (
        <section className="py-16 md:py-20 relative overflow-hidden">
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-amber-500/5 to-pink-500/5" />

            <div className="container relative z-10">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Nuestro <span className="gradient-text">Impacto</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Números que reflejan nuestro compromiso con la psicología científica en Venezuela.
                        </p>
                    </div>
                </FadeIn>

                <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StaggerItem key={index}>
                            <div className="group p-6 md:p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 text-center">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <stat.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    );
}
