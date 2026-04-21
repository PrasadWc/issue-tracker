import { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";

const SignupForm = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;

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
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
        type="password"
        id="password"
        disabled={loading}
        slotProps={{
          input: {
            sx: { borderRadius: "10px" },
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
