'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Briefcase } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/utils';

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const defaultRole = searchParams.get('role') || 'candidate';

  const [form, setForm] = useState({ name: '', email: '', password: '', role: defaultRole });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast({ title: 'Signup Failed', description: data.error, type: 'error' });
        return;
      }

      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.ok) {
        toast({ title: 'Account created!', description: 'Welcome to PitchID', type: 'success' });
        const dashboardPath = form.role === 'recruiter' ? '/dashboard/recruiter' : '/dashboard/candidate';
        router.push(dashboardPath);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center glow-blue">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold gradient-text">PitchID</span>
          </Link>
          <h1 className="text-3xl font-display font-black text-white mb-2">Create your account</h1>
          <p className="text-white/40 text-sm">Start your video profile journey today</p>
        </div>

        <div className="glass-strong rounded-3xl p-8 border border-white/12">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: 'candidate', label: 'Candidate', icon: User, desc: 'Looking for jobs' },
              { value: 'recruiter', label: 'Recruiter', icon: Briefcase, desc: 'Hiring talent' },
            ].map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setForm({ ...form, role: role.value })}
                className={cn(
                  'flex flex-col items-center p-4 rounded-xl border transition-all duration-200',
                  form.role === role.value
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-white'
                    : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                )}
              >
                <role.icon className="w-5 h-5 mb-1.5" />
                <span className="text-sm font-semibold">{role.label}</span>
                <span className="text-xs opacity-60 mt-0.5">{role.desc}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
              icon={<User className="w-4 h-4" />}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              icon={<Mail className="w-4 h-4" />}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                icon={<Lock className="w-4 h-4" />}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-9 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" loading={loading} size="lg" className="w-full" glow>
              Create Account
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-5 text-center border-t border-white/8 pt-5">
            <p className="text-sm text-white/40">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
