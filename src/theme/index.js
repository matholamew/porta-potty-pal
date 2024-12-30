export const lightTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    gray: {
      100: '#F2F2F7',
      200: '#E5E5EA',
      300: '#D1D1D6',
      400: '#C7C7CC',
      500: '#AEAEB2',
      600: '#8E8E93',
    },
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: {
      primary: '#000000',
      secondary: '#3C3C43',
      tertiary: '#48484A',
    },
    divider: '#E5E5EA',
    menu: {
      background: '#FFFFFF',
      hover: '#F2F2F7',
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '44px', // Minimum touch target size
  },
  typography: {
    h1: {
      fontSize: '34px',
      lineHeight: '41px',
      fontWeight: '700',
    },
    h2: {
      fontSize: '28px',
      lineHeight: '34px',
      fontWeight: '600',
    },
    body: {
      fontSize: '17px',
      lineHeight: '22px',
    },
    caption: {
      fontSize: '13px',
      lineHeight: '18px',
    }
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
  }
};

export const darkTheme = {
  colors: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    success: '#30D158',
    warning: '#FFD60A',
    error: '#FF453A',
    gray: {
      100: '#1C1C1E',
      200: '#2C2C2E',
      300: '#3A3A3C',
      400: '#48484A',
      500: '#636366',
      600: '#8E8E93',
    },
    background: '#000000',
    surface: '#1C1C1E',
    text: {
      primary: '#FFFFFF',
      secondary: '#EBEBF599',
      tertiary: '#EBEBF54D',
    },
    divider: '#38383A',
    menu: {
      background: '#1C1C1E',
      hover: '#2C2C2E',
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '44px', // Minimum touch target size
  },
  typography: {
    h1: {
      fontSize: '34px',
      lineHeight: '41px',
      fontWeight: '700',
    },
    h2: {
      fontSize: '28px',
      lineHeight: '34px',
      fontWeight: '600',
    },
    body: {
      fontSize: '17px',
      lineHeight: '22px',
    },
    caption: {
      fontSize: '13px',
      lineHeight: '18px',
    }
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
  }
};

// Export lightTheme as the default theme
export const theme = lightTheme; 