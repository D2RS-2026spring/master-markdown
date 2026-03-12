export interface User {
  id: string;
  username: string;
  avatar?: string;
  email?: string;
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
  username: string;
  avatar?: string;
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
