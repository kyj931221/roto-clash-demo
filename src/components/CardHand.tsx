import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DirectionCard, RotationCard, Role } from '@/types/game';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw, RotateCcw } from 'lucide-react';

interface CardHandProps {
  gameState: any;
  playerId: string;
  onCardSelect: (playerId: string, cardId: string) => void;
  disabled?: boolean;
  className?: string;
}

const DIRECTION_CARDS: DirectionCard[] = [
  { id: 'north', direction: 'north', label: 'North' },
  { id: 'south', direction: 'south', label: 'South' },
  { id: 'east', direction: 'east', label: 'East' },
  { id: 'west', direction: 'west', label: 'West' },
];

const ROTATION_CARDS: RotationCard[] = [
  { id: 'clockwise', rotation: 'clockwise', label: 'Clockwise', degrees: 90 },
  { id: 'counterclockwise', rotation: 'counterclockwise', label: 'Counter-clockwise', degrees: -90 },
];

const getDirectionIcon = (direction: string) => {
  switch (direction) {
    case 'north': return <ArrowUp className="w-6 h-6" />;
    case 'south': return <ArrowDown className="w-6 h-6" />;
    case 'east': return <ArrowRight className="w-6 h-6" />;
    case 'west': return <ArrowLeft className="w-6 h-6" />;
    default: return null;
  }
};

const getRotationIcon = (rotation: string) => {
  switch (rotation) {
    case 'clockwise': return <RotateCw className="w-6 h-6" />;
    case 'counterclockwise': return <RotateCcw className="w-6 h-6" />;
    default: return null;
  }
};

export const CardHand: React.FC<CardHandProps> = ({
  gameState,
  playerId,
  onCardSelect,
  disabled = false,
  className
}) => {
  const isMover = gameState.moverPlayer === playerId;
  const isRotator = gameState.rotatorPlayer === playerId;
  const role = isMover ? 'mover' : 'rotator';
  const cards = role === 'mover' ? DIRECTION_CARDS : ROTATION_CARDS;
  const selectedCard = gameState.selectedCards[playerId];
  const otherPlayerId = playerId === 'player1' ? 'player2' : 'player1';
  const otherPlayerSelected = gameState.selectedCards[otherPlayerId];
  const bothSelected = selectedCard && otherPlayerSelected;

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <h3 className="text-lg font-semibold capitalize">
            Your Role: {role === 'mover' ? 'Mover' : 'Rotator'}
          </h3>
          <Badge className={cn(
            role === 'mover' 
              ? "bg-blue-500 hover:bg-blue-600" 
              : "bg-green-500 hover:bg-green-600"
          )}>
            {role.toUpperCase()}
          </Badge>
        </div>
        <h4 className="text-md font-medium">
          {role === 'mover' ? 'Movement Cards' : 'Rotation Cards'}
        </h4>
        <p className="text-sm text-muted-foreground">
          {role === 'mover' 
            ? 'Choose a direction to move your piece' 
            : 'Choose how to rotate the compass'
          }
        </p>
      </div>

      <div className={cn(
        "grid gap-3",
        role === 'mover' ? "grid-cols-2" : "grid-cols-1"
      )}>
        {cards.map((card) => (
          <Card
            key={card.id}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedCard === card.id 
                ? "ring-2 ring-primary bg-primary/10" 
                : "hover:bg-muted/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !disabled && onCardSelect(playerId, card.id)}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={cn(
                "p-2 rounded-full",
                selectedCard === card.id 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"
              )}>
                {role === 'mover' 
                  ? getDirectionIcon((card as DirectionCard).direction)
                  : getRotationIcon((card as RotationCard).rotation)
                }
              </div>
              <span className="text-sm font-medium">{card.label}</span>
              {role === 'rotator' && (
                <span className="text-xs text-muted-foreground">
                  {(card as RotationCard).degrees > 0 ? '+' : ''}{(card as RotationCard).degrees}°
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <Button
          disabled={true}
          className="w-full"
          size="lg"
          variant="outline"
        >
          {bothSelected 
            ? 'Executing turn...' 
            : selectedCard 
            ? 'Waiting for opponent...' 
            : 'Select a card'
          }
        </Button>
        {selectedCard && !bothSelected && (
          <p className="text-xs text-center text-muted-foreground">
            Card selected! Waiting for {otherPlayerId === 'player2' && gameState.gameMode === 'ai' ? 'AI' : 'other player'}
          </p>
        )}
        {bothSelected && (
          <p className="text-xs text-center text-muted-foreground">
            Both cards selected! Turn will execute automatically...
          </p>
        )}
      </div>
    </div>
  );
};