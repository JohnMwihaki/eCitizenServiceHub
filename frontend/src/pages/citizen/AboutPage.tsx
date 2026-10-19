import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Paper,
  Divider,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  VerifiedUser,
  Flag,
  Visibility,
  Favorite,
  Speed,
  Shield,
  Security,
  Balance,
  Groups,
  LocationCity,
  Phone,
  Email,
  ArrowForward,
  CheckCircle,
  AccessibilityNew,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const serviceCharter = [
    { service: 'Water Pipeline Burst & Clean Supply Interruption', target: '12 – 24 Hours', priority: 'Urgent' },
    { service: 'Blocked Stormwater Drains & Localized Flooding', target: '24 – 48 Hours', priority: 'High' },
    { service: 'Streetlight Blackouts & Public Security Lighting', target: '48 Hours', priority: 'Medium' },
    { service: 'Uncollected Municipal Waste & Illegal Dumping', target: '24 Hours', priority: 'High' },
    { service: 'Hazardous Potholes & Road Surface Damage', target: '48 – 72 Hours', priority: 'Medium' },
    { service: 'Public Health Sanitation Hazards & Infestations', target: '24 Hours', priority: 'Urgent' },
    { service: 'Public Park Maintenance & Broken Fencing', target: '3 – 5 Days', priority: 'Normal' },
  ];

  const coreValues = [
    {
      title: 'Citizen-Centricity',
      desc: 'Residents come first. We design every public service workflow around the dignity, convenience, and voice of the community.',
      icon: <Favorite sx={{ fontSize: 32, color: '#009688' }} />,
    },
    {
      title: 'Integrity & Accountability',
      desc: 'Zero tolerance for malpractice. Every submitted request is timestamped and tracked from inception to resolution with full audit logging.',
      icon: <Shield sx={{ fontSize: 32, color: '#009688' }} />,
    },
    {
      title: 'Radical Transparency',
      desc: 'No hidden gatekeepers. Citizens observe progress notes in real time, view geographic maps, and submit satisfaction ratings.',
      icon: <Visibility sx={{ fontSize: 32, color: '#009688' }} />,
    },
    {
      title: 'Operational Speed',
      desc: 'Measured commitments. Departmental teams are bound by published service charter timelines to ensure timely repairs.',
      icon: <Speed sx={{ fontSize: 32, color: '#009688' }} />,
    },
    {
      title: 'Equitable Devolution',
      desc: 'Fair resource allocation across all county wards—ensuring peri-urban and rural areas receive the same care as city centers.',
      icon: <Balance sx={{ fontSize: 32, color: '#009688' }} />,
    },
    {
      title: 'Civic Partnership',
      desc: 'Co-governance with residents. Community reporting acts as the county eyes and ears to maintain vital infrastructure.',
      icon: <Groups sx={{ fontSize: 32, color: '#009688' }} />,
    },
  ];

  return (
    <Box sx={{ bgcolor: '#F5F8FA', pb: 10 }}>
      {/*ABOUT SECTION  */}
      <Box sx={{ bgcolor: '#FFFFFF', pt: { xs: 6, md: 9 }, pb: { xs: 8, md: 10 }, borderBottom: '1px solid #E2E8F0' }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontFamily: "'Dancing Script', cursive",
              color: '#E11D48',
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              fontStyle: 'italic',
              lineHeight: 1.2,
              mb: 1.5,
            }}
          >
            ABOUT US
          </Typography>

          {/* Introductory Paragraph */}
          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              color: '#334155',
              fontSize: { xs: '1.05rem', md: '1.15rem' },
              lineHeight: 1.8,
              maxWidth: 960,
              mb: 6,
            }}
          >
            eCitizenServiceHub implements digital public infrastructure to empower county residents and administrators in isolating municipal issues faster, reducing resolution delays through proactive reporting and accountable tracking.
          </Typography>

          <Grid container spacing={5} alignItems="center">
            {/* Left Column: Heading, Narrative, and Mission & Vision */}
            <Grid item xs={12} lg={6.5}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  color: '#0F172A',
                  fontSize: { xs: '1.8rem', md: '2.3rem' },
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

              {/* Mission & Vision with Vertical Accent Bar */}
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

              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 5 }}>
                <Button
                  component={Link}
                  to="/requests/new"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#009688',
                    color: '#fff',
                    fontWeight: 700,
                    px: 3.5,
                    py: 1.4,
                    borderRadius: 2.5,
                    fontFamily: "'Poppins', sans-serif",
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
                    color: '#009688',
                    borderColor: '#009688',
                    fontWeight: 700,
                    px: 3.5,
                    py: 1.4,
                    borderRadius: 2.5,
                    fontFamily: "'Poppins', sans-serif",
                    '&:hover': {
                      borderColor: '#00695c',
                      bgcolor: 'rgba(0,150,136,0.06)',
                    },
                  }}
                >
                  Explore Services
                </Button>
              </Stack>
            </Grid>

            {/* Right Column*/}
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

      {/*COUNTY CORE VALUES & SERVICE CHARTER */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        {/* Core Values Grid */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
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
              Our Ethical Foundation
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                color: '#12304A',
              }}
            >
              Core Values Guiding Our Service
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {coreValues.map((val, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 3.5,
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                      borderColor: '#009688',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    <Box sx={{ mb: 2 }}>{val.icon}</Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 800,
                        color: '#12304A',
                        mb: 1.5,
                      }}
                    >
                      {val.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        color: '#64748B',
                        lineHeight: 1.7,
                      }}
                    >
                      {val.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Service Delivery Charter Table */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 8,
            borderRadius: 3.5,
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
          }}
        >
          <Box sx={{ mb: 3 }}>
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
              Service Level Commitments
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                color: '#12304A',
              }}
            >
              County Service Delivery Charter
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                color: '#64748B',
                mt: 0.5,
              }}
            >
              Published maximum response and resolution targets under the Murang'a County Public Service Act.
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: '#12304A' }}>
                    County Public Service
                  </TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: '#12304A' }}>
                    Standard Turnaround Target
                  </TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: '#12304A' }}>
                    Dispatch Priority
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceCharter.map((item, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, color: '#334155' }}>
                      {item.service}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#009688' }}>
                      {item.target}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.priority}
                        size="small"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 700,
                          bgcolor: item.priority === 'Urgent' ? '#FEE2E2' : item.priority === 'High' ? '#FEF3C7' : '#E0F2FE',
                          color: item.priority === 'Urgent' ? '#991B1B' : item.priority === 'High' ? '#92400E' : '#0369A1',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* County Headquarters & Ward Offices */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3.5,
            bgcolor: '#122242',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <LocationCity sx={{ color: '#4db6ac', fontSize: 32 }} />
                <Typography variant="h5" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}>
                  County Executive Headquarters
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontFamily: "'Open Sans', sans-serif", color: '#CBD5E1', lineHeight: 1.7, mb: 3 }}>
                County Administration Block A, Civic Center Way, P.O. 52-10200.
                Open Monday through Friday, 8:00 AM – 5:00 PM (Emergency response operates 24/7).
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ color: '#4db6ac', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                    Hotline: 0800-720-000
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ color: '#4db6ac', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                    support@murangacounty.go.ke
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button
                component={Link}
                to="/requests/new"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: '#009688',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  px: 4,
                  py: 1.6,
                  borderRadius: 2.5,
                  fontFamily: "'Poppins', sans-serif",
                  '&:hover': { bgcolor: '#00695c' },
                }}
              >
                Submit Service Request
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage;
