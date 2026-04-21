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
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fade,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState, useEffect } from "react";
import userService, {
  type User,
  UserRole,
  UserStatus,
} from "../services/userService";

const statusMap: Record<number, string> = {
  [UserStatus.Active]: "Active",
  [UserStatus.Inactive]: "Inactive",
};

const roleMap: Record<number, string> = {
  [UserRole.Admin]: "Admin",
  [UserRole.User]: "User",
};

const roleColors: Record<
  string,
  "primary" | "secondary" | "info" | "success" | "warning"
> = {
  Admin: "primary",
  User: "warning",
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // Debounce search key only
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchKey);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchKey]);

  // Reset page on filter/search change
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, roleFilter, statusFilter]);

  // Fetch users on filter/pagination changes
  useEffect(() => {
    fetchUsers(true);
  }, [debouncedSearch, roleFilter, statusFilter, page, rowsPerPage]);

  const fetchUsers = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await userService.getUsers({
        searchKey: debouncedSearch,
        role: roleFilter ? Number(roleFilter) : undefined,
        status: statusFilter ? Number(statusFilter) : undefined,
        page: page + 1,
        limit: rowsPerPage,
      });
      setUsers(res.data);
      setTotal(res.total);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please check your connectivity.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchKey("");
    setRoleFilter("");
    setStatusFilter("");
    setPage(0);
  };

  const handleToggleStatus = async (user: User) => {
    try {
      setStatusUpdatingId(user._id);
      const newStatus =
        user.status === UserStatus.Active
          ? UserStatus.Inactive
          : UserStatus.Active;
      await userService.updateUser(user._id, { status: newStatus });
      fetchUsers(true);
    } catch (err) {
      console.error("Error updating user status:", err);
    } finally {
      setStatusUpdatingId(null);
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
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <TextField
            size="small"
            placeholder="Search users..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            sx={{ flexGrow: 1, maxWidth: { md: 400 } }}
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

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(0);
                }}
                sx={{ borderRadius: "10px" }}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value={UserRole.Admin.toString()}>Admin</MenuItem>
                <MenuItem value={UserRole.User.toString()}>User</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                sx={{ borderRadius: "10px" }}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value={UserStatus.Active.toString()}>Active</MenuItem>
                <MenuItem value={UserStatus.Inactive.toString()}>
                  Inactive
                </MenuItem>
              </Select>
            </FormControl>

            <Button
              size="small"
              onClick={handleClearFilters}
              sx={{
                borderRadius: "10px",
                color: "text.secondary",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              Clear
            </Button>
          </Box>
        </Box>

        <Fade in={true} timeout={600}>
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
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} sx={{ mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Loading users...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="error">
                        {error}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        No users found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user._id}
                      hover
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
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
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={roleMap[user.role]}
                          color={roleColors[roleMap[user.role]] as any}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            borderRadius: "6px",
                            bgcolor: (t: any) =>
                              `${t.palette[roleColors[roleMap[user.role]] || "primary"].main}15`,
                            color: (t: any) =>
                              t.palette[
                                roleColors[roleMap[user.role]] || "primary"
                              ].main,
                            border: "none",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor:
                                user.status === UserStatus.Active
                                  ? "success.main"
                                  : "text.disabled",
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {statusMap[user.status]}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          color={
                            user.status === UserStatus.Active
                              ? "error"
                              : "primary"
                          }
                          variant="text"
                          onClick={() => handleToggleStatus(user)}
                          disabled={statusUpdatingId === user._id}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: "8px",
                            "&:hover": {
                              bgcolor: (t) =>
                                user.status === UserStatus.Active
                                  ? `${t.palette.error.main}15`
                                  : `${t.palette.primary.main}15`,
                            },
                          }}
                        >
                          {statusUpdatingId === user._id
                            ? "..."
                            : user.status === UserStatus.Active
                              ? "Deactivate"
                              : "Activate"}
                        </Button>
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
    </Box>
  );
};

export default UsersPage;
