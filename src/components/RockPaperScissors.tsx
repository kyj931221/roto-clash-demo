import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { GameState } from '@/types/game';

interface RockPaperScissorsProps {
  gameState: GameState;
  onChoice: (choice: 'rock' | 'paper' | 'scissors') => void;
  className?: string;
}

const choices = [
  { id: 'rock', label: 'Rock', emoji: '🪨', beats: 'scissors' },
  { id: 'paper', label: 'Paper', emoji: '📄', beats: 'rock' },
  { id: 'scissors', label: 'Scissors', emoji: '✂️', beats: 'paper' },
] as const;

export const RockPaperScissors: React.FC<RockPaperScissorsProps> = ({
  gameState,
  onChoice,
  className
}) => {
  const currentPlayerChoice = gameState.rpsChoices?.player1;
  const aiChoice = gameState.rpsChoices?.player2;
  const isAIMode = gameState.gameMode === 'ai';
  const bothSelected = currentPlayerChoice && (isAIMode ? aiChoice : gameState.rpsChoices?.player2);

  const getChoiceDisplay = (choice: string) => {
    const choiceData = choices.find(c => c.id === choice);
    return choiceData ? `${choiceData.emoji} ${choiceData.label}` : choice;
  };

  const getWinnerText = () => {
    if (!bothSelected) return null;
    
    if (gameState.rpsWinner === 'player1') {
      return "🎉 You Won! You can choose your role for the first turn.";
    } else if (gameState.rpsWinner === 'player2') {
      return isAIMode ? "😔 You Lost! AI will choose the role." : "😔 You Lost! Player 2 will choose the role.";
    }
    return "🤝 It's a tie! Play again.";
  };

  const getResultColor = () => {
    if (!bothSelected) return "";
    
    if (gameState.rpsWinner === 'player1') {
      return "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200";
    } else if (gameState.rpsWinner === 'player2') {
      return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200";
    }
    return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200";
  };

  return (
    <div className={cn("max-w-md mx-auto space-y-6", className)}>
      <Card className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Rock Paper Scissors</h2>
        <p className="text-muted-foreground mb-6">
          Winner chooses who moves first!
        </p>

        {!currentPlayerChoice ? (
          <div className="space-y-4">
            <p className="font-medium">Choose your move:</p>
            <div className="grid grid-cols-3 gap-3">
              {choices.map((choice) => (
                <Button
                  key={choice.id}
                  variant="outline"
                  className="h-20 flex flex-col space-y-2 hover:scale-105 transition-transform"
                  onClick={() => onChoice(choice.id)}
                >
                  <span className="text-2xl">{choice.emoji}</span>
                  <span className="text-sm">{choice.label}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <Badge variant="outline" className="mb-2">You</Badge>
                <div className="text-3xl">{getChoiceDisplay(currentPlayerChoice)}</div>
              </div>
              
              <div className="text-2xl">VS</div>
              
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  {isAIMode ? 'AI' : 'Player 2'}
                </Badge>
                <div className="text-3xl">
                  {aiChoice ? getChoiceDisplay(aiChoice) : '❓'}
                </div>
              </div>
            </div>

            {bothSelected && (
              <div className={`mt-6 p-4 rounded-lg border-2 ${getResultColor()}`}>
                <p className="font-bold text-center text-lg">
                  {getWinnerText()}
                </p>
                {gameState.rpsWinner === 'player1' && (
                  <p className="text-sm text-center mt-2 opacity-80">
                    You'll be able to choose your role next.
                  </p>
                )}
                {gameState.rpsWinner === 'player2' && (
                  <p className="text-sm text-center mt-2 opacity-80">
                    {isAIMode ? 'AI' : 'Player 2'} will choose the role and you'll get the remaining role.
                  </p>
                )}
                {!gameState.rpsWinner && (
                  <p className="text-sm text-center mt-2 opacity-80">
                    Try again to determine who chooses first!
                  </p>
                )}
              </div>
            )}

            {!bothSelected && isAIMode && (
              <div className="text-center">
                <Badge variant="secondary" className="animate-pulse">
                  AI is choosing...
                </Badge>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Rules */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Rules:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>🪨 Rock beats ✂️ Scissors</li>
          <li>📄 Paper beats 🪨 Rock</li>
          <li>✂️ Scissors beats 📄 Paper</li>
          <li>Winner chooses to be Mover or Rotator first</li>
        </ul>
      </Card>
    </div>
  );
};