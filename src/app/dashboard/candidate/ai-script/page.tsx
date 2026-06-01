'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Wand2, ArrowRight, RefreshCw, Copy, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { AIScriptResult } from '@/lib/ai';

interface ScriptSectionProps {
  title: string;
  content: string;
  color: string;
  badge: string;
}

function ScriptSection({ title, content, color, badge }: ScriptSectionProps) {
  const [open, setOpen] = useState(true);
  const { toast } = useToast();

  const copy = () => {
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied!', type: 'success' });
  };

  return (
    <div className={`glass rounded-xl border ${color} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
      >
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color.replace('border-', 'bg-').replace('/30', '/20')} ${color.replace('border-', 'text-').replace('/30', '')}`}>
          {badge}
        </span>
        <span className="flex-1 text-left text-sm font-semibold text-white">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{content}</p>
          <button
            onClick={copy}
            className="mt-3 flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            <Copy className="w-3 h-3" /> Copy section
          </button>
        </div>
      )}
    </div>
  );
}

const SECTION_CONFIG = [
  { key: 'introduction',      title: 'Introduction',             badge: '01', color: 'border-cyan-500/30'    },
  { key: 'technicalPoints',   title: 'Technical Talking Points', badge: '02', color: 'border-violet-500/30'  },
  { key: 'experienceSummary', title: 'Experience Summary',       badge: '03', color: 'border-pink-500/30'    },
  { key: 'behavioralIntro',   title: 'Personality & Soft Skills',badge: '04', color: 'border-amber-500/30'   },
  { key: 'closingStatement',  title: 'Closing Statement',        badge: '05', color: 'border-emerald-500/30' },
];

export default function AIScriptPage() {
  const { toast } = useToast();
  const [script, setScript] = useState<AIScriptResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [jobDescription, setJobDescription] = useState<string | null>(null);
  const [fullScriptOpen, setFullScriptOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/candidate/create')
      .then((r) => r.json())
      .then((d) => {
        if (d.candidate?.jobDescription) {
          setJobDescription(d.candidate.jobDescription);
        }
        if (d.candidate?.aiScript) {
          // Reconstruct partial script from saved full script
          setScript({
            introduction: '',
            technicalPoints: '',
            experienceSummary: '',
            behavioralIntro: '',
            closingStatement: '',
            fullScript: d.candidate.aiScript,
            summary: d.candidate.aiSummary || '',
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const generate = async () => {
    if (!jobDescription) {
      toast({ title: 'No job description', description: 'Please add a job description first.', type: 'warning' });
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setScript(data.script);
      toast({ title: 'Script generated!', description: 'Your AI intro script is ready.', type: 'success' });
    } catch (err) {
      toast({ title: 'Generation failed', description: String(err), type: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  const copyFull = () => {
    if (script?.fullScript) {
      navigator.clipboard.writeText(script.fullScript);
      toast({ title: 'Full script copied!', type: 'success' });
    }
  };

  const hasFullSections = script && script.introduction && script.introduction.length > 10;

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-black text-white">AI Script Generator</h1>
            <p className="text-white/40 text-sm mt-1">AI-crafted intro script tailored to your job description.</p>
          </div>
          {script && !generating && (
            <Button onClick={generate} loading={generating} variant="outline" size="sm">
              <RefreshCw className="w-3.5 h-3.5" /> Regenerate
            </Button>
          )}
        </div>

        {!loading && !jobDescription && (
          <Card className="border border-amber-500/20 text-center py-8">
            <Wand2 className="w-10 h-10 text-amber-400/50 mx-auto mb-3" />
            <p className="text-white/60 text-sm mb-4">You need to add a job description first.</p>
            <Link href="/dashboard/candidate/job-description">
              <Button variant="outline" size="sm">Add Job Description →</Button>
            </Link>
          </Card>
        )}

        {jobDescription && !script && !generating && (
          <Card className="text-center py-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-7 h-7 text-cyan-400" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Generate Your Script</h2>
            <p className="text-white/40 text-sm mb-6 max-w-xs mx-auto">
              Our AI will craft a personalized intro script based on your job description.
            </p>
            <Button onClick={generate} size="lg" glow>
              <Wand2 className="w-4 h-4" /> Generate AI Script
            </Button>
          </Card>
        )}

        {generating && (
          <Card className="text-center py-10">
            <div className="w-12 h-12 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-white font-semibold">Generating your script...</p>
            <p className="text-white/40 text-sm mt-1">This takes about 10 seconds</p>
          </Card>
        )}

        {script && !generating && (
          <>
            {/* AI Summary */}
            {script.summary && (
              <Card className="border border-violet-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-semibold text-violet-400">AI Recruiter Summary</span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{script.summary}</p>
              </Card>
            )}

            {/* Sections — only show if we have full sections from regeneration */}
            {hasFullSections && (
              <div className="space-y-3">
                {SECTION_CONFIG.filter((s) => script[s.key as keyof AIScriptResult]).map((section) => (
                  <ScriptSection
                    key={section.key}
                    title={section.title}
                    content={script[section.key as keyof AIScriptResult] as string}
                    color={section.color}
                    badge={section.badge}
                  />
                ))}
              </div>
            )}

            {/* Full script */}
            {script.fullScript && (
              <Card>
                <button
                  onClick={() => setFullScriptOpen(!fullScriptOpen)}
                  className="w-full flex items-center gap-3 mb-2"
                >
                  <span className="text-sm font-bold text-white flex-1 text-left">
                    {hasFullSections ? 'Full Script' : 'Your AI Script'}
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); copyFull(); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); copyFull(); } }}
                    className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1 mr-2 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copy all
                  </span>
                  {fullScriptOpen
                    ? <ChevronUp className="w-4 h-4 text-white/30" />
                    : <ChevronDown className="w-4 h-4 text-white/30" />
                  }
                </button>
                {fullScriptOpen && (
                  <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap mt-3">{script.fullScript}</p>
                )}
                {!fullScriptOpen && (
                  <p className="text-xs text-white/30 mt-1">Click to expand your full script</p>
                )}
              </Card>
            )}

            <div className="flex justify-between">
              <Link href="/dashboard/candidate/job-description">
                <Button variant="outline">← Back</Button>
              </Link>
              <Link href="/dashboard/candidate/record-video">
                <Button glow>Record Video <ArrowRight className="w-4 h-4" /></Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
