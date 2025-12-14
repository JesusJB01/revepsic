"use client";
import React, { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { FadeIn } from "./animations";
import { subscribeToNewsletter, type NewsletterActionState } from "@/lib/actions/newsletter";
import newsletterAnimation from "@/public/animations/Newslettert.json";
import { toast } from "sonner";

// Initial state for the form
const initialState: NewsletterActionState = {
  success: false,
  message: "",
};

export default function Newsletter() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Show toast notification when state changes
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        // Reset form on success
        formRef.current?.reset();
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

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

              {/* Form - using Server Action */}
              <form ref={formRef} action={formAction} className="space-y-4">
                <input type="hidden" name="source" value="homepage_newsletter" />

                <div className="flex flex-col gap-3">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Tu nombre"
                      required
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      disabled={isPending}
                      aria-describedby={state.errors?.name ? "name-error" : undefined}
                    />
                    {state.errors?.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-400">
                        {state.errors.name}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        type="email"
                        name="email"
                        placeholder="correo@ejemplo.com"
                        required
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        disabled={isPending}
                        aria-describedby={state.errors?.email ? "email-error" : undefined}
                      />
                      {state.errors?.email && (
                        <p id="email-error" className="mt-1 text-sm text-red-400">
                          {state.errors.email}
                        </p>
                      )}
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: isPending ? 1 : 1.05 }}
                      whileTap={{ scale: isPending ? 1 : 0.95 }}
                      disabled={isPending}
                      className="px-6 py-3 gradient-bg text-slate-950 font-semibold rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Enviando..." : "Suscribirse"}
                    </motion.button>
                  </div>
                </div>
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
                <Lottie
                  animationData={newsletterAnimation}
                  loop={true}
                  className="w-full h-full relative z-10 drop-shadow-2xl"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
