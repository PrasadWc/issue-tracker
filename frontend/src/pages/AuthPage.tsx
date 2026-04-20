import { useState } from "react";
import { Grid, Box, Typography, Button, Paper } from "@mui/material";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import authBg from "../assets/auth_bg.png";
import { motion } from "framer-motion";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left Side: Animated Intro */}
      <Grid
        size={{ xs: 0, sm: 4, md: 7 }}
        sx={{
          display: { xs: "none", sm: "flex" },
          backgroundImage: `url(${authBg})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          },
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ zIndex: 2, textAlign: "center", color: "white", p: 4 }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            Issue Tracker
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 6,
              opacity: 0.9,
              fontWeight: 300,
            }}
          >
            The ultimate workspace to track, manage, and resolve issues.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
            }}
          >
            {[
              { text: "COLLABORATE", color: "#90caf9", delay: 0 },
              { text: "TRACK", color: "#f48fb1", delay: 0.5 },
              { text: "RESOLVE", color: "#81c784", delay: 1 },
            ].map((item, index) => (
              <motion.div
                key={index}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [0.98, 1.02, 0.98],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: item.delay,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: 4,
                    color: item.color,
                    textShadow: `0 0 10px ${item.color}44`,
                  }}
                >
                  • {item.text} •
                </Typography>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Grid>

      {/* Right Side: Auth Form */}
      <Grid
        size={{ xs: 12, sm: 8, md: 5 }}
        component={Paper}
        elevation={0}
        square
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          bgcolor: "background.paper",
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <Box
              key={isLogin ? "login" : "signup"}
              component={motion.div}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isLogin ? <LoginForm /> : <SignupForm />}
            </Box>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: "text.secondary" }}
              >
                {isLogin ? "New to the platform?" : "Already have an account?"}
              </Typography>
              <Button
                fullWidth
                onClick={() => setIsLogin(!isLogin)}
                variant="outlined"
                sx={{
                  borderRadius: "12px",
                  height: 54,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                  },
                }}
              >
                {isLogin ? "Create an account" : "Sign in to your account"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AuthPage;
