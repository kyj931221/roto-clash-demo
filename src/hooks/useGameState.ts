import { useState, useCallback, useEffect } from 'react';
import { GameState, Player, Position, Direction, Rotation } from '@/types/game';

const BOARD_SIZE = 5;
const CENTER_POSITION = { x: 2, y: 2 };

const createInitialBoard = (): (Player['id'] | null)[][] => {
  const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  // Player 1 starts at bottom-left, Player 2 starts at top-right
  board[4][0] = 'player1';
  board[0][4] = 'player2';
  return board;
};

const createInitialPlayers = (gameMode: 'ai' | 'local' | 'tutorial'): Player[] => [
  {
    id: 'player1',
    name: 'Player 1',
    position: { x: 0, y: 4 },
  },
  {
    id: 'player2',
    name: gameMode === 'ai' ? 'AI' : 'Player 2',
    position: { x: 4, y: 0 },
    isAI: gameMode === 'ai',
  },
];

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(),
    players: createInitialPlayers('ai'),
    moverPlayer: 'player1',
    rotatorPlayer: 'player2',
    compassDirection: 0,
    gamePhase: 'finished', // 초기에는 비활성 상태로 설정
    winner: null,
    turnCount: 0,
    selectedCards: {},
    gameMode: 'ai',
    difficulty: 'medium',
    rpsChoices: {},
  });

  const initializeGame = useCallback((gameMode: 'ai' | 'local' | 'tutorial', difficulty: 'easy' | 'medium' | 'hard') => {
    const randomCompassDirection = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
    
    setGameState({
      board: createInitialBoard(),
      players: createInitialPlayers(gameMode),
      moverPlayer: 'player1',
      rotatorPlayer: 'player2',
      compassDirection: randomCompassDirection,
      gamePhase: gameMode === 'tutorial' ? 'cardSelection' : 'rockPaperScissors',
      winner: null,
      turnCount: 0,
      selectedCards: {},
      gameMode,
      difficulty,
      rpsChoices: {},
    });
  }, []);

  const getDirectionVector = useCallback((direction: Direction, compassDirection: number): Position => {
    const directions = {
      north: { x: 0, y: -1 },
      south: { x: 0, y: 1 },
      east: { x: 1, y: 0 },
      west: { x: -1, y: 0 },
    };

    const baseVector = directions[direction];
    const radians = (compassDirection * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    return {
      x: Math.round(baseVector.x * cos - baseVector.y * sin),
      y: Math.round(baseVector.x * sin + baseVector.y * cos),
    };
  }, []);

  const isValidPosition = useCallback((pos: Position): boolean => {
    return pos.x >= 0 && pos.x < BOARD_SIZE && pos.y >= 0 && pos.y < BOARD_SIZE;
  }, []);

  const movePlayer = useCallback((playerId: Player['id'], direction: Direction) => {
    setGameState(prev => {
      const player = prev.players.find(p => p.id === playerId);
      if (!player) return prev;

      const directionVector = getDirectionVector(direction, prev.compassDirection);
      const newPosition = {
        x: player.position.x + directionVector.x,
        y: player.position.y + directionVector.y,
      };

      if (!isValidPosition(newPosition)) return prev;

      // Check if position is occupied
      if (prev.board[newPosition.y][newPosition.x] !== null) return prev;

      const newBoard = prev.board.map(row => [...row]);
      newBoard[player.position.y][player.position.x] = null;
      newBoard[newPosition.y][newPosition.x] = playerId;

      const newPlayers = prev.players.map(p =>
        p.id === playerId ? { ...p, position: newPosition } : p
      );

      // Check for win condition
      const winner = newPosition.x === CENTER_POSITION.x && newPosition.y === CENTER_POSITION.y 
        ? playerId 
        : null;

      return {
        ...prev,
        board: newBoard,
        players: newPlayers,
        winner,
        gamePhase: winner ? 'finished' : prev.gamePhase,
      };
    });
  }, [getDirectionVector, isValidPosition]);

  const rotateCompass = useCallback((rotation: Rotation) => {
    setGameState(prev => {
      const rotationDegrees = rotation === 'clockwise' ? 90 : -90;
      const newDirection = (prev.compassDirection + rotationDegrees + 360) % 360;
      
      return {
        ...prev,
        compassDirection: newDirection,
      };
    });
  }, []);

  const executeCards = useCallback(() => {
    setGameState(prev => {
      const moverCard = prev.selectedCards[prev.moverPlayer];
      const rotatorCard = prev.selectedCards[prev.rotatorPlayer];
      
      if (!moverCard || !rotatorCard) return prev;

      let newState = { ...prev };

      // 1. 회전 먼저 적용
      if (['clockwise', 'counterclockwise'].includes(rotatorCard)) {
        const rotationDegrees = rotatorCard === 'clockwise' ? 90 : -90;
        newState.compassDirection = (prev.compassDirection + rotationDegrees + 360) % 360;
      }

      // 2. 이동 적용
      if (['north', 'south', 'east', 'west'].includes(moverCard)) {
        const moverPlayer = newState.players.find(p => p.id === prev.moverPlayer);
        if (moverPlayer) {
          const directionVector = getDirectionVector(moverCard as Direction, newState.compassDirection);
          const newPosition = {
            x: moverPlayer.position.x + directionVector.x,
            y: moverPlayer.position.y + directionVector.y,
          };

          if (isValidPosition(newPosition) && newState.board[newPosition.y][newPosition.x] === null) {
            // 보드 업데이트
            const newBoard = newState.board.map(row => [...row]);
            newBoard[moverPlayer.position.y][moverPlayer.position.x] = null;
            newBoard[newPosition.y][newPosition.x] = prev.moverPlayer;

            // 플레이어 위치 업데이트
            const newPlayers = newState.players.map(p =>
              p.id === prev.moverPlayer ? { ...p, position: newPosition } : p
            );

            newState.board = newBoard;
            newState.players = newPlayers;

            // 승리 조건 확인
            if (newPosition.x === CENTER_POSITION.x && newPosition.y === CENTER_POSITION.y) {
              newState.winner = prev.moverPlayer;
              newState.gamePhase = 'finished';
            }
          }
        }
      }

      // 3. 다음 턴 준비 (승리하지 않은 경우)
      if (!newState.winner) {
        const newMover = prev.rotatorPlayer;
        const newRotator = prev.moverPlayer;
        
        newState.moverPlayer = newMover;
        newState.rotatorPlayer = newRotator;
        newState.turnCount = prev.turnCount + 1;
        newState.selectedCards = {};
        newState.gamePhase = 'cardSelection';
      }

      return newState;
    });
  }, [getDirectionVector, isValidPosition]);

  const selectCard = useCallback((playerId: Player['id'], cardId: string) => {
    setGameState(prev => ({
      ...prev,
      selectedCards: {
        ...prev.selectedCards,
        [playerId]: cardId,
      },
    }));
  }, []);

  const playRockPaperScissors = useCallback((playerId: Player['id'], choice: 'rock' | 'paper' | 'scissors') => {
    setGameState(prev => {
      const newChoices = {
        ...prev.rpsChoices,
        [playerId]: choice,
      };

      // AI가 자동으로 선택하도록 처리
      if (prev.gameMode === 'ai' && playerId === 'player1') {
        const aiChoices = ['rock', 'paper', 'scissors'] as const;
        newChoices.player2 = aiChoices[Math.floor(Math.random() * 3)];
      }

      // 두 플레이어가 모두 선택했는지 확인
      const bothSelected = newChoices.player1 && newChoices.player2;
      let winner: Player['id'] | undefined;
      let nextPhase = prev.gamePhase;

      if (bothSelected) {
        const p1Choice = newChoices.player1!;
        const p2Choice = newChoices.player2!;
        
        if (p1Choice === p2Choice) {
          // 무승부 - 다시 선택
          return {
            ...prev,
            rpsChoices: {},
          };
        } else if (
          (p1Choice === 'rock' && p2Choice === 'scissors') ||
          (p1Choice === 'paper' && p2Choice === 'rock') ||
          (p1Choice === 'scissors' && p2Choice === 'paper')
        ) {
          winner = 'player1';
        } else {
          winner = 'player2';
        }
        
        nextPhase = 'roleSelection';
      }

      return {
        ...prev,
        rpsChoices: newChoices,
        rpsWinner: winner,
        gamePhase: nextPhase,
      };
    });
  }, []);

  const selectRole = useCallback((role: Role) => {
    setGameState(prev => {
      const winner = prev.rpsWinner!;
      const loser = winner === 'player1' ? 'player2' : 'player1';
      
      return {
        ...prev,
        moverPlayer: role === 'mover' ? winner : loser,
        rotatorPlayer: role === 'mover' ? loser : winner,
        gamePhase: 'cardSelection',
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      board: createInitialBoard(),
      players: createInitialPlayers(prev.gameMode),
      moverPlayer: 'player1',
      rotatorPlayer: 'player2',
      compassDirection: [0, 90, 180, 270][Math.floor(Math.random() * 4)],
      gamePhase: prev.gameMode === 'tutorial' ? 'cardSelection' : 'rockPaperScissors',
      winner: null,
      turnCount: 0,
      selectedCards: {},
      rpsChoices: {},
    }));
  }, []);

  return {
    gameState,
    initializeGame,
    movePlayer,
    rotateCompass,
    executeCards,
    selectCard,
    playRockPaperScissors,
    selectRole,
    resetGame,
  };
};