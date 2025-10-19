import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { GameBoard } from './GameBoard';
import { Compass } from './Compass';
import { CardHand } from './CardHand';
import { GameInfo } from './GameInfo';
import { GameMenu } from './GameMenu';
import { GameHistoryDialog } from './GameHistoryDialog';
import { TutorialDialog } from './TutorialDialog';
import { RockPaperScissors } from './RockPaperScissors';
import { RoleSelection } from './RoleSelection';
import { useGameState } from '@/hooks/useGameState';
import { useAI } from '@/hooks/useAI';
import { useGameHistory } from '@/hooks/useGameHistory';
import { useGameSettings } from '@/hooks/useGameSettings';
import { Direction, Rotation } from '@/types/game';
import { Home, RotateCcw, Volume2, VolumeX } from 'lucide-react';

export const Game: React.FC = () => {
  const { toast } = useToast();
  const { gameState, initializeGame, movePlayer, rotateCompass, executeCards, selectCard, playRockPaperScissors, selectRole, resetGame } = useGameState();
  const { getAIMove } = useAI();
  const { history, saveGame, clearHistory, getStats } = useGameHistory();
  const { settings, updateSettings } = useGameSettings();
  
  const [showMenu, setShowMenu] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);

  // Handle AI moves
  useEffect(() => {
    if (gameState.gamePhase === 'cardSelection' && 
        gameState.gameMode === 'ai' &&
        !gameState.selectedCards.player2 &&
        !isProcessingTurn) {
      
      const timer = setTimeout(() => {
        setIsProcessingTurn(true);
        const aiMove = getAIMove(gameState);
        selectCard('player2', aiMove);
        setIsProcessingTurn(false);
      }, 1500); // AI thinking time

      return () => clearTimeout(timer);
    }
  }, [gameState.gamePhase, gameState.selectedCards, gameState.gameMode, isProcessingTurn]);

  // Auto-execute when both players have selected cards
  useEffect(() => {
    if (gameState.gamePhase === 'cardSelection' &&
        gameState.selectedCards.player1 &&
        gameState.selectedCards.player2) {
      
      const timer = setTimeout(() => {
        executeCards();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState.selectedCards, gameState.gamePhase, executeCards]);

  // Handle game completion
  useEffect(() => {
    if (gameState.winner && gameStartTime > 0) {
      const duration = Math.floor((Date.now() - gameStartTime) / 1000);
      const winnerName = gameState.players.find(p => p.id === gameState.winner)?.name || 'Unknown';
      
      saveGame({
        gameMode: gameState.gameMode,
        winner: winnerName,
        turnCount: gameState.turnCount,
        duration,
      });

      toast({
        title: "Game Over!",
        description: `${winnerName} wins in ${gameState.turnCount + 1} turns!`,
        duration: 5000,
      });
    }
  }, [gameState.winner, gameStartTime, saveGame, toast]);

  const handleStartGame = useCallback((mode: 'ai' | 'local' | 'tutorial', difficulty?: 'easy' | 'medium' | 'hard') => {
    initializeGame(mode, difficulty || settings.difficulty);
    setShowMenu(false);
    setGameStartTime(Date.now());
    
    if (settings.soundEnabled) {
      // Play start sound effect
      console.log('🎵 Game start sound');
    }
  }, [initializeGame, settings]);



  const handleRockPaperScissors = useCallback((choice: 'rock' | 'paper' | 'scissors') => {
    playRockPaperScissors('player1', choice);
  }, [playRockPaperScissors]);

  const handleRoleSelection = useCallback((role: Role) => {
    selectRole(role);
  }, [selectRole]);

  const handleCardSelect = useCallback((playerId: string, cardId: string) => {
    selectCard(playerId, cardId);
  }, [selectCard]);

  const handleBackToMenu = () => {
    setShowMenu(true);
    resetGame();
  };

  const handleShowHistory = () => {
    setShowHistory(true);
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleStartTutorialGame = () => {
    handleStartGame('tutorial');
  };

  // Show different phases
  if (gameState.gamePhase === 'rockPaperScissors') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto py-8">
          <RockPaperScissors
            gameState={gameState}
            onChoice={handleRockPaperScissors}
          />
        </div>
      </div>
    );
  }

  if (gameState.gamePhase === 'roleSelection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto py-8">
          <RoleSelection
            gameState={gameState}
            onRoleSelect={handleRoleSelection}
          />
        </div>
      </div>
    );
  }

  if (showMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto py-8">
          <GameMenu
            onStartGame={handleStartGame}
            onShowTutorial={handleShowTutorial}
            onShowHistory={handleShowHistory}
            settings={settings}
            onSettingsChange={updateSettings}
          />
        </div>
        
        <GameHistoryDialog
          open={showHistory}
          onOpenChange={setShowHistory}
          history={history}
          stats={getStats()}
          onClearHistory={clearHistory}
        />
        
        <TutorialDialog
          open={showTutorial}
          onOpenChange={setShowTutorial}
          onStartTutorialGame={handleStartTutorialGame}
        />
      </div>
    );
  }

  // Show different game phases
  if (gameState.gamePhase === 'rockPaperScissors') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={handleBackToMenu}>
              <Home className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
            <h1 className="text-2xl font-bold">Roto-Clash</h1>
            <div></div>
          </div>
          <RockPaperScissors
            gameState={gameState}
            onChoice={handleRockPaperScissors}
          />
        </div>
      </div>
    );
  }

  if (gameState.gamePhase === 'roleSelection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={handleBackToMenu}>
              <Home className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
            <h1 className="text-2xl font-bold">Roto-Clash</h1>
            <div></div>
          </div>
          <RoleSelection
            gameState={gameState}
            onRoleSelect={handleRoleSelection}
          />
        </div>
      </div>
    );
  }

  // Main game screen (cardSelection, playing, finished phases)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBackToMenu}>
              <Home className="w-4 h-4 mr-2" />
              Menu
            </Button>
            <Button variant="outline" onClick={resetGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              New Game
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Roto-Clash</h1>
            <Badge variant="outline">{gameState.gameMode.toUpperCase()}</Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Game Info */}
          <div className="lg:col-span-1">
            <GameInfo gameState={gameState} />
          </div>

          {/* Center Panel - Game Board and Compass */}
          <div className="lg:col-span-1 space-y-6">
            <GameBoard gameState={gameState} />
            <Compass direction={gameState.compassDirection} />
            
            {gameState.gameMode === 'tutorial' && (
              <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Tutorial Mode
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Both players select cards simultaneously. Rotation happens first, then movement.
                </p>
              </Card>
            )}
          </div>

          {/* Right Panel - Card Hand */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <CardHand
                gameState={gameState}
                playerId="player1"
                onCardSelect={handleCardSelect}
                disabled={isProcessingTurn || gameState.gamePhase === 'finished'}
              />
              
              {isProcessingTurn && (
                <div className="mt-4 text-center">
                  <Badge variant="secondary" className="animate-pulse">
                    Processing turn...
                  </Badge>
                </div>
              )}
              
              {gameState.gamePhase === 'finished' && (
                <div className="mt-4 space-y-2">
                  <Button onClick={resetGame} className="w-full" size="lg">
                    Play Again
                  </Button>
                  <Button onClick={handleBackToMenu} variant="outline" className="w-full">
                    Back to Menu
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>


      </div>
    </div>
  );
};