
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { colors } from './themes/colors';
const theme = createTheme({
  palette: {
    primary: {
      main: colors.primaryColor,
    },
    secondary: {
      main: colors.primaryColorAdmin,
    },
    text: {
      primary: colors.textColor,
    },
  }, components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: colors.iconColor,
        },
      },
    }
  }
});
createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
)
