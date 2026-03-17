export interface User {
  id: string;
  nickname: string;
  createdAt: string;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  type: 'markdown' | 'qmd';
  difficulty: number;
  stage: number;
  stageName: string;
  order: number;
  content: string;
  hints: string;
  maxScore: number;
  taskType: string;
}

export interface LevelContent {
  task?: string;
  template?: string;
  instruction?: string;
  question?: string;
  options?: string[];
  correctAnswer?: number;
}

export interface Progress {
  id: number;
  userId: string;
  levelId: number;
  completedAt: string;
  score: number;
  attempts: number;
  code?: string;
  level?: Level;
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  totalScore: number;
  completedLevels: number;
}

export interface SubmitResult {
  success: boolean;
  correct: boolean;
  score?: number;
  message?: string;
  progress?: Progress;
}
