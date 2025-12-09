import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter } from "lucide-react";

const footerLinks = {
  navigation: [
    { name: "Home", href: "/" },
    { name: "Nosotros", href: "/nosotros" },
    { name: "Contacto", href: "/contacto" },
    { name: "Team", href: "/equipo" },
    { name: "Blog", href: "/blog" },
  ],
  social: [
    { name: "Facebook", href: "https://www.facebook.com/profile.php?id=100063495787504", icon: Facebook },
    { name: "Instagram", href: "https://www.instagram.com/revepsic/", icon: Instagram },
    { name: "Twitter", href: "https://twitter.com/REVEPSIC", icon: Twitter },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10">
                <Image
                  src="/favicon.svg"
                  alt="REVEPSIC"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">
                <span className="text-foreground">REVEP</span>
                <span className="text-primary">SIC</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Red Venezolana Para el Avance de la Psicología Científica. Líderes en la difusión y divulgación en Venezuela.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Navegación</h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Síguenos</h3>
            <div className="flex gap-3">
              {footerLinks.social.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} REVEPSIC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
