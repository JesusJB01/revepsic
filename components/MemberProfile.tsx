"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Facebook,
    Instagram,
    Twitter,
    MessageCircle,
    Globe,
    User,
    Share2,
    CheckCircle2,
    X,
    ArrowLeft
} from "lucide-react";
import type { TeamMember } from "@/lib/data/team";

interface MemberProfileProps {
    member: TeamMember;
}

export default function MemberProfile({ member }: MemberProfileProps) {
    const [showBio, setShowBio] = useState(false);
    const [showSocial, setShowSocial] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== "undefined"
        ? window.location.href
        : `https://revepsic.com/m/${member.slug}`;

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: `${member.name} | REVEPSIC`,
                text: `Conoce a ${member.name}, ${member.position} en REVEPSIC`,
                url: shareUrl,
            });
        } else {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const whatsappUrl = member.whatsapp
        ? `https://wa.me/${member.whatsapp.replace(/\D/g, "")}`
        : null;

    const hasSocial = member.social && (
        member.social.facebook || member.social.instagram || member.social.twitter
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/4 -left-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.3, 1, 1.3],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-8">
                {/* Back button */}
                <div className="w-full max-w-md md:max-w-none md:w-full mb-4">
                    <div className="md:pl-8 lg:pl-16 xl:pl-24">
                        <Link
                            href="/equipo"
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Volver al equipo</span>
                        </Link>
                    </div>
                </div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Photo */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative mb-4">
                            {/* Animated gradient ring */}
                            <motion.div
                                className="absolute -inset-2 rounded-full bg-gradient-to-br from-pink-500 via-amber-500 to-pink-500"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            />
                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-slate-950">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    sizes="(max-width: 768px) 128px, 160px"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Name and Position */}
                        <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
                            {member.name}
                        </h1>
                        <p className="text-lg text-slate-400 mb-3">{member.position}</p>

                        {/* Verified Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-amber-500/20 border border-pink-500/30 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-amber-400" />
                            <span className="text-sm text-white font-medium">
                                Miembro verificado REVEPSIC
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        {/* Bio Button */}
                        <motion.button
                            onClick={() => setShowBio(!showBio)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white font-medium flex items-center justify-center gap-3 hover:bg-white/10 hover:border-pink-500/50 transition-all"
                        >
                            <User className="w-5 h-5 text-pink-400" />
                            <span>Mi Bio</span>
                        </motion.button>

                        {/* Bio Content */}
                        <AnimatePresence>
                            {showBio && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                                        <p className="text-slate-300 leading-relaxed">{member.bio}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Social Media Button */}
                        {hasSocial && (
                            <>
                                <motion.button
                                    onClick={() => setShowSocial(!showSocial)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white font-medium flex items-center justify-center gap-3 hover:bg-white/10 hover:border-amber-500/50 transition-all"
                                >
                                    <Share2 className="w-5 h-5 text-amber-400" />
                                    <span>Redes Sociales</span>
                                </motion.button>

                                {/* Social Links */}
                                <AnimatePresence>
                                    {showSocial && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex justify-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                                                {member.social?.facebook && (
                                                    <motion.a
                                                        href={member.social.facebook}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30"
                                                    >
                                                        <Facebook className="w-6 h-6" />
                                                    </motion.a>
                                                )}
                                                {member.social?.instagram && (
                                                    <motion.a
                                                        href={member.social.instagram}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/30"
                                                    >
                                                        <Instagram className="w-6 h-6" />
                                                    </motion.a>
                                                )}
                                                {member.social?.twitter && (
                                                    <motion.a
                                                        href={member.social.twitter}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/30"
                                                    >
                                                        <Twitter className="w-6 h-6" />
                                                    </motion.a>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}

                        {/* WhatsApp Button */}
                        {whatsappUrl && (
                            <motion.a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full p-4 bg-green-600 rounded-2xl text-white font-medium flex items-center justify-center gap-3 shadow-lg shadow-green-600/30 hover:bg-green-500 transition-all"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>Contáctame por WhatsApp</span>
                            </motion.a>
                        )}

                        {/* Website Button */}
                        {member.website && (
                            <motion.a
                                href={member.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white font-medium flex items-center justify-center gap-3 hover:bg-white/10 hover:border-violet-500/50 transition-all"
                            >
                                <Globe className="w-5 h-5 text-violet-400" />
                                <span>Mi Sitio Web</span>
                            </motion.a>
                        )}

                        {/* Share Button */}
                        <motion.button
                            onClick={handleShare}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full p-4 gradient-bg rounded-2xl text-slate-950 font-semibold flex items-center justify-center gap-3 shadow-lg shadow-amber-500/20"
                        >
                            {copied ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>¡Link copiado!</span>
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-5 h-5" />
                                    <span>Compartir mi perfil</span>
                                </>
                            )}
                        </motion.button>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 text-center">
                        <Link href="/" className="inline-block">
                            <p className="text-slate-500 text-sm mb-2">Powered by</p>
                            <div className="flex items-center justify-center gap-2">
                                <Image
                                    src="/logo.png"
                                    alt="REVEPSIC"
                                    width={32}
                                    height={32}
                                    className="rounded"
                                    style={{ width: 'auto', height: 'auto' }}
                                />
                                <span className="text-white font-bold text-lg">REVEPSIC</span>
                            </div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
