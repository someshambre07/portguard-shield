import { cn } from '@/lib/utils';
import { Loader2, Shield, Check } from 'lucide-react';

interface ScanProgressProps {
  phase: string;
  percent: number;
  isComplete: boolean;
}

export function ScanProgress({ phase, percent, isComplete }: ScanProgressProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Radar Animation */}
      <div className="relative w-48 h-48 mx-auto">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-4 rounded-full border-2 border-primary/15" />
        <div className="absolute inset-8 rounded-full border border-primary/10" />
        
        {!isComplete && (
          <div
            className="absolute inset-0 rounded-full radar-sweep"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, hsl(var(--primary) / 0.3) 30deg, transparent 60deg)',
            }}
          />
        )}
        
        <div className="absolute inset-0 flex items-center justify-center">
          {isComplete ? (
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center animate-scale-in">
              <Check className="w-8 h-8 text-success" />
            </div>
          ) : (
            <Shield className="w-12 h-12 text-primary scan-pulse" />
          )}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              isComplete ? 'bg-success' : 'bg-primary'
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            {!isComplete && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{phase}</span>
          </div>
          <span className="font-mono text-primary">{Math.round(percent)}%</span>
        </div>
      </div>
    </div>
  );
}
