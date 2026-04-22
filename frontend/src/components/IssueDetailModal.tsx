import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import { type Issue } from "../services/issueService";

interface IssueDetailModalProps {
  open: boolean;
  onClose: () => void;
  issue: Issue | null;
  statusMap: Record<number, string>;
  priorityMap: Record<number, string>;
  statusColors: Record<string, string>;
  priorityColors: Record<string, string>;
}

const IssueDetailModal = ({
  open,
  onClose,
  issue,
  statusMap,
  priorityMap,
  statusColors,
  priorityColors,
}: IssueDetailModalProps) => {
  if (!issue) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px", p: 1 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Issue Details</DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: "uppercase", fontWeight: 700 }}
            >
              Title
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {issue.title}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: "uppercase", fontWeight: 700 }}
            >
              Description
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {issue.description}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 4 }}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", fontWeight: 700 }}
              >
                Status
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={statusMap[issue.status]}
                  color={statusColors[statusMap[issue.status]] as any}
                  size="small"
                  sx={{ fontWeight: 600, borderRadius: "6px" }}
                />
              </Box>
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", fontWeight: 700 }}
              >
                Priority
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={priorityMap[issue.priority]}
                  color={priorityColors[priorityMap[issue.priority]] as any}
                  size="small"
                  sx={{ fontWeight: 600, borderRadius: "6px" }}
                />
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", fontWeight: 700 }}
              >
                Reported By
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {issue.createdBy?.name || "System"}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", fontWeight: 700 }}
              >
                Assigned To
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {typeof issue.assignee === "object"
                  ? issue.assignee.name
                  : issue.assignee || "Unassigned"}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", fontWeight: 700 }}
              >
                Date
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {new Date(issue.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: "10px", fontWeight: 600 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IssueDetailModal;
