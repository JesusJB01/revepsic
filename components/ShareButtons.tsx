"use client";
import React from "react";
import { Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
    title: string;
    url?: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    const shareLinks = [
        {
            name: "Facebook",
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            color: "hover:bg-blue-600",
        },
        {
            name: "Twitter",
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
            color: "hover:bg-sky-500",
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            color: "hover:bg-blue-700",
        },
    ];

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success("¡Enlace copiado!");
        } catch (err) {
            console.error("Error copying:", err);
            toast.error("Error al copiar el enlace");
        }
    };


    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Compartir:</span>
            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`h-9 w-9 rounded-full bg-muted flex items-center justify-center transition-all hover:text-white ${link.color}`}
                    aria-label={`Compartir en ${link.name}`}
                >
                    <link.icon className="h-4 w-4" />
                </a>
            ))}
            <button
                onClick={copyToClipboard}
                className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Copiar enlace"
            >
                <LinkIcon className="h-4 w-4" />
            </button>
        </div>
    );
}
