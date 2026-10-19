import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink, Divider, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { Phone, Email, LocationOn, VerifiedUser, Security } from '@mui/icons-material';
import logoImg from '../asssets/logo.png';

export const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'var(--color-deep-navy)', color: '#F1F5F9', pt: 6, pb: 4, mt: 'auto', borderTop: '3px solid var(--color-teal-medium)' }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* County Identity */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                component="img"
                src={logoImg}
                alt="eCitizen Logo"
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '8px',
                  objectFit: 'contain',
                  mr: 1.5,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                eCitizen<span style={{ color: 'var(--color-aqua-soft)' }}>Hub</span>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2, lineHeight: 1.6 }}>
              A transparent, secure digital gateway enabling Murang'a County residents to discover county services, report community infrastructure issues, and track resolutions directly from home.
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <VerifiedUser sx={{ color: '#0F8B8D', fontSize: 18 }} />
              <Typography variant="caption" sx={{ color: '#CBD5E1', fontWeight: 600 }}>
                Official Murang'a County Digital Services Platform
              </Typography>
            </Stack>
          </Grid>

          {/* Quick Navigation */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Services
            </Typography>
            <Stack spacing={1}>
              <MuiLink component={Link} to="/services" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#0F8B8D' } }}>
                Service Directory
              </MuiLink>
              <MuiLink component={Link} to="/requests/new" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#0F8B8D' } }}>
                Report an Issue
              </MuiLink>
              <MuiLink component={Link} to="/track" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#0F8B8D' } }}>
                Track a Request
              </MuiLink>
              <MuiLink component={Link} to="/about" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#0F8B8D' } }}>
                About County & Charter
              </MuiLink>
            </Stack>
          </Grid>

          {/* Help & Compliance */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Help & Support
            </Typography>
            <Stack spacing={1}>
              <MuiLink component={Link} to="/help" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#0F8B8D' } }}>
                FAQs & Guidelines
              </MuiLink>
              <MuiLink component={Link} to="/help" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#0F8B8D' } }}>
                Request Statuses
              </MuiLink>
              <MuiLink component={Link} to="/about" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#0F8B8D' } }}>
                Citizen Privacy Policy
              </MuiLink>
              <MuiLink component={Link} to="/admin/login" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#0F8B8D' } }}>
                Administrator Portal
              </MuiLink>
            </Stack>
          </Grid>

          {/* Contact Details */}
          <Grid item xs={12} sm={4} md={4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              County Headquarters
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationOn sx={{ color: '#0F8B8D', fontSize: 20, mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Murang'a County Headquarters, P.O. Box 52-10200 Murang'a
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Phone sx={{ color: '#0F8B8D', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                   Hotline: +254 700 000 000
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Email sx={{ color: '#0F8B8D', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  services@muranga.go.ke
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            &copy; {new Date().getFullYear()} Murang'a County Government. All rights reserved. Built for citizen empowerment.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Security fontSize="inherit" /> SSL Encrypted & Data Protected
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
