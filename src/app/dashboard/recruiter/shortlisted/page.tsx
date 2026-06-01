'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Users, ExternalLink, FileText } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ICandidate, IUser } from '@/types';
import { formatDate } from '@/utils';

export default function ShortlistedPage() {
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/recruiter/update-status?status=shortlisted&limit=50')
      .then((r) => r.json())
      .then((d) => setCandidates(d.candidates || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-black text-white">Shortlisted</h1>
            <p className="text-white/40 text-sm">{candidates.length} candidates shortlisted</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        ) : candidates.length === 0 ? (
          <Card className="text-center py-12">
            <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No shortlisted candidates yet</p>
            <Link href="/dashboard/recruiter/candidates" className="text-sm text-cyan-400 hover:text-cyan-300 mt-2 inline-block">
              Browse all candidates →
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {candidates.map((c, i) => {
              const user = c.userId as IUser;
              return (
                <div key={c._id} className="glass rounded-2xl p-5 border border-emerald-500/20 flex items-center gap-4">
                  <span className="text-xs font-bold text-white/20 w-5 text-center">{i + 1}</span>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {user?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{user?.name}</p>
                    <p className="text-xs text-white/40 truncate">{user?.email}</p>
                    {c.aiSummary && <p className="text-xs text-white/30 mt-1 line-clamp-1">{c.aiSummary}</p>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/30 shrink-0">
                    <span>{formatDate(c.createdAt)}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/candidate/${c._id}`} target="_blank">
                      <button className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                    {c.resumeUrl && (
                      <a href={c.resumeUrl} target="_blank" rel="noopener noreferrer">
                        <button className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
