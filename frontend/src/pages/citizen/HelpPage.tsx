import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
  Button,
} from '@mui/material';
import {
  HelpOutline,
  ExpandMore,
  Phone,
  Email,
  LocationOn,
  Security,
  AssignmentTurnedIn,
  ArrowForward,
  CheckCircle,
  Speed,
  Shield,
  Favorite,
  VerifiedUser,
  Build,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const HelpPage: React.FC = () => {
  const treeNodes = [
    {
      title: 'Empathetic & Accessible Design',
      desc: 'We strive to make reporting simple for every resident through natural, human-like workflows. Whether on a basic smartphone or desktop, citizens can report community breakdowns in their own words, attach photos, and receive immediate assistance.',
      side: 'left' as const,
      icon: <Favorite sx={{ fontSize: 22, color: '#007E70' }} />,
    },
    {
      title: 'Mathematical & Audit Certainty',
      desc: 'Leveraging strict sequential tracking codes (e.g. CSR-2026-0042) and database transactions, every single request transition is cryptographically verified and immutable before actions are dispatched to field units.',
      side: 'right' as const,
      icon: <VerifiedUser sx={{ fontSize: 22, color: '#007E70' }} />,
    },
    {
      title: 'Direct County Triage & Action',
      desc: 'No middle gatekeepers or paperwork queues. The County Administrator reviews submissions directly, verifies severity, coordinates municipal maintenance teams, and posts transparent updates to your portal in real time.',
      side: 'left' as const,
      icon: <Build sx={{ fontSize: 22, color: '#007E70' }} />,
    },
    {
      title: 'Absolute Privacy & Verified Resolution',
      desc: 'Your personal data is structurally sandboxed; internal administrative notes remain protected while public maps only display general landmarks. Once repairs are completed, actions taken are recorded, and citizens rate their satisfaction.',
      side: 'right' as const,
      icon: <Shield sx={{ fontSize: 22, color: '#007E70' }} />,
    },
  ];

  const faqs = [
    {
      q: 'How do I submit an issue or request a service?',
      a: 'Navigate to "Report an Issue", select the department (Roads, Water, Waste, etc.), describe the situation, specify the ward and landmark, and optionally attach photos. You will instantly receive a reference number (e.g. CSR-2026-0042).',
    },
    {
      q: 'How can I track the progress of my submission?',
      a: 'Use the "Track Request" page to look up your reference number, or log into your Citizen Portal to view the live timeline, inspection status, and notes posted by county administration.',
    },
    {
      q: 'What should I do if an administrator asks for more information?',
      a: 'The request status will update to "Awaiting Citizen Info". A response dialog will appear on your request detail page where you can submit the requested clarification or photos.',
    },
    {
      q: 'Can I dispute or reopen a request if the repair was incomplete?',
      a: 'Yes. Every resolved request includes a "Dispute / Reopen Request" option where you can explain why the issue persists and submit it back for county review.',
    },
    {
      q: 'Is my personal information visible on public community maps?',
      a: 'No. The public map only displays general infrastructure category icons, landmarks, and resolution status. Your personal name, phone number, and private residence details are strictly hidden.',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh', pb: 10 }}>
      {/* HERO SECTION*/}
      <Box
        sx={{
          bgcolor: '#D5EFEA', 
          color: '#12304A',
          pt: { xs: 7, md: 10 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Right Decorative Concentric Arcs  */}
        <Box
          sx={{
            position: 'absolute',
            right: { xs: -140, md: -60 },
            top: '50%',
            transform: 'translateY(-50%)',
            width: { xs: 340, md: 520 },
            height: { xs: 340, md: 520 },
            borderRadius: '50%',
            border: '28px solid rgba(255, 255, 255, 0.4)',
            pointerEvents: 'none',
            zIndex: 0,
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 35,
              borderRadius: '50%',
              border: '24px solid rgba(255, 255, 255, 0.28)',
            },
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ maxWidth: 720 }}>
            {/* Kicker */}
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                color: '#0F766E',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'block',
                mb: 1.5,
              }}
            >
              Our Story & Citizen Mission
            </Typography>

            {/* Main Title */}
            <Typography
              variant="h2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                color: '#113E4A',
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.6rem' },
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                mb: 3,
              }}
            >
              How it all started
            </Typography>

            {/* Explanatory Paragraphs */}
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                color: '#285563',
                fontSize: { xs: '0.98rem', md: '1.08rem' },
                lineHeight: 1.8,
                mb: 2.5,
              }}
            >
              For years, county residents faced long travel distances and bureaucratic queues when reporting neighborhood breakdowns or requesting municipal services. Drawing upon modern civic technology, Murang'a County established this digital service desk to bridge the gap between residents and municipal public works teams.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                color: '#285563',
                fontSize: { xs: '0.98rem', md: '1.08rem' },
                lineHeight: 1.8,
              }}
            >
              The goal was to build an intuitive, transparent platform that empowers citizens to securely evaluate community issues, pinpoint exact coordinates, and follow direct administrative actions anywhere, 24/7.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* PROCESS SECTION*/}
      <Box
        sx={{
          bgcolor: '#007E70', 
          color: '#FFFFFF',
          py: { xs: 9, md: 13 },
          position: 'relative',
        }}
      >
        <Container maxWidth="md">
          {/* Section Script Tag */}
          <Typography
            sx={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: { xs: '2.4rem', md: '3.2rem' },
              fontWeight: 700,
              fontStyle: 'italic',
              textAlign: 'center',
              color: '#FFFFFF',
              mb: { xs: 6, md: 8 },
              textShadow: '0 2px 10px rgba(0,0,0,0.15)',
            }}
          >
            Values & Operational Flow
          </Typography>

          {/* Tree Timeline Container */}
          <Box sx={{ position: 'relative', py: 2 }}>
            {/* Central Vertical Trunk Line */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: { xs: 24, md: '50%' },
                width: 2,
                bgcolor: 'rgba(255, 255, 255, 0.4)',
                transform: { md: 'translateX(-50%)' },
                zIndex: 0,
              }}
            />

            {/* Alternating Tree Nodes */}
            <Stack spacing={{ xs: 6, md: 8 }}>
              {treeNodes.map((node, idx) => {
                const isLeft = node.side === 'left';
                return (
                  <Box
                    key={idx}
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: { xs: 'row', md: isLeft ? 'row' : 'row-reverse' },
                      alignItems: 'center',
                    }}
                  >
                    {/* Center Circular Node Marker */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: { xs: 24, md: '50%' },
                        transform: 'translate(-50%, -50%)',
                        top: '50%',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: '#FFFFFF',
                        border: '4px solid #80CBC4',
                        boxShadow: '0 0 12px rgba(255,255,255,0.6)',
                        zIndex: 2,
                      }}
                    />

                    {/* Content Box */}
                    <Box
                      sx={{
                        width: { xs: 'calc(100% - 50px)', md: '45%' },
                        ml: { xs: '50px', md: isLeft ? 0 : 'auto' },
                        mr: { xs: 0, md: isLeft ? 'auto' : 0 },
                        textAlign: { xs: 'left', md: isLeft ? 'right' : 'left' },
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 800,
                          color: '#FFFFFF',
                          fontSize: { xs: '1.25rem', md: '1.5rem' },
                          lineHeight: 1.3,
                          mb: 1.2,
                        }}
                      >
                        {node.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          color: '#E0F2FE',
                          lineHeight: 1.75,
                          fontSize: '0.92rem',
                        }}
                      >
                        {node.desc}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/*  FREQUENTLY ASKED QUESTIONS DIRECTORY*/}
      <Container maxWidth="md" sx={{ mt: 8 }}>
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
            Got Questions? We Have Answers.
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              color: '#12304A',
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "'Open Sans', sans-serif", color: '#64748B', mt: 0.5 }}>
            Everything you need to know about reporting, tracking, and county resolution timelines.
          </Typography>
        </Box>

        <Stack spacing={1.5} sx={{ mb: 7 }}>
          {faqs.map((faq, idx) => (
            <Accordion
              key={idx}
              elevation={0}
              sx={{
                border: '1px solid #E2E8F0',
                borderRadius: '12px !important',
                '&::before': { display: 'none' },
                bgcolor: '#FFFFFF',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#009688' }} />}>
                <Typography variant="subtitle1" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#12304A' }}>
                  {faq.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ fontFamily: "'Open Sans', sans-serif", color: '#64748B', lineHeight: 1.75 }}>
                  {faq.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>

        {/* Contact Support Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3.5,
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: '#12304A', mb: 0.5 }}>
                Still have questions or need emergency assistance?
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "'Open Sans', sans-serif", color: '#64748B', mb: 2 }}>
                Our Murang'a County citizen customer care desk is open Monday to Friday, 8:00 AM – 5:00 PM.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ color: '#009688', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#12304A' }}>
                    0800-720-000 (Toll Free)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ color: '#009688', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#12304A' }}>
                    services@muranga.go.ke
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
                startIcon={<ArrowForward />}
                sx={{
                  bgcolor: '#009688',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  px: 3.5,
                  py: 1.4,
                  borderRadius: 2.5,
                  fontFamily: "'Poppins', sans-serif",
                  '&:hover': { bgcolor: '#00695c' },
                }}
              >
                Submit a Report Now
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default HelpPage;
