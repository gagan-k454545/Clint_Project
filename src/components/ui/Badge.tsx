import { cn } from '@/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'status';
  status?: string;
  className?: string;
}

export function Badge({ children, variant = 'default', status, className }: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-white/70 border border-white/20',
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    status: '',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variant === 'status' && status ? `status-${status}` : variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
