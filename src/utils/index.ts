import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    applied: 'status-applied',
    screening: 'status-screening',
    interview: 'status-interview',
    shortlisted: 'status-shortlisted',
    rejected: 'status-rejected',
    hired: 'status-hired',
  };
  return colors[status] || 'status-applied';
}

export function generatePublicProfileUrl(candidateId: string): string {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://pitchid.vercel.app';
  return `${baseUrl}/candidate/${candidateId}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some((type) => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type);
    }
    return file.type === type || file.type.startsWith(type.replace('*', ''));
  });
}

export function validateFileSize(file: File, maxSizeMB: number): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}
