import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Chip, Tooltip } from '@mui/material';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MyLocation, Place, Navigation, ContentCopy } from '@mui/icons-material';

// Fix default leaflet marker icon issue in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
  height?: string | number;
  wardHint?: string;
}

// Sub-component to capture map click events
const MapClickHandler: React.FC<{ onPick: (lat: number, lng: number) => void }> = ({ onPick }) => {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Sub-component to smoothly fly/pan when coordinates update
const MapFlyToHandler: React.FC<{ lat: number | null; lng: number | null }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat !== null && lng !== null) {
      map.flyTo([lat, lng], 15, { animate: true, duration: 1 });
    }
  }, [lat, lng, map]);
  return null;
};

export const LocationPickerMap: React.FC<LocationPickerProps> = ({
  latitude,
  longitude,
  onChange,
  height = 340,
  wardHint,
}) => {
  // Default Murang'a County Coordinates
  const defaultCenter: [number, number] = [-0.7210, 37.1520];
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const currentCenter: [number, number] =
    latitude !== null && longitude !== null ? [latitude, longitude] : defaultCenter;

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        onChange(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLocating(false);
        setGeoError('Could not retrieve current location. Please tap directly on the map to pinpoint.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleCopyCoords = () => {
    if (latitude && longitude) {
      navigator.clipboard.writeText(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="body2" sx={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Place sx={{ fontSize: 18, color: '#0F8B8D' }} /> Tap on the map or use GPS to trace the issue's physical locus.
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<MyLocation fontSize="small" />}
          onClick={handleUseMyLocation}
          disabled={locating}
          sx={{
            fontSize: '0.78rem',
            borderColor: '#CBD5E1',
            color: '#12304A',
            bgcolor: '#FFFFFF',
            fontWeight: 600,
            '&:hover': { bgcolor: '#F8FAFC' },
          }}
        >
          {locating ? 'Locating...' : 'Use My GPS'}
        </Button>
      </Box>

      {geoError && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
          {geoError}
        </Typography>
      )}

      <Box
        sx={{
          height,
          width: '100%',
          borderRadius: 2.5,
          overflow: 'hidden',
          border: '1px solid #CBD5E1',
          position: 'relative',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <MapContainer
          center={currentCenter}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onPick={onChange} />
          <MapFlyToHandler lat={latitude} lng={longitude} />

          {latitude !== null && longitude !== null && (
            <>
              <Marker position={[latitude, longitude]} />
              <Circle
                center={[latitude, longitude]}
                radius={80}
                pathOptions={{ color: '#0F8B8D', fillColor: '#0F8B8D', fillOpacity: 0.15 }}
              />
            </>
          )}
        </MapContainer>
      </Box>

      {latitude !== null && longitude !== null ? (
        <Paper
          elevation={0}
          sx={{
            mt: 1.5,
            p: 1.5,
            bgcolor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label="PINNED LOCUS"
              size="small"
              sx={{ bgcolor: '#0F8B8D', color: '#fff', fontWeight: 800, fontSize: '0.65rem' }}
            />
            <Typography variant="body2" sx={{ color: '#1E293B', fontWeight: 700 }}>
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </Typography>
            <Tooltip title={copied ? 'Copied!' : 'Copy Coordinates'}>
              <Button size="small" onClick={handleCopyCoords} sx={{ minWidth: 28, p: 0.5 }}>
                <ContentCopy fontSize="small" sx={{ color: copied ? '#238636' : '#64748B' }} />
              </Button>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<Navigation fontSize="small" />}
              href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
              target="_blank"
              rel="noreferrer"
              sx={{ fontSize: '0.75rem', textTransform: 'none', color: '#0F8B8D', fontWeight: 600 }}
            >
              Trace Directions
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => onChange(null as any, null as any)}
              sx={{ fontSize: '0.75rem', textTransform: 'none' }}
            >
              Clear Pin
            </Button>
          </Box>
        </Paper>
      ) : (
        wardHint && (
          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 1 }}>
            Selected Area: <strong>{wardHint}</strong>. Click anywhere on the map to place an accurate GPS pin.
          </Typography>
        )
      )}
    </Box>
  );
};
