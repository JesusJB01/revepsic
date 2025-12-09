import Description from "@/components/Description";
import Hero from "@/components/Hero";
import Statistics from "@/components/Statistics";
import Testimonials from "@/components/Testimonials";
import UpcomingEvents from "@/components/UpcomingEvents";
import Newsletter from "@/components/Newsletter";

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
