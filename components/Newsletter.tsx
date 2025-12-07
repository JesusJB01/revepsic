"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeIn } from "./animations";
import { newsletterApi } from "@/lib/api";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setMessage("Por favor, ingresa un correo válido.");
      return;
    }

    setStatus("loading");

    const response = await newsletterApi.subscribe(email, "homepage_newsletter");

    if (response.success) {
      setStatus("success");
      setMessage("¡Gracias por suscribirte!");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(response.message || "Error al suscribirse. Intenta de nuevo.");
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 5000);
  };

  return (
    <section className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <FadeIn>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Regístrate al <span className="gradient-text">newsletter</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-md">
                Mantente informado con todo lo que necesitas saber en Psicología.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="flex-1 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 gradient-bg text-slate-950 font-semibold rounded-xl shadow-lg shadow-amber-500/20"
                  >
                    Suscribirse
                  </motion.button>
                </div>

                {message && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm ${status === "error" ? "text-red-400" : "text-green-400"}`}
                  >
                    {message}
                  </motion.p>
                )}
              </form>

              <p className="text-xs text-slate-500">
                Nos preocupamos por tus datos. Lee nuestra{" "}
                <Link href="#" className="text-slate-400 hover:text-primary transition-colors">
                  política de privacidad
                </Link>
                .
              </p>
            </div>
          </FadeIn>

          {/* Illustration */}
          <FadeIn delay={0.3}>
            <div className="relative hidden lg:block">
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-amber-500/20 rounded-full blur-3xl scale-75" />
                <Image
                  src="/newsletter-illustration.png"
                  alt="Newsletter"
                  fill
                  className="object-contain drop-shadow-2xl relative z-10"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
