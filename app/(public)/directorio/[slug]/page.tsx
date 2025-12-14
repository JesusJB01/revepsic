import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
    ArrowLeft,
    MapPin,
    Phone,
    Mail,
    Globe,
    MessageCircle,
    Linkedin,
    Facebook,
    Instagram,
    Twitter,
    Star,
    Calendar,
    Clock,
    GraduationCap,
    Building2,
    Laptop,
    Home,
    Shield,
    Award,
    BadgeCheck,
    Play,
    User
} from "lucide-react";
import { getDirectoryMemberBySlug, type MemberLocation, type Education, type Schedule, type MemberComment } from "@/lib/data/team";
import type { ConsultationType } from "@/lib/api";

interface DirectoryProfilePageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DirectoryProfilePageProps): Promise<Metadata> {
    const { slug } = await params;
    const member = await getDirectoryMemberBySlug(slug);

    if (!member) {
        return { title: "Psicólogo no encontrado" };
    }

    return {
        title: `${member.name} - ${member.position} | REVEPSIC`,
        description: member.profileDescription || member.bio,
    };
}

export default async function DirectoryProfilePage({ params }: DirectoryProfilePageProps) {
    const { slug } = await params;
    const member = await getDirectoryMemberBySlug(slug);

    if (!member) {
        notFound();
    }

    // Extract arrays safely for type-safe access
    const specialties = member.specialties ?? [];
    const therapies = member.therapies ?? [];
    const targetAges = member.targetAges ?? [];
    const education = member.education ?? [];
    const locations = member.locations ?? [];
    const consultationTypes = member.consultationTypes ?? [];
    const insuranceProviders = member.insuranceProviders ?? [];
    const languages = member.languages ?? [];
    const comments = member.comments ?? [];

    // Calculate average rating
    const avgRating = comments.length > 0
        ? Math.round((comments.reduce((acc, c) => acc + c.rating, 0) / comments.length) * 10) / 10
        : null;


    return (
        <div className="min-h-screen bg-background">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-br from-pink-500/10 via-background to-amber-500/10 pt-24 pb-32">
                <div className="container">
                    <Link
                        href="/directorio"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al directorio
                    </Link>

                    <div className="flex flex-col md:flex-row items-start gap-8">
                        {/* Photo */}
                        <div className="relative">
                            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-background shadow-xl">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    sizes="(max-width: 768px) 160px, 192px"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            {member.isVerified && (
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                    <BadgeCheck className="w-6 h-6 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Basic info */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                    {member.name}
                                </h1>
                                {member.subscriptionPlan === "ASOCIADO_PRO" && (
                                    <span className="px-3 py-1 text-sm font-bold bg-gradient-to-r from-pink-500 to-amber-500 text-white rounded-full">
                                        PRO
                                    </span>
                                )}
                                {member.subscriptionPlan === "ASOCIADO_PLUS" && (
                                    <span className="px-3 py-1 text-sm font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30 rounded-full">
                                        PLUS
                                    </span>
                                )}
                            </div>

                            <p className="text-xl text-muted-foreground mb-4">{member.position}</p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                {member.city && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {member.city}{member.state ? `, ${member.state}` : ""}
                                    </span>
                                )}
                                {member.experienceYears && (
                                    <span className="flex items-center gap-1">
                                        <Award className="w-4 h-4" />
                                        {member.experienceYears} años de experiencia
                                    </span>
                                )}
                                {avgRating !== null && (
                                    <span className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        {avgRating} ({member.comments?.length} opiniones)
                                    </span>
                                )}
                            </div>

                            {/* CTA buttons */}
                            <div className="flex flex-wrap gap-3 mt-6">
                                {member.whatsapp && (
                                    <a
                                        href={`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        WhatsApp
                                    </a>
                                )}
                                {member.email && (
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
                                    >
                                        <Mail className="w-5 h-5" />
                                        Email
                                    </a>
                                )}
                                {member.phone && (
                                    <a
                                        href={`tel:${member.phone}`}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-foreground font-semibold rounded-xl hover:bg-accent transition-colors"
                                    >
                                        <Phone className="w-5 h-5" />
                                        Llamar
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="container -mt-16 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About */}
                        <section className="bg-card rounded-2xl border border-border p-6">
                            <h2 className="text-xl font-bold text-foreground mb-4">Sobre mí</h2>
                            <p className="text-muted-foreground whitespace-pre-line">
                                {member.profileDescription || member.bio}
                            </p>
                        </section>

                        {/* Video */}
                        {member.videoUrl && (
                            <section className="bg-card rounded-2xl border border-border p-6">
                                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                    <Play className="w-5 h-5" />
                                    Video de presentación
                                </h2>
                                <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                                    <iframe
                                        src={member.videoUrl.replace("watch?v=", "embed/")}
                                        className="w-full h-full"
                                        allowFullScreen
                                    />
                                </div>
                            </section>
                        )}

                        {/* Specialties & Therapies */}
                        {(specialties.length > 0 || therapies.length > 0) && (
                            <section className="bg-card rounded-2xl border border-border p-6">
                                <h2 className="text-xl font-bold text-foreground mb-4">Especialidades y Terapias</h2>

                                {specialties.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Especialidades</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {specialties.map((s, i) => (
                                                <span key={i} className="px-3 py-1 text-sm bg-pink-500/10 text-pink-500 rounded-full">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {therapies.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Tipos de terapia</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {therapies.map((t, i) => (
                                                <span key={i} className="px-3 py-1 text-sm bg-amber-500/10 text-amber-500 rounded-full">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {targetAges.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Poblaciones atendidas</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {targetAges.map((a, i) => (
                                                <span key={i} className="px-3 py-1 text-sm bg-violet-500/10 text-violet-500 rounded-full">
                                                    {a}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section className="bg-card rounded-2xl border border-border p-6">
                                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5" />
                                    Formación académica
                                </h2>
                                <div className="space-y-4">
                                    {education.map((edu, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                                <GraduationCap className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-foreground">
                                                    {edu.degree} en {edu.field}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {edu.institution}
                                                    {edu.country && `, ${edu.country}`}
                                                    {edu.year && ` (${edu.year})`}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Locations */}
                        {locations.length > 0 && (
                            <section className="bg-card rounded-2xl border border-border p-6">
                                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Ubicaciones
                                </h2>
                                <div className="space-y-4">
                                    {locations.map((loc, i) => (
                                        <LocationCard key={i} location={loc} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Reviews */}
                        {comments.length > 0 && (
                            <section className="bg-card rounded-2xl border border-border p-6">
                                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                    <Star className="w-5 h-5" />
                                    Opiniones ({comments.length})
                                </h2>
                                <div className="space-y-4">
                                    {comments.map((comment) => (
                                        <CommentCard key={comment.id} comment={comment} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick info card */}
                        <aside className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                            {/* Pricing */}
                            {member.priceRange && (
                                <div className="mb-6 pb-6 border-b border-border">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Tarifas</h3>
                                    <p className="text-2xl font-bold text-foreground">
                                        {member.priceRange.currency === "USD" ? "$" : member.priceRange.currency}
                                        {member.priceRange.min} - {member.priceRange.max}
                                    </p>
                                    {member.priceRange.notes && (
                                        <p className="text-sm text-muted-foreground mt-1">{member.priceRange.notes}</p>
                                    )}
                                    {member.firstSessionFree && (
                                        <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-gradient-to-r from-pink-500/10 to-amber-500/10 text-primary rounded-full border border-primary/20">
                                            Primera consulta gratis
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Consultation types */}
                            {consultationTypes.length > 0 && (
                                <div className="mb-6 pb-6 border-b border-border">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Modalidad de atención</h3>
                                    <div className="space-y-2">
                                        {consultationTypes.map((type, i) => (
                                            <div key={i} className="flex items-center gap-2 text-foreground">
                                                <ConsultationTypeIcon type={type} />
                                                <span>{type === "PRESENCIAL" ? "Presencial" : type === "ONLINE" ? "Online" : "A domicilio"}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Insurance */}
                            {member.acceptsInsurance && (
                                <div className="mb-6 pb-6 border-b border-border">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Seguros aceptados</h3>
                                    <div className="flex items-center gap-2 text-green-500 mb-2">
                                        <Shield className="w-4 h-4" />
                                        <span>Acepta seguros médicos</span>
                                    </div>
                                    {insuranceProviders.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {insuranceProviders.map((ins, i) => (
                                                <span key={i} className="px-2 py-0.5 text-xs bg-muted rounded-full text-muted-foreground">
                                                    {ins}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Languages */}
                            {languages.length > 0 && (
                                <div className="mb-6 pb-6 border-b border-border">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Idiomas</h3>
                                    <p className="text-foreground">{languages.join(", ")}</p>
                                </div>
                            )}

                            {/* Schedule */}
                            {member.schedule && member.schedule.slots && Object.keys(member.schedule.slots).length > 0 && (
                                <div className="mb-6 pb-6 border-b border-border">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Horarios de atención
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        {Object.entries(member.schedule.slots).map(([day, slots]) => (
                                            slots.length > 0 && (
                                                <div key={day} className="flex justify-between items-start">
                                                    <span className="text-muted-foreground capitalize">{day}</span>
                                                    <div className="text-right">
                                                        {slots.map((slot, idx) => (
                                                            <div key={idx} className="text-foreground font-medium">
                                                                {slot.start} - {slot.end}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                    {member.schedule.notes && (
                                        <p className="text-xs text-muted-foreground mt-2">{member.schedule.notes}</p>
                                    )}
                                </div>
                            )}

                            {/* Social links */}
                            <div className="flex items-center gap-3">
                                {member.website && (
                                    <a href={member.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-accent transition-colors">
                                        <Globe className="w-5 h-5" />
                                    </a>
                                )}
                                {member.linkedin && (
                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-accent transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                )}
                                {member.facebook && (
                                    <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-accent transition-colors">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                )}
                                {member.instagram && (
                                    <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-accent transition-colors">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                )}
                                {member.twitter && (
                                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-accent transition-colors">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper components
function ConsultationTypeIcon({ type }: { type: ConsultationType }) {
    switch (type) {
        case "PRESENCIAL": return <Building2 className="w-4 h-4" />;
        case "ONLINE": return <Laptop className="w-4 h-4" />;
        case "DOMICILIO": return <Home className="w-4 h-4" />;
    }
}

function LocationCard({ location }: { location: MemberLocation }) {
    return (
        <div className="p-4 bg-muted/50 rounded-xl">
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ConsultationTypeIcon type={location.type} />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-foreground">{location.name}</h4>
                    {location.address && (
                        <p className="text-sm text-muted-foreground">
                            {location.address}
                            {location.city && `, ${location.city}`}
                        </p>
                    )}
                    {location.phone && (
                        <p className="text-sm text-muted-foreground mt-1">
                            <Phone className="w-3 h-3 inline mr-1" />
                            {location.phone}
                        </p>
                    )}
                    {location.services && location.services.length > 0 && (
                        <div className="mt-3 space-y-1">
                            {location.services.map((service, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{service.name}</span>
                                    <span className="font-medium text-foreground">
                                        {service.currency === "USD" ? "$" : service.currency}{service.price}
                                        {service.duration && <span className="text-muted-foreground text-xs ml-1">({service.duration})</span>}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function CommentCard({ comment }: { comment: MemberComment }) {
    return (
        <div className="p-4 bg-muted/50 rounded-xl">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground">{comment.authorName}</h4>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < comment.rating ? "text-amber-500 fill-amber-500" : "text-muted"}`}
                                />
                            ))}
                        </div>
                    </div>
                    {comment.content && (
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                        {new Date(comment.createdAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
