import { useCallback } from 'react';
import { GameState, Direction, Rotation, Position } from '@/types/game';

const BOARD_SIZE = 5;
const CENTER_POSITION = { x: 2, y: 2 };

export const useAI = () => {
  const getDistance = useCallback((pos1: Position, pos2: Position): number => {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
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

  const evaluateMove = useCallback((
    gameState: GameState, 
    direction: Direction, 
    compassDirection: number
  ): number => {
    const aiPlayer = gameState.players.find(p => p.isAI);
    const humanPlayer = gameState.players.find(p => !p.isAI);
    
    if (!aiPlayer || !humanPlayer) return 0;

    const directionVector = getDirectionVector(direction, compassDirection);
    const newPosition = {
      x: aiPlayer.position.x + directionVector.x,
      y: aiPlayer.position.y + directionVector.y,
    };

    if (!isValidPosition(newPosition)) return -1000;
    if (gameState.board[newPosition.y][newPosition.x] !== null) return -1000;

    // Distance to center (lower is better)
    const distanceToCenter = getDistance(newPosition, CENTER_POSITION);
    let score = -distanceToCenter * 10;

    // Bonus for reaching center
    if (newPosition.x === CENTER_POSITION.x && newPosition.y === CENTER_POSITION.y) {
      score += 1000;
    }

    // Penalty for moving away from center
    const currentDistance = getDistance(aiPlayer.position, CENTER_POSITION);
    if (distanceToCenter > currentDistance) {
      score -= 20;
    }

    return score;
  }, [getDistance, getDirectionVector, isValidPosition]);

  const evaluateRotation = useCallback((
    gameState: GameState, 
    rotation: Rotation
  ): number => {
    const aiPlayer = gameState.players.find(p => p.isAI);
    const humanPlayer = gameState.players.find(p => !p.isAI);
    
    if (!aiPlayer || !humanPlayer) return 0;

    const rotationDegrees = rotation === 'clockwise' ? 90 : -90;
    const newCompassDirection = (gameState.compassDirection + rotationDegrees + 360) % 360;

    let score = 0;

    // Evaluate how this rotation affects human player's best moves
    const directions: Direction[] = ['north', 'south', 'east', 'west'];
    
    directions.forEach(direction => {
      const directionVector = getDirectionVector(direction, newCompassDirection);
      const humanNewPosition = {
        x: humanPlayer.position.x + directionVector.x,
        y: humanPlayer.position.y + directionVector.y,
      };

      if (isValidPosition(humanNewPosition) && 
          gameState.board[humanNewPosition.y][humanNewPosition.x] === null) {
        const humanDistanceToCenter = getDistance(humanNewPosition, CENTER_POSITION);
        const currentHumanDistance = getDistance(humanPlayer.position, CENTER_POSITION);
        
        // Penalty if rotation helps human get closer to center
        if (humanDistanceToCenter < currentHumanDistance) {
          score -= 15;
        }
        
        // Bonus if rotation prevents human from reaching center
        if (humanNewPosition.x === CENTER_POSITION.x && humanNewPosition.y === CENTER_POSITION.y) {
          score -= 100;
        }
      }
    });

    // Evaluate how this rotation affects AI's future moves
    directions.forEach(direction => {
      const directionVector = getDirectionVector(direction, newCompassDirection);
      const aiNewPosition = {
        x: aiPlayer.position.x + directionVector.x,
        y: aiPlayer.position.y + directionVector.y,
      };

      if (isValidPosition(aiNewPosition) && 
          gameState.board[aiNewPosition.y][aiNewPosition.x] === null) {
        const aiDistanceToCenter = getDistance(aiNewPosition, CENTER_POSITION);
        const currentAiDistance = getDistance(aiPlayer.position, CENTER_POSITION);
        
        // Bonus if rotation helps AI get closer to center
        if (aiDistanceToCenter < currentAiDistance) {
          score += 10;
        }
        
        // Big bonus if rotation allows AI to reach center
        if (aiNewPosition.x === CENTER_POSITION.x && aiNewPosition.y === CENTER_POSITION.y) {
          score += 50;
        }
      }
    });

    return score;
  }, [getDistance, getDirectionVector, isValidPosition]);

  const getAIMove = useCallback((gameState: GameState): string => {
    const difficulty = gameState.difficulty;
    const isAIMover = gameState.moverPlayer === 'player2';
    
    if (isAIMover) {
      const directions: Direction[] = ['north', 'south', 'east', 'west'];
      let bestMove = directions[0];
      let bestScore = -Infinity;

      directions.forEach(direction => {
        const score = evaluateMove(gameState, direction, gameState.compassDirection);
        
        // Add randomness based on difficulty
        let adjustedScore = score;
        if (difficulty === 'easy') {
          adjustedScore += Math.random() * 100 - 50; // High randomness
        } else if (difficulty === 'medium') {
          adjustedScore += Math.random() * 30 - 15; // Medium randomness
        }
        // Hard difficulty uses pure evaluation

        if (adjustedScore > bestScore) {
          bestScore = adjustedScore;
          bestMove = direction;
        }
      });

      return bestMove;
    } else {
      // Rotator role
      const rotations: Rotation[] = ['clockwise', 'counterclockwise'];
      let bestRotation = rotations[0];
      let bestScore = -Infinity;

      rotations.forEach(rotation => {
        const score = evaluateRotation(gameState, rotation);
        
        // Add randomness based on difficulty
        let adjustedScore = score;
        if (difficulty === 'easy') {
          adjustedScore += Math.random() * 60 - 30;
        } else if (difficulty === 'medium') {
          adjustedScore += Math.random() * 20 - 10;
        }

        if (adjustedScore > bestScore) {
          bestScore = adjustedScore;
          bestRotation = rotation;
        }
      });

      return bestRotation;
    }
  }, [evaluateMove, evaluateRotation]);

  return { getAIMove };
};