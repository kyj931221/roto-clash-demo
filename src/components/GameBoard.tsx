import React from 'react';
import { cn } from '@/lib/utils';
import { GameState, Position } from '@/types/game';

interface GameBoardProps {
  gameState: GameState;
  className?: string;
}

const BOARD_SIZE = 5;
const CENTER_POSITION = { x: 2, y: 2 };

export const GameBoard: React.FC<GameBoardProps> = ({ gameState, className }) => {
  const { board, players } = gameState;

  const getCellContent = (x: number, y: number) => {
    const playerId = board[y][x];
    if (!playerId) return null;

    const player = players.find(p => p.id === playerId);
    if (!player) return null;

    return (
      <div
        className={cn(
          "w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm",
          playerId === 'player1' 
            ? "bg-blue-500 border-blue-700 text-white" 
            : "bg-red-500 border-red-700 text-white"
        )}
      >
        {playerId === 'player1' ? '1' : '2'}
      </div>
    );
  };

  const isCenter = (x: number, y: number) => 
    x === CENTER_POSITION.x && y === CENTER_POSITION.y;

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      <div className="grid grid-cols-5 gap-1 p-4 bg-card rounded-lg border">
        {Array.from({ length: BOARD_SIZE }, (_, y) =>
          Array.from({ length: BOARD_SIZE }, (_, x) => (
            <div
              key={`${x}-${y}`}
              className={cn(
                "w-12 h-12 border-2 flex items-center justify-center relative",
                isCenter(x, y)
                  ? "bg-yellow-200 border-yellow-400 dark:bg-yellow-800 dark:border-yellow-600"
                  : "bg-background border-border hover:bg-muted/50",
                "transition-colors duration-200"
              )}
            >
              {isCenter(x, y) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-yellow-600 animate-pulse" />
                </div>
              )}
              {getCellContent(x, y)}
            </div>
          ))
        )}
      </div>
      
      {/* Board coordinates for debugging */}
      <div className="text-xs text-muted-foreground">
        Goal: Center (2,2) • Current Turn: {gameState.turnCount + 1}
      </div>
    </div>
  );
};