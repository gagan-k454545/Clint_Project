import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Candidate from '@/models/Candidate';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as {id: string}).id;
    await connectDB();

    const candidate = await Candidate.findOne({ userId }).populate('userId', 'name email profileImage');
    return NextResponse.json({ candidate });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as {id: string}).id;
    const updates = await req.json();

    // Whitelist allowed fields
    const allowedFields = ['jobDescription', 'aiScript', 'aiSummary', 'skills', 'status'];
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => allowedFields.includes(key))
    );

    await connectDB();
    const candidate = await Candidate.findOneAndUpdate(
      { userId },
      { userId, ...filteredUpdates },
      { upsert: true, new: true }
    );

    return NextResponse.json({ candidate });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as {id: string}).id;
    await connectDB();
    await Candidate.findOneAndDelete({ userId });

    return NextResponse.json({ message: 'Profile deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
