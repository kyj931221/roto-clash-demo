import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameState } from '@/types/game';
import { Crown, User, Bot } from 'lucide-react';

interface GameInfoProps {
  gameState: GameState;
  className?: string;
}

export const GameInfo: React.FC<GameInfoProps> = ({ gameState, className }) => {
  const moverPlayer = gameState.players.find(p => p.id === gameState.moverPlayer);
  const rotatorPlayer = gameState.players.find(p => p.id === gameState.rotatorPlayer);

  const getRoleDescription = (role: string) => {
    return role === 'mover' 
      ? 'Move your piece towards the center'
      : 'Rotate the compass to change directions';
  };

  const getPlayerIcon = (player: any) => {
    if (player?.isAI) return <Bot className="w-4 h-4" />;
    return <User className="w-4 h-4" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Current Turn Info */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Current Turn</h3>
          <Badge variant="outline">Turn {gameState.turnCount + 1}</Badge>
        </div>
        
        <div className="space-y-3">
          <div className="text-center mb-3">
            <h4 className="font-semibold text-sm text-muted-foreground">Current Turn Roles</h4>
          </div>
          
          <div className={cn(
            "flex items-center space-x-2 p-2 rounded-lg",
            moverPlayer?.id === 'player1' 
              ? "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800" 
              : "bg-muted/50"
          )}>
            {getPlayerIcon(moverPlayer)}
            <span className="font-medium">{moverPlayer?.name}</span>
            <Badge className="bg-blue-500 hover:bg-blue-600">
              MOVER
            </Badge>
            {moverPlayer?.id === 'player1' && (
              <span className="text-xs text-blue-600 dark:text-blue-400">(You)</span>
            )}
          </div>
          
          <div className={cn(
            "flex items-center space-x-2 p-2 rounded-lg",
            rotatorPlayer?.id === 'player1' 
              ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800" 
              : "bg-muted/50"
          )}>
            {getPlayerIcon(rotatorPlayer)}
            <span className="font-medium">{rotatorPlayer?.name}</span>
            <Badge className="bg-green-500 hover:bg-green-600">
              ROTATOR
            </Badge>
            {rotatorPlayer?.id === 'player1' && (
              <span className="text-xs text-green-600 dark:text-green-400">(You)</span>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Both players select cards simultaneously
          </p>
        </div>
      </Card>

      {/* Players Info */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3">Players</h3>
        <div className="space-y-3">
          {gameState.players.map((player) => (
            <div 
              key={player.id}
              className={cn(
                "flex items-center justify-between p-2 rounded-lg",
                player.id === gameState.moverPlayer 
                  ? "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800" 
                  : player.id === gameState.rotatorPlayer
                  ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                  : "bg-muted/50"
              )}
            >
              <div className="flex items-center space-x-2">
                {getPlayerIcon(player)}
                <span className="font-medium">{player.name}</span>
                {gameState.winner === player.id && (
                  <Crown className="w-4 h-4 text-yellow-500" />
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                ({player.position.x}, {player.position.y})
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Game Status */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3">Game Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Mode:</span>
            <Badge variant="secondary">
              {gameState.gameMode === 'ai' ? 'vs AI' : 
               gameState.gameMode === 'local' ? 'Local 2P' : 'Tutorial'}
            </Badge>
          </div>
          
          {gameState.gameMode === 'ai' && (
            <div className="flex justify-between">
              <span className="text-sm">Difficulty:</span>
              <Badge variant="outline" className={cn(
                gameState.difficulty === 'easy' && "border-green-500 text-green-700",
                gameState.difficulty === 'medium' && "border-yellow-500 text-yellow-700",
                gameState.difficulty === 'hard' && "border-red-500 text-red-700"
              )}>
                {gameState.difficulty.toUpperCase()}
              </Badge>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-sm">Phase:</span>
            <Badge variant={gameState.gamePhase === 'finished' ? 'destructive' : 'default'}>
              {gameState.gamePhase.toUpperCase()}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Winner Announcement */}
      {gameState.winner && (
        <Card className="p-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
            <Crown className="w-5 h-5" />
            <span className="font-semibold">
              {gameState.players.find(p => p.id === gameState.winner)?.name} Wins!
            </span>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            Game completed in {gameState.turnCount + 1} turns
          </p>
        </Card>
      )}
    </div>
  );
};