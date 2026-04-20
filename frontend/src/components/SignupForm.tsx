import { Box, Button, TextField, Typography } from "@mui/material";

const SignupForm = () => {
  return (
    <Box component="form" sx={{ mt: 1 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Sign Up
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Full Name"
        name="name"
        autoComplete="name"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Sign Up
      </Button>
    </Box>
  );
};

export default SignupForm;
