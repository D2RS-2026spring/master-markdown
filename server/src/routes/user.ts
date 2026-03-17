import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

// Helper: get or create user based on session
const getOrCreateUser = async (req: any) => {
  // Generate anonymous ID if not exists
  if (!req.session.userId) {
    req.session.userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  const userId = req.session.userId;

  // Ensure user exists in DB
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: userId,
        nickname: '匿名玩家',
      },
    });
  }

  return user;
};

// Get current user info (auto-creates anonymous user)
router.get('/me', async (req: any, res) => {
  try {
    const user = await getOrCreateUser(req);
    res.json({ user });
  } catch (error) {
    console.error('Failed to get user:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// Set/update nickname
router.post('/nickname', async (req: any, res) => {
  try {
    const { nickname } = req.body;

    if (!nickname || typeof nickname !== 'string') {
      return res.status(400).json({ error: '昵称不能为空' });
    }

    const trimmed = nickname.trim();
    if (trimmed.length < 1 || trimmed.length > 20) {
      return res.status(400).json({ error: '昵称长度需在 1-20 个字符之间' });
    }

    const user = await getOrCreateUser(req);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { nickname: trimmed },
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Failed to update nickname:', error);
    res.status(500).json({ error: 'Failed to update nickname' });
  }
});

export default router;
export { getOrCreateUser };
