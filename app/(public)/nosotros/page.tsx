import Image from "next/image";
import React from "react";
import PageHeader from "@/components/PageHeader";
import { Target, Eye, Heart, Award, Users, BookOpen } from "lucide-react";

const values = [
    { icon: Award, title: "Excelencia en Investigación" },
    { icon: BookOpen, title: "Educación Accesible" },
    { icon: Users, title: "Comunidad Colaborativa" },
    { icon: Heart, title: "Ética y Responsabilidad" },
];

export default function NosotrosPage() {
    return (
        <>
            <PageHeader
                title="Sobre Revepsic"
                subtitle="Conoce nuestra misión y visión"
                imageSrc="/nosotros2.svg"
                imageAlt="Sobre Revepsic"
            />

            <section className="py-16 md:py-24">
                <div className="container max-w-4xl">
                    {/* About */}
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">
                            Acerca de <span className="text-primary">Revepsic</span>
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            En Revepsic, creemos en la promoción y avance de la psicología científica como un pilar fundamental para el bienestar de la sociedad venezolana y, en última instancia, para el mundo entero. Nuestra red se compone de apasionados profesionales de la psicología que se han unido con el objetivo de compartir conocimientos, fomentar la investigación, y difundir información relevante que contribuya al crecimiento de esta disciplina vital.
                        </p>
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="p-8 bg-card rounded-2xl border border-border">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                <Target className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-4">Nuestra Misión</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Fortalecer la psicología científica en Venezuela y más allá, promoviendo la investigación rigurosa, la educación de calidad y el acceso a recursos psicológicos confiables.
                            </p>
                        </div>

                        <div className="p-8 bg-card rounded-2xl border border-border">
                            <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                                <Eye className="h-6 w-6 text-secondary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-4">Nuestra Visión</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Visualizamos un futuro en el que la psicología científica sea un recurso ampliamente disponible y respetado en Venezuela, donde las personas puedan acceder a apoyo psicológico de calidad.
                            </p>
                        </div>
                    </div>

                    {/* Values */}
                    <div className="mb-16">
                        <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
                            Lo Que Nos <span className="text-primary">Impulsa</span>
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {values.map((value, index) => (
                                <div key={index} className="p-6 bg-muted rounded-xl text-center">
                                    <value.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                                    <p className="text-sm font-medium text-foreground">{value.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center p-8 bg-gradient-to-r from-pink-500/10 to-amber-500/10 rounded-2xl border border-border">
                        <h3 className="text-xl font-bold text-foreground mb-4">
                            Únete a Nuestra Comunidad
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                            Si compartes nuestra pasión por la psicología científica, te invitamos a unirte a nuestra comunidad.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
