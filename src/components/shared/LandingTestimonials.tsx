const testimonials = [
  { name: 'Sarah Chen', role: 'Software Engineer', company: 'Google', avatar: 'SC', text: 'PitchID helped me land 3 interviews in one week. The AI script was spot-on for each job description I applied to.', rating: 5 },
  { name: 'Marcus Williams', role: 'Product Manager', company: 'Stripe', avatar: 'MW', text: "As a recruiter, I can review 10x more candidates per day. Watching a 60-second video tells me so much more than a resume.", rating: 5 },
  { name: 'Priya Patel', role: 'UX Designer', company: 'Figma', avatar: 'PP', text: "The QR code on my business card is a conversation starter at every networking event. Everyone wants to know how I made it.", rating: 5 },
  { name: 'James Rodriguez', role: 'Engineering Lead', company: 'Shopify', avatar: 'JR', text: "We shortlisted candidates 3x faster using PitchID. The pipeline view is clean and the video quality is excellent.", rating: 5 },
  { name: 'Aisha Johnson', role: 'Data Scientist', company: 'Netflix', avatar: 'AJ', text: "I was nervous about video recording but the AI script made it so easy. I knew exactly what to say. Got the job!", rating: 5 },
  { name: 'Tom Kim', role: 'Talent Acquisition', company: 'Meta', avatar: 'TK', text: "PitchID has become our go-to screening tool. The candidate profiles are professional and the workflow is seamless.", rating: 5 },
];

export default function LandingTestimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block glass rounded-full px-4 py-1 text-xs font-semibold text-pink-400 border border-pink-500/20 mb-4">
            Testimonials
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-black text-white mb-4">
            Loved by <span className="gradient-text">candidates & recruiters</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="glass rounded-2xl p-6 border border-white/8 hover:border-white/15 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/40">{t.role} @ {t.company}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
