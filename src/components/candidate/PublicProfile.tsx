'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Play, Pause, FileText, Zap, Share2, CheckCircle,
  XCircle, Eye, MessageSquare, Download, Mail,
  MapPin, Calendar, Award, User
} from 'lucide-react';
import { ICandidate, IUser, CandidateStatus } from '@/types';
import { formatDate, getInitials } from '@/utils';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface PublicProfileProps {
  candidate: ICandidate & { userId: IUser };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  applied:     { label: 'Applied',     color: 'text-cyan-400',    bg: 'bg-cyan-500/15',    border: 'border-cyan-500/30'   },
  screening:   { label: 'Screening',   color: 'text-amber-400',   bg: 'bg-amber-500/15',   border: 'border-amber-500/30'  },
  interview:   { label: 'Interview',   color: 'text-violet-400',  bg: 'bg-violet-500/15',  border: 'border-violet-500/30' },
  shortlisted: { label: 'Shortlisted', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30'},
  rejected:    { label: 'Rejected',    color: 'text-red-400',     bg: 'bg-red-500/15',     border: 'border-red-500/30'    },
  hired:       { label: 'Hired',       color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/50'},
};

export default function PublicProfile({ candidate }: PublicProfileProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState(candidate.status);
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const user = candidate.userId;
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.applied;

  const updateStatus = async (newStatus: CandidateStatus) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/recruiter/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: candidate._id, status: newStatus, note }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus(newStatus);
      setNoteSaved(true);
      toast({ title: `Status updated to ${newStatus}`, type: 'success' });
    } catch {
      toast({ title: 'Update failed', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const saveNote = async () => {
    if (!note.trim()) return;
    await updateStatus(status);
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: `${user.name} — PitchID`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() =>
        toast({ title: 'Link copied!', description: 'Profile URL copied to clipboard.', type: 'success' })
      );
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient opacity-70" />
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-cyan-500/8 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-violet-500/8 blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold gradient-text">PitchID</span>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={share}>
              <Share2 className="w-3.5 h-3.5" /> Share Profile
            </Button>
            {candidate.resumeUrl && (
              <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <Download className="w-3.5 h-3.5" /> Resume
                </Button>
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT — Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Hero card */}
            <div className="glass-strong rounded-3xl overflow-hidden border border-white/12">
              {/* Cover banner */}
              <div className="h-24 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-pink-500/20 relative overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
              </div>

              <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="flex items-end justify-between -mt-8 mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-2xl font-black text-white border-4 border-background shadow-xl">
                      {getInitials(user.name)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background ${status === 'shortlisted' || status === 'hired' ? 'bg-emerald-500' : 'bg-white/30'}`} />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                    {cfg.label}
                  </span>
                </div>

                <h1 className="text-2xl font-display font-black text-white">{user.name}</h1>

                {/* Meta info row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-white/40">
                    <Mail className="w-3 h-3" /> {user.email}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-white/40">
                    <Eye className="w-3 h-3" /> {candidate.views} profile views
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-white/40">
                    <Calendar className="w-3 h-3" /> Applied {formatDate(candidate.createdAt)}
                  </span>
                </div>

                {/* AI Summary */}
                {candidate.aiSummary && (
                  <div className="mt-4 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-3.5 h-3.5 text-violet-400" />
                      <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">AI Summary</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">{candidate.aiSummary}</p>
                  </div>
                )}

                {/* Skills */}
                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 glass rounded-full text-xs text-white/60 border border-white/10">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Video Player */}
            <div className="glass-strong rounded-3xl overflow-hidden border border-white/12">
              <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-bold text-white">Video Introduction</span>
                </div>
                {candidate.videoUrl && (
                  <span className="text-xs text-white/30">Click to play</span>
                )}
              </div>

              {candidate.videoUrl ? (
                <div className="relative bg-black group">
                  <video
                    ref={videoRef}
                    src={candidate.videoUrl}
                    poster={candidate.thumbnailUrl}
                    controls
                    preload="metadata"
                    className="w-full aspect-video"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-white/3 to-white/1 flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Play className="w-7 h-7 text-white/20" />
                  </div>
                  <p className="text-sm text-white/25">No video uploaded yet</p>
                </div>
              )}
            </div>

            {/* Resume */}
            {candidate.resumeUrl && (
              <div className="glass rounded-2xl p-5 border border-white/8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">Resume / CV</p>
                  <p className="text-xs text-white/40 mt-0.5">Full document available for review</p>
                </div>
                <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" glow>
                    <Download className="w-3.5 h-3.5" /> View Resume
                  </Button>
                </a>
              </div>
            )}
          </div>

          {/* RIGHT — Recruiter panel */}
          <div className="space-y-4">
            {/* Quick actions */}
            <div className="glass-strong rounded-2xl p-5 border border-white/12">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                Recruiter Actions
              </h3>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => updateStatus('shortlisted')}
                  disabled={updating || status === 'shortlisted'}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/25 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" />
                  Shortlist
                </button>
                <button
                  onClick={() => updateStatus('rejected')}
                  disabled={updating || status === 'rejected'}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-bold hover:bg-red-500/25 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-4 h-4" />
                  Pass
                </button>
              </div>

              {/* Pipeline status */}
              <div className="mb-4">
                <label className="text-xs text-white/40 block mb-2 font-medium">Pipeline Stage</label>
                <select
                  value={status}
                  onChange={(e) => updateStatus(e.target.value as CandidateStatus)}
                  disabled={updating}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                    <option key={val} value={val} className="bg-gray-900">{cfg.label}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-white/40 block mb-2 font-medium flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> Recruiter Notes
                </label>
                <textarea
                  value={note}
                  onChange={(e) => { setNote(e.target.value); setNoteSaved(false); }}
                  placeholder="Add notes about this candidate..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                />
                <button
                  onClick={saveNote}
                  disabled={updating || !note.trim()}
                  className="w-full mt-2 py-2 rounded-xl glass border border-white/10 text-xs font-semibold text-white/50 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {noteSaved ? '✓ Notes saved' : 'Save Notes'}
                </button>
              </div>
            </div>

            {/* QR Code */}
            {candidate.qrCodeUrl && (
              <div className="glass rounded-2xl p-5 border border-white/8 text-center">
                <p className="text-xs text-white/40 mb-3 font-semibold uppercase tracking-wider">Profile QR Code</p>
                <div className="inline-block p-3 bg-white/5 rounded-xl border border-white/10 mb-3">
                  <img src={candidate.qrCodeUrl} alt="QR Code" className="w-28 h-28" />
                </div>
                <p className="text-xs text-white/25">Scan to share this profile</p>
              </div>
            )}

            {/* Contact card */}
            <div className="glass rounded-2xl p-5 border border-white/8">
              <h3 className="text-xs font-bold text-white/60 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Contact
              </h3>
              <a
                href={`mailto:${user.email}`}
                className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors group"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="truncate">{user.email}</span>
              </a>
            </div>

            {/* Powered by */}
            <div className="text-center">
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-white/20 hover:text-white/40 transition-colors">
                <Zap className="w-3 h-3" /> Powered by PitchID
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
