"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">Red Venezolana</span>
              <br />
              <span className="gradient-text">Para el Avance de la Psicología Científica</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0">
              Líderes en la difusión y divulgación de la psicología basada en evidencia en Venezuela.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/nosotros"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-950 gradient-bg rounded-full hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/25"
              >
                Conócenos
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border border-slate-700 rounded-full hover:bg-slate-800 transition-all"
              >
                Contacto
              </Link>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              <Image
                src="/hero-illustration.png"
                alt="Psicología Científica"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
