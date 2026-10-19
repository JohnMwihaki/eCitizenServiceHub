import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validateBody } from '../middlewares/validation';
import { AppError } from '../middlewares/errorHandler';
import { AuthenticatedRequest } from '../types';

const router = Router();

const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required').trim(),
  code: z.string().min(2, 'Code is required').toUpperCase().trim(),
  description: z.string().min(5, 'Description is required').trim(),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
});

const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  icon: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// Public: Get active categories
router.get('/', async (req, res: Response, next) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        icon: true,
        isActive: true,
      },
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Get all categories 
router.get('/admin', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { requests: true },
        },
      },
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Create Category
router.post(
  '/admin',
  authenticate,
  requireAdmin,
  validateBody(categorySchema),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const { name, code, description, icon, isActive } = req.body;

      const existing = await prisma.serviceCategory.findFirst({
        where: {
          OR: [{ name }, { code }],
        },
      });

      if (existing) {
        throw new AppError('A category with this name or code already exists.', 409);
      }

      const category = await prisma.serviceCategory.create({
        data: {
          name,
          code,
          description,
          icon,
          isActive: isActive !== undefined ? isActive : true,
        },
      });

      
      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: 'CREATE_CATEGORY',
          entityType: 'ServiceCategory',
          entityId: category.id,
          details: JSON.stringify({ name, code }),
        },
      });

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Update Category
router.put(
  '/admin/:id',
  authenticate,
  requireAdmin,
  validateBody(updateCategorySchema),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const { id } = req.params;
      const { name, description, icon, isActive } = req.body;

      const category = await prisma.serviceCategory.findUnique({
        where: { id },
      });

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      if (name && name !== category.name) {
        const duplicate = await prisma.serviceCategory.findUnique({
          where: { name },
        });
        if (duplicate) {
          throw new AppError('Another category with this name already exists.', 409);
        }
      }

      const updated = await prisma.serviceCategory.update({
        where: { id },
        data: {
          ...(name ? { name } : {}),
          ...(description ? { description } : {}),
          ...(icon !== undefined ? { icon } : {}),
          ...(isActive !== undefined ? { isActive } : {}),
        },
      });

      
      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: 'UPDATE_CATEGORY',
          entityType: 'ServiceCategory',
          entityId: id,
          details: JSON.stringify({ updates: req.body }),
        },
      });

      res.json({
        success: true,
        message: 'Category updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

//  Admin: Delete or Deactivate Category
router.delete(
  '/admin/:id',
  authenticate,
  requireAdmin,
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const { id } = req.params;

      const category = await prisma.serviceCategory.findUnique({
        where: { id },
        include: {
          _count: { select: { requests: true } },
        },
      });

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      // If category has existing requests, prevent deletion to preserve historical data
      if (category._count.requests > 0) {
        // Deactivate instead
        await prisma.serviceCategory.update({
          where: { id },
          data: { isActive: false },
        });

        res.json({
          success: true,
          message: `Category has ${category._count.requests} existing service requests. It has been deactivated instead of deleted to protect historical records.`,
          data: { deactivated: true },
        });
        return;
      }

      await prisma.serviceCategory.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
