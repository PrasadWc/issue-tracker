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
import { useState } from "react";

const mockIssues = [
  {
    id: "ISS-001",
    title: "Login button not working",
    priority: "High",
    status: "Open",
    assignedTo: "John Doe",
  },
  {
    id: "ISS-002",
    title: "UI alignment on mobile",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "Jane Smith",
  },
  {
    id: "ISS-003",
    title: "Backend API timeout",
    priority: "Critical",
    status: "Closed",
    assignedTo: "Bob Johnson",
  },
  {
    id: "ISS-004",
    title: "Update documentation",
    priority: "Low",
    status: "Open",
    assignedTo: "Alice Wong",
  },
  {
    id: "ISS-005",
    title: "Fix memory leak",
    priority: "High",
    status: "Open",
    assignedTo: "Charlie Brown",
  },
  {
    id: "ISS-006",
    title: "Optimize image assets",
    priority: "Low",
    status: "Closed",
    assignedTo: "David Lee",
  },
  {
    id: "ISS-007",
    title: "Database migration error",
    priority: "Critical",
    status: "In Progress",
    assignedTo: "Eve Taylor",
  },
];

const priorityColors: Record<string, "error" | "warning" | "info" | "default"> =
  {
    Critical: "error",
    High: "warning",
    Medium: "info",
    Low: "default",
  };

const IssuesPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Assigned To</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockIssues
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((issue) => (
                  <TableRow
                    key={issue.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      sx={{ fontWeight: 500, color: "text.secondary" }}
                    >
                      {issue.id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {issue.title}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={issue.priority}
                        color={priorityColors[issue.priority]}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={issue.status}
                        variant="outlined"
                        size="small"
                        sx={{
                          fontWeight: 500,
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {issue.assignedTo}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={mockIssues.length}
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
