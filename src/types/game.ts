export interface Position {
  x: number;
  y: number;
}

export interface Player {
  id: 'player1' | 'player2';
  name: string;
  position: Position;
  isAI?: boolean;
}

export type Role = 'mover' | 'rotator';

export type Direction = 'north' | 'south' | 'east' | 'west';
export type Rotation = 'clockwise' | 'counterclockwise';

export interface DirectionCard {
  id: string;
  direction: Direction;
  label: string;
}

export interface RotationCard {
  id: string;
  rotation: Rotation;
  label: string;
  degrees: number;
}

export interface GameState {
  board: (Player['id'] | null)[][];
  players: Player[];
  moverPlayer: Player['id']; // 현재 턴의 이동자
  rotatorPlayer: Player['id']; // 현재 턴의 회전자
  compassDirection: number; // 0, 90, 180, 270 degrees
  gamePhase: 'rockPaperScissors' | 'roleSelection' | 'cardSelection' | 'playing' | 'finished';
  winner: Player['id'] | null;
  turnCount: number;
  selectedCards: { [playerId: string]: string | null }; // 각 플레이어의 선택된 카드
  gameMode: 'ai' | 'local' | 'tutorial';
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
  timeRemaining?: number;
  rpsWinner?: Player['id']; // 가위바위보 승자
  rpsChoices?: { [playerId: string]: 'rock' | 'paper' | 'scissors' | null };
}

export interface GameHistory {
  id: string;
  date: string;
  gameMode: string;
  winner: string;
  turnCount: number;
  duration: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  theme: 'light' | 'dark';
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number | null;
}