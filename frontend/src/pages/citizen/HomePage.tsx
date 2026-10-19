import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  AddCircleOutline,
  Search,
  CheckCircle,
  ExpandMore,
  ArrowForward,
  Speed,
  ThumbUp,
  Security,
  AccessibilityNew,
  Traffic as Road,
  WaterDrop,
  Waves,
  Delete,
  LocalHospital,
  Lightbulb,
  Park,
  Assignment,
  VerifiedUser,
  OpenInNew,
  Phone,
  Email,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { ServiceCategory } from '../../types';
import { PublicIssuesMap } from '../../components/PublicIssuesMap';

// Rotating Hero Background Images from assets
import healthFacImg from '../../asssets/healthfac.jpg';
import repairWaterImg from '../../asssets/rapairwater.jpg';
import roadConImg from '../../asssets/roadcon.jpg';
import sewageImg from '../../asssets/sewagetreatment.jpg';
import streetlightImg from '../../asssets/streetlight.jpg';

const heroSlides = [
  {
    image: roadConImg,
    tag: 'ROADS & TRANSPORT INFRASTRUCTURE',
    title: 'County Road Grading & Resurfacing',
    desc: 'Rapid reporting and scheduled grading for community roadways and potholes.',
  },
  {
    image: repairWaterImg,
    tag: 'WATER & PIPELINE NETWORK',
    title: 'Clean Municipal Water Supply & Pipe Repairs',
    desc: 'Prompt dispatch for municipal water pipe fractures, low pressure, and clean supply restoration.',
  },
  {
    image: streetlightImg,
    tag: 'PUBLIC LIGHTING & SAFETY',
    title: 'Solar & Grid Streetlight Infrastructure',
    desc: 'Ensuring neighborhood avenues and markets remain brightly illuminated and secure at night.',
  },
  {
    image: sewageImg,
    tag: 'DRAINAGE & WASTEWATER',
    title: 'Stormwater Culverts & Drainage Systems',
    desc: 'Unblocking stormwater culverts to prevent localized flooding of residential compounds.',
  },
  {
    image: healthFacImg,
    tag: 'PUBLIC HEALTH & CLINICS',
    title: 'Community Health Amenities & Sanitation',
    desc: 'Maintaining clean, accessible county clinics and hygienic public environments for all residents.',
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Fetch Categories
  const { data: categories = [], isLoading: catLoading } = useQuery<ServiceCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data;
    },
  });

  // Fetch Verified Public Map Issues
  const { data: publicIssues = [] } = useQuery({
    queryKey: ['publicMapIssues'],
    queryFn: async () => {
      const res = await api.get('/requests/public-map');
      return res.data.data;
    },
  });

  // Fetch Verified County Metrics 
  const { data: countyStats } = useQuery({
    queryKey: ['publicStats'],
    queryFn: async () => {
      const res = await api.get('/requests/public-stats');
      return res.data.data;
    },
  });

  const getCategoryIcon = (code: string) => {
    switch (code) {
      case 'ROADS': return <Road sx={{ fontSize: 32, color: '#009688' }} />;
      case 'WATER': return <WaterDrop sx={{ fontSize: 32, color: '#009688' }} />;
      case 'DRAINAGE': return <Waves sx={{ fontSize: 32, color: '#009688' }} />;
      case 'WASTE': return <Delete sx={{ fontSize: 32, color: '#009688' }} />;
      case 'HEALTH': return <LocalHospital sx={{ fontSize: 32, color: '#009688' }} />;
      case 'LIGHTING': return <Lightbulb sx={{ fontSize: 32, color: '#009688' }} />;
      case 'PARKS': return <Park sx={{ fontSize: 32, color: '#009688' }} />;
      default: return <Assignment sx={{ fontSize: 32, color: '#009688' }} />;
    }
  };

  // FAQs Directory List
  const faqs = [
    {
      q: 'How do I submit a report or service request?',
      a: 'Click "Report an Issue" or "Start Request", select your municipal service department, describe the situation, and optionally pinpoint your location or attach photos. Once submitted, our system automatically generates a unique reference number (e.g. CSR-2026-0042) for end-to-end audit tracking.',
      links: [
        { label: 'Submit an Issue Report', url: '/requests/new' },
        { label: 'Explore County Service Categories', url: '/services' },
      ],
    },
    {
      q: 'Can I track my request without visiting county offices?',
      a: 'Yes, completely online! Simply use the "Track Request" page and enter your reference number, or log into your Citizen Portal to view real-time stage updates, administrative progress notes, and verified field completion notifications.',
      links: [
        { label: 'Track by Reference Number', url: '/track' },
        { label: 'Login to Citizen Portal', url: '/login' },
      ],
    },
    {
      q: 'What happens if an administrator asks for additional information?',
      a: 'If field conditions require more details, the administrator will shift the request to "Awaiting Citizen Info". You will receive an in-app alert, and a dedicated response box will appear directly on your request detail page where you can upload photos or clarify the site location.',
      links: [
        { label: 'Review My Citizen Dashboard', url: '/dashboard' },
      ],
    },
    {
      q: 'Is my personal identity and private address protected on public maps?',
      a: 'Yes, privacy is guaranteed. The public transparency map only plots broad issue categories (e.g., Road Repair, Water Leak) and general neighborhood landmarks. Your personal identity, phone number, national ID, and private contacts are strictly restricted to authorized county administrators.',
      links: [
        { label: 'View Public Issues Map', url: '#public-map' },
        { label: 'County Privacy & Data Standards', url: '/about' },
      ],
    },
    {
      q: 'How do I know when the county has resolved my issue?',
      a: 'When repair work is finished, the administrator marks the request as RESOLVED and records the specific actions taken. A green resolution banner displays on your portal, and you are prompted to rate your satisfaction or dispute the resolution if problems persist.',
      links: [
        { label: 'County Service Level Commitments', url: '/about' },
      ],
    },
    {
      q: 'Can I dispute or reopen a request if the problem was not fixed properly?',
      a: 'Yes. Every resolved request includes a "Dispute / Reopen Request" action. If a pothole resurfacing was incomplete or a water supply issue recurred, you can submit evidence to return the request to active administrative review.',
      links: [
        { label: 'Learn About the Service Charter', url: '/about' },
      ],
    },
  ];

  
  const marqueeCategories = [...categories, ...categories, ...categories, ...categories];

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh', overflowX: 'hidden' }}>
      {/*  HERO SECTION  */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 680, md: 740 },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          color: '#FFFFFF',
        }}
      >
        {/* Rotating Background Image Layers */}
        {heroSlides.map((slide, idx) => (
          <Box
            key={idx}
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: idx === currentSlide ? 1 : 0,
              transform: idx === currentSlide ? 'scale(1.04)' : 'scale(1)',
              transition: 'opacity 1.4s ease-in-out, transform 8s ease-out',
              zIndex: 0,
            }}
          />
        ))}

        {/* Multi-Stop Gradient Dark Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(53, 50, 50, 0.4), rgba(0, 0, 0, 0.4));',
            zIndex: 1,
          }}
        />

        {/* Bottom subtle */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            background: 'linear-gradient(to top, rgba(18, 34, 66, 0.95), transparent)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 8, md: 12 } }}>
          <Grid container spacing={4} alignItems="center">
            {/* Left Column: Overlay Text & CTAs */}
            <Grid item xs={12} md={7.5}>
              <Chip
                icon={<VerifiedUser sx={{ color: '#4db6ac !important', fontSize: 16 }} />}
                label={heroSlides[currentSlide].tag}
                size="small"
                sx={{
                  bgcolor: 'rgba(77, 182, 172, 0.18)',
                  color: '#4db6ac',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  mb: 3,
                  border: '1px solid rgba(77, 182, 172, 0.35)',
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.4rem', sm: '3.4rem', md: '3.9rem' },
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.15,
                  mb: 2.5,
                  letterSpacing: '-0.02em',
                  fontFamily: 'var(--primary-font)',
                }}
              >
                Your County. <br />
                <span style={{ color: '#4db6ac' }}>Your Services.</span> Your Voice.
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: '#E2E8F0',
                  fontSize: { xs: '1rem', md: '1.18rem' },
                  fontWeight: 400,
                  lineHeight: 1.65,
                  maxWidth: 620,
                  mb: 4,
                  fontFamily:  "'Dancing Script', cursive",
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                Report infrastructure issues, request municipal county services, and follow each step from inspection to verified resolution transparently online.
              </Typography>

              {/* Primary Call to Actions */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <Button
                  component={Link}
                  to="/requests/new"
                  variant="contained"
                  size="large"
                  startIcon={<AddCircleOutline />}
                  sx={{
                    bgcolor: '#009688',
                    color: '#fff',
                    py: 1.6,
                    px: 3.5,
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: 2.5,
                    boxShadow: '0 4px 20px rgba(0, 150, 136, 0.45)',
                    '&:hover': { bgcolor: '#00695c' },
                  }}
                >
                  Report an Issue
                </Button>
                <Button
                  component={Link}
                  to="/services"
                  variant="outlined"
                  size="large"
                  sx={{
                    color: '#FFFFFF',
                    borderColor: 'rgba(255,255,255,0.4)',
                    py: 1.6,
                    px: 3.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2.5,
                    backdropFilter: 'blur(8px)',
                    bgcolor: 'rgba(255,255,255,0.06)',
                    '&:hover': {
                      borderColor: '#FFFFFF',
                      bgcolor: 'rgba(255,255,255,0.15)',
                    },
                  }}
                >
                  Request a Service
                </Button>
                <Button
                  component={Link}
                  to="/track"
                  variant="text"
                  size="large"
                  startIcon={<Search />}
                  sx={{
                    color: '#E2E8F0',
                    py: 1.6,
                    px: 2,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    '&:hover': { color: '#FFFFFF' },
                  }}
                >
                  Track a Request
                </Button>
              </Stack>

              {/* Slide Indicator Bar & Current Focus */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                {heroSlides.map((_, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    sx={{
                      width: idx === currentSlide ? 36 : 10,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: idx === currentSlide ? '#4db6ac' : 'rgba(255, 255, 255, 0.35)',
                      cursor: 'pointer',
                      transition: 'all 0.35s ease',
                      boxShadow: idx === currentSlide ? '0 0 10px #4db6ac' : 'none',
                      '&:hover': { bgcolor: '#80cbc4' },
                    }}
                  />
                ))}
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', pl: 1, fontWeight: 500, fontFamily: "'Open Sans', sans-serif" }}>
                  Active Focus: {heroSlides[currentSlide].title}
                </Typography>
              </Stack>
            </Grid>

            {/* Right Column: Floating Verification Card */}
            <Grid item xs={12} md={4.5}>
              <Paper
                elevation={0}
                className="floating-card"
                sx={{
                  bgcolor: 'rgba(18, 34, 66, 0.72)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  borderRadius: 4,
                  p: { xs: 3, md: 3.5 },
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45), 0 0 35px rgba(0, 150, 136, 0.2)',
                  position: 'relative',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                  <Chip
                    icon={<VerifiedUser sx={{ color: '#4db6ac !important', fontSize: 16 }} />}
                    label="VERIFIED OPERATIONS"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(77, 182, 172, 0.15)',
                      color: '#4db6ac',
                      fontWeight: 800,
                      fontSize: '0.72rem',
                      letterSpacing: '0.05em',
                      border: '1px solid rgba(77, 182, 172, 0.3)',
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#238636',
                        boxShadow: '0 0 8px #238636',
                      }}
                    />
                    <Typography variant="caption" sx={{ color: '#A7F3D0', fontWeight: 700, fontSize: '0.72rem', fontFamily: "'Open Sans', sans-serif" }}>
                      LIVE SYSTEM
                    </Typography>
                  </Box>
                </Box>

                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1, fontFamily: "'Poppins', sans-serif" }}>
                      {countyStats ? countyStats.totalReceived : '...'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#CBD5E1', mt: 0.5, fontSize: '0.88rem', fontFamily: "'Open Sans', sans-serif" }}>
                      Total citizen service requests logged
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#4ade80', lineHeight: 1.1, fontFamily: "'Poppins', sans-serif" }}>
                      {countyStats ? countyStats.resolvedCount : '...'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#CBD5E1', mt: 0.5, fontSize: '0.88rem', fontFamily: "'Open Sans', sans-serif" }}>
                      Successfully resolved and verified
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Speed sx={{ color: '#4db6ac', fontSize: 32 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2, fontFamily: "'Poppins', sans-serif" }}>
                        Direct County Workflow
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontFamily: "'Open Sans', sans-serif" }}>
                        Handled directly by County Administration with real-time audit logging
                      </Typography>
                    </Box>
                  </Box>
                </Stack>

                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontFamily: "'Open Sans', sans-serif" }}>
                    CURRENT FIELD FOCUS:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4db6ac', fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
                    {heroSlides[currentSlide].title}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CALL-TO-ACTION OVERLAY BANNER  */}
      <Container maxWidth="lg" sx={{ mt: { xs: -4, md: -6 }, mb: 7, position: 'relative', zIndex: 10 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 45px rgba(18, 34, 66, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          <Box sx={{ maxWidth: 680 }}>
            <Typography
              sx={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: '1.45rem',
                color: '#009688',
                fontWeight: 700,
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              Direct Civic Action Desk
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                color: '#12304A',
                fontSize: { xs: '1.35rem', md: '1.75rem' },
                lineHeight: 1.25,
                mb: 1,
              }}
            >
              Ready to report an issue in your neighborhood?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                color: '#64748B',
                fontSize: { xs: '0.92rem', md: '1.02rem' },
                lineHeight: 1.6,
              }}
            >
              Submitting takes less than two minutes and helps build a better county for all residents.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button
              component={Link}
              to="/requests/new"
              variant="contained"
              size="large"
              startIcon={<AddCircleOutline />}
              sx={{
                bgcolor: '#009688',
                color: '#FFFFFF',
                fontWeight: 700,
                px: 3.5,
                py: 1.4,
                borderRadius: 2.5,
                fontSize: '0.98rem',
                boxShadow: '0 4px 16px rgba(0, 150, 136, 0.35)',
                '&:hover': { bgcolor: '#00695c' },
              }}
            >
              Report an Issue
            </Button>
            <Button
              component={Link}
              to="/services"
              variant="outlined"
              size="large"
              startIcon={<Assignment />}
              sx={{
                borderColor: '#009688',
                color: '#009688',
                fontWeight: 700,
                px: 3.5,
                py: 1.4,
                borderRadius: 2.5,
                fontSize: '0.98rem',
                '&:hover': {
                  borderColor: '#00695c',
                  bgcolor: 'rgba(0, 150, 136, 0.06)',
                },
              }}
            >
              Start Request
            </Button>
          </Stack>
        </Paper>
      </Container>

      {/* EXPLORE COUNTY SERVICES*/}
      <Box sx={{ py: 6, position: 'relative' }}>
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                fontFamily: "'Dancing Script', cursive",
                color: '#009688',
                fontSize: '1.6rem',
                fontWeight: 700,
                fontStyle: 'italic',
                mb: 0.5,
              }}
            >
              Community Solutions & Public Infrastructure
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                color: '#12304A',
                fontSize: { xs: '2rem', md: '2.5rem' },
                mt: 0.5,
                mb: 1.5,
              }}
            >
              Explore County Services
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                color: '#64748B',
                maxWidth: 640,
                mx: 'auto',
                fontSize: '1rem',
              }}
            >
              Select a service area to request county maintenance, report infrastructure breakdowns, or inquire about municipal services.
            </Typography>
          </Box>
        </Container>

        {catLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#009688' }} />
          </Box>
        ) : (
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              py: 2,
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: { xs: 40, md: 100 },
                zIndex: 2,
                background: 'linear-gradient(to right, #F5F8FA 0%, rgba(245,248,250,0) 100%)',
                pointerEvents: 'none',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: { xs: 40, md: 100 },
                zIndex: 2,
                background: 'linear-gradient(to left, #F5F8FA 0%, rgba(245,248,250,0) 100%)',
                pointerEvents: 'none',
              },
            }}
          >
            <Box
              className="scroll-marquee"
              sx={{
                display: 'flex',
                gap: 3,
                width: 'max-content',
              }}
            >
              {marqueeCategories.map((cat, idx) => (
                <Card
                  key={`${cat.id}-${idx}`}
                  sx={{
                    width: { xs: 280, sm: 320 },
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3.5,
                    border: '1px solid #E2E8F0',
                    bgcolor: '#FFFFFF',
                    boxShadow: '0 4px 16px rgba(18, 48, 74, 0.05)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 30px rgba(0, 150, 136, 0.16)',
                      borderColor: '#009688',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 2 }}>{getCategoryIcon(cat.code)}</Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 700,
                        color: '#12304A',
                        mb: 1,
                        fontSize: '1.1rem',
                      }}
                    >
                      {cat.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        color: '#64748B',
                        mb: 2.5,
                        flexGrow: 1,
                        fontSize: '0.86rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {cat.description}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/requests/new?category=${cat.id}`}
                      variant="text"
                      size="small"
                      endIcon={<ArrowForward fontSize="small" />}
                      sx={{
                        color: '#009688',
                        fontWeight: 700,
                        p: 0,
                        justifyContent: 'flex-start',
                        fontFamily: "'Poppins', sans-serif",
                        '&:hover': { color: '#00695c' },
                      }}
                    >
                      Make Request
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            component={Link}
            to="/services"
            endIcon={<ArrowForward />}
            sx={{
              color: '#009688',
              fontWeight: 700,
              fontSize: '0.95rem',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            View Complete Services Directory
          </Button>
        </Box>
      </Box>

      {/* 
          ABOUT US SECTION 
       */}
      <Box sx={{ bgcolor: '#FFFFFF', py: { xs: 8, md: 11 }, borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <Container maxWidth="lg">
          {/* Top Tag & High-Level Intro */}
          <Typography
            sx={{
              fontFamily: "'Dancing Script', cursive",
              color: '#E11D48',
              fontSize: { xs: '1.9rem', md: '2.2rem' },
              fontWeight: 700,
              fontStyle: 'italic',
              lineHeight: 1.2,
              mb: 1.5,
            }}
          >
            ABOUT US
          </Typography>

          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              color: '#334155',
              fontSize: { xs: '1.02rem', md: '1.1rem' },
              lineHeight: 1.8,
              maxWidth: 960,
              mb: 6,
            }}
          >
            eCitizenServiceHub leverages digital public infrastructure to empower county residents and administrators in isolating municipal issues faster, reducing resolution delays through proactive reporting and accountable tracking.
          </Typography>

          
          <Grid container spacing={5} alignItems="center">
            {/* Left Column: Heading, Narrative, and 2-Column Mission & Vision */}
            <Grid item xs={12} lg={6.5}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  color: '#0F172A',
                  fontSize: { xs: '1.75rem', md: '2.3rem' },
                  lineHeight: 1.25,
                  mb: 2.5,
                }}
              >
                We aim to simplify your public service delivery.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#475569',
                  lineHeight: 1.8,
                  fontSize: '0.98rem',
                  mb: 4.5,
                }}
              >
                At eCitizenServiceHub, we are committed to helping county residents and administrative teams manage civic requests efficiently. Our core objective is to provide a uniquely accessible platform that streamlines community reporting and enhances county responsiveness securely for all residents.
              </Typography>

              {/* Two Column Mission & Vision with Vertical Accent Bar */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 800,
                      color: '#0F172A',
                      fontSize: '1.25rem',
                      mb: 1,
                    }}
                  >
                    Mission
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      color: '#64748B',
                      lineHeight: 1.7,
                      fontSize: '0.92rem',
                    }}
                  >
                    To empower county residents with a seamless, transparent public service experience that boosts civic trust and operational clarity natively.
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ borderLeft: '3px solid #E11D48', pl: 2.5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 800,
                        color: '#0F172A',
                        fontSize: '1.25rem',
                        mb: 1,
                      }}
                    >
                      Vision
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        color: '#64748B',
                        lineHeight: 1.7,
                        fontSize: '0.92rem',
                      }}
                    >
                      To become the benchmark county platform that redefines how communities and local administrations report, track, and achieve verified resolutions.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* Right Column: Dark Container with 2x2 Feature Cards Grid */}
            <Grid item xs={12} lg={5.5}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: '#0B132B',
                  borderRadius: 6,
                  p: { xs: 3, sm: 3.5 },
                  boxShadow: '0 25px 60px rgba(11, 19, 43, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Grid container spacing={2}>
                  {/* Card 1 */}
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 3.5,
                        p: 2.5,
                        height: '100%',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          bgcolor: 'rgba(225, 29, 72, 0.2)',
                          color: '#F43F5E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1.5,
                        }}
                      >
                        <AccessibilityNew sx={{ fontSize: 20 }} />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 800,
                          color: '#FFFFFF',
                          fontSize: '0.95rem',
                          mb: 0.5,
                        }}
                      >
                        Inclusive Design
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          color: '#94A3B8',
                          lineHeight: 1.55,
                          display: 'block',
                          fontSize: '0.78rem',
                        }}
                      >
                        Thanks to intuitive mobile navigation, anyone can submit requests in their own words. Wherever you are, the county hears you!
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Card 2 */}
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 3.5,
                        p: 2.5,
                        height: '100%',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          bgcolor: 'rgba(225, 29, 72, 0.2)',
                          color: '#F43F5E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1.5,
                        }}
                      >
                        <VerifiedUser sx={{ fontSize: 20 }} />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 800,
                          color: '#FFFFFF',
                          fontSize: '0.95rem',
                          mb: 0.5,
                        }}
                      >
                        Accountable & Verifiable
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          color: '#94A3B8',
                          lineHeight: 1.55,
                          display: 'block',
                          fontSize: '0.78rem',
                        }}
                      >
                        Every request is stamped with an immutable tracking ID and direct administrative verification, eliminating informal gatekeeping.
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Card 3 */}
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 3.5,
                        p: 2.5,
                        height: '100%',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          bgcolor: 'rgba(225, 29, 72, 0.2)',
                          color: '#F43F5E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1.5,
                        }}
                      >
                        <Speed sx={{ fontSize: 20 }} />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 800,
                          color: '#FFFFFF',
                          fontSize: '0.95rem',
                          mb: 0.5,
                        }}
                      >
                        Maximum Efficiency
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          color: '#94A3B8',
                          lineHeight: 1.55,
                          display: 'block',
                          fontSize: '0.78rem',
                        }}
                      >
                        Direct triage and live geographic mapping ensure county maintenance teams are dispatched to critical community problems within hours.
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Card 4 */}
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 3.5,
                        p: 2.5,
                        height: '100%',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          bgcolor: 'rgba(225, 29, 72, 0.2)',
                          color: '#F43F5E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1.5,
                        }}
                      >
                        <Security sx={{ fontSize: 20 }} />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 800,
                          color: '#FFFFFF',
                          fontSize: '0.95rem',
                          mb: 0.5,
                        }}
                      >
                        Strictly Secure
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          color: '#94A3B8',
                          lineHeight: 1.55,
                          display: 'block',
                          fontSize: '0.78rem',
                        }}
                      >
                        To protect resident safety and privacy, we align with strict data standards. Internal admin notes remain private and confidential.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              <Typography
                sx={{
                  textAlign: 'center',
                  mt: 2,
                  color: '#64748B',
                  fontStyle: 'italic',
                  fontSize: '0.86rem',
                  fontFamily: "'Open Sans', sans-serif",
                }}
              >
                Empowering county communities through civic transparency and simplicity.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 
          HOW IT WORKS
       */}
      <Box sx={{ bgcolor: '#F5F8FA', py: 10, borderBottom: '1px solid #E2E8F0' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              sx={{
                fontFamily: "'Dancing Script', cursive",
                color: '#009688',
                fontSize: '1.5rem',
                fontWeight: 700,
                fontStyle: 'italic',
                mb: 0.5,
              }}
            >
              Simple & Accountable
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                color: '#12304A',
                mt: 0.5,
              }}
            >
              How eCitizenServiceHub Works
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3, bgcolor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    bgcolor: '#E0F2FE',
                    color: '#0284C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2.5,
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  1
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#12304A', mb: 1 }}>
                  Submit Your Request
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "'Open Sans', sans-serif", color: '#64748B', lineHeight: 1.6 }}>
                  Choose your department, describe the issue, pinpoint the location on our interactive map, and submit. You receive a unique reference number immediately.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3, bgcolor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    bgcolor: '#FEF3C7',
                    color: '#D97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2.5,
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  2
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#12304A', mb: 1 }}>
                  Review & Action
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "'Open Sans', sans-serif", color: '#64748B', lineHeight: 1.6 }}>
                  The County Administrator reviews the report, verifies priority, coordinates response units, and posts transparent updates to your portal.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3, bgcolor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    bgcolor: '#DCFCE7',
                    color: '#15803D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2.5,
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  3
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#12304A', mb: 1 }}>
                  Resolution & Rating
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "'Open Sans', sans-serif", color: '#64748B', lineHeight: 1.6 }}>
                  Once repairs or services are delivered, the actions taken are recorded. You receive notice, rate satisfaction, or dispute the resolution if issues remain.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 
           PUBLIC ISSUES MAP SECTION
       */}
      {publicIssues.length > 0 && (
        <Box id="public-map" sx={{ bgcolor: '#FFFFFF', py: 8 }}>
          <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontFamily: "'Dancing Script', cursive",
                  color: '#009688',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  fontStyle: 'italic',
                }}
              >
                Civic Transparency & Spatial Tracking
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  color: '#12304A',
                  mt: 0.5,
                }}
              >
                Public Community Issues Map
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#64748B',
                  mt: 0.5,
                }}
              >
                Verified infrastructure requests plotted across Greenfield County. Private citizen information is strictly hidden.
              </Typography>
            </Box>
            <PublicIssuesMap issues={publicIssues} />
          </Container>
        </Box>
      )}

      {/* 
           GOT QUESTIONS? WE HAVE ANSWERS 
             
       */}
      <Box
        sx={{
          bgcolor: '#FDF2F4', 
          pt: { xs: 8, md: 10 },
          pb: { xs: 14, md: 18 },
          clipPath: {
            xs: 'polygon(0 0, 100% 0, 100% calc(100% - 40px), 0 100%)',
            md: 'polygon(0 0, 100% 0, 100% calc(100% - 75px), 0 100%)',
          },
          position: 'relative',
        }}
      >
        <Container maxWidth="md">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              sx={{
                fontFamily: "'Dancing Script', cursive",
                color: '#E11D48',
                fontSize: { xs: '1.6rem', md: '1.9rem' },
                fontWeight: 700,
                fontStyle: 'italic',
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                color: '#12304A',
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                letterSpacing: '-0.01em',
                mb: 1.5,
              }}
            >
              Got Questions? We Have Answers.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                color: '#64748B',
                maxWidth: 600,
                mx: 'auto',
                fontSize: '0.98rem',
              }}
            >
              Explore essential answers regarding issue logging, turnaround timelines, and status updates.
            </Typography>
          </Box>

          {/* Directory Accordion List */}
          <Stack spacing={1}>
            {faqs.map((faq, idx) => (
              <Accordion
                key={idx}
                elevation={0}
                sx={{
                  bgcolor: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(225, 29, 72, 0.16)',
                  borderRadius: '0 !important',
                  '&::before': { display: 'none' },
                  '&.Mui-expanded': {
                    bgcolor: '#FFFFFF',
                    borderRadius: '16px !important',
                    boxShadow: '0 8px 24px rgba(225, 29, 72, 0.08)',
                    border: '1px solid #FECDD3',
                    my: 1.5,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: '#E11D48' }} />}
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: 1,
                    '& .MuiAccordionSummary-content': { my: 1.2 },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                      color: '#12304A',
                      fontSize: { xs: '0.98rem', md: '1.05rem' },
                    }}
                  >
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, pb: 3, pt: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      color: '#475569',
                      lineHeight: 1.75,
                      fontSize: '0.92rem',
                      mb: 2,
                    }}
                  >
                    {faq.a}
                  </Typography>

                
                  {faq.links && (
                    <Box sx={{ pt: 1, borderTop: '1px solid #FEE2E2' }}>
                      <Stack spacing={0.8}>
                        {faq.links.map((linkItem, lIdx) => (
                          <Box
                            key={lIdx}
                            component={Link}
                            to={linkItem.url}
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 1,
                              color: '#E11D48',
                              textDecoration: 'none',
                              fontSize: '0.86rem',
                              fontWeight: 700,
                              fontFamily: "'Poppins', sans-serif",
                              transition: 'color 0.2s ease',
                              '&:hover': {
                                color: '#9F1239',
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: 14,
                                height: 14,
                                borderRadius: '50%',
                                bgcolor: 'rgba(225, 29, 72, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                              }}
                            >
                              ↗
                            </Box>
                            {linkItem.label}
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* 
          STAY CONNECTED 
       */}
      <Box sx={{ bgcolor: '#FFFFFF', pt: { xs: 4, md: 6 }, pb: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  color: '#12304A',
                  fontSize: { xs: '1.8rem', md: '2.4rem' },
                  mb: 1.5,
                }}
              >
                Stay connected
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#64748B',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  maxWidth: 580,
                }}
              >
                Join a community of proactive residents and neighbors. Stay up to date with verified service resolutions and help improve neighborhood infrastructure across Greenfield County.
              </Typography>
            </Grid>

            <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={{ md: 'flex-end' }}>
                <Button
                  component={Link}
                  to="/services"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#122242',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    px: 3.5,
                    py: 1.4,
                    borderRadius: 2.5,
                    fontFamily: "'Poppins', sans-serif",
                    '&:hover': { bgcolor: '#0a1426' },
                  }}
                >
                  Start Request
                </Button>
                <Button
                  component={Link}
                  to="/requests/new"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: '#122242',
                    color: '#122242',
                    fontWeight: 700,
                    px: 3.5,
                    py: 1.4,
                    borderRadius: 2.5,
                    fontFamily: "'Poppins', sans-serif",
                    '&:hover': {
                      borderColor: '#0a1426',
                      bgcolor: 'rgba(18, 34, 66, 0.05)',
                    },
                  }}
                >
                  Report an Issue
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
