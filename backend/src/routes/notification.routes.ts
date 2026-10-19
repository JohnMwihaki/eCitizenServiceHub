import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middlewares/auth';
import { AppError } from '../middlewares/errorHandler';
import { AuthenticatedRequest } from '../types';

const router = Router();

// Get authenticated user's notifications
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { limit = '30' } = req.query;
    const take = Math.min(100, parseInt(limit as string, 10) || 30);

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: 'desc' },
        take,
      }),
      prisma.notification.count({
        where: { userId: req.user!.id, isRead: false },
      }),
    ]);

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Mark single notification as read
router.patch('/:id/read', authenticate, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { id } = req.params;

    const notif = await prisma.notification.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!notif) {
      throw new AppError('Notification not found', 404);
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

// Mark all notifications as read
router.patch('/read-all', authenticate, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, isRead: false },
      data: { isRead: true },
    });

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
