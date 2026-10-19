import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { config } from '../config';
import { authenticate } from '../middlewares/auth';
import { validateBody } from '../middlewares/validation';
import { authLimiter } from '../middlewares/rateLimiter';
import { AppError } from '../middlewares/errorHandler';
import { AuthenticatedRequest } from '../types';

const router = Router();

const registerSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  fullName: z.string().min(2, 'Full name is required').trim(),
  phone: z.string().optional(),
  nationalId: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  nationalId: z.string().optional().nullable(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

// Helper function to sign JWT
function generateToken(user: { id: string; email: string; role: Role }) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as any }
  );
}

// Citizen Registration 
router.post(
  '/register',
  authLimiter,
  validateBody(registerSchema),
  async (req, res: Response, next) => {
    try {
      const { email, password, fullName, phone, nationalId } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new AppError('An account with this email address already exists.', 409);
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          fullName,
          phone,
          nationalId,
          role: Role.CITIZEN, 
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          nationalId: true,
          role: true,
          createdAt: true,
        },
      });

      const token = generateToken(user);

      // Create welcome notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Welcome to eCitizenServiceHub',
          message: 'Your citizen account has been successfully created. You can now request county services and report community issues.',
          type: 'GENERAL',
        },
      });

      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Citizen Login
router.post(
  '/login',
  authLimiter,
  validateBody(loginSchema),
  async (req, res: Response, next) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.isActive) {
        throw new AppError('Invalid email or password', 401);
      }

      // If user is ADMIN, notify them to use Administrator portal login
      if (user.role === Role.ADMIN) {
        throw new AppError('Administrator accounts must log in via the Administrator Portal at /admin/login.', 403);
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
      }

      const token = generateToken(user);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            nationalId: user.nationalId,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Administrator Login 
router.post(
  '/admin/login',
  authLimiter,
  validateBody(loginSchema),
  async (req, res: Response, next) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.isActive) {
        throw new AppError('Invalid administrator credentials', 401);
      }

      if (user.role !== Role.ADMIN) {
        throw new AppError('Access denied. Administrator privileges are required to access this portal.', 403);
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new AppError('Invalid administrator credentials', 401);
      }

      const token = generateToken(user);

      // Log admin 
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'ADMIN_LOGIN',
          entityType: 'User',
          entityId: user.id,
          ipAddress: req.ip,
        },
      });

      res.json({
        success: true,
        message: 'Administrator login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Current User Retrieval
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        nationalId: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Update Profile
router.put(
  '/profile',
  authenticate,
  validateBody(updateProfileSchema),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const { fullName, phone, nationalId } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: req.user!.id },
        data: {
          ...(fullName ? { fullName } : {}),
          ...(phone !== undefined ? { phone } : {}),
          ...(nationalId !== undefined ? { nationalId } : {}),
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          nationalId: true,
          role: true,
          updatedAt: true,
        },
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Change Password
router.post(
  '/change-password',
  authenticate,
  validateBody(changePasswordSchema),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isCurrentValid) {
        throw new AppError('Current password is incorrect.', 400);
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash },
      });

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Logout
router.post('/logout', (req, res: Response) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;
