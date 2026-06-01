import { Upload, Wand2, Video, QrCode, Users } from 'lucide-react';

const steps = [
  { icon: Upload, title: 'Upload Your Resume', desc: 'Start by uploading your existing resume or CV in PDF or DOCX format.', color: 'from-cyan-500 to-cyan-600', num: '01' },
  { icon: Wand2, title: 'Generate AI Script', desc: 'Paste the job description and our AI instantly writes your personalized intro script.', color: 'from-violet-500 to-violet-600', num: '02' },
  { icon: Video, title: 'Record Your Intro', desc: 'Hit record on your phone or laptop and deliver your 60-second video introduction.', color: 'from-pink-500 to-pink-600', num: '03' },
  { icon: QrCode, title: 'Get Your QR Profile', desc: 'Generate a unique QR code that links to your complete candidate profile.', color: 'from-emerald-500 to-emerald-600', num: '04' },
  { icon: Users, title: 'Recruiters Review', desc: 'Recruiters scan your QR, watch your video, review your resume, and reach out.', color: 'from-amber-500 to-amber-600', num: '05' },
];

export default function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block glass rounded-full px-4 py-1 text-xs font-semibold text-violet-400 border border-violet-500/20 mb-4">
            How It Works
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-black text-white mb-4">
            From resume to hired in<br />
            <span className="gradient-text">5 simple steps</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-amber-500/30" />
          
          {steps.map((step, i) => (
            <div key={step.num} className="flex flex-col items-center text-center group">
              <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg z-10`}>
                <step.icon className="w-8 h-8 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-white/20 flex items-center justify-center">
                  <span className="text-xs font-black text-white/60">{i + 1}</span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{step.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
