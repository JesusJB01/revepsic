"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { newsletterApi } from "@/lib/api";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ConfirmNewsletterPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Token de confirmación no válido.");
            return;
        }

        const confirmSubscription = async () => {
            const response = await newsletterApi.confirmSubscription(token);

            if (response.success) {
                setStatus("success");
                setMessage(response.data?.message || "¡Tu suscripción ha sido confirmada!");
            } else {
                setStatus("error");
                setMessage(response.message || "El enlace de confirmación no es válido o ha expirado.");
            }
        };

        confirmSubscription();
    }, [token]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center"
            >
                {status === "loading" && (
                    <>
                        <Loader2 className="h-16 w-16 mx-auto text-primary animate-spin mb-6" />
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            Confirmando suscripción...
                        </h1>
                        <p className="text-muted-foreground">
                            Por favor espera mientras verificamos tu suscripción.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="h-16 w-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                            <CheckCircle className="h-10 w-10 text-green-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            ¡Bienvenido a Revepsic!
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            {message}
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 gradient-bg text-slate-950 font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90 transition-opacity"
                        >
                            Ir al inicio
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="h-16 w-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                            <XCircle className="h-10 w-10 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            Error de confirmación
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            {message}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/"
                                className="px-6 py-3 bg-muted text-foreground font-semibold rounded-xl hover:bg-muted/80 transition-colors"
                            >
                                Ir al inicio
                            </Link>
                            <Link
                                href="/#newsletter"
                                className="px-6 py-3 gradient-bg text-slate-950 font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90 transition-opacity"
                            >
                                Suscribirse nuevamente
                            </Link>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}
