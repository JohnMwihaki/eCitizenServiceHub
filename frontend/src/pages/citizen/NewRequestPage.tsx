import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Divider,
  Stack,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  AddCircleOutline,
  CheckCircle,
  Place,
  AttachFile,
  ArrowForward,
  ArrowBack,
  RateReview,
  Assignment,
  ReportProblem,
} from '@mui/icons-material';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { ServiceCategory, RequestType } from '../../types';
import { LocationPickerMap } from '../../components/LocationPickerMap';

const steps = ['Service & Type', 'Problem Details', 'Location & Files', 'Review & Confirm'];

export const NewRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCat = searchParams.get('category');

  const [activeStep, setActiveStep] = useState(0);

  // Form State
  const [requestType, setRequestType] = useState<RequestType>('COMMUNITY_ISSUE');
  const [categoryId, setCategoryId] = useState<string>(preselectedCat || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [ward, setWard] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    id: string;
    referenceNumber: string;
    title: string;
    status: string;
    createdAt: string;
  } | null>(null);

  // Fetch categories
  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data;
    },
  });

  useEffect(() => {
    if (preselectedCat && !categoryId) {
      setCategoryId(preselectedCat);
    }
  }, [preselectedCat]);

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);

  // Validation per step
  const canProceedStep0 = Boolean(categoryId);
  const canProceedStep1 = title.trim().length >= 5 && description.trim().length >= 10;
  const canProceedStep2 = locationName.trim().length >= 3;

  const handleNext = () => {
    setError(null);
    if (activeStep === 0 && !canProceedStep0) {
      setError('Please select a service category.');
      return;
    }
    if (activeStep === 1 && !canProceedStep1) {
      setError('Title must be at least 5 characters and description at least 10 characters.');
      return;
    }
    if (activeStep === 2 && !canProceedStep2) {
      setError('Please provide a location name, landmark, or street name.');
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setActiveStep((prev) => prev - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append(
        'data',
        JSON.stringify({
          title,
          description,
          categoryId,
          requestType,
          locationName,
          ward: ward || null,
          latitude,
          longitude,
        })
      );

      files.forEach((file) => {
        formData.append('attachments', file);
      });

      const res = await api.post('/requests', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success && res.data?.data) {
        setSubmittedResult(res.data.data);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to submit request. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (submittedResult) {
    return (
      <Box sx={{ bgcolor: '#F5F8FA', minHeight: 'calc(100vh - 72px)', py: 8 }}>
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 5,
              borderRadius: 3,
              textAlign: 'center',
              border: '1px solid #BBF7D0',
              bgcolor: '#FFFFFF',
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: '#DCFCE7',
                color: '#15803D',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
              }}
            >
              <CheckCircle sx={{ fontSize: 44 }} />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800, color: '#12304A', mb: 1 }}>
              Request Submitted Successfully!
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
              Your request has been securely recorded by Murang'a County. Use this official reference number to track all progress:
            </Typography>

            <Box
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                bgcolor: '#F1F5F9',
                border: '2px dashed #0F8B8D',
                mb: 4,
              }}
            >
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Official County Reference Number
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F8B8D', my: 0.5, letterSpacing: '0.05em' }}>
                {submittedResult.referenceNumber}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Status: <strong>SUBMITTED</strong> &bull; Awaiting Administrator Review
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                component={Link}
                to={`/requests/${submittedResult.id}`}
                variant="contained"
                sx={{
                  bgcolor: '#0F8B8D',
                  color: '#fff',
                  fontWeight: 700,
                  py: 1.2,
                  px: 3,
                  '&:hover': { bgcolor: '#0c7375' },
                }}
              >
                Track This Request
              </Button>
              <Button
                component={Link}
                to="/dashboard"
                variant="outlined"
                sx={{ color: '#12304A', borderColor: '#CBD5E1', fontWeight: 600 }}
              >
                Go to Dashboard
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: 'calc(100vh - 72px)', py: 6 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#12304A', mb: 0.5 }}>
            Report an Issue or Request a Service
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Follow the guided steps below to submit your issue directly to Murang'a County.
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={1} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
          {/* STEP 0: Category & Request Type */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#12304A', mb: 1 }}>
                Step 1: Choose Submission Type & Category
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                Are you reporting a public community infrastructure defect, or requesting a municipal service?
              </Typography>

              <RadioGroup
                row
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as RequestType)}
                sx={{ mb: 3 }}
              >
                <FormControlLabel
                  value="COMMUNITY_ISSUE"
                  control={<Radio sx={{ color: '#0F8B8D', '&.Mui-checked': { color: '#0F8B8D' } }} />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ReportProblem fontSize="small" sx={{ color: '#D97706' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Report a Community Issue (e.g. pothole, broken light, illegal dump)</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="SERVICE_REQUEST"
                  control={<Radio sx={{ color: '#0F8B8D', '&.Mui-checked': { color: '#0F8B8D' } }} />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Assignment fontSize="small" sx={{ color: '#0F8B8D' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Request a County Service (e.g. water connection, permit, tree trimming)</Typography>
                    </Box>
                  }
                />
              </RadioGroup>

              <FormControl fullWidth required sx={{ mt: 1 }}>
                <InputLabel id="category-label">Service Department / Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={categoryId}
                  label="Service Department / Category"
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      <strong>{c.name}</strong> &mdash; <span style={{ color: '#64748B', fontSize: '0.85rem' }}>{c.description}</span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedCategoryObj && (
                <Paper elevation={0} sx={{ p: 2, mt: 2.5, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#12304A' }}>
                    Selected: {selectedCategoryObj.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                    {selectedCategoryObj.description}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}

          {/* STEP 1: Details & Description */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#12304A', mb: 1 }}>
                Step 2: Describe the Issue or Request
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                Provide a clear title and thorough description to assist county response teams.
              </Typography>

              <Stack spacing={2.5}>
                <TextField
                  label="Request Title"
                  required
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Large pothole near Central Market bus junction"
                  helperText="A brief summary of the issue (minimum 5 characters)"
                />

                <TextField
                  label="Detailed Description"
                  required
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what happened, how long it has been an issue, hazards caused to traffic or health..."
                  helperText="Provide specific context to help administrators prioritize action (minimum 10 characters)"
                />
              </Stack>
            </Box>
          )}

          {/* STEP 2: Location & Map & Attachments */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#12304A', mb: 1 }}>
                Step 3: Location and Attachments
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                Pin the location on the map and attach optional photos to help crews locate the site.
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={7}>
                  <TextField
                    label="Location Name or Landmark"
                    required
                    fullWidth
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Kenyatta Avenue, outside Gate 2 of Community Center"
                    helperText="Visible landmark, street name, or building"
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="Ward or Sub-County"
                    fullWidth
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder="e.g. Central Ward"
                    helperText="Type ward or click a preset below"
                  />
                </Grid>
              </Grid>

              {/* Quick Ward Presets to Auto-Center Map */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 0.8 }}>
                  Quick Trace Ward Area:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {[
                    { name: 'Township (Murang\'a Town)', lat: -0.7185, lng: 37.1512 },
                    { name: 'Mbiri (Kiharu)', lat: -0.7245, lng: 37.1568 },
                    { name: 'Muguru (Kangema)', lat: -0.6854, lng: 36.9667 },
                    { name: 'Ichagaki (Maragua)', lat: -0.7812, lng: 37.1289 },
                    { name: 'Kimorori (Kenol)', lat: -0.8521, lng: 37.1189 },
                    { name: 'Kangari (Kigumo)', lat: -0.7720, lng: 37.0320 },
                    { name: 'Kariara (Gatanga)', lat: -0.9542, lng: 37.0541 },
                    { name: 'Gitugi (Mathioya)', lat: -0.6380, lng: 36.9850 },
                  ].map((w) => (
                    <Chip
                      key={w.name}
                      label={w.name}
                      size="small"
                      clickable
                      onClick={() => {
                        setWard(w.name);
                        setLatitude(w.lat);
                        setLongitude(w.lng);
                      }}
                      sx={{
                        fontWeight: 600,
                        bgcolor: ward === w.name ? '#0F8B8D' : '#F1F5F9',
                        color: ward === w.name ? '#FFFFFF' : '#334155',
                        '&:hover': { bgcolor: ward === w.name ? '#0c7375' : '#E2E8F0' },
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Leaflet Map Picker */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#12304A', mb: 1 }}>
                  Map Location (Interactive GPS Pin):
                </Typography>
                <LocationPickerMap
                  latitude={latitude}
                  longitude={longitude}
                  wardHint={ward}
                  onChange={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                  height={300}
                />
              </Box>

              {/* Attachments */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#12304A', mb: 1 }}>
                  Attach Photos or Documents (Optional, Max 5 files):
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFile />}
                  sx={{ borderColor: '#CBD5E1', color: '#12304A' }}
                >
                  Upload Files
                  <input type="file" multiple hidden onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx" />
                </Button>

                {files.length > 0 && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.5, gap: 1 }}>
                    {files.map((file, idx) => (
                      <Chip
                        key={idx}
                        label={`${file.name} (${Math.round(file.size / 1024)} KB)`}
                        onDelete={() => removeFile(idx)}
                        size="small"
                        sx={{ bgcolor: '#F1F5F9' }}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            </Box>
          )}

          {/* STEP 3: Review and Confirm */}
          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#12304A', mb: 1 }}>
                Step 4: Review Your Submission
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                Please review the information below before final submission.
              </Typography>

              <Card elevation={0} sx={{ bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Type</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {requestType === 'COMMUNITY_ISSUE' ? 'Community Issue Report' : 'County Service Request'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Category</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {selectedCategoryObj?.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Title</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#12304A' }}>
                        {title}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Description</Typography>
                      <Typography variant="body2" sx={{ color: '#334155', whiteSpace: 'pre-line' }}>
                        {description}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Location</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {locationName} {ward ? `(${ward})` : ''}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">GPS Pin</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {latitude && longitude ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` : 'No GPS Pin provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Attachments</Typography>
                      <Typography variant="body2">
                        {files.length > 0 ? `${files.length} file(s) attached` : 'No attachments'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Alert severity="info" sx={{ borderRadius: 2 }}>
                By submitting, your request will be delivered to the Murang'a County Administration. You will receive an official tracking reference immediately upon submission.
              </Alert>
            </Box>
          )}

          {/* Stepper Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2, borderTop: '1px solid #E2E8F0' }}>
            <Button
              disabled={activeStep === 0 || submitting}
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{ color: '#64748B' }}
            >
              Back
            </Button>

            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                sx={{ bgcolor: '#0F8B8D', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#0c7375' } }}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting}
                startIcon={<CheckCircle />}
                sx={{
                  bgcolor: '#238636',
                  color: '#fff',
                  fontWeight: 700,
                  px: 3,
                  '&:hover': { bgcolor: '#1a6328' },
                }}
              >
                {submitting ? 'Submitting to County...' : 'Confirm & Submit Request'}
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
