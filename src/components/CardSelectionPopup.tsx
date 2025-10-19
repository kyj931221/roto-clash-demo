import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw, RotateCcw, CheckCircle } from 'lucide-react';

interface CardSelectionPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playerName: string;
  role: 'mover' | 'rotator';
  selectedCard: string;
  isAI?: boolean;
}

const getCardIcon = (cardId: string) => {
  switch (cardId) {
    case 'north': return <ArrowUp className="w-8 h-8" />;
    case 'south': return <ArrowDown className="w-8 h-8" />;
    case 'east': return <ArrowRight className="w-8 h-8" />;
    case 'west': return <ArrowLeft className="w-8 h-8" />;
    case 'clockwise': return <RotateCw className="w-8 h-8" />;
    case 'counterclockwise': return <RotateCcw className="w-8 h-8" />;
    default: return null;
  }
};

const getCardLabel = (cardId: string) => {
  switch (cardId) {
    case 'north': return 'North';
    case 'south': return 'South';
    case 'east': return 'East';
    case 'west': return 'West';
    case 'clockwise': return 'Clockwise';
    case 'counterclockwise': return 'Counter-clockwise';
    default: return cardId;
  }
};

const getCardDescription = (cardId: string, role: string) => {
  if (role === 'mover') {
    return `Move one step ${cardId} (relative to compass direction)`;
  } else {
    return `Rotate compass ${cardId === 'clockwise' ? '90° clockwise' : '90° counter-clockwise'}`;
  }
};

export const CardSelectionPopup: React.FC<CardSelectionPopupProps> = ({
  open,
  onOpenChange,
  playerName,
  role,
  selectedCard,
  isAI = false
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (open) {
      setShowContent(false);
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Auto-close after 2.5 seconds
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="text-center space-y-4">
          {/* Header */}
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold">Card Selected!</h3>
          </div>

          {/* Player Info */}
          <div className="flex items-center justify-center space-x-2">
            <span className="font-medium">{playerName}</span>
            <Badge className={cn(
              role === 'mover' 
                ? "bg-blue-500 hover:bg-blue-600" 
                : "bg-green-500 hover:bg-green-600"
            )}>
              {role.toUpperCase()}
            </Badge>
          </div>

          {/* Selected Card */}
          <Card className={cn(
            "p-6 transition-all duration-300",
            showContent ? "scale-100 opacity-100" : "scale-95 opacity-0",
            role === 'mover' 
              ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800" 
              : "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
          )}>
            <div className="flex flex-col items-center space-y-3">
              <div className={cn(
                "p-4 rounded-full",
                role === 'mover' 
                  ? "bg-blue-500 text-white" 
                  : "bg-green-500 text-white"
              )}>
                {getCardIcon(selectedCard)}
              </div>
              
              <div className="text-center">
                <h4 className="text-xl font-bold">{getCardLabel(selectedCard)}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {getCardDescription(selectedCard, role)}
                </p>
              </div>
            </div>
          </Card>

          {/* Status Message */}
          <p className="text-sm text-muted-foreground">
            {isAI 
              ? "AI has made their selection"
              : "Waiting for opponent to select their card..."
            }
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};