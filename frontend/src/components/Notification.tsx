import { Snackbar, Alert, AlertTitle } from "@mui/material";
import { useNotificationStore } from "../store/useNotificationStore";

const Notification = () => {
  const { isOpen, message, type, hideNotification } = useNotificationStore();

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    hideNotification();
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        sx={{
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          minWidth: "280px",
          "& .MuiAlert-icon": {
            fontSize: "24px",
          },
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, textTransform: "capitalize" }}>
          {type}
        </AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
