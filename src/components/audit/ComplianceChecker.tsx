import { ShieldCheck } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export function ComplianceChecker() {
  const regulations = [
    {
      name: 'EEOC 4/5ths Rule',
      status: 'fail',
      desc: 'US Equal Employment Opportunity Commission guideline requiring protected group selection rate to be at least 80% of majority group.',
    },
    {
      name: 'EU AI Act',
      status: 'warning',
      desc: 'Article 10: Requires examination of possible biases in data used to train high-risk AI systems.',
    },
    {
      name: 'Fair Housing Act',
      status: 'pass',
      desc: 'Prohibits discrimination in housing-related transactions on the basis of race, color, religion, sex, etc.',
    }
  ];

  return (
    <div className="space-y-4">
      {regulations.map((reg, i) => (
        <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
          <div className="mt-0.5">
            {reg.status === 'pass' && <ShieldCheck className="w-5 h-5 text-[#22C55E]" />}
            {reg.status === 'warning' && <ShieldCheck className="w-5 h-5 text-[#FFB740]" />}
            {reg.status === 'fail' && <ShieldCheck className="w-5 h-5 text-[#FF4D6D]" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">{reg.name}</h4>
              <Tooltip content={reg.desc} />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {reg.status === 'pass' && 'Meets regulatory thresholds.'}
              {reg.status === 'warning' && 'Approaching regulatory limits. Monitor closely.'}
              {reg.status === 'fail' && 'Fails to meet regulatory minimums. Mitigation required.'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
