import { useMemo } from 'react';
import { AttributeMetrics } from '../../types';

interface BiasHeatmapProps {
  metrics: Record<string, AttributeMetrics>;
}

export function BiasHeatmap({ metrics }: BiasHeatmapProps) {
  const attributes = Object.keys(metrics);
  const metricKeys: (keyof AttributeMetrics)[] = [
    'disparateImpact',
    'statParityDiff',
    'equalOppDiff',
    'avgOddsDiff'
  ];

  const labels: Record<keyof AttributeMetrics, string> = {
    disparateImpact: 'Disparate Impact',
    statParityDiff: 'Statistical Parity',
    equalOppDiff: 'Equal Opportunity',
    avgOddsDiff: 'Average Odds',
    theilIndex: 'Theil Index'
  };

  const getSeverityColor = (key: keyof AttributeMetrics, value: number) => {
    // Basic severity thresholds (simplified for demo)
    if (key === 'disparateImpact') {
      if (value < 0.8) return 'bg-[#FF4D6D]'; // Red (EEOC 4/5ths rule)
      if (value < 0.9) return 'bg-[#FFB740]'; // Yellow
      return 'bg-[#22C55E]'; // Green
    } else {
      // Differences (ideal is 0)
      const absValue = Math.abs(value);
      if (absValue > 0.15) return 'bg-[#FF4D6D]';
      if (absValue > 0.05) return 'bg-[#FFB740]';
      return 'bg-[#22C55E]';
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        <div className="grid grid-cols-[120px_repeat(4,1fr)] gap-1 mb-2">
          <div className="text-xs text-gray-500 font-medium">Attribute</div>
          {metricKeys.map(key => (
            <div key={key} className="text-xs text-center text-gray-500 font-medium px-2">
              {labels[key]}
            </div>
          ))}
        </div>

        {attributes.map(attr => (
          <div key={attr} className="grid grid-cols-[120px_repeat(4,1fr)] gap-1 mb-1 items-center">
            <div className="text-sm font-medium capitalize text-gray-300">{attr}</div>
            {metricKeys.map(key => {
              const val = metrics[attr][key];
              const colorClass = getSeverityColor(key, val);
              
              return (
                <div 
                  key={`${attr}-${key}`} 
                  className={`h-12 rounded-md ${colorClass} flex items-center justify-center bg-opacity-80 hover:bg-opacity-100 transition-all cursor-help group relative`}
                >
                  <span className="text-white font-medium text-sm drop-shadow-md">
                    {val.toFixed(3)}
                  </span>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-[#0A0A0F] text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity">
                    {labels[key]} for {attr}: {val.toFixed(3)}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
