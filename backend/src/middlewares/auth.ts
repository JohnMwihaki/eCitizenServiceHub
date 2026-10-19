import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { config } from '../config';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest, AuthUser } from '../types';
import { AppError } from './errorHandler';

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError('Authentication required. Missing or invalid Bearer token.', 401));
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      email: string;
      role: Role;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      next(new AppError('User account not found or has been deactivated.', 401));
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      next(new AppError('Session token has expired. Please log in again.', 401));
      return;
    }
    next(new AppError('Invalid authentication token.', 401));
  }
}

export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required.', 401));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(
        new AppError(
          `Forbidden: Access requires ${allowedRoles.join(' or ')} privileges.`,
          403
        )
      );
      return;
    }

    next();
  };
}

export const requireAdmin = requireRole(Role.ADMIN);
export const requireCitizen = requireRole(Role.CITIZEN);
