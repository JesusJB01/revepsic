import Description from "@/components/Description";
import Hero from "@/components/Hero";
import Statistics from "@/components/Statistics";
import Testimonials from "@/components/Testimonials";
import UpcomingEvents from "@/components/UpcomingEvents";
import Newsletter from "@/components/Newsletter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "REVEPSIC - Red Venezolana de Psicología Científica",
  description: "REVEPSIC es una red de profesionales de la psicología dedicada a promover la investigación científica, la práctica basada en evidencia y el desarrollo profesional en Venezuela.",
  keywords: ["psicología", "Venezuela", "investigación", "salud mental", "evidencia científica", "profesionales"],
  openGraph: {
    title: "REVEPSIC - Red Venezolana de Psicología Científica",
    description: "Conectamos profesionales de la psicología dedicados a la investigación y práctica basada en evidencia.",
    type: "website",
    locale: "es_VE",
  },
  twitter: {
    card: "summary_large_image",
    title: "REVEPSIC - Red Venezolana de Psicología Científica",
    description: "Conectamos profesionales de la psicología dedicados a la investigación y práctica basada en evidencia.",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Statistics />
      <Description />
      <Testimonials />
      <UpcomingEvents />
      <Newsletter />
    </>
  );
}
