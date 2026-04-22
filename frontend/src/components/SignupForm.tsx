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

const SignupForm = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation State
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateName = (val: string) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!val) return "Name is required";
    if (!nameRegex.test(val)) return "Name can only contain letters and spaces";
    if (val.length < 2) return "Name is too short";
    return "";
  };

  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) return "Email is required";
    if (!emailRegex.test(val)) return "Invalid email format";
    return "";
  };

  const validatePassword = (val: string) => {
    if (!val) return "Password is required";
    if (val.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nErr = validateName(name);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);

    if (nErr || eErr || pErr) {
      setNameError(nErr);
      setEmailError(eErr);
      setPasswordError(pErr);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await authService.register({ name, email, password });
      setAuth(res.user, res.token);
      navigate("/issues");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Create Account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Join our community and start tracking your issues
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
        id="name"
        label="Full Name"
        name="name"
        autoComplete="name"
        autoFocus
        disabled={loading}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (nameError) setNameError(validateName(e.target.value));
        }}
        error={!!nameError}
        helperText={nameError}
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
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
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
        disabled={loading}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (passwordError) setPasswordError(validatePassword(e.target.value));
        }}
        error={!!passwordError}
        helperText={passwordError}
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
        {loading ? "Creating Account..." : "Sign Up"}
      </Button>
    </Box>
  );
};

export default SignupForm;
