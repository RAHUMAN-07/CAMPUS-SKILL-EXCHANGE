import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js'; // Assuming auth middleware exists

const router = Router();
const prisma = new PrismaClient();

// Get all conversations for the current user
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: req.user.id },
          { user2Id: req.user.id }
        ]
      },
      include: {
        user1: { select: { id: true, name: true, profilePhotoUrl: true } },
        user2: { select: { id: true, name: true, profilePhotoUrl: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages for a specific conversation
router.get('/conversations/:id/messages', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await prisma.conversation.findUnique({
      where: { id }
    });
    
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    if (conversation.user1Id !== req.user.id && conversation.user2Id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/conversations/:id/messages', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    if (!content) return res.status(400).json({ error: 'Content is required' });

    const conversation = await prisma.conversation.findUnique({
      where: { id }
    });
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    if (conversation.user1Id !== req.user.id && conversation.user2Id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: req.user.id,
        content
      }
    });
    
    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Create or get conversation with another user
router.post('/conversations', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const user1Id = req.user.id < userId ? req.user.id : userId;
    const user2Id = req.user.id < userId ? userId : req.user.id;

    let conversation = await prisma.conversation.findUnique({
      where: {
        user1Id_user2Id: { user1Id, user2Id }
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { user1Id, user2Id }
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

export default router;
