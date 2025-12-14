"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    MapPin,
    Star,
    Building2,
    Laptop,
    Home,
    Shield,
    BadgeCheck,
    DollarSign
} from "lucide-react";
import type { DirectoryMember } from "@/lib/data/team";
import type { ConsultationType } from "@/lib/api";

interface DirectoryCardProps {
    member: DirectoryMember;
    index?: number;
}

// Get consultation type label
function getConsultationLabel(type: ConsultationType) {
    switch (type) {
        case "PRESENCIAL": return { icon: <Building2 className="w-3.5 h-3.5" />, label: "Presencial" };
        case "ONLINE": return { icon: <Laptop className="w-3.5 h-3.5" />, label: "Online" };
        case "DOMICILIO": return { icon: <Home className="w-3.5 h-3.5" />, label: "Domicilio" };
    }
}

// Calculate average rating
function getAverageRating(comments?: { rating: number }[]): number | null {
    if (!comments || comments.length === 0) return null;
    const sum = comments.reduce((acc, c) => acc + c.rating, 0);
    return Math.round((sum / comments.length) * 10) / 10;
}

export default function DirectoryCard({ member, index = 0 }: DirectoryCardProps) {
    const avgRating = getAverageRating(member.comments);
    const mainSpecialties = member.specialties?.slice(0, 3) || [];
    const extraSpecialties = (member.specialties?.length || 0) - 3;
    const minPrice = member.priceRange?.min;
    const maxPrice = member.priceRange?.max;
    const currency = member.priceRange?.currency || "USD";
    const description = member.profileDescription || member.bio || "";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, delay: index * 0.03 }}
        >
            <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                <div className="flex gap-5">
                    {/* Left: Image */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border-2 border-border">
                                <Image
                                    src={member.image || "https://picsum.photos/200"}
                                    alt={member.name}
                                    width={112}
                                    height={112}
                                    className="object-cover w-full h-full"
                                    unoptimized
                                />
                            </div>
                            {/* Badges */}
                            <div className="absolute -top-2 -left-2 flex gap-1">
                                {member.isVerified && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded-full">
                                        <BadgeCheck className="w-3 h-3" /> Verificado
                                    </span>
                                )}
                            </div>
                            {member.subscriptionPlan === "ASOCIADO_PRO" && (
                                <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-pink-500 to-amber-500 text-white rounded-full">
                                    PRO
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header row */}
                        <div className="flex items-start justify-between gap-4 mb-1">
                            <div>
                                <h3 className="text-lg font-bold text-foreground leading-tight">
                                    {member.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {member.position}
                                </p>
                            </div>
                            {/* Rating */}
                            {avgRating !== null && (
                                <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="font-semibold text-sm">{avgRating}</span>
                                    <span className="text-xs text-muted-foreground">({member.comments?.length})</span>
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        {member.city && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{member.city}{member.state ? `, ${member.state}` : ''}</span>
                            </div>
                        )}

                        {/* Specialties */}
                        {mainSpecialties.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {mainSpecialties.map((specialty, i) => (
                                    <span
                                        key={i}
                                        className="px-2.5 py-0.5 text-xs font-medium bg-muted text-foreground rounded-md border border-border"
                                    >
                                        {specialty}
                                    </span>
                                ))}
                                {extraSpecialties > 0 && (
                                    <span className="px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-md border border-border">
                                        +{extraSpecialties}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Consultation types & Price */}
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                            {member.consultationTypes && member.consultationTypes.length > 0 && (
                                <div className="flex items-center gap-2">
                                    {member.consultationTypes.map((type, i) => {
                                        const { icon, label } = getConsultationLabel(type);
                                        return (
                                            <span key={i} className="flex items-center gap-1">
                                                {icon} {label}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                            {minPrice !== undefined && minPrice !== null && (
                                <span className="flex items-center gap-1 font-medium text-foreground">
                                    <DollarSign className="w-3.5 h-3.5" />
                                    {minPrice}{maxPrice && maxPrice !== minPrice ? `-${maxPrice}` : ''} {currency}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {description}
                            </p>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/directorio/${member.slug}`}
                                className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Ver perfil
                            </Link>
                            {member.whatsapp && (
                                <a
                                    href={`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 text-sm font-medium bg-muted text-foreground rounded-lg hover:bg-accent transition-colors border border-border"
                                >
                                    Contactar
                                </a>
                            )}
                            {member.acceptsInsurance && (
                                <span className="ml-auto flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                    <Shield className="w-4 h-4" /> Seguros
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
