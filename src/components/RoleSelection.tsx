import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { GameState, Role } from '@/types/game';
import { ArrowRight, RotateCw } from 'lucide-react';

interface RoleSelectionProps {
  gameState: GameState;
  onRoleSelect: (role: Role) => void;
  className?: string;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({
  gameState,
  onRoleSelect,
  className
}) => {
  const winner = gameState.rpsWinner;
  const isPlayerWinner = winner === 'player1';
  const isAIMode = gameState.gameMode === 'ai';

  // AI가 이겼을 때 자동으로 역할 선택
  React.useEffect(() => {
    if (!isPlayerWinner && isAIMode) {
      // AI가 이겼을 때 랜덤하게 역할 선택
      const roles: Role[] = ['mover', 'rotator'];
      const aiChoice = roles[Math.floor(Math.random() * 2)];
      setTimeout(() => onRoleSelect(aiChoice), 1500);
    }
  }, [isPlayerWinner, isAIMode, onRoleSelect]);

  const roles = [
    {
      id: 'mover' as Role,
      title: 'Mover',
      description: 'Move your piece towards the center',
      icon: <ArrowRight className="w-8 h-8" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      details: [
        'Choose direction cards (North, South, East, West)',
        'Move your piece one step in the chosen direction',
        'Direction is relative to the current compass',
        'Goal: Reach the center first'
      ]
    },
    {
      id: 'rotator' as Role,
      title: 'Rotator',
      description: 'Control the compass direction',
      icon: <RotateCw className="w-8 h-8" />,
      color: 'bg-green-500 hover:bg-green-600',
      details: [
        'Choose rotation cards (Clockwise, Counter-clockwise)',
        'Rotate the compass by 90 degrees',
        'Changes the meaning of all directions',
        'Strategy: Help yourself or hinder opponent'
      ]
    }
  ];

  if (!isPlayerWinner) {
    return (
      <div className={cn("max-w-md mx-auto space-y-6", className)}>
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Role Assignment</h2>
          <div className="space-y-4">
            {isAIMode ? (
              <>
                <Badge variant="secondary" className="animate-pulse">
                  AI is choosing a role...
                </Badge>
                <p className="text-muted-foreground">
                  The AI won the rock-paper-scissors and is selecting whether to be the Mover or Rotator for the first turn.
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  You lost the rock-paper-scissors. You'll get the remaining role.
                </p>
              </>
            ) : (
              <>
                <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300">
                  You Lost
                </Badge>
                <p className="text-muted-foreground">
                  Player 2 won the rock-paper-scissors and is choosing their role.
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  You'll get the remaining role after Player 2 makes their choice.
                </p>
              </>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("max-w-2xl mx-auto space-y-6", className)}>
      <Card className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Choose Your Role</h2>
        <p className="text-muted-foreground mb-6">
          🎉 You won the rock-paper-scissors! Choose your role for the first turn.
        </p>
        <Badge variant="outline" className="mb-4">
          Roles will alternate each turn
        </Badge>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <Card 
            key={role.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => onRoleSelect(role.id)}
          >
            <div className="text-center space-y-4">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white",
                role.color
              )}>
                {role.icon}
              </div>
              
              <div>
                <h3 className="text-xl font-bold">{role.title}</h3>
                <p className="text-muted-foreground">{role.description}</p>
              </div>

              <div className="space-y-2 text-left">
                <h4 className="font-semibold text-sm">What you'll do:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {role.details.map((detail, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button className={cn("w-full", role.color)}>
                Choose {role.title}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Remember:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Roles alternate every turn</li>
          <li>• Rotation happens BEFORE movement</li>
          <li>• Both players choose cards simultaneously</li>
          <li>• First to reach the center wins!</li>
        </ul>
      </Card>
    </div>
  );
};