import { Router } from 'express';
import { Prisma, Progress } from '@prisma/client';
import { prisma } from '../prisma/client';

const router = Router();

const buildGithubAuthUrl = (state: string) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID || '',
    redirect_uri: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/api/auth/github/callback',
    scope: 'read:user user:email',
    state,
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
};

const mergeProgressToGithubUser = async (anonymousUserId: string, githubUserId: string) => {
  const [anonymousProgress, githubProgress] = await Promise.all([
    prisma.progress.findMany({ where: { userId: anonymousUserId } }),
    prisma.progress.findMany({ where: { userId: githubUserId } }),
  ]);

  const githubProgressByLevel = new Map<number, Progress>(githubProgress.map((item: Progress) => [item.levelId, item]));

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    for (const item of anonymousProgress) {
      const existing = githubProgressByLevel.get(item.levelId);

      if (!existing) {
        await tx.progress.update({
          where: { id: item.id },
          data: { userId: githubUserId },
        });
        continue;
      }

      const mergedAttempts = Math.max(existing.attempts, item.attempts);
      const mergedScore = Math.max(existing.score, item.score);
      const mergedCode = existing.code || item.code;

      await tx.progress.update({
        where: { id: existing.id },
        data: {
          attempts: mergedAttempts,
          score: mergedScore,
          code: mergedCode,
        },
      });

      await tx.progress.delete({ where: { id: item.id } });
    }
  });
};

router.get('/github', async (req: any, res) => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return res.status(500).json({ error: 'GitHub OAuth is not configured' });
  }

  const state = Math.random().toString(36).slice(2);
  req.session.oauthState = state;

  const redirect = typeof req.query.redirect === 'string' ? req.query.redirect : '/profile';
  req.session.oauthRedirect = redirect;

  return res.redirect(buildGithubAuthUrl(state));
});

router.get('/github/callback', async (req: any, res) => {
  const { code, state } = req.query;

  if (!code || typeof code !== 'string' || state !== req.session.oauthState) {
    return res.status(400).send('OAuth state mismatch or missing code');
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/api/auth/github/callback',
      }),
    });

    const tokenData = await tokenResponse.json() as { access_token?: string };
    if (!tokenData.access_token) {
      return res.status(401).send('Failed to get GitHub access token');
    }

    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'md-master-app',
      },
    });

    if (!githubUserResponse.ok) {
      return res.status(401).send('Failed to fetch GitHub user info');
    }

    const githubUser = await githubUserResponse.json() as { id: number; login: string; name?: string };
    const githubUserId = `github-${githubUser.id}`;
    const currentUserId = req.session.userId as string | undefined;

    const displayName = (githubUser.name || githubUser.login || 'GitHub玩家').slice(0, 20);

    await prisma.user.upsert({
      where: { id: githubUserId },
      create: {
        id: githubUserId,
        nickname: displayName,
      },
      update: {
        nickname: displayName,
      },
    });

    if (currentUserId && currentUserId !== githubUserId && currentUserId.startsWith('user-')) {
      await mergeProgressToGithubUser(currentUserId, githubUserId);
      await prisma.user.deleteMany({ where: { id: currentUserId } });
    }

    req.session.userId = githubUserId;
    delete req.session.oauthState;

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const redirectPath = req.session.oauthRedirect || '/profile';
    delete req.session.oauthRedirect;

    return res.redirect(`${clientUrl}${redirectPath}?auth=success`);
  } catch (error) {
    console.error('GitHub OAuth callback failed:', error);
    return res.status(500).send('GitHub login failed');
  }
});

router.post('/logout', (req: any, res) => {
  req.session.regenerate((err: any) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }

    return res.json({ success: true });
  });
});

export default router;
