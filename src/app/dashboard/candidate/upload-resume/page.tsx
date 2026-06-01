'use client';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, X, ArrowRight, Download } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import { useToast } from '@/components/ui/Toast';
import { cn, formatFileSize } from '@/utils';
import Link from 'next/link';

export default function UploadResumePage() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState<string | null>(null);

  useEffect(() => {
    // Check if already uploaded
    fetch('/api/candidate/create')
      .then((r) => r.json())
      .then((d) => {
        if (d.candidate?.resumeUrl) setUploaded(d.candidate.resumeUrl);
      });
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: () => toast({ title: 'Invalid file', description: 'Please upload a PDF or DOCX (max 5MB)', type: 'error' }),
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 10, 85));
    }, 200);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await fetch('/api/upload/resume', { method: 'POST', body: formData });
      const data = await res.json();
      clearInterval(interval);

      if (!res.ok) throw new Error(data.error);

      setProgress(100);
      setUploaded(data.url);
      toast({ title: 'Resume uploaded!', description: 'Your resume has been saved.', type: 'success' });
    } catch (err) {
      clearInterval(interval);
      toast({ title: 'Upload failed', description: String(err), type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-display font-black text-white">Upload Resume</h1>
          <p className="text-white/40 text-sm mt-1">Upload your resume to get started. PDF or DOCX, max 5MB.</p>
        </div>

        {/* Current upload */}
        {uploaded && (
          <Card className="border border-emerald-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Resume uploaded</p>
                <p className="text-xs text-white/40 truncate max-w-xs">{uploaded}</p>
              </div>
              <a href={uploaded} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline">
                  <Download className="w-3.5 h-3.5" /> View
                </Button>
              </a>
            </div>
          </Card>
        )}

        {/* Dropzone */}
        <Card>
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200',
              isDragActive ? 'border-cyan-500 bg-cyan-500/5 dropzone-active' : 'border-white/15 hover:border-white/30',
              file && 'border-white/25'
            )}
          >
            <input {...getInputProps()} />
            <Upload className={cn('w-10 h-10 mx-auto mb-4', isDragActive ? 'text-cyan-400' : 'text-white/30')} />
            {isDragActive ? (
              <p className="text-cyan-400 font-semibold">Drop your file here</p>
            ) : (
              <>
                <p className="text-white/70 font-semibold mb-1">Drag & drop or click to upload</p>
                <p className="text-xs text-white/30">PDF, DOC, DOCX — max 5MB</p>
              </>
            )}
          </div>

          {/* File selected */}
          {file && (
            <div className="mt-4 glass rounded-xl p-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                <p className="text-xs text-white/40">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setProgress(0); }}
                className="text-white/30 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {uploading && (
            <Progress value={progress} className="mt-4" label="Uploading..." showPercent />
          )}

          {file && !uploading && (
            <Button className="w-full mt-4" onClick={handleUpload} glow>
              <Upload className="w-4 h-4" /> Upload Resume
            </Button>
          )}
        </Card>

        {uploaded && (
          <div className="flex justify-end">
            <Link href="/dashboard/candidate/job-description">
              <Button glow>
                Next: Job Description <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
