import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Candidate from '@/models/Candidate';
import User from '@/models/User';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();

    const candidate = await Candidate.findById(id).populate('userId', 'name email profileImage');
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    // Increment views
    await Candidate.findByIdAndUpdate(id, { $inc: { views: 1 } });

    return NextResponse.json({ candidate });
  } catch (error) {
    console.error('Get candidate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
