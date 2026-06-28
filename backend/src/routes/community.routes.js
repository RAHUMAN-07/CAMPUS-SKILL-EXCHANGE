import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get all communities
router.get('/', async (req, res) => {
  try {
    const communities = await prisma.community.findMany({
      orderBy: { memberCount: 'desc' }
    });
    res.json(communities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
});

// Create a community
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name || !description) return res.status(400).json({ error: 'Name and description are required' });

    const community = await prisma.community.create({
      data: { name, description, icon: icon || '👥', memberCount: 1 }
    });
    res.status(201).json(community);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create community' });
  }
});

// Get posts for a community
router.get('/:id/posts', async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await prisma.post.findMany({
      where: { communityId: id },
      include: {
        author: { select: { id: true, name: true, profilePhotoUrl: true } },
        _count: { select: { comments: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create a post
router.post('/:id/posts', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

    const post = await prisma.post.create({
      data: {
        communityId: id,
        authorId: req.user.id,
        title,
        content
      }
    });
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

export default router;
