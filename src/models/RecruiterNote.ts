import mongoose, { Schema, Document } from 'mongoose';

export interface IRecruiterNoteDocument extends Document {
  recruiterId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  note: string;
  status: 'applied' | 'screening' | 'interview' | 'shortlisted' | 'rejected' | 'hired';
  createdAt: Date;
}

const RecruiterNoteSchema = new Schema<IRecruiterNoteDocument>(
  {
    recruiterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
    note: { type: String, default: '' },
    status: {
      type: String,
      enum: ['applied', 'screening', 'interview', 'shortlisted', 'rejected', 'hired'],
      default: 'applied',
    },
  },
  { timestamps: true }
);

export const RecruiterNote =
  mongoose.models.RecruiterNote ||
  mongoose.model<IRecruiterNoteDocument>('RecruiterNote', RecruiterNoteSchema);
export default RecruiterNote;
