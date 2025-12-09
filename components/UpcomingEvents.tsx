"use client";
import React from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations";

// TODO: Connect to API - these will be fetched from backend
const events = [
    {
        title: "3ra Jornada Venezolana de Psicología Basada en Evidencia",
        date: "15 de Marzo, 2025",
        location: "Universidad Central de Venezuela",
        href: "/postulacion",
        status: "upcoming",
    },
    {
        title: "Taller: Introducción a la Terapia Cognitivo-Conductual",
        date: "20 de Febrero, 2025",
        location: "Online - Zoom",
        href: "#",
        status: "upcoming",
    },
    {
        title: "Seminario de Investigación en Psicología",
        date: "10 de Abril, 2025",
        location: "Caracas, Venezuela",
        href: "#",
        status: "upcoming",
    },
];

export default function UpcomingEvents() {
    return (
        <section className="py-16 md:py-24">
            <div className="container">
                <FadeIn>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Próximos <span className="gradient-text">Eventos</span>
                            </h2>
                            <p className="text-muted-foreground max-w-xl">
                                No te pierdas nuestras próximas actividades y oportunidades de formación.
                            </p>
                        </div>
                        <Link
                            href="/ponencia"
                            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                        >
                            Ver todos los eventos
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </FadeIn>

                <StaggerContainer className="grid md:grid-cols-3 gap-6">
                    {events.map((event, index) => (
                        <StaggerItem key={index}>
                            <Link
                                href={event.href}
                                className="group block p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full"
                            >
                                {/* Status badge */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs font-medium text-green-500 uppercase">Próximamente</span>
                                </div>

                                <h3 className="text-lg font-semibold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2">
                                    {event.title}
                                </h3>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        {event.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        {event.location}
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-2 text-primary font-medium text-sm">
                                    Más información
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    );
}
