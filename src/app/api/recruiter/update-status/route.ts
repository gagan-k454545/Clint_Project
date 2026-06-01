import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Candidate from '@/models/Candidate';
import RecruiterNote from '@/models/RecruiterNote';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    await connectDB();

    const query: Record<string, unknown> = {};
    if (status && status !== 'all') query.status = status;

    let candidates = await Candidate.find(query)
      .populate('userId', 'name email profileImage')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (search) {
      candidates = candidates.filter((c) => {
        const user = c.userId as {name?: string; email?: string};
        return (
          user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          user?.email?.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    const total = await Candidate.countDocuments(query);

    return NextResponse.json({ candidates, total, page, limit });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as {role?: string}).role;
    if (role !== 'recruiter' && role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { candidateId, status, note } = await req.json();
    const recruiterId = (session.user as {id: string}).id;

    const validStatuses = ['applied', 'screening', 'interview', 'shortlisted', 'rejected', 'hired'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await connectDB();

    if (status) {
      await Candidate.findByIdAndUpdate(candidateId, { status });
    }

    if (note !== undefined) {
      await RecruiterNote.findOneAndUpdate(
        { recruiterId, candidateId },
        { recruiterId, candidateId, note, status: status || 'applied' },
        { upsert: true }
      );
    }

    return NextResponse.json({ message: 'Updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
