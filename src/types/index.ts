export type UserRole = 'candidate' | 'recruiter' | 'admin';

export type CandidateStatus = 
  | 'applied' 
  | 'screening' 
  | 'interview' 
  | 'shortlisted' 
  | 'rejected' 
  | 'hired';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  createdAt: string;
}

export interface ICandidate {
  _id: string;
  userId: string | IUser;
  resumeUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  qrCodeUrl?: string;
  jobDescription?: string;
  aiScript?: string;
  aiSummary?: string;
  skills?: string[];
  status: CandidateStatus;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface IRecruiter {
  _id: string;
  userId: string | IUser;
  companyName: string;
  recruiterName: string;
  email: string;
  notes: IRecruiterNote[];
}

export interface IRecruiterNote {
  candidateId: string;
  note: string;
  status: CandidateStatus;
  createdAt: string;
}

export interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

export interface AIScriptSection {
  introduction: string;
  technicalPoints: string;
  experienceSummary: string;
  behavioralIntro: string;
  closingStatement: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
