'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard, Upload, FileText, Wand2, Video,
  QrCode, BarChart3, LogOut, Menu, X, Zap, ChevronRight
} from 'lucide-react';
import { cn } from '@/utils';

const candidateNav = [
  { href: '/dashboard/candidate', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/candidate/upload-resume', label: 'Upload Resume', icon: Upload },
  { href: '/dashboard/candidate/job-description', label: 'Job Description', icon: FileText },
  { href: '/dashboard/candidate/ai-script', label: 'AI Script', icon: Wand2 },
  { href: '/dashboard/candidate/record-video', label: 'Record Video', icon: Video },
  { href: '/dashboard/candidate/qr-code', label: 'QR Code', icon: QrCode },
  { href: '/dashboard/candidate/analytics', label: 'Analytics', icon: BarChart3 },
];

const recruiterNav = [
  { href: '/dashboard/recruiter', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/recruiter/candidates', label: 'All Candidates', icon: FileText },
  { href: '/dashboard/recruiter/shortlisted', label: 'Shortlisted', icon: BarChart3 },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as { id?: string; role?: string; name?: string; email?: string } | undefined;

  const nav = user?.role === 'recruiter' ? recruiterNav : candidateNav;
  const steps = user?.role === 'recruiter' ? [] : [
    'Upload Resume',
    'Job Description',
    'AI Script',
    'Record Video',
    'QR Code',
  ];

  const currentStep = steps.findIndex(s => pathname.includes(s.toLowerCase().replace(' ', '-')));

  return (
    <div className="min-h-screen flex">
      {/* Sidebar overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col glass border-r border-white/8 transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        <div className="p-5 border-b border-white/8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display text-lg font-bold gradient-text">PitchID</span>
          </Link>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/40 truncate capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Progress for candidate */}
        {user?.role === 'candidate' && currentStep >= 0 && (
          <div className="px-4 py-3 border-b border-white/8">
            <div className="flex justify-between text-xs text-white/40 mb-1.5">
              <span>Profile Progress</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-violet-600 rounded-full transition-all"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard/candidate' && item.href !== '/dashboard/recruiter' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                  active
                    ? 'bg-gradient-to-r from-cyan-500/20 to-violet-600/20 text-white border border-cyan-500/20'
                    : 'text-white/50 hover:text-white hover:bg-white/8'
                )}
              >
                <item.icon className={cn('w-4 h-4', active ? 'text-cyan-400' : '')} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="w-3 h-3 text-white/30" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/8">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass border-b border-white/8 px-4 sm:px-6 h-14 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-white/60 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="text-xs text-white/30 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
