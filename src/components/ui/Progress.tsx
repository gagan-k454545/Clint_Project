import { cn } from '@/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  color?: 'blue' | 'purple' | 'green' | 'gradient';
  label?: string;
  showPercent?: boolean;
}

export function Progress({ value, max = 100, className, color = 'gradient', label, showPercent }: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    blue: 'bg-cyan-500',
    purple: 'bg-violet-500',
    green: 'bg-emerald-500',
    gradient: 'bg-gradient-to-r from-cyan-500 to-violet-600',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-white/60">{label}</span>}
          {showPercent && <span className="text-xs text-white/60">{Math.round(percent)}%</span>}
        </div>
      )}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-300', colors[color])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default Progress;
