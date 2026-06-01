'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Zap, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';
import { cn } from '@/utils';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = session?.user as { id?: string; role?: string; name?: string; email?: string } | undefined;
  const dashboardHref = user?.role === 'recruiter' ? '/dashboard/recruiter' : '/dashboard/candidate';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-white/8 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center glow-blue">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold gradient-text">PitchID</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/features" className="text-sm text-white/60 hover:text-white transition-colors">Features</Link>
              <Link href="/pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</Link>
              <Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">About</Link>
            </div>

            {/* Auth */}
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 glass rounded-xl px-3 py-2 hover:bg-white/10 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm text-white/80 max-w-24 truncate">{user?.name}</span>
                    <ChevronDown className="w-3 h-3 text-white/40" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass-strong rounded-xl shadow-xl overflow-hidden border border-white/10">
                      <Link
                        href={dashboardHref}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/10"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm" glow>Get Started</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white/60 hover:text-white"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-3">
            <Link href="/features" className="block text-sm text-white/60 hover:text-white py-2" onClick={() => setMobileOpen(false)}>Features</Link>
            <Link href="/pricing" className="block text-sm text-white/60 hover:text-white py-2" onClick={() => setMobileOpen(false)}>Pricing</Link>
            <Link href="/about" className="block text-sm text-white/60 hover:text-white py-2" onClick={() => setMobileOpen(false)}>About</Link>
            <div className="pt-2 border-t border-white/10 flex gap-3">
              {session ? (
                <>
                  <Link href={dashboardHref} onClick={() => setMobileOpen(false)}>
                    <Button size="sm" variant="outline">Dashboard</Button>
                  </Link>
                  <Button size="sm" variant="danger" onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
