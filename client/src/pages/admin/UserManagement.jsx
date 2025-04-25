import React, { useState, useEffect } from "react";
import PageHeader from "../../components/Admin/PageHeader";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
} from "@mui/material";
import { DetailCard } from "../../styles/ContainerStyles";
import { useModeration } from "../../hooks/admin/useModeration";
import { formatDate, formatTimeAgo } from "../../utils/timeFormatter";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import SearchIcon from "@mui/icons-material/Search";
import FlagIcon from "@mui/icons-material/Flag";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

const UserManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { users, userListLoading, userLoading, issueWarning, viewAllUsers } =
    useModeration();

  // States for table functionality
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("lastActiveAt");
  const [statusFilter, setStatusFilter] = useState("All");

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [warningDialog, setWarningDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    viewAllUsers();
  }, []);

  useEffect(() => {
    if (users) {
      const filtered = users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const matchesSearch =
          fullName.includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "All" || user.status === statusFilter;

        return matchesSearch && matchesStatus;
      });

      setFilteredUsers(filtered);
      setPage(0); // Reset to first page when filters change
    }
  }, [users, searchTerm, statusFilter]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialog(true);
  };

  const handleWarningClick = (user) => {
    setSelectedUser(user);
    setWarningDialog(true);
  };

  const handleWarningConfirm = () => {
    console.log("Issuing warning to user:", selectedUser);
    issueWarning(selectedUser?.userId);
    setWarningDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = () => {
    // Implement delete functionality here
    console.log("Delete confirmed for user:", selectedUser);
    setDeleteDialog(false);
    setSelectedUser(null);
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "Active":
        return { bg: theme.palette.success.main, color: "white" };
      case "Restricted":
        return { bg: theme.palette.error.main, color: "white" };
      default:
        return { bg: theme.palette.gray[600], color: "white" };
    }
  };

  // Sort function
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const sortedUsers = filteredUsers.slice().sort(getComparator(order, orderBy));
  const paginatedUsers = sortedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: isMobile ? 1 : 3, maxWidth: 1200, margin: "0 auto" }}>
      <PageHeader
        title="User Management"
        subtitle="Manage user accounts, permissions, and activity"
        sx={{
          "& .MuiTypography-h4": {
            bgcolor: theme.palette.primary.main,
            color: "white",
            padding: "12px 16px",
            borderRadius: 1,
            fontWeight: "bold",
            mb: 1,
          },
        }}
      />
      <DetailCard>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: isMobile ? "100%" : "auto",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <TextField
              placeholder="Search by name or email..."
              variant="outlined"
              fullWidth={isMobile}
              sx={{ minWidth: isMobile ? "100%" : "300px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl
              sx={{ minWidth: isMobile ? "100%" : "150px" }}
              size="small"
            >
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Restricted">Restricted</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 2 }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="user management table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === "firstName"}
                      direction={orderBy === "firstName" ? order : "asc"}
                      onClick={() => handleRequestSort("firstName")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      User
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === "generatedRecipeCount"}
                      direction={
                        orderBy === "generatedRecipeCount" ? order : "asc"
                      }
                      onClick={() => handleRequestSort("generatedRecipeCount")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      Generation(s)
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Last Updated
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === "status"}
                      direction={orderBy === "status" ? order : "asc"}
                      onClick={() => handleRequestSort("status")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userListLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.email} hover>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar
                            src={user.userImg}
                            alt={`${user.firstName} ${user.lastName}`}
                          >
                            {user.firstName?.charAt(0)}
                          </Avatar>
                          <Typography variant="body2">
                            {`${user.firstName} ${user.lastName}`}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell align="center">
                        {user.generatedRecipeCount}
                      </TableCell>
                      <TableCell>{formatDate(user.lastActiveAt)}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          sx={{
                            bgcolor: alpha(
                              getStatusChipColor(user.status).bg,
                              0.2
                            ),
                            borderColor: getStatusChipColor(user.status).bg,
                            color: getStatusChipColor(user.status).bg,
                          }}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            color="warning"
                            onClick={() => handleWarningClick(user)}
                            size="small"
                            title="Issue Flag"
                            disabled={
                              user.status === "Restricted" ||
                              user.status === "Disabled"
                            }
                          >
                            <FlagIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(user)}
                            size="small"
                            title="Remove User"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
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
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </DetailCard>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{ bgcolor: theme.palette.primary.main, color: "white" }}
        >
          {"Confirm User Removal"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description" sx={{ mt: 2 }}>
            Are you sure you want to remove {selectedUser?.firstName}{" "}
            {selectedUser?.lastName}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            autoFocus
          >
            Confirm Removal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Warning Confirmation Dialog */}
      <Dialog
        open={warningDialog}
        onClose={() => setWarningDialog(false)}
        aria-labelledby="warning-dialog-title"
        aria-describedby="warning-dialog-description"
      >
        <DialogTitle
          id="warning-dialog-title"
          sx={{ bgcolor: theme.palette.warning.main, color: "white" }}
        >
          {"Confirm Flag User"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="warning-dialog-description" sx={{ mt: 2 }}>
            Are you sure you want to flag {selectedUser?.firstName}{" "}
            {selectedUser?.lastName} for potentially violating community
            guidelines? This action will restrict the user's account and cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setWarningDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleWarningConfirm}
            variant="contained"
            color="warning"
            autoFocus
          >
            Confirm Flag
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
