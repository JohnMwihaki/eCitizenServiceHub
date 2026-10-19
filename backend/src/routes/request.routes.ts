import { Router, Response } from 'express';
import { z } from 'zod';
import { RequestStatus, Priority, RequestType, Role, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validateBody } from '../middlewares/validation';
import { upload } from '../middlewares/upload';
import { AppError } from '../middlewares/errorHandler';
import { AuthenticatedRequest } from '../types';
import { generateReferenceNumber } from '../utils/referenceGenerator';
import { isValidTransition } from '../utils/workflowValidator';

const router = Router();

const createRequestSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long').trim(),
  description: z.string().min(10, 'Description must be at least 10 characters long').trim(),
  categoryId: z.string().uuid('Invalid category ID'),
  requestType: z.enum(['SERVICE_REQUEST', 'COMMUNITY_ISSUE']).default('SERVICE_REQUEST'),
  locationName: z.string().min(3, 'Location name or landmark is required').trim(),
  ward: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

const additionalInfoSchema = z.object({
  message: z.string().min(5, 'Additional information details are required').trim(),
});

const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comments: z.string().optional().nullable(),
});

const reopenSchema = z.object({
  reason: z.string().min(5, 'Reason for reopening is required').trim(),
});

const statusUpdateSchema = z.object({
  status: z.nativeEnum(RequestStatus),
  reason: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  resolutionDetails: z.string().optional().nullable(),
});

const addUpdateSchema = z.object({
  message: z.string().min(3, 'Message cannot be empty').trim(),
  isInternal: z.boolean().default(false),
});

const requestInfoSchema = z.object({
  question: z.string().min(5, 'Please provide the specific details required from the citizen').trim(),
});

const resolveSchema = z.object({
  resolutionDetails: z.string().min(10, 'Please record the specific actions taken to resolve this request').trim(),
  notes: z.string().optional().nullable(),
});

const rejectSchema = z.object({
  reason: z.string().min(10, 'A clear explanation is required when rejecting a request').trim(),
});

const categoryPrioritySchema = z.object({
  categoryId: z.string().uuid().optional(),
  priority: z.nativeEnum(Priority).optional(),
});


// PUBLIC ENDPOINTS

// Public Map: Approved community issues with coordinates 
router.get('/public-map', async (req, res: Response, next) => {
  try {
    const issues = await prisma.serviceRequest.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
        status: {
          notIn: [RequestStatus.REJECTED],
        },
      },
      select: {
        id: true,
        referenceNumber: true,
        title: true,
        requestType: true,
        status: true,
        priority: true,
        locationName: true,
        ward: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        category: {
          select: {
            name: true,
            code: true,
            icon: true,
          },
        },
      },
      take: 200,
    });

    res.json({
      success: true,
      data: issues,
    });
  } catch (error) {
    next(error);
  }
});

// Public Stats: Unauthenticated live metrics for public citizen views
router.get('/public-stats', async (req, res: Response, next) => {
  try {
    const [totalReceived, resolvedCount] = await Promise.all([
      prisma.serviceRequest.count(),
      prisma.serviceRequest.count({
        where: {
          status: { in: [RequestStatus.RESOLVED, RequestStatus.CLOSED] },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalReceived,
        resolvedCount,
        activeCount: Math.max(0, totalReceived - resolvedCount),
      },
    });
  } catch (error) {
    next(error);
  }
});

// 2. CITIZEN ENDPOINTS

// Create a service request or community issue report
router.post(
  '/',
  authenticate,
  upload.array('attachments', 5),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      
      let bodyData = req.body;
      if (typeof bodyData.data === 'string') {
        try {
          bodyData = JSON.parse(bodyData.data);
        } catch {
          
        }
      }

      // Handle coordinate coercion if coming from FormData
      if (typeof bodyData.latitude === 'string') {
        bodyData.latitude = bodyData.latitude ? parseFloat(bodyData.latitude) : null;
      }
      if (typeof bodyData.longitude === 'string') {
        bodyData.longitude = bodyData.longitude ? parseFloat(bodyData.longitude) : null;
      }

      const validated = await createRequestSchema.parseAsync(bodyData);

      // Verify category exists and is active
      const category = await prisma.serviceCategory.findUnique({
        where: { id: validated.categoryId },
      });

      if (!category || !category.isActive) {
        throw new AppError('The selected service category is not available.', 400);
      }

      const referenceNumber = await generateReferenceNumber();

      const newRequest = await prisma.$transaction(async (tx) => {
        const created = await tx.serviceRequest.create({
          data: {
            referenceNumber,
            title: validated.title,
            description: validated.description,
            requestType: validated.requestType as RequestType,
            status: RequestStatus.SUBMITTED,
            priority: Priority.MEDIUM,
            categoryId: validated.categoryId,
            citizenId: req.user!.id,
            locationName: validated.locationName,
            ward: validated.ward || null,
            latitude: validated.latitude || null,
            longitude: validated.longitude || null,
          },
        });

        // Add initial status history
        await tx.requestStatusHistory.create({
          data: {
            requestId: created.id,
            fromStatus: null,
            toStatus: RequestStatus.SUBMITTED,
            changedById: req.user!.id,
            reason: 'Initial report submitted by citizen',
          },
        });

        // Handle uploaded file attachments if any
        const files = req.files as Express.Multer.File[];
        if (files && files.length > 0) {
          for (const file of files) {
            await tx.requestAttachment.create({
              data: {
                requestId: created.id,
                fileName: file.filename,
                originalName: file.originalname,
                fileUrl: `/uploads/${file.filename}`,
                fileType: file.mimetype,
                fileSize: file.size,
                uploadedById: req.user!.id,
              },
            });
          }
        }

        // Create confirmation notification for citizen
        await tx.notification.create({
          data: {
            userId: req.user!.id,
            title: `Request Submitted: ${referenceNumber}`,
            message: `Your request "${validated.title}" has been successfully logged with reference ${referenceNumber}. You can track its progress here.`,
            type: 'STATUS_CHANGE',
            relatedRequestId: created.id,
          },
        });

        return created;
      });

      res.status(201).json({
        success: true,
        message: 'Service request submitted successfully',
        data: {
          id: newRequest.id,
          referenceNumber: newRequest.referenceNumber,
          title: newRequest.title,
          status: newRequest.status,
          createdAt: newRequest.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get authenticated citizen's own requests
router.get('/my', authenticate, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      category,
      search,
      dateFrom,
      dateTo,
      type,
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * pageSize;

    const where: Prisma.ServiceRequestWhereInput = {
      citizenId: req.user!.id,
    };

    if (status && Object.values(RequestStatus).includes(status as RequestStatus)) {
      where.status = status as RequestStatus;
    }

    if (type && Object.values(RequestType).includes(type as RequestType)) {
      where.requestType = type as RequestType;
    }

    if (category) {
      where.categoryId = category;
    }

    if (search) {
      where.OR = [
        { referenceNumber: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { locationName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [total, requests] = await Promise.all([
      prisma.serviceRequest.count({ where }),
      prisma.serviceRequest.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              code: true,
              icon: true,
            },
          },
          feedback: {
            select: {
              id: true,
              rating: true,
              comments: true,
            },
          },
          _count: {
            select: {
              updates: {
                where: { isInternal: false }, 
              },
              attachments: true,
            },
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        requests,
        pagination: {
          total,
          page: pageNum,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// View request details (for citizen or admin)
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const isUserAdmin = req.user!.role === Role.ADMIN;

    const request = await prisma.serviceRequest.findFirst({
      where: isUserAdmin
        ? { id }
        : { id, citizenId: req.user!.id }, 
      include: {
        category: true,
        citizen: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'asc' },
          include: {
            changedBy: {
              select: {
                id: true,
                fullName: true,
                role: true,
              },
            },
          },
        },
        updates: {
          where: isUserAdmin
            ? undefined 
            : { isInternal: false }, 
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                role: true,
              },
            },
          },
        },
        attachments: true,
        feedback: true,
      },
    });

    if (!request) {
      throw new AppError('Service request not found or access denied.', 404);
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
});

// Submit additional information 
router.post(
  '/:id/additional-info',
  authenticate,
  upload.array('attachments', 3),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const { id } = req.params;

      const serviceRequest = await prisma.serviceRequest.findFirst({
        where: { id, citizenId: req.user!.id },
      });

      if (!serviceRequest) {
        throw new AppError('Request not found or access denied.', 404);
      }

      if (serviceRequest.status !== RequestStatus.AWAITING_CITIZEN) {
        throw new AppError(
          `Cannot submit additional information when request is in status "${serviceRequest.status}". Additional information can only be submitted when awaiting citizen details.`,
          400
        );
      }

      const validated = await additionalInfoSchema.parseAsync(req.body);

      const files = req.files as Express.Multer.File[];

      await prisma.$transaction(async (tx) => {
        // Record citizen update
        await tx.requestUpdate.create({
          data: {
            requestId: id,
            authorId: req.user!.id,
            message: `[Citizen Response]: ${validated.message}`,
            isInternal: false,
          },
        });

        // Save attachments if any
        if (files && files.length > 0) {
          for (const file of files) {
            await tx.requestAttachment.create({
              data: {
                requestId: id,
                fileName: file.filename,
                originalName: file.originalname,
                fileUrl: `/uploads/${file.filename}`,
                fileType: file.mimetype,
                fileSize: file.size,
                uploadedById: req.user!.id,
              },
            });
          }
        }

        // Transition status back to IN_PROGRESS
        await tx.serviceRequest.update({
          where: { id },
          data: { status: RequestStatus.IN_PROGRESS },
        });

        // Record status history
        await tx.requestStatusHistory.create({
          data: {
            requestId: id,
            fromStatus: RequestStatus.AWAITING_CITIZEN,
            toStatus: RequestStatus.IN_PROGRESS,
            changedById: req.user!.id,
            reason: 'Citizen provided requested additional information',
          },
        });

        // Notify Admins
        const admins = await tx.user.findMany({
          where: { role: Role.ADMIN, isActive: true },
          select: { id: true },
        });

        for (const admin of admins) {
          await tx.notification.create({
            data: {
              userId: admin.id,
              title: `Info Provided: ${serviceRequest.referenceNumber}`,
              message: `Citizen ${req.user!.fullName} provided requested additional info for ${serviceRequest.referenceNumber}. Request is back IN_PROGRESS.`,
              type: 'INFO_PROVIDED',
              relatedRequestId: id,
            },
          });
        }
      });

      res.json({
        success: true,
        message: 'Additional information submitted successfully. Request moved back to IN_PROGRESS.',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Submit feedback after resolution
router.post(
  '/:id/feedback',
  authenticate,
  validateBody(feedbackSchema),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const { id } = req.params;
      const { rating, comments } = req.body;

      const serviceRequest = await prisma.serviceRequest.findFirst({
        where: { id, citizenId: req.user!.id },
        include: { feedback: true },
      });

      if (!serviceRequest) {
        throw new AppError('Request not found or access denied.', 404);
      }

      if (
        serviceRequest.status !== RequestStatus.RESOLVED &&
        serviceRequest.status !== RequestStatus.CLOSED
      ) {
        throw new AppError('Feedback can only be submitted after the service request has been resolved.', 400);
      }

      if (serviceRequest.feedback) {
        throw new AppError('Feedback has already been submitted for this request.', 400);
      }

      const feedback = await prisma.feedback.create({
        data: {
          requestId: id,
          citizenId: req.user!.id,
          rating,
          comments,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Thank you for your feedback!',
        data: feedback,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Citizen request review
router.post(
  '/:id/reopen',
  authenticate,
  validateBody(reopenSchema),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const serviceRequest = await prisma.serviceRequest.findFirst({
        where: { id, citizenId: req.user!.id },
      });

      if (!serviceRequest) {
        throw new AppError('Request not found or access denied.', 404);
      }

      if (
        serviceRequest.status !== RequestStatus.RESOLVED &&
        serviceRequest.status !== RequestStatus.CLOSED
      ) {
        throw new AppError('Only resolved or closed requests can be requested for review or reopening.', 400);
      }

      await prisma.$transaction(async (tx) => {
        await tx.serviceRequest.update({
          where: { id },
          data: { status: RequestStatus.REOPENED },
        });

        await tx.requestStatusHistory.create({
          data: {
            requestId: id,
            fromStatus: serviceRequest.status,
            toStatus: RequestStatus.REOPENED,
            changedById: req.user!.id,
            reason: `Citizen dispute / review requested: ${reason}`,
          },
        });

        await tx.requestUpdate.create({
          data: {
            requestId: id,
            authorId: req.user!.id,
            message: `[Reopen Request by Citizen]: ${reason}`,
            isInternal: false,
          },
        });

        // Notify Admins
        const admins = await tx.user.findMany({
          where: { role: Role.ADMIN, isActive: true },
          select: { id: true },
        });

        for (const admin of admins) {
          await tx.notification.create({
            data: {
              userId: admin.id,
              title: `Resolution Disputed: ${serviceRequest.referenceNumber}`,
              message: `Citizen reopened request ${serviceRequest.referenceNumber}. Reason: ${reason}`,
              type: 'REQUEST_REOPENED',
              relatedRequestId: id,
            },
          });
        }
      });

      res.json({
        success: true,
        message: 'Request reopened for administrative review.',
      });
    } catch (error) {
      next(error);
    }
  }
);

//  ADMINISTRATOR ENDPOINTS

// List all requests 
router.get(
  '/admin/all',
  authenticate,
  requireAdmin,
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const {
        page = '1',
        limit = '15',
        status,
        category,
        priority,
        type,
        search,
        ward,
        dateFrom,
        dateTo,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query as Record<string, string>;

      const pageNum = Math.max(1, parseInt(page, 10));
      const pageSize = Math.max(1, Math.min(100, parseInt(limit, 10)));
      const skip = (pageNum - 1) * pageSize;

      const where: Prisma.ServiceRequestWhereInput = {};

      if (status && Object.values(RequestStatus).includes(status as RequestStatus)) {
        where.status = status as RequestStatus;
      }

      if (category) {
        where.categoryId = category;
      }

      if (priority && Object.values(Priority).includes(priority as Priority)) {
        where.priority = priority as Priority;
      }

      if (type && Object.values(RequestType).includes(type as RequestType)) {
        where.requestType = type as RequestType;
      }

      if (ward) {
        where.ward = { contains: ward, mode: 'insensitive' };
      }

      if (search) {
        where.OR = [
          { referenceNumber: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { locationName: { contains: search, mode: 'insensitive' } },
          { citizen: { fullName: { contains: search, mode: 'insensitive' } } },
          { citizen: { email: { contains: search, mode: 'insensitive' } } },
        ];
      }

      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = new Date(dateFrom);
        if (dateTo) where.createdAt.lte = new Date(dateTo);
      }

      const validSortFields = ['createdAt', 'updatedAt', 'priority', 'status', 'referenceNumber'];
      const field = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
      const order = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';

      const [total, requests] = await Promise.all([
        prisma.serviceRequest.count({ where }),
        prisma.serviceRequest.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { [field]: order },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                code: true,
                icon: true,
              },
            },
            citizen: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
            feedback: {
              select: {
                rating: true,
              },
            },
            _count: {
              select: {
                updates: true,
                attachments: true,
              },
            },
          },
        }),
      ]);

      res.json({
        success: true,
        data: {
          requests,
          pagination: {
            total,
            page: pageNum,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Correct category and set priority
router.patch(
  '/admin/:id/category-priority',
  authenticate,
  requireAdmin,
  validateBody(categoryPrioritySchema),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const { id } = req.params;
      const { categoryId, priority } = req.body;

      const request = await prisma.serviceRequest.findUnique({
        where: { id },
        include: { category: true },
      });

      if (!request) {
        throw new AppError('Request not found', 404);
      }

      const updateData: Prisma.ServiceRequestUpdateInput = {};
      const changes: string[] = [];

      if (categoryId && categoryId !== request.categoryId) {
        const newCategory = await prisma.serviceCategory.findUnique({
          where: { id: categoryId },
        });
        if (!newCategory) throw new AppError('Invalid category ID', 400);
        updateData.category = { connect: { id: categoryId } };
        changes.push(`Category changed from "${request.category.name}" to "${newCategory.name}"`);
      }

      if (priority && priority !== request.priority) {
        updateData.priority = priority;
        changes.push(`Priority updated from ${request.priority} to ${priority}`);
      }

      if (changes.length === 0) {
        res.json({ success: true, message: 'No changes made', data: request });
        return;
      }

      const updated = await prisma.$transaction(async (tx) => {
        const res = await tx.serviceRequest.update({
          where: { id },
          data: updateData,
          include: { category: true },
        });

        await tx.auditLog.create({
          data: {
            userId: req.user!.id,
            action: 'UPDATE_CATEGORY_PRIORITY',
            entityType: 'ServiceRequest',
            entityId: id,
            details: JSON.stringify({ changes }),
          },
        });

        // Add internal update record
        await tx.requestUpdate.create({
          data: {
            requestId: id,
            authorId: req.user!.id,
            message: `Administrative adjustment: ${changes.join('. ')}.`,
            isInternal: true,
          },
        });

        return res;
      });

      res.json({
        success: true,
        message: 'Request updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Update status with strict transition validation
router.patch(
  '/admin/:id/status',
  authenticate,
  requireAdmin,
  validateBody(statusUpdateSchema),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const { id } = req.params;
      const { status: newStatus, reason, notes, resolutionDetails } = req.body;

      const request = await prisma.serviceRequest.findUnique({
        where: { id },
      });

      if (!request) {
        throw new AppError('Service request not found', 404);
      }

      if (!isValidTransition(request.status, newStatus)) {
        throw new AppError(
          `Invalid status transition from "${request.status}" to "${newStatus}". Please follow the allowed request workflow.`,
          400
        );
      }

      // Rejection and On Hold require an explanation
      if (newStatus === RequestStatus.REJECTED && (!reason || reason.trim().length < 5)) {
        throw new AppError('A valid explanation is required when rejecting a request.', 400);
      }

      if (newStatus === RequestStatus.ON_HOLD && (!reason || reason.trim().length < 5)) {
        throw new AppError('A valid reason is required when placing a request on hold.', 400);
      }

      // Resolution requires resolution details
      if (newStatus === RequestStatus.RESOLVED && (!resolutionDetails || resolutionDetails.trim().length < 5)) {
        throw new AppError('Resolution details are required when marking a request as resolved.', 400);
      }

      const updated = await prisma.$transaction(async (tx) => {
        const updateData: Prisma.ServiceRequestUpdateInput = {
          status: newStatus,
        };

        if (newStatus === RequestStatus.RESOLVED) {
          updateData.resolvedAt = new Date();
          updateData.resolutionDetails = resolutionDetails;
        } else if (newStatus === RequestStatus.CLOSED) {
          updateData.closedAt = new Date();
        } else if (newStatus === RequestStatus.REJECTED) {
          updateData.rejectionReason = reason;
        } else if (newStatus === RequestStatus.ON_HOLD) {
          updateData.onHoldReason = reason;
        }

        const res = await tx.serviceRequest.update({
          where: { id },
          data: updateData,
        });

        // Record status history
        await tx.requestStatusHistory.create({
          data: {
            requestId: id,
            fromStatus: request.status,
            toStatus: newStatus,
            changedById: req.user!.id,
            reason: reason || null,
            notes: notes || null,
          },
        });

        // Notify citizen
        let notifTitle = `Request Status: ${newStatus.replace('_', ' ')}`;
        let notifMessage = `Your request ${request.referenceNumber} status has changed to ${newStatus}.`;

        if (newStatus === RequestStatus.RESOLVED) {
          notifTitle = `Resolved: ${request.referenceNumber}`;
          notifMessage = `Your request has been resolved. Action taken: ${resolutionDetails}`;
        } else if (newStatus === RequestStatus.REJECTED) {
          notifTitle = `Rejected: ${request.referenceNumber}`;
          notifMessage = `Your request could not be processed. Reason: ${reason}`;
        } else if (newStatus === RequestStatus.ON_HOLD) {
          notifTitle = `On Hold: ${request.referenceNumber}`;
          notifMessage = `Your request was placed on hold. Reason: ${reason}`;
        }

        await tx.notification.create({
          data: {
            userId: request.citizenId,
            title: notifTitle,
            message: notifMessage,
            type: 'STATUS_CHANGE',
            relatedRequestId: id,
          },
        });

        // Audit log
        await tx.auditLog.create({
          data: {
            userId: req.user!.id,
            action: 'UPDATE_STATUS',
            entityType: 'ServiceRequest',
            entityId: id,
            details: JSON.stringify({ from: request.status, to: newStatus, reason, notes }),
          },
        });

        return res;
      });

      res.json({
        success: true,
        message: `Status updated successfully to ${newStatus}`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Add citizen-visible update or private internal note
router.post(
  '/admin/:id/updates',
  authenticate,
  requireAdmin,
  validateBody(addUpdateSchema),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const { id } = req.params;
      const { message, isInternal } = req.body;

      const request = await prisma.serviceRequest.findUnique({
        where: { id },
      });

      if (!request) {
        throw new AppError('Service request not found', 404);
      }

      const update = await prisma.$transaction(async (tx) => {
        const created = await tx.requestUpdate.create({
          data: {
            requestId: id,
            authorId: req.user!.id,
            message,
            isInternal: Boolean(isInternal),
          },
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                role: true,
              },
            },
          },
        });

        // If public update, notify citizen
        if (!isInternal) {
          await tx.notification.create({
            data: {
              userId: request.citizenId,
              title: `Update on ${request.referenceNumber}`,
              message: `Administrator update: ${message}`,
              type: 'PUBLIC_UPDATE',
              relatedRequestId: id,
            },
          });
        }

        return created;
      });

      res.status(201).json({
        success: true,
        message: isInternal ? 'Internal note recorded privately.' : 'Public update published to citizen.',
        data: update,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Request additional information from citizen
router.post(
  '/admin/:id/request-info',
  authenticate,
  requireAdmin,
  validateBody(requestInfoSchema),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const { id } = req.params;
      const { question } = req.body;

      const request = await prisma.serviceRequest.findUnique({
        where: { id },
      });

      if (!request) {
        throw new AppError('Service request not found', 404);
      }

      if (!isValidTransition(request.status, RequestStatus.AWAITING_CITIZEN)) {
        throw new AppError(
          `Cannot request additional info from status "${request.status}". Current request workflow does not allow this transition.`,
          400
        );
      }

      await prisma.$transaction(async (tx) => {
        // Update request status to AWAITING_CITIZEN
        await tx.serviceRequest.update({
          where: { id },
          data: { status: RequestStatus.AWAITING_CITIZEN },
        });

        // Add public update with question
        await tx.requestUpdate.create({
          data: {
            requestId: id,
            authorId: req.user!.id,
            message: `[Action Required from Citizen]: ${question}`,
            isInternal: false,
          },
        });

        // Record status history
        await tx.requestStatusHistory.create({
          data: {
            requestId: id,
            fromStatus: request.status,
            toStatus: RequestStatus.AWAITING_CITIZEN,
            changedById: req.user!.id,
            reason: question,
          },
        });

        // Notify citizen
        await tx.notification.create({
          data: {
            userId: request.citizenId,
            title: `Action Required: ${request.referenceNumber}`,
            message: `The County Administrator requested additional information: "${question}". Please submit the details via your dashboard.`,
            type: 'INFO_REQUESTED',
            relatedRequestId: id,
          },
        });

        // Audit log
        await tx.auditLog.create({
          data: {
            userId: req.user!.id,
            action: 'REQUEST_CITIZEN_INFO',
            entityType: 'ServiceRequest',
            entityId: id,
            details: JSON.stringify({ question }),
          },
        });
      });

      res.json({
        success: true,
        message: 'Additional information request sent to citizen. Status moved to AWAITING_CITIZEN.',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Resolve request
router.post(
  '/admin/:id/resolve',
  authenticate,
  requireAdmin,
  validateBody(resolveSchema),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const { id } = req.params;
      const { resolutionDetails, notes } = req.body;

      const request = await prisma.serviceRequest.findUnique({
        where: { id },
      });

      if (!request) {
        throw new AppError('Service request not found', 404);
      }

      if (!isValidTransition(request.status, RequestStatus.RESOLVED)) {
        throw new AppError(
          `Cannot resolve request from status "${request.status}". Current workflow transition is invalid.`,
          400
        );
      }

      await prisma.$transaction(async (tx) => {
        const resolvedAt = new Date();

        await tx.serviceRequest.update({
          where: { id },
          data: {
            status: RequestStatus.RESOLVED,
            resolutionDetails,
            resolvedAt,
          },
        });

        // Add public update announcing resolution
        await tx.requestUpdate.create({
          data: {
            requestId: id,
            authorId: req.user!.id,
            message: `Resolution Summary: ${resolutionDetails}`,
            isInternal: false,
          },
        });

        // Record status history
        await tx.requestStatusHistory.create({
          data: {
            requestId: id,
            fromStatus: request.status,
            toStatus: RequestStatus.RESOLVED,
            changedById: req.user!.id,
            reason: 'Issue resolved by County Administration',
            notes: notes || null,
          },
        });

        // Notify citizen and prompt for feedback
        await tx.notification.create({
          data: {
            userId: request.citizenId,
            title: `Resolved: ${request.referenceNumber}`,
            message: `Your request "${request.title}" has been successfully resolved! Actions taken: ${resolutionDetails}. Please take a moment to rate our service.`,
            type: 'RESOLUTION',
            relatedRequestId: id,
          },
        });

        // Audit log
        await tx.auditLog.create({
          data: {
            userId: req.user!.id,
            action: 'RESOLVE_REQUEST',
            entityType: 'ServiceRequest',
            entityId: id,
            details: JSON.stringify({ resolutionDetails, notes }),
          },
        });
      });

      res.json({
        success: true,
        message: 'Request resolved successfully. Citizen has been notified.',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Reject request
router.post(
  '/admin/:id/reject',
  authenticate,
  requireAdmin,
  validateBody(rejectSchema),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const request = await prisma.serviceRequest.findUnique({
        where: { id },
      });

      if (!request) {
        throw new AppError('Service request not found', 404);
      }

      if (!isValidTransition(request.status, RequestStatus.REJECTED)) {
        throw new AppError(`Cannot reject request from status "${request.status}".`, 400);
      }

      await prisma.$transaction(async (tx) => {
        await tx.serviceRequest.update({
          where: { id },
          data: {
            status: RequestStatus.REJECTED,
            rejectionReason: reason,
          },
        });

        // Status history
        await tx.requestStatusHistory.create({
          data: {
            requestId: id,
            fromStatus: request.status,
            toStatus: RequestStatus.REJECTED,
            changedById: req.user!.id,
            reason,
          },
        });

        // Add public update explaining rejection
        await tx.requestUpdate.create({
          data: {
            requestId: id,
            authorId: req.user!.id,
            message: `Request could not be processed: ${reason}`,
            isInternal: false,
          },
        });

        // Notify citizen
        await tx.notification.create({
          data: {
            userId: request.citizenId,
            title: `Request Rejected: ${request.referenceNumber}`,
            message: `Your request was not approved. Explanation: ${reason}`,
            type: 'STATUS_CHANGE',
            relatedRequestId: id,
          },
        });

        // Audit log
        await tx.auditLog.create({
          data: {
            userId: req.user!.id,
            action: 'REJECT_REQUEST',
            entityType: 'ServiceRequest',
            entityId: id,
            details: JSON.stringify({ reason }),
          },
        });
      });

      res.json({
        success: true,
        message: 'Request has been rejected with the provided explanation.',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
