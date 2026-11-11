import { createTheme } from '@mui/material/styles';

// Soft, clean shadow used for cards, paper and menus.
const softShadow = '0 2px 12px rgba(15, 23, 42, 0.06)';
const hoverShadow = '0 8px 24px rgba(15, 23, 42, 0.12)';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
    background: { default: '#f4f6f8', paper: '#ffffff' },
    text: { primary: '#1e293b', secondary: '#64748b' },
    divider: 'rgba(15, 23, 42, 0.08)',
  },
  shape: { borderRadius: 12 },
  spacing: 8,
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          boxShadow: softShadow,
          border: '1px solid rgba(15, 23, 42, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        elevation1: { boxShadow: softShadow },
      },
    },
    MuiMenu: {
      styleOverrides: { paper: { boxShadow: hoverShadow } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 10 } },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#64748b',
          backgroundColor: '#f8fafc',
          whiteSpace: 'nowrap',
        },
      },
    },
  },
});

export default theme;
