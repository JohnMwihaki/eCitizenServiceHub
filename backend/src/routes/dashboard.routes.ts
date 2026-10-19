import { Router, Response } from 'express';
import { RequestStatus, Priority, Role } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { AuthenticatedRequest } from '../types';

const router = Router();


//  CITIZEN DASHBOARD

router.get('/citizen', authenticate, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const citizenId = req.user!.id;

    const [
      total,
      awaitingReview,
      inProgress,
      resolved,
      awaitingCitizen,
      rejected,
      recentRequests,
      recentNotifications,
    ] = await Promise.all([
      prisma.serviceRequest.count({ where: { citizenId } }),
      prisma.serviceRequest.count({
        where: {
          citizenId,
          status: { in: [RequestStatus.SUBMITTED, RequestStatus.UNDER_REVIEW] },
        },
      }),
      prisma.serviceRequest.count({
        where: { citizenId, status: RequestStatus.IN_PROGRESS },
      }),
      prisma.serviceRequest.count({
        where: {
          citizenId,
          status: { in: [RequestStatus.RESOLVED, RequestStatus.CLOSED] },
        },
      }),
      prisma.serviceRequest.count({
        where: { citizenId, status: RequestStatus.AWAITING_CITIZEN },
      }),
      prisma.serviceRequest.count({
        where: { citizenId, status: RequestStatus.REJECTED },
      }),
      prisma.serviceRequest.findMany({
        where: { citizenId },
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: { name: true, code: true, icon: true },
          },
          feedback: {
            select: { rating: true },
          },
        },
      }),
      prisma.notification.findMany({
        where: { userId: citizenId },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          total,
          awaitingReview,
          inProgress,
          resolved,
          awaitingCitizen,
          rejected,
        },
        recentRequests,
        recentNotifications,
      },
    });
  } catch (error) {
    next(error);
  }
});


//  ADMINISTRATOR DASHBOARD

router.get('/admin', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      total,
      submitted,
      underReview,
      inProgress,
      awaitingCitizen,
      onHold,
      resolved,
      closed,
      rejected,
      reopened,
      overdueCount,
      categoryCounts,
      priorityCounts,
      needsAttention,
      feedbackStats,
      resolvedRequestsWithTimes,
      wardCountsRaw,
    ] = await Promise.all([
      prisma.serviceRequest.count(),
      prisma.serviceRequest.count({ where: { status: RequestStatus.SUBMITTED } }),
      prisma.serviceRequest.count({ where: { status: RequestStatus.UNDER_REVIEW } }),
      prisma.serviceRequest.count({ where: { status: RequestStatus.IN_PROGRESS } }),
      prisma.serviceRequest.count({ where: { status: RequestStatus.AWAITING_CITIZEN } }),
      prisma.serviceRequest.count({ where: { status: RequestStatus.ON_HOLD } }),
      prisma.serviceRequest.count({ where: { status: RequestStatus.RESOLVED } }),
      prisma.serviceRequest.count({ where: { status: RequestStatus.CLOSED } }),
      prisma.serviceRequest.count({ where: { status: RequestStatus.REJECTED } }),
      prisma.serviceRequest.count({ where: { status: RequestStatus.REOPENED } }),
      
      prisma.serviceRequest.count({
        where: {
          status: { in: [RequestStatus.SUBMITTED, RequestStatus.UNDER_REVIEW, RequestStatus.IN_PROGRESS] },
          createdAt: { lte: sevenDaysAgo },
        },
      }),
      // Requests by category
      prisma.serviceCategory.findMany({
        select: {
          id: true,
          name: true,
          code: true,
          _count: { select: { requests: true } },
        },
      }),
      // Requests by priority
      prisma.serviceRequest.groupBy({
        by: ['priority'],
        _count: { priority: true },
      }),
      // Needs attention: submitted, urgent, awaiting citizen, or reopened
      prisma.serviceRequest.findMany({
        where: {
          OR: [
            { status: RequestStatus.SUBMITTED },
            { status: RequestStatus.REOPENED },
            { priority: Priority.URGENT, status: { notIn: [RequestStatus.RESOLVED, RequestStatus.CLOSED, RequestStatus.REJECTED] } },
            { createdAt: { lte: sevenDaysAgo }, status: { in: [RequestStatus.UNDER_REVIEW, RequestStatus.IN_PROGRESS] } },
          ],
        },
        take: 8,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        include: {
          category: { select: { name: true, code: true } },
          citizen: { select: { fullName: true, phone: true } },
        },
      }),
      // Feedback aggregate
      prisma.feedback.aggregate({
        _avg: { rating: true },
        _count: { rating: true },
      }),
      // Resolved requests to calculate real average resolution time
      prisma.serviceRequest.findMany({
        where: {
          resolvedAt: { not: null },
        },
        select: {
          createdAt: true,
          resolvedAt: true,
        },
      }),
      // Requests grouped by ward
      prisma.serviceRequest.groupBy({
        by: ['ward'],
        _count: { id: true },
        where: { ward: { not: null } },
      }),
    ]);

    // Calculate real average resolution time in hours
    let avgResolutionHours: number | null = null;
    if (resolvedRequestsWithTimes.length > 0) {
      const totalHours = resolvedRequestsWithTimes.reduce((acc, curr) => {
        if (!curr.resolvedAt) return acc;
        const diffMs = curr.resolvedAt.getTime() - curr.createdAt.getTime();
        return acc + diffMs / (1000 * 60 * 60);
      }, 0);
      avgResolutionHours = Math.round((totalHours / resolvedRequestsWithTimes.length) * 10) / 10;
    }

    res.json({
      success: true,
      data: {
        summary: {
          total,
          submitted,
          underReview,
          inProgress,
          awaitingCitizen,
          onHold,
          resolved,
          closed,
          rejected,
          reopened,
          overdue: overdueCount,
        },
        performance: {
          avgResolutionHours,
          resolvedCount: resolved + closed,
          averageSatisfaction: feedbackStats._avg.rating
            ? Math.round(feedbackStats._avg.rating * 10) / 10
            : null,
          feedbackCount: feedbackStats._count.rating,
        },
        byStatus: [
          { status: 'SUBMITTED', count: submitted, label: 'Submitted' },
          { status: 'UNDER_REVIEW', count: underReview, label: 'Under Review' },
          { status: 'IN_PROGRESS', count: inProgress, label: 'In Progress' },
          { status: 'AWAITING_CITIZEN', count: awaitingCitizen, label: 'Awaiting Citizen' },
          { status: 'ON_HOLD', count: onHold, label: 'On Hold' },
          { status: 'RESOLVED', count: resolved, label: 'Resolved' },
          { status: 'CLOSED', count: closed, label: 'Closed' },
          { status: 'REJECTED', count: rejected, label: 'Rejected' },
          { status: 'REOPENED', count: reopened, label: 'Reopened' },
        ],
        byCategory: categoryCounts.map((cat) => ({
          id: cat.id,
          name: cat.name,
          code: cat.code,
          count: cat._count.requests,
        })),
        byPriority: priorityCounts.map((p) => ({
          priority: p.priority,
          count: p._count.priority,
        })),
        byWard: wardCountsRaw.map((w) => ({
          ward: w.ward || 'Unspecified',
          count: w._count.id,
        })),
        needsAttention,
      },
    });
  } catch (error) {
    next(error);
  }
});


// ADMIN REPORTS

router.get('/reports', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { dateFrom, dateTo, categoryId, status, format } = req.query as Record<string, string>;

    const where: any = {};
    if (status && Object.values(RequestStatus).includes(status as RequestStatus)) {
      where.status = status as RequestStatus;
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const requests = await prisma.serviceRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true, code: true } },
        citizen: { select: { fullName: true, email: true, phone: true } },
        feedback: { select: { rating: true, comments: true } },
      },
    });

    if (format === 'csv') {
      const headers = [
        'Reference Number',
        'Title',
        'Category',
        'Type',
        'Status',
        'Priority',
        'Citizen Name',
        'Location',
        'Ward',
        'Submitted At',
        'Resolved At',
        'Rating',
      ];

      const rows = requests.map((r) => [
        `"${r.referenceNumber}"`,
        `"${r.title.replace(/"/g, '""')}"`,
        `"${r.category.name}"`,
        `"${r.requestType}"`,
        `"${r.status}"`,
        `"${r.priority}"`,
        `"${r.citizen.fullName.replace(/"/g, '""')}"`,
        `"${r.locationName.replace(/"/g, '""')}"`,
        `"${r.ward || ''}"`,
        `"${r.createdAt.toISOString()}"`,
        `"${r.resolvedAt ? r.resolvedAt.toISOString() : ''}"`,
        `"${r.feedback ? r.feedback.rating : ''}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=ecitizen-report-${Date.now()}.csv`);
      res.send(csvContent);
      return;
    }

    res.json({
      success: true,
      data: {
        total: requests.length,
        requests,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
