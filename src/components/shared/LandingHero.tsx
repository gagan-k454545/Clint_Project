'use client';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles, Video, QrCode, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400">AI-Powered Recruitment Platform</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black leading-[1.05] mb-6">
              <span className="text-white">Your Career,</span>
              <br />
              <span className="gradient-text glow-text-blue">On Camera.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/50 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8">
              Replace boring resumes with AI-generated video profiles. Record once, share everywhere with a QR code. Get hired faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/auth/signup">
                <Button size="xl" glow className="w-full sm:w-auto group">
                  Start for Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="xl" variant="outline" className="w-full sm:w-auto group">
                  <Play className="w-4 h-4" />
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/8">
              {[
                { value: '10x', label: 'More Interviews' },
                { value: '2 min', label: 'Profile Setup' },
                { value: '98%', label: 'Recruiter Approval' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-black gradient-text-blue">{stat.value}</div>
                  <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard mockup */}
          <div className="flex-1 max-w-lg w-full">
            <div className="relative">
              {/* Main card */}
              <div className="glass-strong rounded-3xl p-6 border border-white/12 glow-blue">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">JD</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">John Doe</p>
                    <p className="text-xs text-white/40">Senior Engineer • 5 yrs exp</p>
                  </div>
                  <div className="ml-auto">
                    <span className="status-shortlisted px-2.5 py-0.5 rounded-full text-xs font-semibold">Shortlisted</span>
                  </div>
                </div>

                {/* Video preview */}
                <div className="relative rounded-2xl bg-gradient-to-br from-cyan-900/30 to-violet-900/30 border border-white/10 aspect-video mb-4 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 scanline" />
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-2 mx-auto">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                    <p className="text-xs text-white/40">Intro Video • 1:45</p>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-500 rounded-full px-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white record-pulse" />
                    <span className="text-white text-xs font-semibold">REC</span>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="glass rounded-xl p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-semibold text-cyan-400">AI Summary</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Highly skilled engineer with expertise in React, Node.js, and cloud architecture. Strong leadership background and a passion for scalable systems...
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/30 transition-colors">
                    ✓ Shortlist
                  </button>
                  <button className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold hover:bg-red-500/30 transition-colors">
                    ✗ Pass
                  </button>
                  <button className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/40 hover:text-white border border-white/10">
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 glass rounded-xl p-3 border border-white/10 shadow-xl animate-float">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-white">Video Ready</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 glass rounded-xl p-3 border border-white/10 shadow-xl animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-semibold text-white">AI Script Generated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
