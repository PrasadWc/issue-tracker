import { createTheme } from "@mui/material";
import type { PaletteMode } from "@mui/material";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#66b8fbff" : "#264ee0ff",
      },
      secondary: {
        main: mode === "dark" ? "#f48fb1" : "#f48fb1",
      },
      background: {
        default: mode === "dark" ? "#0a1929" : "#f5f5f5",
        paper: mode === "dark" ? "#132f4c" : "#ffffff",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: "background-color 0.4s ease, color 0.4s ease",
          },
          // Ensure all paper-like components also transition
          ".MuiPaper-root": {
            transition:
              "background-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease",
          },
          // Transition for sidebar/appbar
          ".MuiDrawer-paper, .MuiAppBar-root": {
            transition: "background-color 0.4s ease, color 0.4s ease",
          },
        },
      },
    },
  });

export default getTheme;
