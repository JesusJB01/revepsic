"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { FadeIn } from "./animations";

// TODO: Connect to API - these will be fetched from backend
const testimonials = [
    {
        quote: "REVEPSIC ha sido fundamental en mi desarrollo profesional. La red me ha permitido conectar con colegas y acceder a recursos de investigación de alta calidad.",
        name: "Dra. María González",
        role: "Psicóloga Clínica",
        image: "/maria.jpg",
    },
    {
        quote: "Formar parte de esta red me ha brindado la oportunidad de participar en eventos de primer nivel y mantenerme actualizado en las últimas tendencias de la psicología basada en evidencia.",
        name: "Lic. Carlos Mendoza",
        role: "Investigador en Psicología",
        image: "/nelson.jpg",
    },
    {
        quote: "La comunidad de REVEPSIC es increíblemente solidaria. Siempre hay alguien dispuesto a colaborar y compartir conocimientos.",
        name: "Lic. Ana Rodríguez",
        role: "Psicóloga Educativa",
        image: "/anarodriguez.jpg",
    },
];

export default function Testimonials() {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    return (
        <section className="py-16 md:py-24 bg-muted relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

            <div className="container relative z-10">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Lo que dicen nuestros <span className="gradient-text">miembros</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Testimonios de profesionales que forman parte de nuestra red.
                        </p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <div className="max-w-3xl mx-auto">
                        <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border shadow-xl">
                            {/* Quote icon */}
                            <div className="absolute -top-4 left-8">
                                <div className="h-10 w-10 rounded-full gradient-bg flex items-center justify-center">
                                    <Quote className="h-5 w-5 text-white" />
                                </div>
                            </div>

                            {/* Testimonial content */}
                            <div className="pt-4">
                                <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8 italic">
                                    "{testimonials[current].quote}"
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-primary">
                                        <Image
                                            src={testimonials[current].image}
                                            alt={testimonials[current].name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{testimonials[current].name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex gap-2 absolute bottom-8 right-8">
                                <button
                                    onClick={prev}
                                    className="h-10 w-10 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors"
                                    aria-label="Previous"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={next}
                                    className="h-10 w-10 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors"
                                    aria-label="Next"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Dots */}
                            <div className="flex gap-2 justify-center mt-8">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrent(index)}
                                        className={`h-2 rounded-full transition-all ${index === current ? "w-8 bg-primary" : "w-2 bg-border"
                                            }`}
                                        aria-label={`Go to testimonial ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
