import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Button,
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Place, FilterList } from '@mui/icons-material';
import { StatusChip } from './StatusChip';

interface MapIssue {
  id: string;
  referenceNumber: string;
  title: string;
  requestType: string;
  status: any;
  priority: any;
  locationName: string;
  ward?: string | null;
  latitude: number;
  longitude: number;
  createdAt: string;
  category: {
    name: string;
    code: string;
    icon?: string | null;
  };
}

interface PublicIssuesMapProps {
  issues: MapIssue[];
  height?: string | number;
}

export const PublicIssuesMap: React.FC<PublicIssuesMapProps> = ({
  issues,
  height = 420,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const defaultCenter: [number, number] = [-0.7210, 37.1520];

  const filteredIssues =
    selectedCategory === 'ALL'
      ? issues
      : issues.filter((i) => i.category.code === selectedCategory);

  const categories = Array.from(
    new Set(issues.map((i) => JSON.stringify({ code: i.category.code, name: i.category.name })))
  ).map((s) => JSON.parse(s));

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* Category filter bar */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList sx={{ color: '#0F8B8D', fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
            Filter by Category:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{ bgcolor: '#fff', fontSize: '0.85rem' }}
            >
              <MenuItem value="ALL">All Categories ({issues.length})</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.code} value={c.code}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Typography variant="caption" sx={{ color: '#64748B' }}>
          Displaying {filteredIssues.length} active county issues with verified GPS coordinates.
        </Typography>
      </Box>

      {/* Map surface */}
      <Box
        sx={{
          height,
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid #CBD5E1',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredIssues.map((issue) => (
            <Marker key={issue.id} position={[issue.latitude, issue.longitude]}>
              <Popup>
                <Box sx={{ p: 0.5, minWidth: 200 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                    <StatusChip status={issue.status} size="small" />
                    <Chip label={issue.category.name} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#12304A', mb: 0.5 }}>
                    {issue.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.8 }}>
                    <Place fontSize="inherit" /> {issue.locationName} {issue.ward ? `(${issue.ward})` : ''}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block' }}>
                    Reference: <strong>{issue.referenceNumber}</strong>
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
};
