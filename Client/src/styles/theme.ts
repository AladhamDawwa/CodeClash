import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#525068',
      main: '#272543',
      dark: '#1b192e',
      contrastText: '#fff',
    },
    secondary: {
      light: '#4f4f64',
      main: '#24243E',
      dark: '#19192b',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: 'Outfit, sans-serif',
  },
});

export default theme;
