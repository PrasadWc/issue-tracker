import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export type ConfirmSeverity = "info" | "warning" | "error" | "success";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  severity?: ConfirmSeverity;
}

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  severity = "info",
}: ConfirmationDialogProps) => {
  const getIcon = () => {
    switch (severity) {
      case "error":
        return <ErrorOutlineIcon sx={{ fontSize: 40, color: "error.main" }} />;
      case "warning":
        return (
          <WarningAmberIcon sx={{ fontSize: 40, color: "warning.main" }} />
        );
      case "success":
        return (
          <CheckCircleOutlineIcon
            sx={{ fontSize: 40, color: "success.main" }}
          />
        );
      default:
        return (
          <InfoOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />
        );
    }
  };

  const getColor = () => {
    switch (severity) {
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "success":
        return "success";
      default:
        return "primary";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          p: 1,
        },
      }}
    >
      <DialogContent sx={{ textAlign: "center", pt: 4 }}>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          {getIcon()}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
        <DialogContentText sx={{ px: 2 }}>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: "center", gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{
            minWidth: 100,
            fontWeight: 600,
            textTransform: "none",
            color: "text.secondary",
            borderColor: "divider",
            borderRadius: "10px",
            "&:hover": {
              borderColor: "text.disabled",
              bgcolor: "action.hover",
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={getColor()}
          disabled={loading}
          sx={{
            minWidth: 100,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "10px",
            boxShadow: (t: any) =>
              `0 4px 12px ${
                t.palette[getColor() as "primary" | "error" | "warning"].main
              }44`,
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            confirmText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
