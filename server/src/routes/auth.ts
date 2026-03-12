import { Router } from 'express';
import passport from 'passport';
import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import { prisma } from '../prisma/client';

const router = Router();

// GitHub OAuth configuration
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID || '',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  callbackURL: '/auth/github/callback'
}, async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
  try {
    const user = await prisma.user.upsert({
      where: { id: profile.id },
      update: {
        username: profile.username || '',
        avatar: profile.photos?.[0]?.value,
        email: profile.emails?.[0]?.value
      },
      create: {
        id: profile.id,
        username: profile.username || '',
        avatar: profile.photos?.[0]?.value,
        email: profile.emails?.[0]?.value
      }
    });
    done(null, user);
  } catch (error) {
    done(error as Error);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// GitHub OAuth routes
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL || 'http://localhost:3000');
  }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router;
