import { Video, Wand2, QrCode, BarChart3, Shield, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Video,
    title: 'Mobile-First Recording',
    description: 'Record your intro directly from your phone. No equipment needed. Professional quality in seconds.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: Wand2,
    title: 'AI Script Generator',
    description: 'Paste any job description. Our AI crafts a personalized, professional introduction script tailored to the role.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: QrCode,
    title: 'Instant QR Profile',
    description: 'Get a scannable QR code linking directly to your video profile. Print it on your business card or resume.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
  {
    icon: BarChart3,
    title: 'Profile Analytics',
    description: 'Track who viewed your profile, how long they watched, and where they came from.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: Shield,
    title: 'ATS-Friendly',
    description: 'Your profile works alongside traditional applications. Include your PitchID link in any resume.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: Smartphone,
    title: 'Recruiter Workflow',
    description: 'Recruiters can scan, watch, shortlist, and add notes all from their mobile device.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
];

export default function LandingFeatures() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block glass rounded-full px-4 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20 mb-4">
            Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-black text-white mb-4">
            Everything you need to<br />
            <span className="gradient-text">stand out</span>
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            PitchID combines AI, video, and smart QR technology into one seamless hiring experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`glass rounded-2xl p-6 border ${feature.border} hover:bg-white/5 transition-all duration-300 group gradient-border`}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
