import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { connectDB } from '@/lib/mongodb';
import Candidate from '@/models/Candidate';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only PDF and DOCX files are allowed' }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const userId = (session.user as {id: string}).id;

    const { url } = await uploadToCloudinary(buffer, 'resumes', 'raw', {
      public_id: `resume_${userId}_${Date.now()}`,
      format: file.type === 'application/pdf' ? 'pdf' : 'docx',
    });

    await connectDB();
    await Candidate.findOneAndUpdate(
      { userId },
      { userId, resumeUrl: url },
      { upsert: true, new: true }
    );

    return NextResponse.json({ url, message: 'Resume uploaded successfully' });
  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
