import { Router } from 'express';
import { prisma } from '../prisma/client';
import { validateAnswer } from '../validators';

const router = Router();

// Helper: get or create user based on session
const ensureUser = async (req: any): Promise<string> => {
  if (!req.session.userId) {
    req.session.userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  const userId = req.session.userId;

  // Ensure user exists in DB
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) {
    await prisma.user.create({
      data: {
        id: userId,
        nickname: '匿名玩家',
      },
    });
  }

  return userId;
};

// Get user's progress
router.get('/', async (req: any, res) => {
  try {
    const userId = await ensureUser(req);

    const progress = await prisma.progress.findMany({
      where: { userId },
      include: { level: true }
    });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Submit level answer
router.post('/submit', async (req: any, res) => {
  try {
    const { levelId, code } = req.body;
    const userId = await ensureUser(req);

    const level = await prisma.level.findUnique({
      where: { id: levelId }
    });

    if (!level) {
      return res.status(404).json({ error: 'Level not found' });
    }

    // Use new validator
    const result = validateAnswer(levelId, code, level);

    // Get existing progress
    const existingProgress = await prisma.progress.findUnique({
      where: {
        userId_levelId: { userId, levelId }
      }
    });

    const attempts = (existingProgress?.attempts || 0) + 1;

    if (result.correct) {
      // Calculate score
      let score = level.maxScore;
      if (attempts > 3) {
        score = Math.floor(score * 0.9); // 10% penalty after 3 attempts
      }

      // Save progress
      const progress = await prisma.progress.upsert({
        where: {
          userId_levelId: { userId, levelId }
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
        message: result.message,
        progress
      });
    } else {
      // Track attempt even if incorrect
      if (existingProgress) {
        await prisma.progress.update({
          where: {
            userId_levelId: { userId, levelId }
          },
          data: { attempts }
        });
      } else {
        await prisma.progress.create({
          data: {
            userId,
            levelId,
            score: 0,
            attempts,
            code
          }
        });
      }

      res.json({
        success: true,
        correct: false,
        message: result.message,
        failures: result.failures
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

// Get user's total score
router.get('/score', async (req: any, res) => {
  try {
    const userId = await ensureUser(req);

    const progress = await prisma.progress.findMany({
      where: { userId }
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
