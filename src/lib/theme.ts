import { createTheme } from '@mui/material/styles';
import chroma from 'chroma-js';

interface GeneratedColors {
  primary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
}

export const generateTheme = (baseHue: number): GeneratedColors => {
  // Generate primary colors
  const primaryMain = chroma.hsl(baseHue, 0.65, 0.5).hex();
  const primaryLight = chroma(primaryMain).brighten(0.7).hex();
  const primaryDark = chroma(primaryMain).darken(0.7).hex();
  
  // Generate secondary colors (complementary hue)
  const secondaryHue = (baseHue + 180) % 360;
  const secondaryMain = chroma.hsl(secondaryHue, 0.65, 0.5).hex();
  const secondaryLight = chroma(secondaryMain).brighten(0.7).hex();
  const secondaryDark = chroma(secondaryMain).darken(0.7).hex();

  return {
    primary: {
      main: primaryMain,
      light: primaryLight,
      dark: primaryDark,
      contrastText: chroma.contrast(primaryMain, '#ffffff') >= 4.5 ? '#ffffff' : '#000000',
    },
    secondary: {
      main: secondaryMain,
      light: secondaryLight,
      dark: secondaryDark,
      contrastText: chroma.contrast(secondaryMain, '#ffffff') >= 4.5 ? '#ffffff' : '#000000',
    },
  };
};

// Default theme colors (based on Material Design blue)
const defaultThemeColors = generateTheme(210);

// Color palette
const colors = {
  primary: defaultThemeColors.primary,
  secondary: defaultThemeColors.secondary,
  neutral: {
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  semantic: {
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
  },
};

// Spacing scale
const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem',  // 8px
  md: '1rem',    // 16px
  lg: '1.5rem',  // 24px
  xl: '2rem',    // 32px
  xxl: '3rem',   // 48px
};

// Shadow definitions
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

// Typography scale
const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 500,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 500,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 500,
    lineHeight: 1.2,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 500,
    lineHeight: 1.2,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
};

// Border radius
const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.25rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
};

// Transitions
const transitions = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

// Create and export the theme
export const theme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.semantic.success,
    warning: colors.semantic.warning,
    error: colors.semantic.error,
    info: colors.semantic.info,
    grey: colors.neutral.gray,
    background: {
      default: colors.neutral.gray[50],
      paper: colors.neutral.white,
    },
  },
  spacing: (factor: number) => `${0.25 * factor}rem`,
  typography,
  shape: {
    borderRadius: parseInt(borderRadius.md),
  },
  shadows: [
    'none',
    shadows.sm,
    shadows.md,
    shadows.lg,
    shadows.xl,
    shadows['2xl'],
    ...Array(19).fill('none'), // MUI expects 25 shadow values
  ],
  transitions,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// Export individual theme elements for use in Storybook and testing
export const themeTokens = {
  colors,
  spacing,
  shadows,
  typography,
  borderRadius,
  transitions,
};

// Type definitions
export type ThemeColors = typeof colors;
export type ThemeSpacing = typeof spacing;
export type ThemeShadows = typeof shadows;
export type ThemeTypography = typeof typography;
export type ThemeBorderRadius = typeof borderRadius;
export type ThemeTransitions = typeof transitions;

// Export the theme generator types
export type GeneratedThemeColors = GeneratedColors;
