import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LandingFeatures from '@/components/shared/LandingFeatures';
import LandingHowItWorks from '@/components/shared/LandingHowItWorks';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <div className="text-center py-16">
          <h1 className="text-5xl font-display font-black text-white mb-4">
            Everything you need to <span className="gradient-text">get hired</span>
          </h1>
          <p className="text-lg text-white/40 max-w-xl mx-auto mb-8">
            PitchID combines AI, video, and smart QR technology into one powerful hiring platform.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" glow>Start for Free →</Button>
          </Link>
        </div>
        <LandingFeatures />
        <LandingHowItWorks />
      </main>
      <Footer />
    </div>
  );
}
