import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import {
  Search,
  ArrowForward,
  Traffic as Road,
  WaterDrop,
  Waves,
  Delete,
  LocalHospital,
  Lightbulb,
  Park,
  Assignment,
  VerifiedUser,
  Build,
  AccessTime,
  CheckCircle,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { ServiceCategory } from '../../types';

export const ServicesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const location = useLocation();
  const isPortal = location.pathname.startsWith('/portal');

  const { data: categories = [], isLoading } = useQuery<ServiceCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data;
    },
  });

  const getCategoryIcon = (code: string) => {
    switch (code) {
      case 'ROADS': return <Road sx={{ fontSize: 24, color: 'var(--color-teal-medium)' }} />;
      case 'WATER': return <WaterDrop sx={{ fontSize: 24, color: 'var(--color-teal-medium)' }} />;
      case 'DRAINAGE': return <Waves sx={{ fontSize: 24, color: 'var(--color-teal-medium)' }} />;
      case 'WASTE': return <Delete sx={{ fontSize: 24, color: 'var(--color-teal-medium)' }} />;
      case 'HEALTH': return <LocalHospital sx={{ fontSize: 24, color: 'var(--color-teal-medium)' }} />;
      case 'LIGHTING': return <Lightbulb sx={{ fontSize: 24, color: 'var(--color-teal-medium)' }} />;
      case 'PARKS': return <Park sx={{ fontSize: 24, color: 'var(--color-teal-medium)' }} />;
      default: return <Assignment sx={{ fontSize: 24, color: 'var(--color-teal-medium)' }} />;
    }
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: 'var(--color-deep-navy)', minHeight: '100vh' }}>
      {/* 
          TOP HERO SECTION 
       */}
      <Box
        sx={{
          bgcolor: 'var(--color-deep-navy)',
          color: '#FFFFFF',
          pt: { xs: 6, md: 9 },
          pb: { xs: 8, md: 11 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            {/* Left Column: Heading, Subtitle & CTAs */}
            <Grid item xs={12} md={7}>
             
              <Chip
                label="MURANG'A COUNTY MUNICIPAL SERVICE DIRECTORY"
                size="small"
                sx={{
                  bgcolor: 'rgba(77, 182, 172, 0.14)',
                  color: 'var(--color-aqua-soft)',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  mb: 3,
                  border: '1px solid rgba(77, 182, 172, 0.35)',
                  borderRadius: 5,
                  px: 1,
                }}
              />

              {/* Main Headline */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.4rem', md: '3.9rem' },
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.12,
                  letterSpacing: '-0.02em',
                  mb: 2.5,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                The Services <br />
                Behind{' '}
                <Box
                  component="span"
                  sx={{
                    color: 'var(--color-button)',
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 4,
                      left: 0,
                      right: 0,
                      height: 4,
                      bgcolor: 'rgba(172, 15, 7, 0.45)',
                      borderRadius: 2,
                    },
                  }}
                >
                  County
                </Box>{' '}
                <br />
                <Box
                  component="span"
                  sx={{
                    color: 'var(--color-button)',
                  }}
                >
                  Resolution
                </Box>
              </Typography>

              {/* Paragraph Description */}
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.75)',
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  lineHeight: 1.7,
                  maxWidth: 540,
                  mb: 4,
                  fontFamily: "'Open Sans', sans-serif",
                }}
              >
                Murang'a County digital operations directory connects residents directly with
                authorized municipal engineering units. Review departmental portfolios, inspect
                verified standards of service, and initiate prioritized public requests online.
              </Typography>

              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  to={isPortal ? '/portal/new-request' : '/requests/new'}
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'var(--color-button)',
                    color: '#FFFFFF',
                    px: 3.5,
                    py: 1.6,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    borderRadius: 2.5,
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: '0 4px 20px rgba(172, 15, 7, 0.45)',
                    '&:hover': { bgcolor: 'rgb(145, 12, 5)' },
                  }}
                >
                  Request a Service
                </Button>
                <Button
                  component={Link}
                  to={isPortal ? '/portal/track' : '/track'}
                  variant="outlined"
                  size="large"
                  sx={{
                    color: '#FFFFFF',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    px: 3.5,
                    py: 1.6,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    borderRadius: 2.5,
                    fontFamily: "'Poppins', sans-serif",
                    bgcolor: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(8px)',
                    '&:hover': {
                      borderColor: '#FFFFFF',
                      bgcolor: 'rgba(255, 255, 255, 0.12)',
                    },
                  }}
                >
                  Track an Issue
                </Button>
              </Stack>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  bgcolor: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: 4,
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: 'rgba(255, 255, 255, 0.65)',
                    display: 'block',
                    mb: 3,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  SERVICE DELIVERY BENCHMARKS
                </Typography>

                <Stack spacing={2.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.88rem' }}>
                      Standard SLA Resolution
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
                      48 hrs
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.88rem' }}>
                      Municipal Portfolios
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
                      {categories.length > 0 ? categories.length : 8} Sectors
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.88rem' }}>
                      Field Response Units
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
                      24/7 Dispatch
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.88rem' }}>
                      Public SLA Transparency
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--color-aqua-soft)', fontFamily: "'Poppins', sans-serif" }}>
                      99.2%
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

     
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          borderRadius: { xs: '24px 24px 0 0', md: '36px 36px 0 0' },
          pt: { xs: 5, md: 8 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          zIndex: 3,
          boxShadow: '0 -15px 40px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Container maxWidth="lg">
          {/* Section Heading & Subtitle Row */}
          <Grid container spacing={3} alignItems="flex-end" sx={{ mb: 5 }}>
            <Grid item xs={12} md={7}>
              <Typography
                variant="caption"
                sx={{
                  color: 'var(--color-button)',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  display: 'block',
                  mb: 1,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                THE PORTFOLIO PIPELINE
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.9rem', md: '2.5rem' },
                  fontWeight: 800,
                  color: 'var(--color-deep-navy)',
                  letterSpacing: '-0.02em',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                How County Services Operate
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography
                variant="body2"
                sx={{
                  color: '#64748B',
                  lineHeight: 1.7,
                  fontSize: '0.92rem',
                  fontFamily: "'Open Sans', sans-serif",
                }}
              >
                From initial citizen report intake to automated tracking, engineering field inspection,
                and transparent resolution verified by the community.
              </Typography>
            </Grid>
          </Grid>

          {/* Search Filter Bar */}
          <Paper
            elevation={0}
            sx={{
              p: '4px 16px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 3,
              border: '1px solid var(--color-border-light)',
              bgcolor: '#F8FAFC',
              mb: 5,
              transition: 'border-color 0.2s ease',
              '&:focus-within': {
                borderColor: 'var(--color-teal-medium)',
                bgcolor: '#FFFFFF',
              },
            }}
          >
            <Search sx={{ color: 'var(--color-teal-medium)', mr: 1.5 }} />
            <TextField
              variant="standard"
              placeholder="Search county service by keyword (e.g. roads, clean water, drainage, streetlight, health)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: '0.95rem', py: 1.2, fontFamily: "'Open Sans', sans-serif" },
              }}
            />
            {search && (
              <Button size="small" onClick={() => setSearch('')} sx={{ color: '#94A3B8', textTransform: 'none' }}>
                Clear
              </Button>
            )}
          </Paper>

          {/* Numbered Service List Items*/}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress sx={{ color: 'var(--color-teal-medium)' }} />
            </Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: '#64748B', fontWeight: 600 }}>
                No county services match "{search}"
              </Typography>
              <Button onClick={() => setSearch('')} sx={{ mt: 1, color: 'var(--color-teal-dark)', fontWeight: 700 }}>
                View All Services
              </Button>
            </Box>
          ) : (
            <Box sx={{ borderTop: '1px solid var(--color-border-light)' }}>
              {filtered.map((cat, index) => {
                const stepNumber = String(index + 1).padStart(2, '0');
                return (
                  <Box
                    key={cat.id}
                    sx={{
                      py: { xs: 3.5, md: 4.5 },
                      borderBottom: '1px solid var(--color-border-light)',
                      transition: 'background-color 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(240, 255, 250, 0.4)',
                      },
                    }}
                  >
                    <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">
                   
                      <Grid item xs={3} sm={2} md={1.5}>
                        <Typography
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: '2.5rem', sm: '3.2rem', md: '3.8rem' },
                            fontWeight: 800,
                            lineHeight: 1,
                            color: 'transparent',
                            WebkitTextStroke: '1.8px #ff758f',
                            userSelect: 'none',
                          }}
                        >
                          {stepNumber}
                        </Typography>
                      </Grid>

                      {/*  Service Title, Description & Badges */}
                      <Grid item xs={9} sm={6.5} md={7.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.8, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getCategoryIcon(cat.code)}
                          </Box>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 800,
                              color: 'var(--color-deep-navy)',
                              fontSize: { xs: '1.2rem', md: '1.38rem' },
                              letterSpacing: '-0.01em',
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            {cat.name}
                          </Typography>
                          <Chip
                            label={cat.code}
                            size="small"
                            sx={{
                              bgcolor: 'var(--color-aqua-translucent)',
                              color: 'var(--color-teal-dark)',
                              fontWeight: 800,
                              fontSize: '0.68rem',
                              height: 22,
                              border: '1px solid rgba(77, 182, 172, 0.3)',
                            }}
                          />
                        </Box>

                        <Typography
                          variant="body1"
                          sx={{
                            color: '#475569',
                            fontSize: { xs: '0.88rem', md: '0.94rem' },
                            lineHeight: 1.65,
                            fontFamily: "'Open Sans', sans-serif",
                          }}
                        >
                          {cat.description}
                        </Typography>
                      </Grid>

                      {/* Action Button */}
                      <Grid item xs={12} sm={3.5} md={3} sx={{ textAlign: { sm: 'right' } }}>
                        <Button
                          component={Link}
                          to={
                            isPortal
                              ? `/portal/new-request?category=${cat.id}`
                              : `/requests/new?category=${cat.id}`
                          }
                          variant="contained"
                          endIcon={<ArrowForward />}
                          sx={{
                            bgcolor: 'var(--color-teal-dark)',
                            color: '#FFFFFF',
                            fontWeight: 700,
                            fontSize: '0.84rem',
                            fontFamily: "'Poppins', sans-serif",
                            py: 1.2,
                            px: 2.5,
                            borderRadius: 2.5,
                            textTransform: 'none',
                            boxShadow: '0 2px 10px rgba(0, 105, 92, 0.25)',
                            '&:hover': {
                              bgcolor: 'var(--color-teal-medium)',
                              boxShadow: '0 4px 14px rgba(0, 150, 136, 0.35)',
                            },
                          }}
                        >
                          Submit Request
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default ServicesPage;
