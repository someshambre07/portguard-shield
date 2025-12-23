import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/lib/mockApi';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const sizeConfig = {
  sm: { width: 120, strokeWidth: 8, fontSize: 'text-xl' },
  md: { width: 180, strokeWidth: 10, fontSize: 'text-3xl' },
  lg: { width: 240, strokeWidth: 12, fontSize: 'text-4xl' },
};

const levelColors: Record<RiskLevel, string> = {
  low: 'stroke-success',
  medium: 'stroke-warning',
  high: 'stroke-destructive',
};

const levelBgColors: Record<RiskLevel, string> = {
  low: 'text-success',
  medium: 'text-warning',
  high: 'text-destructive',
};

export function RiskGauge({ score, level, size = 'md', animated = true }: RiskGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const config = sizeConfig[size];
  
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  useEffect(() => {
    if (animated) {
      const duration = 1500;
      const steps = 60;
      const increment = score / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.round(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    } else {
      setDisplayScore(score);
    }
  }, [score, animated]);
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: config.width, height: config.width }}>
        <svg
          className="transform -rotate-90"
          width={config.width}
          height={config.width}
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className="stroke-muted"
            strokeWidth={config.strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className={cn(levelColors[level], 'transition-all duration-1000')}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? offset : offset}
            style={{
              transition: animated ? 'stroke-dashoffset 1.5s ease-out' : 'none',
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn(config.fontSize, 'font-bold', levelBgColors[level])}>
            {displayScore}
          </span>
          <span className="text-muted-foreground text-sm">/ 100</span>
        </div>
      </div>
      
      {/* Risk level badge */}
      <div
        className={cn(
          'px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wide',
          level === 'low' && 'bg-success/20 text-success',
          level === 'medium' && 'bg-warning/20 text-warning',
          level === 'high' && 'bg-destructive/20 text-destructive'
        )}
      >
        {level} Risk
      </div>
    </div>
  );
}
