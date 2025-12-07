import React from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { ArrowRight } from "lucide-react";

// Placeholder articles until API is connected
const articles = [
  {
    title: "Descubriendo la Importancia de la Psicología Basada en Evidencia",
    excerpt: "Un viaje fascinante a través de la PBE, un enfoque que ilumina el panorama de la mente humana.",
    slug: "articulo",
    date: "21 Nov 2023",
  },
];

export default function BlogPage() {
  return (
    <>
      <PageHeader
        title="Blog"
        subtitle="Artículos sobre psicología basada en evidencia"
        imageSrc="/blog.jpg"
        imageAlt="Blog REVEPSIC"
      />

      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          {articles.length > 0 ? (
            <div className="space-y-6">
              {articles.map((article, index) => (
                <Link
                  key={index}
                  href={`/${article.slug}`}
                  className="group block p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">{article.date}</p>
                      <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                        {article.title}
                      </h2>
                      <p className="text-muted-foreground">{article.excerpt}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay artículos disponibles por el momento.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
