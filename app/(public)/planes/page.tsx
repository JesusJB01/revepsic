import React from "react";
import { Check, Star, Crown, Users, Sparkles } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { FadeIn } from "@/components/animations";
import Link from "next/link";

export const metadata = {
    title: "Planes de Membresía | REVEPSIC",
    description: "Únete a nuestra red de profesionales y accede a recursos exclusivos, eventos y oportunidades de colaboración.",
};

const plans = [
    {
        name: "Miembro Asociado",
        description: "Ideal para profesionales que inician su camino en la psicología científica",
        price: "Básico",
        icon: Users,
        gradient: "from-violet-500 to-purple-600",
        features: [
            "Acceso al directorio de miembros",
            "Newsletter mensual con novedades",
            "Acceso a eventos públicos",
            "Descuentos en talleres y cursos",
            "Certificado de membresía digital",
        ],
        cta: "Comenzar",
        popular: false,
    },
    {
        name: "Miembro Titular",
        description: "Para profesionales activos que impulsan nuestra misión",
        price: "Profesional",
        icon: Star,
        gradient: "from-amber-500 to-orange-600",
        features: [
            "Todo lo incluido en Asociado",
            "Perfil destacado en el directorio",
            "Acceso prioritario a eventos exclusivos",
            "Participación en grupos de trabajo",
            "Publicación en el blog de REVEPSIC",
            "Networking con otros profesionales",
            "Certificado de membresía premium",
        ],
        cta: "Unirme ahora",
        popular: true,
    },
    {
        name: "Fundador",
        description: "Liderazgo y visión para el futuro de REVEPSIC",
        price: "Elite",
        icon: Crown,
        gradient: "from-pink-500 to-rose-600",
        features: [
            "Todo lo incluido en Titular",
            "Voz en decisiones estratégicas",
            "Acceso a recursos exclusivos de investigación",
            "Mentoría y colaboración directa",
            "Reconocimiento especial en eventos",
            "Participación en la junta directiva",
            "Insignia de fundador verificada",
            "Prioridad en nuevas iniciativas",
        ],
        cta: "Contactar",
        popular: false,
    },
];

export default function PlanesPage() {
    return (
        <>
            <PageHeader
                title="Planes de Membresía"
                subtitle="Únete a nuestra red de profesionales y accede a recursos exclusivos"
                imageSrc="/team2.svg"
                imageAlt="Planes REVEPSIC"
            />

            <section className="py-16 md:py-24 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/5 to-amber-500/5 rounded-full blur-3xl" />
                </div>

                <div className="container relative z-10">
                    {/* Intro */}
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Elige tu <span className="gradient-text">Plan</span>
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Selecciona el plan que mejor se adapte a tus necesidades y objetivos profesionales.
                                Todos nuestros planes incluyen acceso a una comunidad vibrante de profesionales.
                            </p>
                        </div>
                    </FadeIn>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {plans.map((plan, index) => {
                            const Icon = plan.icon;
                            return (
                                <FadeIn key={plan.name} delay={index * 0.1}>
                                    <div
                                        className={`relative h-full rounded-2xl border transition-all duration-300 hover:scale-105 ${plan.popular
                                                ? "border-amber-500/50 bg-gradient-to-br from-amber-500/5 to-orange-500/5 shadow-xl shadow-amber-500/10"
                                                : "border-border bg-card/50 backdrop-blur-sm hover:border-primary/50"
                                            }`}
                                    >
                                        {/* Popular Badge */}
                                        {plan.popular && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                                <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold rounded-full shadow-lg">
                                                    <Sparkles className="w-4 h-4" />
                                                    <span>Más Popular</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-8">
                                            {/* Icon */}
                                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plan.gradient} mb-4`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>

                                            {/* Plan Name */}
                                            <h3 className="text-2xl font-bold text-foreground mb-2">
                                                {plan.name}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-muted-foreground text-sm mb-4">
                                                {plan.description}
                                            </p>

                                            {/* Price */}
                                            <div className="mb-6">
                                                <div className={`text-3xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                                                    {plan.price}
                                                </div>
                                            </div>

                                            {/* Features */}
                                            <ul className="space-y-3 mb-8">
                                                {plan.features.map((feature) => (
                                                    <li key={feature} className="flex items-start gap-3">
                                                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 bg-gradient-to-br ${plan.gradient} bg-clip-text text-transparent`} />
                                                        <span className="text-sm text-muted-foreground">
                                                            {feature}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* CTA Button */}
                                            <Link
                                                href="/contacto"
                                                className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all ${plan.popular
                                                        ? "gradient-bg text-slate-950 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30"
                                                        : "bg-card border border-border text-foreground hover:bg-muted hover:border-primary/50"
                                                    }`}
                                            >
                                                {plan.cta}
                                            </Link>
                                        </div>
                                    </div>
                                </FadeIn>
                            );
                        })}
                    </div>

                    {/* Additional Info */}
                    <FadeIn delay={0.4}>
                        <div className="mt-16 text-center">
                            <div className="inline-block bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12 max-w-3xl">
                                <h3 className="text-2xl font-bold text-foreground mb-3">
                                    ¿Tienes preguntas?
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    Nuestro equipo está listo para ayudarte a elegir el plan perfecto para ti.
                                    Contáctanos y resolveremos todas tus dudas sobre las membresías.
                                </p>
                                <Link
                                    href="/contacto"
                                    className="inline-block px-8 py-3 bg-card border border-border text-foreground font-semibold rounded-xl hover:bg-muted hover:border-primary/50 transition-all"
                                >
                                    Contactar al equipo
                                </Link>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </>
    );
}
