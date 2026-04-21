import { useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useThemeStore } from "./store/useThemeStore";
import getTheme from "./theme";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import IssuesPage from "./pages/IssuesPage";
import UsersPage from "./pages/UsersPage";
import { useAuthStore } from "./store/useAuthStore";

const AppContent = () => {
  const mode = useThemeStore((state) => state.mode);
  const theme = useMemo(() => getTheme(mode), [mode]);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) return <Navigate to="/auth" replace />;
    return <Layout>{children}</Layout>;
  };

  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    if (isAuthenticated) return <Navigate to="/issues" replace />;
    return <>{children}</>;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/issues"
            element={
              <ProtectedRoute>
                <IssuesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/issues" : "/auth"} replace />
            }
          />
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/issues" : "/auth"} replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

function App() {
  return <AppContent />;
}

export default App;
