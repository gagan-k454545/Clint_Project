'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Video, StopCircle, RotateCcw, Upload, ArrowRight, Mic, MicOff,
  Camera, CameraOff, Clock, CheckCircle, AlertCircle, Play, Pause
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/utils';

type RecordState = 'idle' | 'permission' | 'ready' | 'recording' | 'preview' | 'uploading' | 'done';

const MAX_DURATION = 120; // 2 minutes

export default function RecordVideoPage() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<RecordState>('idle');
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Check if already uploaded
    fetch('/api/candidate/create')
      .then((r) => r.json())
      .then((d) => {
        if (d.candidate?.videoUrl) {
          setUploadedUrl(d.candidate.videoUrl);
          setState('done');
        }
      });

    return () => {
      stopStream();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const requestPermission = async () => {
    setState('permission');
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
      }
      setState('ready');
    } catch (err) {
      setError('Camera/mic access denied. Please allow permissions and try again.');
      setState('idle');
    }
  };

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    setDuration(0);

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      setRecordedBlob(blob);
      if (previewRef.current) {
        previewRef.current.src = URL.createObjectURL(blob);
      }
      setState('preview');
      stopStream();
    };

    recorder.start(1000); // collect every 1s
    setState('recording');

    timerRef.current = setInterval(() => {
      setDuration((d) => {
        if (d >= MAX_DURATION - 1) {
          stopRecording();
          return d;
        }
        return d + 1;
      });
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
  }, []);

  const reRecord = () => {
    setRecordedBlob(null);
    setDuration(0);
    setUploadProgress(0);
    requestPermission();
  };

  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !micEnabled; });
    setMicEnabled(!micEnabled);
  };

  const toggleCam = () => {
    streamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !camEnabled; });
    setCamEnabled(!camEnabled);
  };

  const uploadVideo = async () => {
    if (!recordedBlob) return;
    setState('uploading');
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((p) => Math.min(p + 5, 88));
    }, 300);

    try {
      const formData = new FormData();
      formData.append('video', recordedBlob, 'intro.webm');

      const res = await fetch('/api/upload/video', { method: 'POST', body: formData });
      const data = await res.json();
      clearInterval(interval);

      if (!res.ok) throw new Error(data.error);

      setUploadProgress(100);
      setUploadedUrl(data.url);
      setState('done');
      toast({ title: 'Video uploaded!', description: 'Your intro video is live.', type: 'success' });
    } catch (err) {
      clearInterval(interval);
      setState('preview');
      toast({ title: 'Upload failed', description: String(err), type: 'error' });
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-display font-black text-white">Record Intro Video</h1>
          <p className="text-white/40 text-sm mt-1">Record a 60–120 second professional video introduction.</p>
        </div>

        {/* Done state */}
        {state === 'done' && uploadedUrl && (
          <>
            <Card className="border border-emerald-500/30">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="font-bold text-white">Video uploaded successfully!</p>
                  <p className="text-xs text-white/40">Your intro video is ready for recruiters.</p>
                </div>
              </div>
              <video
                src={uploadedUrl}
                controls
                className="w-full rounded-xl aspect-video bg-black"
              />
              <Button onClick={reRecord} variant="outline" size="sm" className="mt-4">
                <RotateCcw className="w-3.5 h-3.5" /> Re-record
              </Button>
            </Card>
            <div className="flex justify-end">
              <Link href="/dashboard/candidate/qr-code">
                <Button glow>Generate QR Code <ArrowRight className="w-4 h-4" /></Button>
              </Link>
            </div>
          </>
        )}

        {/* Error */}
        {error && (
          <Card className="border border-red-500/30">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </Card>
        )}

        {/* Idle state */}
        {state === 'idle' && !uploadedUrl && (
          <Card className="text-center py-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
              <Video className="w-9 h-9 text-cyan-400" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Ready to record?</h2>
            <p className="text-sm text-white/40 mb-6 max-w-xs mx-auto">
              We'll need access to your camera and microphone. Keep it under 2 minutes.
            </p>
            <Button onClick={requestPermission} size="lg" glow>
              <Camera className="w-4 h-4" /> Start Camera
            </Button>

            {/* Tips */}
            <div className="mt-8 text-left space-y-2">
              {[
                'Find a well-lit, quiet space',
                'Look directly at the camera',
                'Keep it under 2 minutes',
                'Use your AI script as a guide',
              ].map((tip) => (
                <div key={tip} className="flex items-center gap-2 text-xs text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
                  {tip}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Permission loading */}
        {state === 'permission' && (
          <Card className="text-center py-10">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-white/60">Requesting camera access...</p>
          </Card>
        )}

        {/* Camera ready / recording */}
        {(state === 'ready' || state === 'recording') && (
          <Card className="p-0 overflow-hidden">
            {/* Video feed */}
            <div className="relative bg-black rounded-t-2xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-video object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />

              {/* Recording indicator */}
              {state === 'recording' && (
                <>
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 rounded-full px-3 py-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white record-pulse" />
                    <span className="text-white text-xs font-bold">REC</span>
                  </div>
                  <div className="absolute top-4 right-4 glass rounded-full px-3 py-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-white/60" />
                    <span className="text-sm font-mono font-bold text-white">{formatTime(duration)}</span>
                  </div>
                  {/* Timer bar */}
                  <div className="absolute bottom-0 left-0 right-0">
                    <div
                      className="h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-1000"
                      style={{ width: `${(duration / MAX_DURATION) * 100}%` }}
                    />
                  </div>
                </>
              )}

              {/* No cam overlay */}
              {!camEnabled && (
                <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center">
                  <CameraOff className="w-10 h-10 text-white/30" />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-5">
              <div className="flex items-center justify-center gap-4">
                {/* Mic toggle */}
                <button
                  onClick={toggleMic}
                  className={cn(
                    'w-11 h-11 rounded-full flex items-center justify-center transition-all',
                    micEnabled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  )}
                >
                  {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                {/* Main record button */}
                {state === 'ready' ? (
                  <button
                    onClick={startRecording}
                    className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-lg hover:shadow-red-500/30 active:scale-95"
                  >
                    <div className="w-6 h-6 rounded-full bg-white" />
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-700 flex items-center justify-center transition-all shadow-lg active:scale-95"
                  >
                    <StopCircle className="w-8 h-8 text-white" />
                  </button>
                )}

                {/* Cam toggle */}
                <button
                  onClick={toggleCam}
                  className={cn(
                    'w-11 h-11 rounded-full flex items-center justify-center transition-all',
                    camEnabled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  )}
                >
                  {camEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
                </button>
              </div>

              <p className="text-center text-xs text-white/30 mt-3">
                {state === 'ready' ? 'Press the red button to start recording' : `Recording... ${formatTime(MAX_DURATION - duration)} remaining`}
              </p>
            </div>
          </Card>
        )}

        {/* Preview state */}
        {state === 'preview' && recordedBlob && (
          <Card className="p-0 overflow-hidden">
            <div className="relative">
              <video
                ref={previewRef}
                controls
                className="w-full aspect-video bg-black rounded-t-2xl"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Duration: <span className="text-white font-semibold">{formatTime(duration)}</span></span>
                <span className="text-white/60">Size: <span className="text-white font-semibold">{(recordedBlob.size / (1024 * 1024)).toFixed(1)} MB</span></span>
              </div>
              <div className="flex gap-3">
                <Button onClick={reRecord} variant="outline" className="flex-1">
                  <RotateCcw className="w-4 h-4" /> Re-record
                </Button>
                <Button onClick={uploadVideo} className="flex-1" glow>
                  <Upload className="w-4 h-4" /> Upload Video
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Uploading */}
        {state === 'uploading' && (
          <Card>
            <div className="text-center py-4">
              <Upload className="w-10 h-10 text-cyan-400 mx-auto mb-4 animate-bounce" />
              <p className="font-semibold text-white mb-4">Uploading your video...</p>
              <Progress value={uploadProgress} showPercent color="gradient" />
              <p className="text-xs text-white/30 mt-3">Please don't close this page</p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
