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
import { useState, useEffect } from "react";
import issueService, { IssuePriority, type Issue } from "../services/issueService";

interface CreateIssueModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  issue?: Issue | null;
}

const CreateIssueModal = ({
  open,
  onClose,
  onSuccess,
  issue,
}: CreateIssueModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<number>(IssuePriority.Low);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!issue;

  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description);
      setPriority(issue.priority);
    } else {
      setTitle("");
      setDescription("");
      setPriority(IssuePriority.Low);
    }
  }, [issue, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (isEdit && issue) {
        await issueService.updateIssue(issue._id, {
          title,
          description,
          priority: priority as any,
        });
      } else {
        await issueService.createIssue({
          title,
          description,
          priority: priority as any,
        });
      }
      handleClose();
      onSuccess();
    } catch (err: any) {
      console.error(`Error ${isEdit ? "updating" : "creating"} issue:`, err);
      setError(err.response?.data?.message || `Failed to ${isEdit ? "update" : "create"} issue.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: "16px", p: 1 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>
        {isEdit ? "Edit Issue" : "Create New Issue"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <TextField
              label="Title"
              placeholder="What's the problem?"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              label="Description"
              placeholder="Provide more details..."
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value as number)}
                sx={{ borderRadius: "10px" }}
              >
                <MenuItem value={IssuePriority.Low}>Low</MenuItem>
                <MenuItem value={IssuePriority.Medium}>Medium</MenuItem>
                <MenuItem value={IssuePriority.High}>High</MenuItem>
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
              px: 3,
              boxShadow: (t) => `0 4px 12px ${t.palette.primary.main}44`,
            }}
          >
            {loading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Issue" : "Create Issue")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateIssueModal;
