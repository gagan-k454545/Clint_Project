import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LandingHero from "@/components/shared/LandingHero";
import LandingFeatures from "@/components/shared/LandingFeatures";
import LandingHowItWorks from "@/components/shared/LandingHowItWorks";
import LandingTestimonials from "@/components/shared/LandingTestimonials";
import LandingCTA from "@/components/shared/LandingCTA";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingTestimonials />
        <LandingCTA />
      </main>
      <Footer />
    </div>
  );
}
