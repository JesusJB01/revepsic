"use client";
import React from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

const socialLinks = [
  {
    name: "Facebook",
    username: "@revepsic",
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=100063495787504",
    color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white",
  },
  {
    name: "Instagram",
    username: "@revepsic",
    icon: Instagram,
    href: "https://www.instagram.com/revepsic/",
    color: "bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white",
  },
  {
    name: "Twitter",
    username: "@REVEPSIC",
    icon: Twitter,
    href: "https://twitter.com/REVEPSIC",
    color: "bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white",
  },
  {
    name: "Email",
    username: "revepsic@gmail.com",
    icon: Mail,
    href: "mailto:revepsic@gmail.com",
    color: "bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white",
  },
];

export default function ContactoPage() {
  return (
    <>
      <PageHeader
        title="Contacto"
        subtitle="Estaremos felices de conectar contigo"
        imageSrc="/contact.svg"
        imageAlt="Contacto"
      />

      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Nuestras <span className="text-primary">Redes</span>
            </h2>
            <p className="text-muted-foreground">
              Síguenos en nuestras redes sociales y mantente al día con nuestras actividades.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 bg-card rounded-2xl border border-border hover:border-transparent transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all ${social.color}`}>
                    <social.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{social.name}</h3>
                    <p className="text-sm text-muted-foreground">{social.username}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
