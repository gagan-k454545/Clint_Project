import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import QRCode from 'qrcode';
import { connectDB } from '@/lib/mongodb';
import Candidate from '@/models/Candidate';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as {id: string}).id;
    await connectDB();

    const candidate = await Candidate.findOne({ userId });
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate profile not found' }, { status: 404 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://pitchid.vercel.app';
    const profileUrl = `${baseUrl}/candidate/${candidate._id}`;

    // Generate QR code as PNG buffer
    const qrBuffer = await QRCode.toBuffer(profileUrl, {
      type: 'png',
      width: 400,
      margin: 2,
      color: {
        dark: '#FFFFFF',
        light: '#0A0A0F',
      },
      errorCorrectionLevel: 'H',
    });

    // Upload QR to Cloudinary
    const { url } = await uploadToCloudinary(qrBuffer, 'qr', 'image', {
      public_id: `qr_${userId}_${Date.now()}`,
    });

    // Save QR URL
    await Candidate.findOneAndUpdate({ userId }, { qrCodeUrl: url });

    return NextResponse.json({
      qrCodeUrl: url,
      profileUrl,
      message: 'QR code generated successfully',
    });
  } catch (error) {
    console.error('QR generation error:', error);
    return NextResponse.json({ error: 'QR generation failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as {id: string}).id;
    await connectDB();

    const candidate = await Candidate.findOne({ userId });
    if (!candidate?.qrCodeUrl) {
      return NextResponse.json({ qrCodeUrl: null, candidateId: candidate?._id });
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://pitchid.vercel.app';
    return NextResponse.json({
      qrCodeUrl: candidate.qrCodeUrl,
      profileUrl: `${baseUrl}/candidate/${candidate._id}`,
      candidateId: candidate._id,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
