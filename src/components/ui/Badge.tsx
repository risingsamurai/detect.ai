import { Severity } from '../../types';

interface BadgeProps {
  severity: Severity;
  className?: string;
}

export function Badge({ severity, className = '' }: BadgeProps) {
  const colors = {
    critical: 'bg-[#FF4D6D]/10 text-[#FF4D6D] border-[#FF4D6D]/20',
    high: 'bg-[#FFB740]/10 text-[#FFB740] border-[#FFB740]/20',
    moderate: 'bg-[#FFB740]/5 text-[#FFB740]/80 border-[#FFB740]/10',
    minor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    fair: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
  };

  const labels = {
    critical: 'Critical Bias',
    high: 'High Bias',
    moderate: 'Moderate Bias',
    minor: 'Minor Issues',
    fair: 'Fair',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[severity]} ${className}`}>
      {labels[severity]}
    </span>
  );
}
