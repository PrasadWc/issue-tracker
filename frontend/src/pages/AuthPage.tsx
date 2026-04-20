import { useState } from "react";
import { Container, Paper, Box, Button } from "@mui/material";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
          {isLogin ? <LoginForm /> : <SignupForm />}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button onClick={() => setIsLogin(!isLogin)} color="secondary">
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthPage;
