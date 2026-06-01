import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { CheckCircle, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: ['1 video profile', 'AI script generation', 'QR code', 'Resume upload', 'Public profile page'],
    cta: 'Get Started Free',
    href: '/auth/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For active job seekers',
    features: ['Unlimited profiles', 'Advanced AI scripts', 'Custom QR designs', 'Analytics dashboard', 'Priority support', 'Profile themes', 'ATS integration'],
    cta: 'Start Pro Trial',
    href: '/auth/signup',
    highlight: true,
  },
  {
    name: 'Teams',
    price: '$49',
    period: '/month',
    description: 'For recruiters & HR teams',
    features: ['Unlimited candidates', 'Team dashboard', 'Pipeline management', 'Bulk QR scanning', 'Export to ATS', 'API access', 'Custom branding', 'Dedicated support'],
    cta: 'Contact Sales',
    href: '/auth/signup?role=recruiter',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-display font-black text-white mb-4">
              Simple, <span className="gradient-text">transparent</span> pricing
            </h1>
            <p className="text-lg text-white/40 max-w-md mx-auto">
              Start free. Upgrade when you're ready to supercharge your job search.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`glass rounded-3xl p-7 border flex flex-col ${
                  plan.highlight
                    ? 'border-cyan-500/40 relative glow-blue'
                    : 'border-white/10'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-white mb-1">{plan.name}</h2>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-white/40 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-sm text-white/40 mt-1">{plan.description}</p>
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}>
                  <Button
                    variant={plan.highlight ? 'primary' : 'outline'}
                    className="w-full"
                    glow={plan.highlight}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-white/25 mt-10">
            All plans include SSL security, 99.9% uptime, and GDPR compliance.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
