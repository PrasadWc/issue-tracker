import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import IssuesPage from "./pages/IssuesPage";
import UsersPage from "./pages/UsersPage";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#0a1929",
      paper: "#132f4c",
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Routes (Wrapped in Layout) */}
          <Route
            path="/issues"
            element={
              <Layout>
                <IssuesPage />
              </Layout>
            }
          />
          <Route
            path="/users"
            element={
              <Layout>
                <UsersPage />
              </Layout>
            }
          />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/issues" replace />} />
          <Route path="*" element={<Navigate to="/issues" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
