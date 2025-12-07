"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setMessage("Por favor, ingresa un correo válido.");
      return;
    }

    // TODO: Connect to API
    console.log("Subscribing:", email);
    setStatus("success");
    setMessage("¡Gracias por suscribirte!");
    setEmail("");

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 3000);
  };

  return (
    <section className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-transparent to-transparent" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
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
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-3 gradient-bg text-slate-950 font-semibold rounded-xl hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                >
                  Suscribirse
                </button>
              </div>

              {message && (
                <p className={`text-sm ${status === "error" ? "text-red-400" : "text-green-400"}`}>
                  {message}
                </p>
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

          {/* Illustration */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square max-w-md mx-auto">
              <Image
                src="/newsletter-illustration.png"
                alt="Newsletter"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
