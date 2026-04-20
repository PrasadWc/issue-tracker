import { Box, Button, TextField, Typography } from "@mui/material";

const LoginForm = () => {
  return (
    <Box component="form" sx={{ mt: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Welcome back
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Enter your credentials to access your account
      </Typography>

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
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
        autoComplete="current-password"
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
        Sign In
      </Button>
    </Box>
  );
};

export default LoginForm;
