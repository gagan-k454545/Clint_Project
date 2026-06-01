'use client';
import { useEffect, useState } from 'react';
import { Eye, TrendingUp, QrCode, Video, BarChart3, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import { ICandidate } from '@/types';
import { formatDate, getStatusColor } from '@/utils';

export default function AnalyticsPage() {
  const [candidate, setCandidate] = useState<ICandidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/candidate/create')
      .then((r) => r.json())
      .then((d) => setCandidate(d.candidate))
      .finally(() => setLoading(false));
  }, []);

  const completionItems = [
    { label: 'Resume', done: Boolean(candidate?.resumeUrl) },
    { label: 'Job Description', done: Boolean(candidate?.jobDescription) },
    { label: 'AI Script', done: Boolean(candidate?.aiScript) },
    { label: 'Video', done: Boolean(candidate?.videoUrl) },
    { label: 'QR Code', done: Boolean(candidate?.qrCodeUrl) },
  ];
  const completedCount = completionItems.filter((i) => i.done).length;

  const stats = [
    { label: 'Profile Views', value: candidate?.views ?? 0, icon: Eye, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { label: 'Profile Score', value: `${Math.round((completedCount / 5) * 100)}%`, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { label: 'Current Status', value: candidate?.status ?? 'N/A', icon: BarChart3, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    { label: 'Member Since', value: candidate ? formatDate(candidate.createdAt) : '—', icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-display font-black text-white">Analytics</h1>
          <p className="text-white/40 text-sm mt-1">Track your profile performance and completion.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label} className={`border ${stat.border}`}>
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-black text-white capitalize">{stat.value}</p>
                  <p className="text-xs text-white/40 mt-1">{stat.label}</p>
                </Card>
              ))}
            </div>

            {/* Profile completion */}
            <Card>
              <h3 className="text-sm font-bold text-white mb-4">Profile Completion</h3>
              <div className="space-y-3">
                {completionItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      item.done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/20'
                    }`}>
                      {item.done ? '✓' : '○'}
                    </div>
                    <span className={`text-sm flex-1 ${item.done ? 'text-white' : 'text-white/30'}`}>{item.label}</span>
                    <span className={`text-xs font-semibold ${item.done ? 'text-emerald-400' : 'text-white/20'}`}>
                      {item.done ? 'Done' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-violet-600 rounded-full transition-all"
                  style={{ width: `${(completedCount / 5) * 100}%` }}
                />
              </div>
              <p className="text-xs text-white/30 mt-2">{completedCount} of 5 sections complete</p>
            </Card>

            {/* Status timeline */}
            <Card>
              <h3 className="text-sm font-bold text-white mb-4">Application Status</h3>
              <div className="flex items-center gap-0">
                {['applied', 'screening', 'interview', 'shortlisted', 'hired'].map((s, i, arr) => {
                  const statuses = ['applied', 'screening', 'interview', 'shortlisted', 'hired'];
                  const currentIdx = statuses.indexOf(candidate?.status || 'applied');
                  const isActive = i <= currentIdx;
                  const isCurrent = s === candidate?.status;
                  return (
                    <div key={s} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isActive ? 'bg-gradient-to-br from-cyan-500 to-violet-600 text-white' : 'bg-white/10 text-white/20'
                        } ${isCurrent ? 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-transparent' : ''}`}>
                          {i + 1}
                        </div>
                        <span className={`text-xs mt-1 text-center capitalize ${isActive ? 'text-white/60' : 'text-white/20'}`}>
                          {s}
                        </span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className={`h-0.5 flex-1 mx-1 ${isActive && i < currentIdx ? 'bg-gradient-to-r from-cyan-500 to-violet-600' : 'bg-white/10'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
