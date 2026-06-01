'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, CheckCircle, Clock, TrendingUp, Eye, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import { ICandidate, IUser } from '@/types';
import { formatDate } from '@/utils';

export default function RecruiterDashboard() {
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/recruiter/update-status?limit=5')
      .then((r) => r.json())
      .then((d) => {
        setCandidates(d.candidates || []);
        setTotal(d.total || 0);
      })
      .finally(() => setLoading(false));
  }, []);

  const shortlisted = candidates.filter((c) => c.status === 'shortlisted').length;
  const withVideo = candidates.filter((c) => c.videoUrl).length;

  const stats = [
    { label: 'Total Candidates', value: total, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { label: 'Shortlisted', value: shortlisted, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'With Video', value: withVideo, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { label: 'In Review', value: candidates.filter((c) => c.status === 'screening').length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-black text-white">Recruiter Dashboard</h1>
            <p className="text-white/40 text-sm mt-1">Review and manage candidate profiles.</p>
          </div>
          <Link href="/dashboard/recruiter/candidates">
            <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className={`border ${stat.border} text-center`}>
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Recent candidates */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white">Recent Candidates</h2>
            <Link href="/dashboard/recruiter/candidates" className="text-xs text-cyan-400 hover:text-cyan-300">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No candidates yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {candidates.slice(0, 5).map((c) => {
                const user = c.userId as IUser;
                return (
                  <Link key={c._id} href={`/candidate/${c._id}`} target="_blank">
                    <div className="flex items-center gap-4 p-3 glass rounded-xl hover:bg-white/5 transition-all group cursor-pointer border border-white/5 hover:border-white/15">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                        {user?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user?.name || 'Unknown'}</p>
                        <p className="text-xs text-white/40 truncate">{user?.email}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {c.videoUrl && <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full status-${c.status}`}>
                          {c.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
