import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      //main: "#556cd6",
      light: "#EB7478",
      main: "#CD171E",
      dark: "#8B1115",
      contrastText: "#fff",
    },
    secondary: {
      //main: "#19857b",
      main: "#116BD1",
    },
    success: {
      main: "#33B55A",
      contrastText: "#fff",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
  overrides: {
    MuiButton: {
      raisedPrimary: {
        color: "#cd171e",
      },
    },
  },
});

export default theme;
