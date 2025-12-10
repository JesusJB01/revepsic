import React from "react";
import { Award, Users, Star } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import TeamMemberCard from "@/components/TeamMemberCard";
import { FadeIn } from "@/components/animations";
import { getMembersGrouped, type TeamMember } from "@/lib/data/team";
import TeamSection from "@/components/TeamSection";

// Dynamic page - uses cache tags for on-demand revalidation
// In development, always fetches fresh data (no cache)
// In production, uses on-demand revalidation via /api/revalidate

export default async function EquipoPage() {
  // Fetch members from API (server-side)
  const { fundadores, titulares, asociados } = await getMembersGrouped();

  return (
    <>
      <PageHeader
        title="Nuestro Equipo"
        subtitle="Conoce a las personas detrás de REVEPSIC"
        imageSrc="/team2.svg"
        imageAlt="Equipo REVEPSIC"
      />

      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Animated background elements - moved to client component */}
        <TeamBackgroundAnimations />

        <div className="container relative z-10">
          {/* Intro */}
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                El <span className="gradient-text">Equipo</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Profesionales comprometidos con el avance de la psicología científica en Venezuela.
                Cada miembro aporta su experiencia única para construir una comunidad más fuerte.
              </p>
            </div>
          </FadeIn>

          {/* Fundadores Section */}
          {fundadores.length > 0 && (
            <TeamSection
              title="Fundadores"
              subtitle="Los visionarios que dieron inicio a REVEPSIC"
              icon={<Award className="w-5 h-5" />}
              members={fundadores}
              gradientFrom="from-pink-500"
              gradientTo="to-rose-600"
            />
          )}

          {/* Titulares Section */}
          {titulares.length > 0 && (
            <TeamSection
              title="Miembros Titulares"
              subtitle="Profesionales activos que impulsan nuestra misión"
              icon={<Star className="w-5 h-5" />}
              members={titulares}
              gradientFrom="from-amber-500"
              gradientTo="to-orange-600"
            />
          )}

          {/* Asociados Section */}
          {asociados.length > 0 && (
            <TeamSection
              title="Miembros Asociados"
              subtitle="Profesionales de la psicología que forman parte de nuestra red"
              icon={<Users className="w-5 h-5" />}
              members={asociados}
              gradientFrom="from-violet-500"
              gradientTo="to-purple-600"
            />
          )}
        </div>
      </section>
    </>
  );
}

// Client component for animations
function TeamBackgroundAnimations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/5 to-amber-500/5 rounded-full blur-3xl" />
    </div>
  );
}
