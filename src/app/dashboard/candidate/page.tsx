'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Upload, FileText, Wand2, Video, QrCode, BarChart3,
  CheckCircle, Circle, ArrowRight, Eye, Zap
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ICandidate } from '@/types';
import { formatDate } from '@/utils';

const steps = [
  { key: 'resumeUrl', label: 'Upload Resume', href: '/dashboard/candidate/upload-resume', icon: Upload },
  { key: 'jobDescription', label: 'Add Job Description', href: '/dashboard/candidate/job-description', icon: FileText },
  { key: 'aiScript', label: 'Generate AI Script', href: '/dashboard/candidate/ai-script', icon: Wand2 },
  { key: 'videoUrl', label: 'Record Video', href: '/dashboard/candidate/record-video', icon: Video },
  { key: 'qrCodeUrl', label: 'Generate QR Code', href: '/dashboard/candidate/qr-code', icon: QrCode },
];

export default function CandidateDashboard() {
  const { data: session } = useSession();
  const [candidate, setCandidate] = useState<ICandidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/candidate/create')
      .then((r) => r.json())
      .then((d) => setCandidate(d.candidate))
      .finally(() => setLoading(false));
  }, []);

  const user = session?.user as { id?: string; name?: string; role?: string } | undefined;
  const completedSteps = steps.filter((s) => candidate?.[s.key as keyof ICandidate]).length;
  const progressPct = Math.round((completedSteps / steps.length) * 100);

  const nextStep = steps.find((s) => !candidate?.[s.key as keyof ICandidate]);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {loading ? 'Loading your profile...' : `Profile ${progressPct}% complete`}
          </p>
        </div>

        {/* Progress overview */}
        {loading ? (
          <Skeleton className="h-32 rounded-2xl" />
        ) : (
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-violet-600/5" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-white">Profile Setup</h2>
                  <p className="text-xs text-white/40 mt-0.5">{completedSteps} of {steps.length} steps completed</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black gradient-text-blue">{progressPct}%</span>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full mb-4">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-violet-600 rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              {nextStep && (
                <Link href={nextStep.href}>
                  <Button size="sm" className="gap-2">
                    Continue: {nextStep.label}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              )}
              {progressPct === 100 && (
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">Profile complete! Share your QR to start getting discovered.</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Steps checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step, i) => {
            const done = Boolean(candidate?.[step.key as keyof ICandidate]);
            const isNext = !done && steps.slice(0, i).every((s) => candidate?.[s.key as keyof ICandidate]);
            return (
              <Link key={step.key} href={step.href}>
                <div className={`glass rounded-2xl p-5 border transition-all duration-200 hover:bg-white/5 cursor-pointer group ${
                  done ? 'border-emerald-500/30' : isNext ? 'border-cyan-500/30' : 'border-white/8'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      done ? 'bg-emerald-500/20' : isNext ? 'bg-cyan-500/20' : 'bg-white/5'
                    }`}>
                      {done
                        ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                        : <step.icon className={`w-5 h-5 ${isNext ? 'text-cyan-400' : 'text-white/30'}`} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${done ? 'text-white' : isNext ? 'text-white' : 'text-white/40'}`}>
                        {step.label}
                      </p>
                      <p className="text-xs mt-0.5">
                        {done
                          ? <span className="text-emerald-400">Completed</span>
                          : isNext
                            ? <span className="text-cyan-400">Up next</span>
                            : <span className="text-white/25">Pending</span>
                        }
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Stats */}
        {candidate && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Profile Views', value: candidate.views || 0, icon: Eye, color: 'text-cyan-400' },
              { label: 'Status', value: candidate.status || 'Applied', icon: Zap, color: 'text-violet-400' },
              { label: 'Member Since', value: formatDate(candidate.createdAt), icon: CheckCircle, color: 'text-emerald-400' },
              { label: 'Profile Score', value: `${progressPct}%`, icon: BarChart3, color: 'text-pink-400' },
            ].map((stat) => (
              <Card key={stat.label} className="text-center">
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <p className="text-lg font-black text-white">{stat.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
