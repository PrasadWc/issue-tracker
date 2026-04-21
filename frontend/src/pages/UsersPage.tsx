import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Box,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState } from "react";

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Developer",
    status: "Active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Alice Wong",
    email: "alice@example.com",
    role: "Designer",
    status: "Active",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Developer",
    status: "Active",
  },
  {
    id: 6,
    name: "David Lee",
    email: "david@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 7,
    name: "Eve Taylor",
    email: "eve@example.com",
    role: "Admin",
    status: "Active",
  },
];

const roleColors: Record<
  string,
  "primary" | "secondary" | "info" | "success" | "warning"
> = {
  Admin: "primary",
  Developer: "secondary",
  Designer: "info",
  User: "warning",
};

const UsersPage = () => {
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
            Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your team members and their permissions.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          sx={{
            borderRadius: "10px",
            height: 48,
            px: 3,
            fontWeight: 600,
            boxShadow: (t) => `0 8px 16px ${t.palette.primary.main}33`,
          }}
        >
          Add User
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
            placeholder="Search users..."
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
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: (t) => t.palette.primary.light,
                            width: 40,
                            height: 40,
                            fontSize: "0.9rem",
                            fontWeight: 700,
                          }}
                        >
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700 }}
                          >
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={roleColors[user.role] as any}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          borderRadius: "6px",
                          bgcolor: (t: any) =>
                            `${t.palette[roleColors[user.role] || "primary"].main}15`,
                          color: (t: any) =>
                            t.palette[roleColors[user.role] || "primary"].main,
                          border: "none",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor:
                              user.status === "Active"
                                ? "success.main"
                                : "text.disabled",
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {user.status}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        sx={{ textTransform: "none", fontWeight: 600 }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={mockUsers.length}
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

export default UsersPage;
