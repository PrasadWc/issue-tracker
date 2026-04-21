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
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState, useEffect } from "react";
import issueService, {
  type Issue,
  IssueStatus,
  IssuePriority,
} from "../services/issueService";
import { useAuthStore } from "../store/useAuthStore";

const statusMap: Record<number, string> = {
  [IssueStatus.Open]: "Open",
  [IssueStatus.InProgress]: "In Progress",
  [IssueStatus.Closed]: "Completed",
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

const statusColors: Record<string, "info" | "warning" | "success" | "default"> =
  {
    Open: "info",
    "In Progress": "warning",
    Completed: "success",
  };

const IssuesPage = () => {
  const user = useAuthStore((state) => state.user);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    fetchIssues();
  }, [page, rowsPerPage]);

  const fetchIssues = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
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

  const handleAssignToMe = async (issueId: string) => {
    if (!user) return;
    try {
      setAssigningId(issueId);
      await issueService.updateIssue(issueId, { assignee: user._id });
      await fetchIssues(true);
    } catch (err) {
      console.error("Error assigning issue:", err);
      setError("Failed to assign issue. Please try again.");
    } finally {
      setAssigningId(null);
    }
  };

  const handleOpenStatusMenu = (
    event: React.MouseEvent<HTMLElement>,
    issue: Issue,
  ) => {
    setStatusMenuAnchor(event.currentTarget);
    setSelectedIssue(issue);
  };

  const handleCloseStatusMenu = () => {
    setStatusMenuAnchor(null);
    setSelectedIssue(null);
  };

  const handleStatusChange = async (newStatus: number) => {
    if (!selectedIssue) return;
    try {
      setLoading(true);
      await issueService.updateIssue(selectedIssue._id, {
        status: newStatus as any,
      });
      handleCloseStatusMenu();
      await fetchIssues(true);
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status.");
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
                    <TableCell sx={{ fontWeight: 600, maxWidth: 200 }}>
                      {issue.title}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 400,
                        overflow: "visible",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                        color: "text.secondary",
                        wordWrap: "break-word",
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
                      {(() => {
                        const isOwnIssue =
                          user &&
                          issue.assignee &&
                          (typeof issue.assignee === "object"
                            ? issue.assignee._id === user._id
                            : issue.assignee === user._id);
                        const canUpdate =
                          isOwnIssue && issue.status === IssueStatus.InProgress;

                        return (
                          <Chip
                            label={statusMap[issue.status]}
                            color={statusColors[statusMap[issue.status]]}
                            variant="outlined"
                            size="small"
                            onClick={
                              canUpdate
                                ? (e) => handleOpenStatusMenu(e, issue)
                                : undefined
                            }
                            onDelete={
                              canUpdate
                                ? (e) => handleOpenStatusMenu(e, issue)
                                : undefined
                            }
                            deleteIcon={
                              canUpdate ? (
                                <KeyboardArrowDownIcon
                                  sx={{ fontSize: "14px !important" }}
                                />
                              ) : undefined
                            }
                            sx={{
                              fontWeight: 600,
                              borderRadius: "6px",
                              bgcolor: (t: any) =>
                                `${t.palette[statusColors[statusMap[issue.status]] || "primary"].main}15`,
                              cursor: canUpdate ? "pointer" : "default",
                              "& .MuiChip-deleteIcon": {
                                color: "inherit",
                                margin: "0 2px 0 -4px",
                              },
                            }}
                          />
                        );
                      })()}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {issue.createdBy?.name || "System"}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {typeof issue.assignee === "object" ? (
                        issue.assignee.name
                      ) : issue.assignee ? (
                        issue.assignee
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => handleAssignToMe(issue._id)}
                          disabled={!!assigningId}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: "8px",
                            height: 28,
                          }}
                        >
                          {assigningId === issue._id ? "..." : "Fix this"}
                        </Button>
                      )}
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

      {/* Status Transition Menu */}
      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={handleCloseStatusMenu}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            mt: 1,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <MenuItem
          onClick={() => handleStatusChange(IssueStatus.Closed)}
          sx={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "error.main",
            borderRadius: "8px",
            mx: 1,
            "&:hover": { bgcolor: "error.lighter" },
          }}
        >
          Complete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default IssuesPage;
