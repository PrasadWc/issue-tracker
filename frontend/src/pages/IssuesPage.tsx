import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import issueService, {
  type Issue,
  IssueStatus,
  IssuePriority,
} from "../services/issueService";

const statusMap: Record<number, string> = {
  [IssueStatus.Open]: "Open",
  [IssueStatus.InProgress]: "In Progress",
  [IssueStatus.Closed]: "Closed",
};

const priorityMap: Record<number, string> = {
  [IssuePriority.Low]: "Low",
  [IssuePriority.Medium]: "Medium",
  [IssuePriority.High]: "High",
};

const priorityColors: Record<string, "error" | "warning" | "info" | "default"> =
  {
    High: "error",
    Medium: "warning",
    Low: "info",
  };

const IssuesPage = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchIssues();
  }, [page, rowsPerPage]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      // Backend uses 1-based indexing for pages
      const res = await issueService.getIssues(page + 1, rowsPerPage);
      setIssues(res.data);
      setTotal(res.total);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching issues:", err);
      setError("Failed to fetch issues. Please check your connectivity.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Issues
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and track all reported bugs and tasks.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: "10px",
            height: 48,
            px: 3,
            fontWeight: 600,
            boxShadow: (t) => `0 8px 16px ${t.palette.primary.main}33`,
          }}
        >
          Create Issue
        </Button>
      </Box>

      {/* Filter and Content Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 2,
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <TextField
            size="small"
            placeholder="Search issues..."
            sx={{ flexGrow: 1, maxWidth: 400 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: "10px" },
              },
            }}
          />
          <IconButton
            sx={{
              borderRadius: "10px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead
              sx={{
                bgcolor: (t) =>
                  t.palette.mode === "dark"
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(0,0,0,0.01)",
              }}
            >
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created By</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Assignee</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Loading issues...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="error">
                      {error}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : issues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No issues found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                issues.map((issue) => (
                  <TableRow
                    key={issue._id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>
                      {issue.title}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 300,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "text.secondary",
                      }}
                    >
                      {issue.description}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={priorityMap[issue.priority]}
                        color={priorityColors[priorityMap[issue.priority]]}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusMap[issue.status]}
                        variant="outlined"
                        size="small"
                        sx={{
                          fontWeight: 500,
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {issue.createdBy?.name || "System"}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {typeof issue.assignee === "object"
                        ? issue.assignee.name
                        : issue.assignee || "Unassigned"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: "1px solid", borderColor: "divider" }}
        />
      </Paper>
    </Box>
  );
};

export default IssuesPage;
