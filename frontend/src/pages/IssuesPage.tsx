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
} from "@mui/material";

const mockIssues = [
  {
    id: 1,
    title: "Login button not working",
    priority: "High",
    status: "Open",
    assignedTo: "John Doe",
  },
  {
    id: 2,
    title: "UI alignment on mobile",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "Jane Smith",
  },
  {
    id: 3,
    title: "Backend API timeout",
    priority: "Critical",
    status: "Closed",
    assignedTo: "Bob Johnson",
  },
  {
    id: 4,
    title: "Update documentation",
    priority: "Low",
    status: "Open",
    assignedTo: "Alice Wong",
  },
];

const IssuesPage = () => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Issues</Typography>
        <Button variant="contained">Create Issue</Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockIssues.map((issue) => (
              <TableRow key={issue.id} hover>
                <TableCell>{issue.id}</TableCell>
                <TableCell>{issue.title}</TableCell>
                <TableCell>
                  <Chip
                    label={issue.priority}
                    color={
                      issue.priority === "Critical"
                        ? "error"
                        : issue.priority === "High"
                          ? "warning"
                          : "info"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip label={issue.status} variant="outlined" size="small" />
                </TableCell>
                <TableCell>{issue.assignedTo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default IssuesPage;
