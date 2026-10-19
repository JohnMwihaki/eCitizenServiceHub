import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#122242',
      light: '#1e3a6d',
      dark: '#0a1426',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#009688', 
      light: '#4db6ac', 
      dark: '#00695c', 
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#238636',
      light: '#2ea043',
      dark: '#1a6328',
    },
    warning: {
      main: '#D97706',
      light: '#f59e0b',
      dark: '#b45309',
    },
    error: {
      main: '#C62828',
      light: '#ef5350',
      dark: '#b71c1c',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
  },

  typography: {
    fontFamily: '"Poppins", "Open Sans", "Lato", sans-serif',
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    subtitle2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Open Sans", "Poppins", sans-serif',
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Open Sans", "Poppins", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: '"Poppins", sans-serif',
      textTransform: 'none',
      fontWeight: 600,
    },
    caption: {
      fontFamily: '"Open Sans", sans-serif',
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--primary-font': "'Poppins', sans-serif",
          '--secondary-font': "'Dancing Script', 'Lato', cursive, sans-serif",
          '--script-font': "'Dancing Script', cursive",
          '--color-teal-medium': 'rgba(0,150,136,1)',
          '--color-aqua-soft': 'rgba(77,182,172,1)',
          '--color-teal-dark': 'rgba(0,105,92,1)',
          '--color-white': 'rgba(255,255,255,1)',
          '--color-light-mint': 'rgba(240,255,250,1)',
          '--color-dark-grey': 'rgba(51,51,51,1)',
          '--color-placeholder-grey': 'rgba(150,150,150,1)',
          '--color-border-light': 'rgba(220,220,220,1)',
          '--color-light-cyan': 'rgba(178,235,242,1)',
          '--color-aqua-translucent': 'rgba(77,182,172,0.15)',
          '--color-soft-white-overlay': 'rgba(255,255,255,0.3)',
          '--color-blush-pink': 'rgba(255,228,235,1)',
          '--color-soft-pastel-pink': 'rgba(255,240,245,1)',
          '--color-deep-navy': 'rgba(18,34,66,1)',
          '--color-cool-navy': 'rgb(10, 10, 12)',
          '--color-soft-cool-gray': 'rgba(120,130,140,1)',
          '--color-lavender-gray': 'rgba(150,145,165,1)',
          '--color-button': 'rgb(172, 15, 7)',
        },
        body: {
          fontFamily: 'var(--primary-font)',
          backgroundColor: '#F8FAFC',
          color: '#111827',
          margin: 0,
          padding: 0,
        },
        '@keyframes floatCard': {
          '0%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
          '100%': {
            transform: 'translateY(0px)',
          },
        },
        '@keyframes scrollServices': {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-50%)',
          },
        },
        '.floating-card': {
          animation: 'floatCard 4.5s ease-in-out infinite',
        },
        '.scroll-marquee': {
          animation: 'scrollServices 32s linear infinite',
        },
        '.scroll-marquee:hover': {
          animationPlayState: 'paused',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          fontFamily: 'var(--primary-font)',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
          border: '1px solid #E2E8F0',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;