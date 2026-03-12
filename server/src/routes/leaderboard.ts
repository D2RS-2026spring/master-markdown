import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    // Get all users with their total scores
    const users = await prisma.user.findMany({
      include: {
        progress: true
      }
    });

    const leaderboard = users
      .map(user => ({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        totalScore: user.progress.reduce((sum, p) => sum + p.score, 0),
        completedLevels: user.progress.length
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 100); // Top 100

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get user's rank
router.get('/rank/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const users = await prisma.user.findMany({
      include: {
        progress: true
      }
    });

    const sortedUsers = users
      .map(user => ({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        totalScore: user.progress.reduce((sum, p) => sum + p.score, 0),
        completedLevels: user.progress.length
      }))
      .sort((a, b) => b.totalScore - a.totalScore);

    const rank = sortedUsers.findIndex(u => u.id === userId) + 1;
    const user = sortedUsers.find(u => u.id === userId);

    res.json({
      rank,
      ...user
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rank' });
  }
});

export default router;
