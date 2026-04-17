import { Tooltip } from '../ui/Tooltip';

interface MetricCardProps {
  title: string;
  value: number;
  threshold: [number, number];
  description: string;
}

export function MetricCard({ title, value, threshold, description }: MetricCardProps) {
  // Determine if value falls inside the acceptable threshold
  const [min, max] = threshold;
  const isPassing = value >= min && value <= max;
  
  // Calculate position for visual bar (-1 to 1 typical scale, or 0 to 2)
  // For simplicity, let's normalize to a percentage within the bar
  // Most disparate impact is ~0-2. Most diffs are -1 to 1.
  const isRatio = title.toLowerCase().includes('impact');
  const barMin = isRatio ? 0 : -0.5;
  const barMax = isRatio ? 1.5 : 0.5;
  
  const percentage = Math.max(0, Math.min(100, ((value - barMin) / (barMax - barMin)) * 100));
  const minPercent = Math.max(0, Math.min(100, ((min - barMin) / (barMax - barMin)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((max - barMin) / (barMax - barMin)) * 100));

  return (
    <div className="bg-[#1A1A24] rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-gray-200">{title}</h4>
          <Tooltip content={description} />
        </div>
        <span className={`text-lg font-bold ${isPassing ? 'text-[#22C55E]' : 'text-[#FF4D6D]'}`}>
          {value.toFixed(3)}
        </span>
      </div>

      <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden mt-6">
        {/* Acceptable Range Indicator */}
        <div 
          className="absolute h-full bg-[#22C55E]/20"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
        
        {/* Center line for diffs, or threshold line for ratio */}
        {!isRatio && (
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-500/50" />
        )}

        {/* Value Marker */}
        <div 
          className={`absolute top-0 bottom-0 w-1.5 rounded-full -ml-0.5 shadow-[0_0_8px_currentColor] ${isPassing ? 'bg-[#22C55E] text-[#22C55E]' : 'bg-[#FF4D6D] text-[#FF4D6D]'}`}
          style={{ left: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{barMin}</span>
        <span>{barMax}</span>
      </div>
    </div>
  );
}
