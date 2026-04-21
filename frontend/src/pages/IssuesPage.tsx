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
  TablePagination,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fade,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState, useEffect } from "react";
import issueService, {
  type Issue,
  IssueStatus,
  IssuePriority,
} from "../services/issueService";
import { useAuthStore } from "../store/useAuthStore";
import CreateIssueModal from "../components/CreateIssueModal";

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

  // Filter and Search states
  const [searchKey, setSearchKey] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | "">("");
  const [priorityFilter, setPriorityFilter] = useState<number | "">("");
  const [viewTab, setViewTab] = useState<"all" | "assigned" | "reported">(
    "all",
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<Issue | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchKey);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchKey]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, statusFilter, priorityFilter, viewTab]);

  useEffect(() => {
    fetchIssues();
  }, [
    page,
    rowsPerPage,
    debouncedSearch,
    statusFilter,
    priorityFilter,
    viewTab,
  ]);

  const fetchIssues = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      // Backend uses 1-based indexing for pages
      const res = await issueService.getIssues(page + 1, rowsPerPage, {
        status: statusFilter === "" ? undefined : (statusFilter as number),
        priority:
          priorityFilter === "" ? undefined : (priorityFilter as number),
        searchKey: debouncedSearch || undefined,
        assignee: viewTab === "assigned" ? user?._id : undefined,
        createdBy: viewTab === "reported" ? user?._id : undefined,
      });
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

  const handleOpenDeleteConfirm = (issue: Issue) => {
    setIssueToDelete(issue);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setIssueToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!issueToDelete) return;
    try {
      setLoading(true);
      await issueService.deleteIssue(issueToDelete._id);
      handleCloseDeleteConfirm();
      await fetchIssues(true);
    } catch (err) {
      console.error("Error deleting issue:", err);
      setError("Failed to delete issue.");
    } finally {
      setLoading(false);
    }
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
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Issues
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and track all reported bugs and tasks.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateModalOpen(true)}
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

      {/* Tabs Section */}
      <Tabs
        value={viewTab}
        onChange={(_e, newValue) => setViewTab(newValue)}
        sx={{
          mb: 1,
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            minWidth: 100,
            color: "text.secondary",
            "&.Mui-selected": {
              color: "primary.main",
            },
          },
          "& .MuiTabs-indicator": {
            height: 2,
            borderRadius: "3px 3px 0 0",
          },
        }}
      >
        <Tab label="All Issues" value="all" />
        <Tab label="Assigned to Me" value="assigned" />
        <Tab label="Reported by Me" value="reported" />
      </Tabs>

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
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <TextField
            placeholder="Search by title or description..."
            size="small"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", md: 320 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: "background.paper",
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value as number | "")}
                sx={{ borderRadius: "10px" }}
              >
                <MenuItem value="">All Statuses</MenuItem>
                {Object.entries(statusMap).map(([value, label]) => (
                  <MenuItem key={value} value={parseInt(value)}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) =>
                  setPriorityFilter(e.target.value as number | "")
                }
                sx={{ borderRadius: "10px" }}
              >
                <MenuItem value="">All Priorities</MenuItem>
                {Object.entries(priorityMap).map(([value, label]) => (
                  <MenuItem key={value} value={parseInt(value)}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              startIcon={<FilterListIcon />}
              sx={{
                borderRadius: "10px",
                color: "text.secondary",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => {
                setSearchKey("");
                setStatusFilter("");
                setPriorityFilter("");
              }}
            >
              Clear
            </Button>
          </Box>
        </Box>

        <Fade in={true} key={viewTab} timeout={600}>
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
                  {viewTab === "reported" && (
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {error ? (
                  <TableRow>
                    <TableCell
                      colSpan={viewTab === "reported" ? 7 : 6}
                      align="center"
                      sx={{ py: 3 }}
                    >
                      <Typography variant="body2" color="error">
                        {error}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : !loading && issues.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={viewTab === "reported" ? 7 : 6}
                      align="center"
                      sx={{ py: 3 }}
                    >
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
                            isOwnIssue &&
                            issue.status === IssueStatus.InProgress;

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
                      {viewTab === "reported" && (
                        <TableCell align="right">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteConfirm(issue)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: "1px solid", borderColor: "divider" }}
        />
      </Paper>

      <CreateIssueModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchIssues(true)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete issue "
            <strong>{issueToDelete?.title}</strong>"? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDeleteConfirm}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              color: "text.secondary",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={loading}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "10px",
              boxShadow: (t) => `0 4px 12px ${t.palette.error.main}44`,
            }}
          >
            {loading ? "Deleting..." : "Delete Issue"}
          </Button>
        </DialogActions>
      </Dialog>

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
