"use client";
import React from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations";

export default function TeamCTA() {
    return (
        <FadeIn delay={0.3}>
            <div className="mt-16 text-center">
                <div className="inline-block bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12">
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                        ¿Quieres ser parte del equipo?
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Únete a nuestra red de profesionales y accede a recursos exclusivos, eventos y oportunidades de colaboración.
                    </p>
                    <motion.a
                        href="/contacto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-8 py-3 gradient-bg text-slate-950 font-semibold rounded-xl shadow-lg shadow-amber-500/20"
                    >
                        Únete a REVEPSIC
                    </motion.a>
                </div>
            </div>
        </FadeIn>
    );
}
