import { RequestStatus } from '@prisma/client';

export const VALID_STATUS_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  SUBMITTED: [
    RequestStatus.UNDER_REVIEW,
    RequestStatus.IN_PROGRESS,
    RequestStatus.AWAITING_CITIZEN,
    RequestStatus.ON_HOLD,
    RequestStatus.REJECTED,
    RequestStatus.RESOLVED,
  ],
  UNDER_REVIEW: [
    RequestStatus.IN_PROGRESS,
    RequestStatus.AWAITING_CITIZEN,
    RequestStatus.ON_HOLD,
    RequestStatus.REJECTED,
    RequestStatus.RESOLVED,
  ],
  IN_PROGRESS: [
    RequestStatus.AWAITING_CITIZEN,
    RequestStatus.ON_HOLD,
    RequestStatus.RESOLVED,
    RequestStatus.REJECTED,
  ],
  AWAITING_CITIZEN: [
    RequestStatus.IN_PROGRESS,
    RequestStatus.UNDER_REVIEW,
    RequestStatus.ON_HOLD,
    RequestStatus.REJECTED,
    RequestStatus.RESOLVED,
    RequestStatus.CLOSED,
  ],
  ON_HOLD: [
    RequestStatus.UNDER_REVIEW,
    RequestStatus.IN_PROGRESS,
    RequestStatus.REJECTED,
    RequestStatus.RESOLVED,
  ],
  RESOLVED: [
    RequestStatus.CLOSED,
    RequestStatus.REOPENED,
  ],
  REOPENED: [
    RequestStatus.UNDER_REVIEW,
    RequestStatus.IN_PROGRESS,
    RequestStatus.RESOLVED,
    RequestStatus.CLOSED,
  ],
  CLOSED: [
    RequestStatus.REOPENED,
  ],
  REJECTED: [
    RequestStatus.REOPENED,
  ],
};

export function isValidTransition(fromStatus: RequestStatus, toStatus: RequestStatus): boolean {
  if (fromStatus === toStatus) return false;
  const allowed = VALID_STATUS_TRANSITIONS[fromStatus];
  return Boolean(allowed && allowed.includes(toStatus));
}
