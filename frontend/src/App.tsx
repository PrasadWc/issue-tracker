import { useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useThemeStore } from "./store/useThemeStore";
import getTheme from "./theme";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import IssuesPage from "./pages/IssuesPage";
import UsersPage from "./pages/UsersPage";

const AppContent = () => {
  const mode = useThemeStore((state) => state.mode);
  const theme = useMemo(() => getTheme(mode), [mode]);

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
};

function App() {
  return <AppContent />;
}

export default App;
