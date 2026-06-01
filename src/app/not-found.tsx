import Link from 'next/link';
import { Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative z-10 text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center mx-auto mb-6 glow-blue">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-8xl font-display font-black gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Page not found</h2>
        <p className="text-white/40 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button glow>Go Home</Button>
          </Link>
          <Link href="/dashboard/candidate">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
