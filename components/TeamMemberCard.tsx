"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, ExternalLink } from "lucide-react";
import type { TeamMember } from "@/lib/data/team";

interface TeamMemberCardProps {
    member: TeamMember;
    index?: number;
}

export default function TeamMemberCard({ member, index = 0 }: TeamMemberCardProps) {
    const router = useRouter();

    const handleCardClick = (e: React.MouseEvent) => {
        // Don't navigate if clicking on a social link
        const target = e.target as HTMLElement;
        if (target.closest('a')) {
            return;
        }
        router.push(`/m/${member.slug}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
        >
            <div
                onClick={handleCardClick}
                className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 transition-all duration-300 hover:bg-card/80 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer"
            >
                {/* Gradient glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/10 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* View profile indicator */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <ExternalLink className="w-4 h-4 text-primary" />
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Image container */}
                    <div className="relative mb-4">
                        {/* Animated ring */}
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-pink-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-border group-hover:border-transparent transition-colors duration-300">
                            <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                sizes="(max-width: 768px) 96px, 112px"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    </div>

                    {/* Name and Position */}
                    <h3 className="font-bold text-foreground text-lg mb-1 transition-colors group-hover:text-primary">
                        {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{member.position}</p>

                    {/* Bio - shows on hover */}
                    <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-300">
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                            {member.bio}
                        </p>
                    </div>

                    {/* Social Links */}
                    {member.social && (
                        <div className="flex gap-2 mt-2">
                            {member.social.facebook && (
                                <motion.a
                                    href={member.social.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-blue-600 hover:text-white transition-colors"
                                    aria-label={`Facebook de ${member.name}`}
                                >
                                    <Facebook className="w-4 h-4" />
                                </motion.a>
                            )}
                            {member.social.instagram && (
                                <motion.a
                                    href={member.social.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-gradient-to-br hover:from-pink-500 hover:to-amber-500 hover:text-white transition-colors"
                                    aria-label={`Instagram de ${member.name}`}
                                >
                                    <Instagram className="w-4 h-4" />
                                </motion.a>
                            )}
                            {member.social.twitter && (
                                <motion.a
                                    href={member.social.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-sky-500 hover:text-white transition-colors"
                                    aria-label={`Twitter de ${member.name}`}
                                >
                                    <Twitter className="w-4 h-4" />
                                </motion.a>
                            )}
                        </div>
                    )}

                    {/* View profile text */}
                    <p className="mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Ver perfil completo →
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
