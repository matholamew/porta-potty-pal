const baseTheme = {
  spacing: {
    xs: '8px',    // Minimum spacing
    sm: '12px',   // Standard padding
    md: '16px',   // Component spacing
    lg: '24px',   // Section spacing
    xl: '32px',   // Layout spacing
    xxl: '44px'   // Minimum touch target
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '14px'    // Apple's standard corner radius
  },
  typography: {
    h1: {
      fontSize: '34px',
      lineHeight: '41px',
      fontWeight: '700'
    },
    h2: {
      fontSize: '28px',
      lineHeight: '34px',
      fontWeight: '600'
    },
    body: {
      fontSize: '17px',    // Apple's standard text size
      lineHeight: '22px',
      fontWeight: '400'
    },
    caption: {
      fontSize: '13px',    // Minimum 11pt per Apple guidelines
      lineHeight: '18px',
      fontWeight: '400'
    }
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.12)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.16)',
    large: '0 8px 24px rgba(0, 0, 0, 0.24)'
  }
};

export const lightTheme = {
  ...baseTheme,
  colors: {
    primary: '#007AFF',    // iOS blue
    surface: '#FFFFFF',
    background: '#F2F2F7', // iOS light gray
    text: {
      primary: '#000000',
      secondary: '#6C6C70', // iOS secondary text
      onPrimary: '#FFFFFF'
    },
    gray: {
      100: '#F2F2F7',
      200: '#E5E5EA',
      300: '#D1D1D6',
      400: '#C7C7CC'
    },
    error: '#FF3B30',      // iOS red
    menu: {
      background: '#FFFFFF',
      hover: '#F2F2F7',
      divider: '#E5E5EA'
    }
  }
};

export const darkTheme = {
  ...baseTheme,
  colors: {
    primary: '#0A84FF',    // iOS dark mode blue
    surface: '#1C1C1E',
    background: '#000000',
    text: {
      primary: '#FFFFFF',
      secondary: '#8E8E93', // iOS dark mode secondary text
      onPrimary: '#FFFFFF'
    },
    gray: {
      100: '#1C1C1E',
      200: '#2C2C2E',
      300: '#3A3A3C',
      400: '#48484A'
    },
    error: '#FF453A',      // iOS dark mode red
    menu: {
      background: '#2C2C2E',
      hover: '#3A3A3C',
      divider: '#48484A'
    }
  }
}; 