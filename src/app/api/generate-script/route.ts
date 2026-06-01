import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateCandidateScript } from '@/lib/ai';
import { connectDB } from '@/lib/mongodb';
import Candidate from '@/models/Candidate';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobDescription } = await req.json();
    if (!jobDescription || jobDescription.trim().length < 50) {
      return NextResponse.json(
        { error: 'Job description must be at least 50 characters' },
        { status: 400 }
      );
    }

    const userId = (session.user as {id: string}).id;
    await connectDB();

    const user = await User.findById(userId);
    const candidateName = user?.name || session.user.name || 'Candidate';

    const script = await generateCandidateScript(jobDescription, candidateName);

    // Save to candidate profile
    await Candidate.findOneAndUpdate(
      { userId },
      {
        userId,
        jobDescription,
        aiScript: script.fullScript,
        aiSummary: script.summary,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ script, message: 'Script generated successfully' });
  } catch (error) {
    console.error('Script generation error:', error);
    const message = error instanceof Error ? error.message : 'Script generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
