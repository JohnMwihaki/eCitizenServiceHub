export type Role = 'CITIZEN' | 'ADMIN';

export type RequestStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'IN_PROGRESS'
  | 'AWAITING_CITIZEN'
  | 'ON_HOLD'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REJECTED'
  | 'REOPENED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type RequestType = 'SERVICE_REQUEST' | 'COMMUNITY_ISSUE';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  nationalId?: string | null;
  role: Role;
  isActive?: boolean;
  createdAt?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  icon?: string | null;
  isActive: boolean;
  _count?: {
    requests?: number;
  };
}

export interface RequestAttachment {
  id: string;
  requestId: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedById: string;
  createdAt: string;
}

export interface RequestStatusHistory {
  id: string;
  requestId: string;
  fromStatus: RequestStatus | null;
  toStatus: RequestStatus;
  changedById: string;
  reason?: string | null;
  notes?: string | null;
  createdAt: string;
  changedBy?: {
    id: string;
    fullName: string;
    role: Role;
  };
}

export interface RequestUpdate {
  id: string;
  requestId: string;
  authorId: string;
  message: string;
  isInternal: boolean;
  createdAt: string;
  author?: {
    id: string;
    fullName: string;
    role: Role;
  };
}

export interface Feedback {
  id: string;
  requestId: string;
  citizenId: string;
  rating: number;
  comments?: string | null;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  requestType: RequestType;
  status: RequestStatus;
  priority: Priority;
  categoryId: string;
  citizenId: string;
  locationName: string;
  ward?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  rejectionReason?: string | null;
  onHoldReason?: string | null;
  resolutionDetails?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  category: ServiceCategory;
  citizen?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
  };
  attachments?: RequestAttachment[];
  statusHistory?: RequestStatusHistory[];
  updates?: RequestUpdate[];
  feedback?: Feedback | null;
  _count?: {
    updates?: number;
    attachments?: number;
  };
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  relatedRequestId?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  summary?: string | null;
  priority: Priority;
  category?: string | null;
  isPublished: boolean;
  publishedAt?: string | null;
  authorId?: string;
  createdAt: string;
  author?: {
    fullName: string;
    email: string;
  };
}

export interface CitizenDashboardStats {
  stats: {
    total: number;
    awaitingReview: number;
    inProgress: number;
    resolved: number;
    awaitingCitizen: number;
    rejected?: number;
  };
  recentRequests: ServiceRequest[];
  recentNotifications: NotificationItem[];
}

export interface AdminDashboardData {
  summary: {
    total: number;
    submitted: number;
    underReview: number;
    inProgress: number;
    awaitingCitizen: number;
    onHold: number;
    resolved: number;
    closed: number;
    rejected: number;
    reopened: number;
    overdue: number;
  };
  performance: {
    avgResolutionHours: number | null;
    resolvedCount: number;
    averageSatisfaction: number | null;
    feedbackCount: number;
  };
  byStatus: { status: RequestStatus; count: number; label: string }[];
  byCategory: { id: string; name: string; code: string; count: number }[];
  byPriority: { priority: Priority; count: number }[];
  byWard: { ward: string; count: number }[];
  needsAttention: ServiceRequest[];
}
