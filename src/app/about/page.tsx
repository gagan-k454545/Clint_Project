import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Zap, Target, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20 max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center mx-auto mb-6 glow-blue">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-display font-black text-white mb-4">
            About <span className="gradient-text">PitchID</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            We believe hiring should be human-first. Resumes reduce people to bullet points. PitchID gives every candidate a voice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Target, title: 'Our Mission', desc: 'Replace outdated paper resumes with dynamic, AI-powered video profiles that let candidates truly showcase who they are.', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
            { icon: Heart, title: 'Our Values', desc: 'Fairness, transparency, and opportunity for all. We\'re building tools that level the playing field for every job seeker.', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
            { icon: Zap, title: 'Our Vision', desc: 'A world where the best candidate gets the job — not the one with the most polished resume template.', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
          ].map((item) => (
            <div key={item.title} className={`glass rounded-2xl p-6 border ${item.border}`}>
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-3xl p-10 border border-white/12 text-center">
          <h2 className="text-3xl font-display font-black text-white mb-4">
            Ready to transform your job search?
          </h2>
          <p className="text-white/40 mb-6">Join thousands of candidates and recruiters on PitchID.</p>
          <Link href="/auth/signup">
            <Button size="lg" glow>Create Your Profile →</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
