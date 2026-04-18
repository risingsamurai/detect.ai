import { useState } from 'react';
import { Recommendation } from '../../types';
import { Button } from '../ui/Button';
import { CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface MitigationCardProps {
  recommendation: Recommendation;
  index: number;
}

export function MitigationCard({ recommendation, index }: MitigationCardProps) {
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    setApplying(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setApplying(false);
    setApplied(true);
    toast.success(`Successfully applied: ${recommendation.title}`);
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'text-[#22C55E] bg-[#22C55E]/10';
      case 'medium': return 'text-[#FFB740] bg-[#FFB740]/10';
      case 'high': return 'text-[#FF4D6D] bg-[#FF4D6D]/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className={`p-5 rounded-xl border transition-all ${
      applied 
        ? 'bg-[#22C55E]/5 border-[#22C55E]/30' 
        : 'bg-[#12121A] border-white/5 hover:border-white/20'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
            applied ? 'bg-[#22C55E] text-white' : 'bg-white/10 text-gray-400'
          }`}>
            {applied ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h4 className="font-semibold">{recommendation.title}</h4>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEffortColor(recommendation.effort)}`}>
                {recommendation.effort} effort
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {recommendation.description}
            </p>
            
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-[#00C2A8]" />
              <span className="text-gray-300">Expected improvement:</span>
              <span className="text-[#00C2A8] font-medium">+{recommendation.expectedImprovement} score</span>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          {applied ? (
            <Button variant="outline" className="gap-2 text-[#22C55E] border-[#22C55E]/30 hover:bg-[#22C55E]/10 pointer-events-none">
              <CheckCircle2 className="w-4 h-4" /> Applied
            </Button>
          ) : (
            <Button onClick={handleApply} isLoading={applying} className="gap-2">
              Apply Fix <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
