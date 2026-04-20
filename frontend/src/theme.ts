import { createTheme } from "@mui/material";
import type { PaletteMode } from "@mui/material";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#90caf9",
      },
      secondary: {
        main: "#f48fb1",
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
  });

export default getTheme;
