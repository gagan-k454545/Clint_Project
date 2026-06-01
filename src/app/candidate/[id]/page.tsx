import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Candidate from '@/models/Candidate';
import PublicProfile from '@/components/candidate/PublicProfile';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    await connectDB();
    const candidate = await Candidate.findById(id).populate('userId', 'name');
    const user = candidate?.userId as { name?: string } | undefined;
    return {
      title: `${user?.name || 'Candidate'} — PitchID Profile`,
      description: candidate?.aiSummary || 'View this candidate\'s video profile on PitchID.',
    };
  } catch {
    return { title: 'Candidate Profile — PitchID' };
  }
}

export default async function CandidatePublicPage({ params }: PageProps) {
  const { id } = await params;

  try {
    await connectDB();
    const candidate = await Candidate.findById(id).populate('userId', 'name email profileImage');
    if (!candidate) notFound();

    // Increment views server-side
    await Candidate.findByIdAndUpdate(id, { $inc: { views: 1 } });

    return <PublicProfile candidate={JSON.parse(JSON.stringify(candidate))} />;
  } catch {
    notFound();
  }
}
