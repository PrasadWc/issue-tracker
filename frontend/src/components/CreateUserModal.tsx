import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import userService, { UserRole } from "../services/userService";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateUserModal = ({
  open,
  onClose,
  onSuccess,
}: CreateUserModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<number>(UserRole.User);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Name, email, and password are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await userService.createUser({
        name,
        email,
        password,
        role: role as any,
      });
      handleClose();
      onSuccess();
    } catch (err: any) {
      console.error("Error creating user:", err);
      setError(err.response?.data?.message || "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole(UserRole.User);
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: "16px", p: 1 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>Add New User</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <TextField
              label="Full Name"
              placeholder="John Doe"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              label="Email Address"
              placeholder="john@example.com"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              label="Password"
              placeholder="Min 6 characters"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value as number)}
                sx={{ borderRadius: "10px" }}
              >
                <MenuItem value={UserRole.Admin}>Admin</MenuItem>
                <MenuItem value={UserRole.User}>User</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              color: "text.secondary",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "10px",
              px: 4,
              boxShadow: (t) => `0 4px 12px ${t.palette.primary.main}44`,
            }}
          >
            {loading ? "Adding..." : "Add User"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateUserModal;
