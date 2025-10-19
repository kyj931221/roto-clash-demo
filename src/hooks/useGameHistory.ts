import { useState, useEffect } from 'react';
import { GameHistory } from '@/types/game';

const STORAGE_KEY = 'roto-clash-history';

export const useGameHistory = () => {
  const [history, setHistory] = useState<GameHistory[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse game history:', error);
        setHistory([]);
      }
    }
  }, []);

  const saveGame = (gameData: Omit<GameHistory, 'id' | 'date'>) => {
    const newGame: GameHistory = {
      ...gameData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    const updatedHistory = [newGame, ...history].slice(0, 50); // Keep last 50 games
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getStats = () => {
    const totalGames = history.length;
    const wins = history.filter(game => game.winner === 'Player 1').length;
    const aiWins = history.filter(game => game.winner === 'AI').length;
    const localWins = history.filter(game => 
      game.gameMode === 'local' && (game.winner === 'Player 1' || game.winner === 'Player 2')
    ).length;

    const averageTurns = totalGames > 0 
      ? Math.round(history.reduce((sum, game) => sum + game.turnCount, 0) / totalGames)
      : 0;

    const averageDuration = totalGames > 0
      ? Math.round(history.reduce((sum, game) => sum + game.duration, 0) / totalGames)
      : 0;

    return {
      totalGames,
      wins,
      aiWins,
      localWins,
      winRate: totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0,
      averageTurns,
      averageDuration,
    };
  };

  return {
    history,
    saveGame,
    clearHistory,
    getStats,
  };
};