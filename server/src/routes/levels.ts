import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

// Get all levels
router.get('/', async (req, res) => {
  try {
    const levels = await prisma.level.findMany({
      orderBy: [
        { stage: 'asc' },
        { order: 'asc' }
      ]
    });
    res.json(levels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch levels' });
  }
});

// Get level by ID
router.get('/:id', async (req, res) => {
  try {
    const level = await prisma.level.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!level) {
      return res.status(404).json({ error: 'Level not found' });
    }
    res.json(level);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch level' });
  }
});

export default router;
