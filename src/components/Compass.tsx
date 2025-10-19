import React from 'react';
import { cn } from '@/lib/utils';

interface CompassProps {
  direction: number;
  className?: string;
}

export const Compass: React.FC<CompassProps> = ({ direction, className }) => {
  const getDirectionLabel = (degrees: number) => {
    switch (degrees) {
      case 0: return 'N';
      case 90: return 'E';
      case 180: return 'S';
      case 270: return 'W';
      default: return 'N';
    }
  };

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <h3 className="text-lg font-semibold">Compass</h3>
      <div className="relative w-24 h-24 bg-card border-2 border-border rounded-full flex items-center justify-center">
        {/* Compass background */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-900" />
        
        {/* Direction markers */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute top-1 text-xs font-bold text-foreground">N</div>
          <div className="absolute right-1 text-xs font-bold text-foreground">E</div>
          <div className="absolute bottom-1 text-xs font-bold text-foreground">S</div>
          <div className="absolute left-1 text-xs font-bold text-foreground">W</div>
        </div>
        
        {/* Compass needle */}
        <div 
          className="absolute w-1 h-8 bg-red-500 rounded-full origin-bottom transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `rotate(${direction}deg) translateY(-50%)`,
            transformOrigin: 'center bottom'
          }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-red-600" />
        </div>
        
        {/* Center dot */}
        <div className="absolute w-2 h-2 bg-foreground rounded-full" />
      </div>
      
      <div className="text-sm text-muted-foreground">
        Current: {getDirectionLabel(direction)} ({direction}°)
      </div>
    </div>
  );
};