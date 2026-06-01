'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { QrCode, Download, Share2, RefreshCw, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function QRCodePage() {
  const { toast } = useToast();
  const [qrData, setQrData] = useState<{ qrCodeUrl: string; profileUrl: string; candidateId: string } | null>(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/qr/generate')
      .then((r) => r.json())
      .then((d) => {
        if (d.qrCodeUrl) setQrData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/qr/generate', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQrData(data);
      toast({ title: 'QR Code generated!', description: 'Your profile QR is ready to share.', type: 'success' });
    } catch (err) {
      toast({ title: 'Failed', description: String(err), type: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  const downloadQR = async () => {
    if (!qrData?.qrCodeUrl) return;
    const a = document.createElement('a');
    a.href = qrData.qrCodeUrl;
    a.download = 'pitchid-qr.png';
    a.target = '_blank';
    a.click();
    toast({ title: 'QR downloaded!', type: 'success' });
  };

  const copyLink = () => {
    if (!qrData?.profileUrl) return;
    navigator.clipboard.writeText(qrData.profileUrl);
    toast({ title: 'Link copied!', description: 'Profile URL copied to clipboard.', type: 'success' });
  };

  const share = async () => {
    if (!qrData?.profileUrl) return;
    if (navigator.share) {
      await navigator.share({ title: 'My PitchID Profile', url: qrData.profileUrl });
    } else {
      copyLink();
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-display font-black text-white">QR Code Profile</h1>
          <p className="text-white/40 text-sm mt-1">
            Generate a QR code that links directly to your video profile.
          </p>
        </div>

        {loading ? (
          <Card className="text-center py-12">
            <div className="w-10 h-10 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mx-auto" />
          </Card>
        ) : qrData ? (
          <>
            {/* QR Display */}
            <Card className="text-center border border-cyan-500/20">
              <div className="flex items-center gap-2 justify-center mb-6">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">QR Code Active</span>
              </div>

              {/* QR Image */}
              <div className="inline-block p-4 glass rounded-2xl border border-white/10 mb-6">
                <img
                  src={qrData.qrCodeUrl}
                  alt="Profile QR Code"
                  className="w-48 h-48 rounded-xl"
                />
              </div>

              {/* Profile URL */}
              <div className="glass rounded-xl p-3 mb-6 flex items-center gap-2">
                <span className="text-xs text-white/40 flex-1 truncate text-left">{qrData.profileUrl}</span>
                <button onClick={copyLink} className="text-white/40 hover:text-cyan-400 transition-colors shrink-0">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-3">
                <Button onClick={downloadQR} variant="outline" size="sm" className="flex-col gap-1 py-3 h-auto">
                  <Download className="w-4 h-4" />
                  <span className="text-xs">Download</span>
                </Button>
                <Button onClick={share} variant="outline" size="sm" className="flex-col gap-1 py-3 h-auto">
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs">Share</span>
                </Button>
                <Link href={`/candidate/${qrData.candidateId}`} target="_blank" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full flex-col gap-1 py-3 h-auto">
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-xs">Preview</span>
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Usage tips */}
            <Card>
              <h3 className="text-sm font-bold text-white mb-3">Where to use your QR code</h3>
              <div className="space-y-2">
                {[
                  'Print it on your resume or CV',
                  'Add it to your business card',
                  'Include it in email signatures',
                  'Share it on LinkedIn or job boards',
                  'Display it at networking events',
                ].map((tip) => (
                  <div key={tip} className="flex items-center gap-2 text-sm text-white/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex justify-between">
              <Button onClick={generate} loading={generating} variant="outline" size="sm">
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </Button>
              <Link href="/dashboard/candidate/analytics">
                <Button glow>View Analytics →</Button>
              </Link>
            </div>
          </>
        ) : (
          <Card className="text-center py-12">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-9 h-9 text-cyan-400" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Generate Your QR Code</h2>
            <p className="text-sm text-white/40 mb-6 max-w-xs mx-auto">
              Create a scannable QR code linked to your complete video profile. Recruiters scan it to instantly see your intro.
            </p>
            <Button onClick={generate} loading={generating} size="lg" glow>
              <QrCode className="w-4 h-4" /> Generate QR Code
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
