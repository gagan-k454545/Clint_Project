'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, Video, FileText, ExternalLink, Users } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { ICandidate, IUser, CandidateStatus } from '@/types';

const STATUSES: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'applied', label: 'Applied' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Interview' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'hired', label: 'Hired' },
];

function CandidateCard({ candidate, onStatusChange }: {
  candidate: ICandidate;
  onStatusChange: (id: string, status: CandidateStatus) => void;
}) {
  const user = candidate.userId as IUser;
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (status: CandidateStatus) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/recruiter/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: candidate._id, status }),
      });
      if (!res.ok) throw new Error('Failed');
      onStatusChange(candidate._id, status);
      toast({ title: `Marked as ${status}`, type: 'success' });
    } catch {
      toast({ title: 'Update failed', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/8 hover:border-white/15 transition-all">
      {/* Video thumbnail */}
      {candidate.thumbnailUrl ? (
        <div className="relative aspect-video bg-black overflow-hidden">
          <img src={candidate.thumbnailUrl} alt="Video thumbnail" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Video className="w-5 h-5 text-white fill-white" />
            </div>
          </div>
        </div>
      ) : candidate.videoUrl ? (
        <div className="aspect-video bg-gradient-to-br from-cyan-900/30 to-violet-900/30 flex items-center justify-center">
          <Video className="w-8 h-8 text-white/30" />
        </div>
      ) : (
        <div className="aspect-video bg-white/3 flex items-center justify-center">
          <p className="text-xs text-white/20">No video</p>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Unknown'}</p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 status-${candidate.status}`}>
            {candidate.status}
          </span>
        </div>

        {/* AI Summary */}
        {candidate.aiSummary && (
          <p className="text-xs text-white/40 leading-relaxed mb-3 line-clamp-2">{candidate.aiSummary}</p>
        )}

        {/* Actions row */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1 flex-1">
            <button
              onClick={() => updateStatus('shortlisted')}
              disabled={updating || candidate.status === 'shortlisted'}
              className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/30 transition-colors disabled:opacity-40"
            >
              ✓
            </button>
            <button
              onClick={() => updateStatus('rejected')}
              disabled={updating || candidate.status === 'rejected'}
              className="flex-1 py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold hover:bg-red-500/30 transition-colors disabled:opacity-40"
            >
              ✗
            </button>
          </div>
          <Link href={`/candidate/${candidate._id}`} target="_blank">
            <button className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </Link>
          {candidate.resumeUrl && (
            <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
              <button className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                <FileText className="w-3.5 h-3.5" />
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecruiterCandidatesPage() {
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '12' });
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (search) params.set('search', search);

    const res = await fetch(`/api/recruiter/update-status?${params}`);
    const data = await res.json();
    setCandidates(data.candidates || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [page, statusFilter, search]);

  useEffect(() => {
    const timer = setTimeout(fetchCandidates, 300);
    return () => clearTimeout(timer);
  }, [fetchCandidates]);

  const handleStatusChange = (id: string, status: CandidateStatus) => {
    setCandidates((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-black text-white">Candidates</h1>
            <p className="text-white/40 text-sm mt-1">{total} total candidates</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => { setStatusFilter(s.value); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === s.value
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'glass border border-white/10 text-white/40 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </div>
        ) : candidates.length === 0 ? (
          <Card className="text-center py-12">
            <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No candidates found</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates.map((c) => (
              <CandidateCard key={c._id} candidate={c} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > 12 && (
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              ← Previous
            </Button>
            <span className="text-sm text-white/40 px-4 py-2">
              Page {page} of {Math.ceil(total / 12)}
            </span>
            <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 12)} onClick={() => setPage(p => p + 1)}>
              Next →
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
