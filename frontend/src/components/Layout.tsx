import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BugReportIcon from "@mui/icons-material/BugReport";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { useConfirmStore } from "../store/useConfirmStore";
import { useTheme } from "@mui/material/styles";
import { UserRole } from "../services/userService";

const DRAWER_WIDTH = 260;
const MINI_DRAWER_WIDTH = 72;

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const toggleColorMode = useThemeStore((state) => state.toggleMode);
  const { user, logout } = useAuthStore();
  const confirm = useConfirmStore((state) => state.confirm);
  const setLoading = useConfirmStore((state) => state.setLoading);
  const closeConfirm = useConfirmStore((state) => state.onCancel);

  const handleDrawerToggle = () => {
    if (window.innerWidth < theme.breakpoints.values.sm) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const handleLogout = async () => {
    const isConfirmed = await confirm({
      title: "Logout",
      message: "Are you sure you want to logout?",
      confirmText: "Logout",
      cancelText: "Cancel",
      severity: "error",
    });
    if (!isConfirmed) return;
    try {
      setLoading(true);
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    } finally {
      setLoading(false);
      closeConfirm();
      navigate("/auth");
    }
  };

  const menuItems = [
    { text: "Issues", icon: <BugReportIcon />, path: "/issues" },
    ...(user?.role === UserRole.Admin
      ? [{ text: "Users", icon: <PeopleIcon />, path: "/users" }]
      : []),
  ];

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        pt: "64px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          px: open ? 2 : 1,
          pt: 3,
          transition: "padding 0.2s",
        }}
      >
        <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                key={item.text}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  sx={{
                    minHeight: 48,
                    justifyContent: {
                      xs: "initial",
                      sm: open ? "initial" : "center",
                    },
                    px: 2.5,
                    borderRadius: "12px",
                    bgcolor: isActive ? "primary.main" : "transparent",
                    color: isActive ? "white" : "text.secondary",
                    "&:hover": {
                      bgcolor: isActive ? "primary.dark" : "action.hover",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: 0,
                      mr: { xs: 2, sm: open ? 2 : "auto" },
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: { xs: 1, sm: open ? 1 : 0 },
                      transition: "opacity 0.2s",
                    }}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "0.95rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ mx: 2, my: 2 }} />

      <Box
        sx={{
          px: { xs: 2, sm: open ? 2 : 1 },
          pb: 3,
          transition: "padding 0.2s",
        }}
      >
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 48,
              justifyContent: {
                xs: "initial",
                sm: open ? "initial" : "center",
              },
              px: 2.5,
              borderRadius: "12px",
              color: "error.main",
              "&:hover": {
                bgcolor: (t) =>
                  t.palette.mode === "dark"
                    ? "rgba(239, 68, 68, 0.08)"
                    : "rgba(239, 68, 68, 0.04)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "inherit",
                minWidth: 0,
                mr: open ? 2 : "auto",
                justifyContent: "center",
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                opacity: { xs: 1, sm: open ? 1 : 0 },
                transition: "opacity 0.2s",
              }}
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: (t) =>
            t.palette.mode === "dark"
              ? "rgba(10, 25, 41, 0.7)"
              : "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: "divider",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: (t) => `0 4px 10px ${t.palette.primary.main}44`,
              }}
            >
              <BugReportIcon sx={{ color: "white", fontSize: 18 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, letterSpacing: -0.5 }}
            >
              Issue Tracker
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={toggleColorMode}
              color="inherit"
              sx={{ mr: -1 }}
            >
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>

            {user && (
              <>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 1.5, height: 24, my: "auto" }}
                />
                <Tooltip title={user.name}>
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: "primary.main",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: "2px solid",
                      borderColor: "divider",
                    }}
                  >
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Avatar>
                </Tooltip>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer with Mini-Variant Transitions */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          flexShrink: 0,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          "& .MuiDrawer-paper": {
            width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: "background.default",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflowY: "auto",
          p: { xs: 2, md: 3 },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: "100%",
        }}
      >
        <Toolbar />
        <Box sx={{ maxWidth: 1400, mx: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
