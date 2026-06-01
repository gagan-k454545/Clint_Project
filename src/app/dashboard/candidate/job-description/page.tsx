'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, CheckCircle, Lightbulb } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

const EXAMPLES = [
  'Senior React Developer at a fast-growing fintech startup...',
  'Full Stack Engineer with Node.js and AWS experience...',
  'UX Designer with 3+ years experience in SaaS products...',
];

export default function JobDescriptionPage() {
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/candidate/create')
      .then((r) => r.json())
      .then((d) => {
        if (d.candidate?.jobDescription) {
          setJobDescription(d.candidate.jobDescription);
          setSaved(true);
        }
      });
  }, []);

  const handleSave = async () => {
    if (jobDescription.trim().length < 50) {
      toast({ title: 'Too short', description: 'Please add at least 50 characters describing the job.', type: 'warning' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/candidate/create', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSaved(true);
      toast({ title: 'Saved!', description: 'Job description saved successfully.', type: 'success' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save. Try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-display font-black text-white">Job Description</h1>
          <p className="text-white/40 text-sm mt-1">
            Paste the job description you're applying for. Our AI will use this to craft your intro script.
          </p>
        </div>

        {/* Tips */}
        <Card className="border border-amber-500/20">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-400 mb-1">Pro Tip</p>
              <p className="text-xs text-white/50 leading-relaxed">
                Include the full job description with responsibilities and requirements for the best AI-generated script. The more detail you provide, the more personalized your intro will be.
              </p>
            </div>
          </div>
        </Card>

        {/* Textarea */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">Job Description</span>
            {saved && <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto" />}
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => { setJobDescription(e.target.value); setSaved(false); }}
            placeholder="Paste the full job description here...

Example:
We are looking for a Senior React Developer to join our team. You will be responsible for building scalable web applications, collaborating with designers, and leading technical discussions...

Required skills:
- 5+ years React experience
- TypeScript proficiency
- ..."
            rows={14}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/80 placeholder:text-white/20 text-sm resize-none focus:outline-none focus:border-cyan-500/50 transition-colors leading-relaxed"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-white/25">{jobDescription.length} characters</span>
            <span className={`text-xs ${jobDescription.length >= 50 ? 'text-emerald-400' : 'text-white/30'}`}>
              {jobDescription.length >= 50 ? '✓ Minimum length met' : `${50 - jobDescription.length} more chars needed`}
            </span>
          </div>
        </Card>

        {/* Example prompts */}
        <Card>
          <p className="text-xs text-white/40 mb-3 font-semibold uppercase tracking-wider">Quick Examples</p>
          <div className="space-y-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setJobDescription(ex)}
                className="w-full text-left text-xs text-white/40 hover:text-white/70 glass rounded-lg px-3 py-2 border border-white/5 hover:border-white/15 transition-all"
              >
                {ex}
              </button>
            ))}
          </div>
        </Card>

        <div className="flex justify-between">
          <Link href="/dashboard/candidate/upload-resume">
            <Button variant="outline">← Back</Button>
          </Link>
          <div className="flex gap-3">
            <Button onClick={handleSave} loading={saving} variant="outline">
              {saved ? '✓ Saved' : 'Save'}
            </Button>
            {saved && (
              <Link href="/dashboard/candidate/ai-script">
                <Button glow>
                  Generate AI Script <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
