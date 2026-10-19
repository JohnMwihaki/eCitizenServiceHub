import React from 'react';
import { Chip } from '@mui/material';
import { Priority } from '../types';

interface PriorityChipProps {
  priority: Priority;
  size?: 'small' | 'medium';
}

const priorityConfig: Record<Priority, { label: string; bgcolor: string; textColor: string }> = {
  LOW: {
    label: 'Low',
    bgcolor: '#F1F5F9',
    textColor: '#475569',
  },
  MEDIUM: {
    label: 'Medium',
    bgcolor: '#E0F2FE',
    textColor: '#0284C7',
  },
  HIGH: {
    label: 'High',
    bgcolor: '#FEF3C7',
    textColor: '#D97706',
  },
  URGENT: {
    label: 'Urgent',
    bgcolor: '#FEE2E2',
    textColor: '#DC2626',
  },
};

export const PriorityChip: React.FC<PriorityChipProps> = ({ priority, size = 'small' }) => {
  const config = priorityConfig[priority] || priorityConfig.MEDIUM;

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        bgcolor: config.bgcolor,
        color: config.textColor,
        fontWeight: 700,
        fontSize: size === 'small' ? '0.72rem' : '0.82rem',
        borderRadius: '6px',
        border: '1px solid rgba(0,0,0,0.08)',
      }}
    />
  );
};
