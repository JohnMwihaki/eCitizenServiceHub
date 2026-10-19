import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: 'rgba(18,34,66,1)', 
      light: '#1e3a6d',
      dark: 'rgb(10, 10, 12)', 
      contrastText: 'rgba(255,255,255,1)',
    },
    secondary: {
      main: 'rgba(0,150,136,1)', 
      light: 'rgba(77,182,172,1)', 
      dark: 'rgba(0,105,92,1)', 
      contrastText: 'rgba(255,255,255,1)',
    },
    success: {
      main: 'rgba(0,150,136,1)',
      light: 'rgba(77,182,172,1)',
      dark: 'rgba(0,105,92,1)',
    },
    warning: {
      main: '#D97706',
      light: '#f59e0b',
      dark: '#b45309',
    },
    error: {
      main: 'rgb(172, 15, 7)', 
      light: '#ef5350',
      dark: 'rgb(145, 12, 5)',
    },
    background: {
      default: '#F8FAFC',
      paper: 'var(--color-white)',
    },
    text: {
      primary: 'rgba(51,51,51,1)',
      secondary: 'rgba(120,130,140,1)', 
    },
  },

  typography: {
    fontFamily: 'var(--primary-font)',
    h1: {
      fontFamily: 'var(--primary-font)',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: 'var(--color-deep-navy)',
    },
    h2: {
      fontFamily: 'var(--primary-font)',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: 'var(--color-deep-navy)',
    },
    h3: {
      fontFamily: 'var(--primary-font)',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: 'var(--color-deep-navy)',
    },
    h4: {
      fontFamily: 'var(--primary-font)',
      fontWeight: 600,
      color: 'var(--color-deep-navy)',
    },
    h5: {
      fontFamily: 'var(--primary-font)',
      fontWeight: 600,
      color: 'var(--color-deep-navy)',
    },
    h6: {
      fontFamily: 'var(--primary-font)',
      fontWeight: 600,
      color: 'var(--color-deep-navy)',
    },
    subtitle1: {
      fontFamily: 'var(--primary-font)',
      fontWeight: 600,
    },
    subtitle2: {
      fontFamily: 'var(--primary-font)',
      fontWeight: 600,
    },
    body1: {
      fontFamily: 'var(--primary-font)',
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: 'var(--primary-font)',
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: 'var(--primary-font)',
      textTransform: 'none',
      fontWeight: 600,
    },
    caption: {
      fontFamily: 'var(--primary-font)',
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
          color: 'var(--color-dark-grey)',
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
        '.brand-accent-title': {
          fontFamily: 'var(--primary-font)',
          color: 'var(--color-deep-navy)',
        },
        '.brand-script': {
          fontFamily: 'var(--script-font)',
          color: 'var(--color-teal-medium)',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          
          borderRadius: 0,
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
        containedPrimary: {
          backgroundColor: 'var(--color-deep-navy)',
          color: 'var(--color-white)',
          '&:hover': {
            backgroundColor: 'var(--color-cool-navy)',
          },
        },
        containedSecondary: {
          backgroundColor: 'var(--color-teal-medium)',
          color: 'var(--color-white)',
          '&:hover': {
            backgroundColor: 'var(--color-teal-dark)',
          },
        },
        containedError: {
          backgroundColor: 'var(--color-button)',
          color: 'var(--color-white)',
          '&:hover': {
            backgroundColor: 'rgb(145, 12, 5)',
          },
        },
        outlinedPrimary: {
          borderColor: 'var(--color-deep-navy)',
          color: 'var(--color-deep-navy)',
        },
        outlinedSecondary: {
          borderColor: 'var(--color-teal-medium)',
          color: 'var(--color-teal-dark)',
        },
        textSecondary: {
          color: 'var(--color-teal-dark)',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
          border: '1px solid var(--color-border-light)',
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

    MuiTypography: {
      styleOverrides: {
        h1: { fontFamily: 'var(--primary-font)', color: 'var(--color-deep-navy)' },
        h2: { fontFamily: 'var(--primary-font)', color: 'var(--color-deep-navy)' },
        h3: { fontFamily: 'var(--primary-font)', color: 'var(--color-deep-navy)' },
        h4: { fontFamily: 'var(--primary-font)', color: 'var(--color-deep-navy)' },
        h5: { fontFamily: 'var(--primary-font)', color: 'var(--color-deep-navy)' },
        h6: { fontFamily: 'var(--primary-font)', color: 'var(--color-deep-navy)' },
      },
    },
  },
});

export default theme;
