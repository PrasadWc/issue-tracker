import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";

const LoginForm = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation State
  const [emailError, setEmailError] = useState("");

  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) return "Email is required";
    if (!emailRegex.test(val)) return "Invalid email format";
    return "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const eErr = validateEmail(email);
    if (eErr) {
      setEmailError(eErr);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await authService.login({ email, password });
      setAuth(res.user, res.token);
      navigate("/issues");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Welcome back
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Enter your credentials to access your account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
          {error}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        disabled={loading}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) setEmailError(validateEmail(e.target.value));
        }}
        error={!!emailError}
        helperText={emailError}
        slotProps={{
          input: {
            sx: { borderRadius: "10px" },
          },
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        id="password"
        autoComplete="current-password"
        disabled={loading}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        slotProps={{
          input: {
            sx: { borderRadius: "10px" },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          mt: 4,
          mb: 2,
          height: 54,
          borderRadius: "12px",
          fontSize: "1rem",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: (t) =>
            t.palette.mode === "dark"
              ? "0 8px 16px rgba(144, 202, 249, 0.2)"
              : "0 8px 16px rgba(25, 118, 210, 0.2)",
        }}
      >
        {loading ? "Signing In..." : "Sign In"}
      </Button>
    </Box>
  );
};

export default LoginForm;
