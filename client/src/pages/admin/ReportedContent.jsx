import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  Grid,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  Stack,
  TableSortLabel,
  IconButton as MuiIconButton,
  Tooltip,
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlagIcon from "@mui/icons-material/Flag";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PageHeader from "../../components/Admin/PageHeader";
import { useModeration } from "../../hooks/admin/useModeration";
import { formatDate } from "../../utils/timeFormatter";
import { useNavigate } from "react-router-dom";
import { DetailCard } from "../../styles/ContainerStyles";

const ReportedContent = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortDirection, setSortDirection] = useState("desc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    reports,
    loading,
    reportsLoading,
    removeReportedPost,
    ignoreReportedPost,
    viewReportedPosts,
  } = useModeration();

  useEffect(() => {
    viewReportedPosts();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    setPage(0);
  };

  const handleViewReport = (post) => {
    setSelectedReport(post);
    setDialogOpen(true);
  };

  const handleRemovePost = (reportedPost) => {
    console.log("Reported Post:", reportedPost);
    removeReportedPost(reportedPost?.post?._id);
    setDialogOpen(false);
  };

  const handleIgnorePost = (postId) => {
    ignoreReportedPost(postId);
    setDialogOpen(false);
  };

  const navigateToPostDetail = (postId) => {
    console.log("Open post in new tab", postId);
    navigate(`/admin/reported/${postId}`);
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "Pending":
        return theme.palette.warning.main;

      case "Ignored":
        return theme.palette.success.main;
      case "Removed":
        return theme.palette.error.main;
      default:
        return theme.palette.gray[600];
    }
  };

  // Filter and sort posts
  const filteredAndSortedData = React.useMemo(() => {
    let filtered = [...reports];

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((report) => report?.status === statusFilter);
    }

    // Sort by createdAt
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [reports, statusFilter, sortDirection]);

  // Pagination
  const paginatedData = filteredAndSortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Responsive columns based on screen size
  const getVisibleColumns = () => {
    if (isMobile) {
      return ["Post", "Status", "Actions"];
    }
    return ["Post", "Reported By", "Reason", "Date", "Status", "Actions"];
  };

  const visibleColumns = getVisibleColumns();

  return (
    <Box sx={{ p: isMobile ? 0 : 3, maxWidth: 1200, margin: "0 auto" }}>
      <PageHeader
        title="Reported Content"
        description="Review and manage content reported by users"
        buttonText="Export Reports"
        buttonIcon={<FlagIcon />}
        onButtonClick={() => console.log("Export reports")}
      />

      <DetailCard>
        <Box
          display="flex"
          justifyContent="space-between"
          mb={2}
          flexWrap="wrap"
          gap={2}
        >
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter by Status"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Ignored">Ignored</MenuItem>
              <MenuItem value="Removed">Removed</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {reportsLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ overflow: "auto" }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead
                sx={{
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                <TableRow>
                  {visibleColumns.includes("Post") && (
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Post
                    </TableCell>
                  )}

                  {visibleColumns.includes("Reported By") && (
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Reported By
                    </TableCell>
                  )}

                  {visibleColumns.includes("Reason") && (
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Reason
                    </TableCell>
                  )}

                  {visibleColumns.includes("Date") && (
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      <TableSortLabel
                        active={true}
                        direction={sortDirection}
                        onClick={toggleSortDirection}
                        sx={{
                          color: "#fff !important",
                          "&.MuiTableSortLabel-root:hover": {
                            color: "#fff",
                          },
                          "& .MuiTableSortLabel-icon": {
                            color: "#fff !important",
                          },
                        }}
                      >
                        Date
                      </TableSortLabel>
                    </TableCell>
                  )}

                  {visibleColumns.includes("Status") && (
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Status
                    </TableCell>
                  )}

                  {visibleColumns.includes("Actions") && (
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((report) => (
                    <TableRow
                      key={report?._id}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      {visibleColumns.includes("Post") && (
                        <TableCell onClick={() => handleViewReport(report)}>
                          <Typography
                            fontWeight={"bold"}
                            variant="subtitle2"
                            noWrap
                            sx={{ maxWidth: isMobile ? 120 : 200 }}
                          >
                            {report?.post?.topic || "Untitled Post"}
                          </Typography>
                        </TableCell>
                      )}

                      {visibleColumns.includes("Reported By") && (
                        <TableCell onClick={() => handleViewReport(report)}>
                          <Box display="flex" alignItems="center">
                            <Avatar
                              sx={{ width: 24, height: 24, mr: 1 }}
                              src={
                                report?.reportedBy?.userImg || "../avatar.png"
                              }
                            />
                            <Typography variant="body2">
                              {report?.reportedBy?.firstName +
                                " " +
                                report?.reportedBy?.lastName}
                            </Typography>
                          </Box>
                        </TableCell>
                      )}

                      {visibleColumns.includes("Reason") && (
                        <TableCell onClick={() => handleViewReport(report)}>
                          <Typography noWrap sx={{ maxWidth: 200 }}>
                            {report?.reason}
                          </Typography>
                        </TableCell>
                      )}

                      {visibleColumns.includes("Date") && (
                        <TableCell onClick={() => handleViewReport(report)}>
                          {formatDate(report?.createdAt)}
                        </TableCell>
                      )}

                      {visibleColumns.includes("Status") && (
                        <TableCell onClick={() => handleViewReport(report)}>
                          <Chip
                            label={report?.status}
                            size="small"
                            sx={{
                              bgcolor: alpha(
                                getStatusChipColor(report?.status),
                                0.1
                              ),
                              fontWeight: "bold",
                              color: getStatusChipColor(report?.status),
                              border: `1px solid ${getStatusChipColor(
                                report?.status
                              )}`,
                            }}
                          />
                        </TableCell>
                      )}

                      {visibleColumns.includes("Actions") && (
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleViewReport(report)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length} align="center">
                      <Typography variant="body1" p={2}>
                        No reported posts found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAndSortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </DetailCard>

      {/* View Report Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullScreen={fullScreen}
        fullWidth="md"
        slotProps={{
          paper: {
            elevation: 3,
            sx: { borderRadius: 2, overflow: "hidden" },
          },
        }}
      >
        {selectedReport && (
          <>
            <DialogTitle
              bgcolor={theme.palette.primary.main}
              color="#fff"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
              }}
            >
              <Typography variant="h6" fontWeight="500">
                Report Details
              </Typography>
              <IconButton
                aria-label="close"
                onClick={() => setDialogOpen(false)}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={3} my={1}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      borderColor: theme.palette.divider,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary"
                      gutterBottom
                    >
                      Reporter Information
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{ mb: 2, mt: 1 }}
                    >
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          mr: 2,
                          border: `2px solid ${theme.palette.primary.light}`,
                        }}
                        src={
                          selectedReport?.reportedBy?.userImg || "../avatar.png"
                        }
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="500">
                          {selectedReport.reportedBy.firstName +
                            " " +
                            selectedReport?.reportedBy?.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(selectedReport.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Reason for Report:
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        py: 2,
                        backgroundColor: theme.palette.grey[50],
                        borderRadius: 1,
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2">
                        {selectedReport.reason}
                      </Typography>
                    </Paper>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Current Status:
                      </Typography>
                      <Chip
                        label={selectedReport?.status}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          bgcolor: alpha(
                            getStatusChipColor(selectedReport?.status),
                            0.1
                          ),
                          color: getStatusChipColor(selectedReport?.status),
                          border: `1px solid ${getStatusChipColor(
                            selectedReport?.status
                          )}`,
                        }}
                      />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      borderColor: theme.palette.divider,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color="primary"
                        gutterBottom
                      >
                        Content
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<OpenInNewIcon />}
                        onClick={() =>
                          navigateToPostDetail(selectedReport.post._id)
                        }
                      >
                        View Full Post
                      </Button>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      {selectedReport?.post?.topic}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ flexGrow: 1, overflow: "auto" }}
                    >
                      {selectedReport.post?.description}
                    </Typography>
                  </Paper>
                </Grid>

                {selectedReport.status === "Pending" && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                        mt: 1,
                      }}
                    >
                      <Button
                        color="success"
                        variant="outlined"
                        startIcon={
                          loading ? (
                            <CircularProgress size={16} />
                          ) : (
                            <CheckCircleIcon color="success" />
                          )
                        }
                        onClick={() =>
                          handleIgnorePost(selectedReport.post?._id)
                        }
                        disabled={loading}
                      >
                        Ignore
                      </Button>
                      <Button
                        sx={{ color: "#fff" }}
                        color="error"
                        variant="contained"
                        startIcon={
                          loading ? (
                            <CircularProgress size={16} />
                          ) : (
                            <DeleteIcon sx={{ color: "#fff" }} />
                          )
                        }
                        onClick={() => handleRemovePost(selectedReport)}
                        disabled={loading}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ReportedContent;
