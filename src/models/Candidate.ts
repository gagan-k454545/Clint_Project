import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidateDocument extends Document {
  userId: mongoose.Types.ObjectId;
  resumeUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  qrCodeUrl?: string;
  jobDescription?: string;
  aiScript?: string;
  aiSummary?: string;
  skills?: string[];
  status: 'applied' | 'screening' | 'interview' | 'shortlisted' | 'rejected' | 'hired';
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema = new Schema<ICandidateDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    resumeUrl: { type: String },
    videoUrl: { type: String },
    thumbnailUrl: { type: String },
    qrCodeUrl: { type: String },
    jobDescription: { type: String },
    aiScript: { type: String },
    aiSummary: { type: String },
    skills: [{ type: String }],
    status: {
      type: String,
      enum: ['applied', 'screening', 'interview', 'shortlisted', 'rejected', 'hired'],
      default: 'applied',
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Candidate =
  mongoose.models.Candidate || mongoose.model<ICandidateDocument>('Candidate', CandidateSchema);
export default Candidate;
