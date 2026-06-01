import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function LandingCTA() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-strong rounded-3xl p-12 border border-white/12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center mx-auto mb-6 glow-blue">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-black text-white mb-4">
              Ready to transform<br />your job search?
            </h2>
            <p className="text-lg text-white/50 mb-8 max-w-lg mx-auto">
              Join thousands of candidates and recruiters who are hiring smarter with PitchID.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/signup?role=candidate">
                <Button size="xl" glow className="w-full sm:w-auto group">
                  Create Your Profile
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth/signup?role=recruiter">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  Start Hiring
                </Button>
              </Link>
            </div>
            <p className="text-xs text-white/25 mt-6">Free to start • No credit card required</p>
          </div>
        </div>
      </div>
    </section>
  );
}
