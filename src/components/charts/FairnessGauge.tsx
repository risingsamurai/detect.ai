import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FairnessGaugeProps {
  score: number;
}

export function FairnessGauge({ score }: FairnessGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedScore(Math.round((score / steps) * currentStep));
      if (currentStep >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // SVG parameters
  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Use a semi-circle gauge (180 degrees)
  const arcLength = circumference / 2;
  // Calculate dash offset based on score (0 to 100)
  const strokeDashoffset = arcLength - (animatedScore / 100) * arcLength;

  let color = '#FF4D6D'; // Critical
  let verdict = 'Critical Bias';
  
  if (score > 40) { color = '#FFB740'; verdict = 'High Bias'; }
  if (score > 60) { color = '#FCD34D'; verdict = 'Moderate Issues'; } // Yellow-ish
  if (score > 75) { color = '#3B82F6'; verdict = 'Minor Issues'; } // Blue
  if (score > 90) { color = '#22C55E'; verdict = 'Fair'; } // Green

  return (
    <div className="flex flex-col items-center justify-center relative h-48">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-180 absolute top-0"
        style={{ filter: `drop-shadow(0 0 10px ${color}40)` }}
      >
        {/* Background Arc */}
        <circle
          stroke="rgba(255,255,255,0.1)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          style={{ strokeDashoffset: 0 }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress Arc */}
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute top-1/2 -translate-y-1/4 flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-bold font-sans tracking-tighter"
          style={{ color }}
        >
          {animatedScore}
        </motion.span>
        <span className="text-sm font-medium mt-1 text-gray-300">{verdict}</span>
      </div>
    </div>
  );
}
