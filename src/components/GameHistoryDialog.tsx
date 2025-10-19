import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GameHistory } from '@/types/game';
import { Trophy, Clock, Target, Trash2, Calendar } from 'lucide-react';

interface GameHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: GameHistory[];
  stats: {
    totalGames: number;
    wins: number;
    aiWins: number;
    localWins: number;
    winRate: number;
    averageTurns: number;
    averageDuration: number;
  };
  onClearHistory: () => void;
}

export const GameHistoryDialog: React.FC<GameHistoryDialogProps> = ({
  open,
  onOpenChange,
  history,
  stats,
  onClearHistory
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getGameModeLabel = (mode: string) => {
    switch (mode) {
      case 'ai': return 'vs AI';
      case 'local': return 'Local 2P';
      case 'tutorial': return 'Tutorial';
      default: return mode;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Game History & Statistics</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Statistics */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalGames}</div>
                <div className="text-sm text-muted-foreground">Total Games</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.winRate}%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.averageTurns}</div>
                <div className="text-sm text-muted-foreground">Avg Turns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatDuration(stats.averageDuration)}
                </div>
                <div className="text-sm text-muted-foreground">Avg Duration</div>
              </div>
            </div>
          </Card>

          <Separator />

          {/* Recent Games */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Games</h3>
              {history.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearHistory}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear History
                </Button>
              )}
            </div>

            {history.length === 0 ? (
              <Card className="p-8 text-center">
                <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No games played yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start playing to see your game history here!
                </p>
              </Card>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map((game) => (
                  <Card key={game.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Trophy className={`w-4 h-4 ${
                            game.winner === 'Player 1' ? 'text-green-500' : 
                            game.winner === 'AI' ? 'text-red-500' : 'text-blue-500'
                          }`} />
                          <span className="font-medium">{game.winner} Won</span>
                        </div>
                        <Badge variant="outline">
                          {getGameModeLabel(game.gameMode)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span>{game.turnCount} turns</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDuration(game.duration)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(game.date)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};