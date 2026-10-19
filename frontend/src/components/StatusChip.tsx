import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { RequestStatus } from '../types';

interface StatusChipProps {
  status: RequestStatus;
  size?: 'small' | 'medium';
}

const statusConfig: Record<
  RequestStatus,
  { label: string; color: ChipProps['color']; bgcolor: string; textColor: string }
> = {
  SUBMITTED: {
    label: 'Submitted',
    color: 'default',
    bgcolor: '#E2E8F0',
    textColor: '#334155',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: 'info',
    bgcolor: '#E0F2FE',
    textColor: '#0369A1',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'primary',
    bgcolor: '#E0F2FE',
    textColor: '#0F8B8D',
  },
  AWAITING_CITIZEN: {
    label: 'Awaiting Citizen Info',
    color: 'warning',
    bgcolor: '#FEF3C7',
    textColor: '#B45309',
  },
  ON_HOLD: {
    label: 'On Hold',
    color: 'default',
    bgcolor: '#F3F4F6',
    textColor: '#4B5563',
  },
  RESOLVED: {
    label: 'Resolved',
    color: 'success',
    bgcolor: '#DCFCE7',
    textColor: '#15803D',
  },
  CLOSED: {
    label: 'Closed',
    color: 'default',
    bgcolor: '#E2E8F0',
    textColor: '#475569',
  },
  REJECTED: {
    label: 'Rejected',
    color: 'error',
    bgcolor: '#FEE2E2',
    textColor: '#B91C1C',
  },
  REOPENED: {
    label: 'Reopened',
    color: 'warning',
    bgcolor: '#FFEDD5',
    textColor: '#C2410C',
  },
};

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'small' }) => {
  const config = statusConfig[status] || {
    label: status,
    bgcolor: '#E2E8F0',
    textColor: '#334155',
  };

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        bgcolor: config.bgcolor,
        color: config.textColor,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.85rem',
        borderRadius: '6px',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
    />
  );
};
