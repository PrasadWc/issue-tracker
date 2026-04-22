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
  Fade,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState, useEffect } from "react";
import issueService, {
  type Issue,
  IssueStatus,
  IssuePriority,
} from "../services/issueService";
import { useAuthStore } from "../store/useAuthStore";
import CreateIssueModal from "../components/CreateIssueModal";
import IssueDetailModal from "../components/IssueDetailModal";
import { useConfirmStore } from "../store/useConfirmStore";
import { useNotificationStore } from "../store/useNotificationStore";

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
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );
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
  const [issueToEdit, setIssueToEdit] = useState<Issue | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedIssueDetail, setSelectedIssueDetail] = useState<Issue | null>(
    null,
  );
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const confirm = useConfirmStore((state) => state.confirm);
  const setConfirmLoading = useConfirmStore((state) => state.setLoading);
  const closeConfirm = useConfirmStore((state) => state.onCancel);

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
    fetchIssues(true);
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
    } catch (err: any) {
      console.error("Error fetching issues:", err);
      showNotification(
        "Failed to fetch issues. Please check your connectivity.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToMe = async (issueId: string, title: string) => {
    if (!user) return;
    const isConfirmed = await confirm({
      title: "Assign Issue",
      message: `Would you like to assign "${title}" to yourself?`,
      confirmText: "Assign to Me",
      severity: "info",
    });

    if (!isConfirmed) return;

    try {
      setConfirmLoading(true);
      setAssigningId(issueId);
      await issueService.updateIssue(issueId, { assignee: user._id });
      await fetchIssues(true);
      showNotification("Issue assigned to you successfully!", "success");
      closeConfirm();
    } catch (err) {
      console.error("Error assigning issue:", err);
      showNotification("Failed to assign issue. Please try again.", "error");
    } finally {
      setAssigningId(null);
      setConfirmLoading(false);
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

  const handleConfirmDelete = async (issue: Issue) => {
    const isConfirmed = await confirm({
      title: "Delete Issue",
      message: `Are you sure you want to delete "${issue.title}"? This action cannot be undone.`,
      confirmText: "Delete",
      severity: "error",
    });

    if (!isConfirmed) return;

    try {
      setConfirmLoading(true);
      setLoading(true);
      await issueService.deleteIssue(issue._id);
      await fetchIssues(true);
      showNotification("Issue deleted successfully!", "success");
      closeConfirm();
    } catch (err) {
      console.error("Error deleting issue:", err);
      showNotification("Failed to delete issue.", "error");
    } finally {
      setLoading(false);
      setConfirmLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: number) => {
    if (!selectedIssue) return;

    if (newStatus === IssueStatus.Closed) {
      const isConfirmed = await confirm({
        title: "Complete Issue",
        message: `Are you sure you want to mark "${selectedIssue.title}" as completed?`,
        confirmText: "Complete",
        severity: "success",
      });
      if (!isConfirmed) return;
    }

    try {
      if (newStatus === IssueStatus.Closed) setConfirmLoading(true);
      setLoading(true);
      await issueService.updateIssue(selectedIssue._id, {
        status: newStatus as any,
      });
      handleCloseStatusMenu();
      await fetchIssues(true);
      showNotification(
        `Issue status updated to ${statusMap[newStatus || 0]}`,
        "success",
      );
      if (newStatus === IssueStatus.Closed) closeConfirm();
    } catch (err) {
      console.error("Error updating status:", err);
      showNotification("Failed to update status.", "error");
    } finally {
      setLoading(false);
      setConfirmLoading(false);
    }
  };

  const handleOpenEditModal = (issue: Issue) => {
    setIssueToEdit(issue);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setIssueToEdit(null);
  };

  const handleOpenExportMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleCloseExportMenu = () => {
    setExportMenuAnchor(null);
  };

  const downloadFile = (data: string, fileName: string, type: string) => {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    handleCloseExportMenu();
    if (issues.length === 0) {
      showNotification("No issues to export.", "warning");
      return;
    }

    const headers = [
      "Title",
      "Description",
      "Status",
      "Priority",
      "Assignee",
      "Reporter",
      "Created At",
    ];
    const csvData = issues.map((issue) => [
      `"${issue.title}"`,
      `"${issue.description}"`,
      statusMap[issue.status],
      priorityMap[issue.priority],
      issue.assignee && typeof issue.assignee === "object"
        ? issue.assignee.name
        : "Unassigned",
      issue.createdBy && typeof issue.createdBy === "object"
        ? issue.createdBy.name
        : "Unknown",
      new Date(issue.createdAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");
    downloadFile(csvContent, `issues_export_${Date.now()}.csv`, "text/csv");
    showNotification("Issues exported to CSV successfully!", "success");
  };

  const exportToJSON = () => {
    handleCloseExportMenu();
    if (issues.length === 0) {
      showNotification("No issues to export.", "warning");
      return;
    }

    const jsonData = JSON.stringify(issues, null, 2);
    downloadFile(
      jsonData,
      `issues_export_${Date.now()}.json`,
      "application/json",
    );
    showNotification("Issues exported to JSON successfully!", "success");
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
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleOpenExportMenu}
            sx={{
              borderRadius: "10px",
              height: 48,
              px: 3,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Export
          </Button>
          <Menu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={handleCloseExportMenu}
            PaperProps={{
              sx: {
                borderRadius: "12px",
                mt: 1,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                minWidth: 160,
              },
            }}
          >
            <MenuItem onClick={exportToCSV} sx={{ py: 1.5, fontWeight: 500 }}>
              Export to CSV
            </MenuItem>
            <MenuItem onClick={exportToJSON} sx={{ py: 1.5, fontWeight: 500 }}>
              Export to JSON
            </MenuItem>
          </Menu>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateModalOpen(true)}
            sx={{
              borderRadius: "10px",
              height: 48,
              px: 3,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: (t) => `0 8px 16px ${t.palette.primary.main}33`,
            }}
          >
            Create Issue
          </Button>
        </Box>
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
                  <TableCell sx={{ fontWeight: 600, minWidth: 300 }}>
                    Title
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created By</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Assignee</TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, width: 120 }}
                    align="center"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && issues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} sx={{ mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Loading issues...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : issues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
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
                          maxWidth: 200,
                          color: "text.secondary",
                        }}
                      >
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "block",
                          }}
                        >
                          {issue.description}
                        </Typography>
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
                            onClick={() =>
                              handleAssignToMe(issue._id, issue.title)
                            }
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
                      <TableCell align="center" sx={{ width: 120 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 0.5,
                          }}
                        >
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => {
                              setSelectedIssueDetail(issue);
                              setIsDetailModalOpen(true);
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          {viewTab === "reported" && (
                            <>
                              <IconButton
                                color="primary"
                                size="small"
                                onClick={() => handleOpenEditModal(issue)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleConfirmDelete(issue)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </TableCell>
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
        onClose={handleCloseModal}
        onSuccess={() => fetchIssues(true)}
        issue={issueToEdit}
      />

      {/* Global Confirmation Dialog is handled in App.tsx */}

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
      <IssueDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        issue={selectedIssueDetail}
        statusMap={statusMap}
        priorityMap={priorityMap}
        statusColors={statusColors}
        priorityColors={priorityColors}
      />
    </Box>
  );
};

export default IssuesPage;
