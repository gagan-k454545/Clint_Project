import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { connectDB } from '@/lib/mongodb';
import Candidate from '@/models/Candidate';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('video') as File;

    if (!file) {
      return NextResponse.json({ error: 'No video provided' }, { status: 400 });
    }

    // Be lenient with MIME type — browsers can report different types
    const isVideo =
      file.type.startsWith('video/') ||
      file.type === 'application/octet-stream' ||
      file.name.match(/\.(webm|mp4|mov|ogg|avi)$/i);

    if (!isVideo) {
      return NextResponse.json({ error: 'Only video files are allowed' }, { status: 400 });
    }

    // 100MB max
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: 'Video must be less than 100MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const userId = (session.user as { id: string }).id;

    const { url, thumbnailUrl } = await uploadToCloudinary(buffer, 'videos', 'video', {
      public_id: `video_${userId}_${Date.now()}`,
      resource_type: 'video',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });

    await connectDB();
    await Candidate.findOneAndUpdate(
      { userId },
      { userId, videoUrl: url, thumbnailUrl },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      url,
      thumbnailUrl,
      message: 'Video uploaded successfully',
    });
  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
