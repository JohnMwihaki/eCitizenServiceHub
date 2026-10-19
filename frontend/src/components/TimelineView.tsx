import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import {
  CheckCircle,
  Schedule,
  Info,
  Build,
  HighlightOff,
  Replay,
  PauseCircle,
  ChatBubbleOutline,
  AssignmentTurnedIn,
} from '@mui/icons-material';
import { RequestStatusHistory, RequestUpdate, RequestStatus } from '../types';
import { StatusChip } from './StatusChip';

interface TimelineItem {
  id: string;
  type: 'STATUS' | 'UPDATE';
  date: Date;
  title: string;
  subtitle?: string | null;
  authorName?: string;
  authorRole?: string;
  status?: RequestStatus;
  isInternal?: boolean;
}

interface TimelineViewProps {
  statusHistory?: RequestStatusHistory[];
  updates?: RequestUpdate[];
  isAdminView?: boolean;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  statusHistory = [],
  updates = [],
  isAdminView = false,
}) => {
 
  const items: TimelineItem[] = [
    ...statusHistory.map((h) => ({
      id: `sh-${h.id}`,
      type: 'STATUS' as const,
      date: new Date(h.createdAt),
      title: h.reason || `Status updated to ${h.toStatus.replace('_', ' ')}`,
      subtitle: h.notes,
      authorName: h.changedBy?.fullName || 'System',
      authorRole: h.changedBy?.role || 'SYSTEM',
      status: h.toStatus,
    })),
    ...updates.map((u) => ({
      id: `up-${u.id}`,
      type: 'UPDATE' as const,
      date: new Date(u.createdAt),
      title: u.message,
      authorName: u.author?.fullName || 'User',
      authorRole: u.author?.role || 'CITIZEN',
      isInternal: u.isInternal,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()); // newest first

  const getStatusIcon = (status?: RequestStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return <Schedule sx={{ color: '#64748B' }} />;
      case 'UNDER_REVIEW':
        return <Info sx={{ color: '#0284C7' }} />;
      case 'IN_PROGRESS':
        return <Build sx={{ color: '#0F8B8D' }} />;
      case 'AWAITING_CITIZEN':
        return <PauseCircle sx={{ color: '#D97706' }} />;
      case 'ON_HOLD':
        return <PauseCircle sx={{ color: '#64748B' }} />;
      case 'RESOLVED':
        return <CheckCircle sx={{ color: '#238636' }} />;
      case 'CLOSED':
        return <AssignmentTurnedIn sx={{ color: '#334155' }} />;
      case 'REJECTED':
        return <HighlightOff sx={{ color: '#C62828' }} />;
      case 'REOPENED':
        return <Replay sx={{ color: '#D97706' }} />;
      default:
        return <ChatBubbleOutline sx={{ color: '#0F8B8D' }} />;
    }
  };

  if (items.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', color: '#94A3B8' }}>
        <Typography variant="body2">No timeline activity recorded yet.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', pl: 3, '&::before': { content: '""', position: 'absolute', top: 12, bottom: 12, left: 11, width: 2, bgcolor: '#E2E8F0' } }}>
      {items.map((item) => (
        <Box key={item.id} sx={{ position: 'relative', mb: 3 }}>
          {/* Timeline Dot */}
          <Box
            sx={{
              position: 'absolute',
              left: -32,
              top: 2,
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: '#FFFFFF',
              border: '2px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
            }}
          >
            {item.type === 'STATUS' ? getStatusIcon(item.status) : <ChatBubbleOutline sx={{ fontSize: 14, color: item.isInternal ? '#D97706' : '#0F8B8D' }} />}
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: item.isInternal ? '#FDE68A' : '#E2E8F0',
              bgcolor: item.isInternal ? '#FFFBEB' : '#FFFFFF',
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 0.8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {item.status && <StatusChip status={item.status} size="small" />}
                {item.isInternal && (
                  <Chip
                    label="INTERNAL ADMIN NOTE (PRIVATE)"
                    size="small"
                    sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 800, fontSize: '0.65rem', height: 20 }}
                  />
                )}
                {item.type === 'UPDATE' && !item.isInternal && (
                  <Chip
                    label={item.authorRole === 'ADMIN' ? 'COUNTY UPDATE' : 'CITIZEN RESPONSE'}
                    size="small"
                    sx={{
                      bgcolor: item.authorRole === 'ADMIN' ? '#E0F2FE' : '#F1F5F9',
                      color: item.authorRole === 'ADMIN' ? '#0369A1' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      height: 20,
                    }}
                  />
                )}
              </Box>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                {item.date.toLocaleDateString()} at {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 500, color: '#1E293B', whiteSpace: 'pre-line' }}>
              {item.title}
            </Typography>

            {item.subtitle && (
              <Typography variant="caption" sx={{ display: 'block', mt: 0.8, color: '#64748B', fontStyle: 'italic' }}>
                Note: {item.subtitle}
              </Typography>
            )}

            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Recorded by: <span style={{ fontWeight: 600, color: '#475569' }}>{item.authorName}</span>
                {item.authorRole && ` (${item.authorRole})`}
              </Typography>
            </Box>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};
