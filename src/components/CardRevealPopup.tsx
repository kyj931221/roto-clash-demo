import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw, RotateCcw, Eye } from 'lucide-react';
import { GameState } from '@/types/game';

interface CardRevealPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  revealedCards: {
    moverPlayer: string;
    rotatorPlayer: string;
    moverCard: string;
    rotatorCard: string;
    moverPlayerName: string;
    rotatorPlayerName: string;
  } | null;
  turnCount: number;
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
    return `Move one step ${cardId}`;
  } else {
    return `Rotate compass ${cardId === 'clockwise' ? '90° clockwise' : '90° counter-clockwise'}`;
  }
};

export const CardRevealPopup: React.FC<CardRevealPopupProps> = ({
  open,
  onOpenChange,
  revealedCards,
  turnCount
}) => {
  const [showCards, setShowCards] = useState(false);

  if (!revealedCards || !open) return null;

  useEffect(() => {
    if (open) {
      setShowCards(false);
      const timer = setTimeout(() => setShowCards(true), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Auto-close after showing cards for 3 seconds
  useEffect(() => {
    if (open && showCards) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, showCards, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center space-x-2">
            <Eye className="w-6 h-6" />
            <span>Cards Revealed!</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Turn Info */}
          <div className="text-center">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Turn {turnCount + 1}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              Rotation will be applied first, then movement
            </p>
          </div>

          {/* Cards Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rotator Card (Applied First) */}
            <div className="space-y-3">
              <div className="text-center">
                <Badge className="bg-green-500 hover:bg-green-600 mb-2">
                  ROTATOR (First)
                </Badge>
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-medium">{revealedCards.rotatorPlayerName}</span>
                </div>
              </div>
              
              <Card className={cn(
                "p-6 transition-all duration-500",
                showCards ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4",
                "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
              )}>
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-4 rounded-full bg-green-500 text-white">
                    {getCardIcon(revealedCards.rotatorCard)}
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-bold">{getCardLabel(revealedCards.rotatorCard)}</h4>
                    <p className="text-sm text-muted-foreground">
                      {getCardDescription(revealedCards.rotatorCard, 'rotator')}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Mover Card (Applied Second) */}
            <div className="space-y-3">
              <div className="text-center">
                <Badge className="bg-blue-500 hover:bg-blue-600 mb-2">
                  MOVER (Second)
                </Badge>
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-medium">{revealedCards.moverPlayerName}</span>
                </div>
              </div>
              
              <Card className={cn(
                "p-6 transition-all duration-500 delay-200",
                showCards ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4",
                "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
              )}>
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-4 rounded-full bg-blue-500 text-white">
                    {getCardIcon(revealedCards.moverCard)}
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-bold">{getCardLabel(revealedCards.moverCard)}</h4>
                    <p className="text-sm text-muted-foreground">
                      {getCardDescription(revealedCards.moverCard, 'mover')}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Execution Order */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold text-center mb-2">Execution Order:</h4>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="flex items-center space-x-1">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Compass Rotation</span>
              </span>
              <span>→</span>
              <span className="flex items-center space-x-1">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Piece Movement</span>
              </span>
            </div>
          </div>

          {/* Auto-execution message */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm">Turn will execute automatically...</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};