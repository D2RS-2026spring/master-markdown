import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

// Middleware to check authentication
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// Get user's progress
router.get('/', isAuthenticated, async (req: any, res) => {
  try {
    const progress = await prisma.progress.findMany({
      where: { userId: req.user.id },
      include: { level: true }
    });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Submit level answer
router.post('/submit', isAuthenticated, async (req: any, res) => {
  try {
    const { levelId, code } = req.body;
    const userId = req.user.id;

    const level = await prisma.level.findUnique({
      where: { id: levelId }
    });

    if (!level) {
      return res.status(404).json({ error: 'Level not found' });
    }

    // Validate answer based on task type
    let isCorrect = false;
    let score = 0;

    const expectedPattern = new RegExp(level.expectedAnswer, 'i');

    switch (level.taskType) {
      case 'choice':
        const content = JSON.parse(level.content);
        isCorrect = parseInt(code) === content.correctAnswer;
        break;
      case 'judge':
        isCorrect = code.toLowerCase() === level.expectedAnswer.toLowerCase();
        break;
      case 'fill_blank':
        isCorrect = expectedPattern.test(code);
        break;
      case 'code':
      case 'comprehensive':
        isCorrect = expectedPattern.test(code);
        break;
      default:
        isCorrect = expectedPattern.test(code);
    }

    if (isCorrect) {
      // Check existing progress
      const existingProgress = await prisma.progress.findUnique({
        where: {
          userId_levelId: {
            userId,
            levelId
          }
        }
      });

      let attempts = 1;
      if (existingProgress) {
        attempts = existingProgress.attempts + 1;
      }

      // Calculate score
      score = level.maxScore;
      if (attempts > 3) {
        score = Math.floor(score * 0.9); // 10% penalty after 3 attempts
      }

      // Save progress
      const progress = await prisma.progress.upsert({
        where: {
          userId_levelId: {
            userId,
            levelId
          }
        },
        update: {
          score: Math.max(score, existingProgress?.score || 0),
          attempts,
          code
        },
        create: {
          userId,
          levelId,
          score,
          attempts,
          code
        }
      });

      res.json({
        success: true,
        correct: true,
        score,
        progress
      });
    } else {
      // Track attempt even if incorrect
      const existingProgress = await prisma.progress.findUnique({
        where: {
          userId_levelId: {
            userId,
            levelId
          }
        }
      });

      if (existingProgress) {
        await prisma.progress.update({
          where: {
            userId_levelId: {
              userId,
              levelId
            }
          },
          data: {
            attempts: existingProgress.attempts + 1
          }
        });
      }

      res.json({
        success: true,
        correct: false,
        message: '答案不正确，请重试'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

// Get user's total score
router.get('/score', isAuthenticated, async (req: any, res) => {
  try {
    const progress = await prisma.progress.findMany({
      where: { userId: req.user.id }
    });

    const totalScore = progress.reduce((sum, p) => sum + p.score, 0);
    const completedLevels = progress.length;

    res.json({
      totalScore,
      completedLevels,
      progress
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch score' });
  }
});

export default router;
