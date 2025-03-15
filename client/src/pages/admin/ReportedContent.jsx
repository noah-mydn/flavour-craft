// src/pages/ReportedContent.js
import React, { useState } from "react";
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
  DialogActions,
  TextField,
  Divider,
  Avatar,
  Paper,
  Grid,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningIcon from "@mui/icons-material/Warning";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlagIcon from "@mui/icons-material/Flag";
import PageHeader from "../../components/Admin/PageHeader";

// Sample data for reported content
const reportedContentData = [
  {
    id: 1,
    title: "Spicy Chicken Recipe",
    reportReason: "Inappropriate content",
    reportedBy: "user123",
    reportDate: "2025-03-10",
    status: "Pending",
    recipeContent:
      "This is a spicy chicken recipe with detailed instructions...",
    userComments:
      "This recipe contains inappropriate language and unsafe cooking instructions.",
  },
  {
    id: 2,
    title: "Chocolate Cake",
    reportReason: "Copyright infringement",
    reportedBy: "baker456",
    reportDate: "2025-03-12",
    status: "Pending",
    recipeContent: "A detailed chocolate cake recipe with instructions...",
    userComments:
      "This recipe was copied directly from my blog without permission.",
  },
  {
    id: 3,
    title: "Green Smoothie",
    reportReason: "Health misinformation",
    reportedBy: "healthnut789",
    reportDate: "2025-03-14",
    status: "Pending",
    recipeContent:
      "Green smoothie with various ingredients and health claims...",
    userComments:
      "This recipe makes dangerous health claims about curing conditions.",
  },
  {
    id: 4,
    title: "Seafood Pasta",
    reportReason: "Spam",
    reportedBy: "chef101",
    reportDate: "2025-03-11",
    status: "Resolved",
    recipeContent: "Seafood pasta recipe with detailed preparation steps...",
    userComments:
      "The post contains multiple unnecessary links to external products.",
  },
  {
    id: 5,
    title: "Vegan Burger",
    reportReason: "Misleading information",
    reportedBy: "veggielover",
    reportDate: "2025-03-09",
    status: "Rejected",
    recipeContent:
      "Vegan burger recipe with full ingredients list and steps...",
    userComments:
      "The recipe claims to be vegan but includes honey as an ingredient.",
  },
];

const ReportedContent = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionNote, setActionNote] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const handleActionDialog = (report, type) => {
    setSelectedReport(report);
    setActionType(type);
    setActionDialogOpen(true);
  };

  const handleAction = () => {
    // In a real app, this would submit the action to the backend
    console.log(
      `Taking ${actionType} action on report #${selectedReport.id} with note: ${actionNote}`
    );
    setActionDialogOpen(false);
    // Here you would update the report status, etc.
  };

  const getStatusChipProps = (status) => {
    switch (status) {
      case "Pending":
        return { color: "warning", icon: <FlagIcon /> };
      case "Resolved":
        return { color: "success", icon: <CheckCircleIcon /> };
      case "Rejected":
        return { color: "error", icon: <BlockIcon /> };
      default:
        return { color: "default", icon: null };
    }
  };

  return (
    <Box>
      <PageHeader
        title="Reported Content"
        description="Review and manage content reported by users"
        buttonText="Export Reports"
        buttonIcon={<FlagIcon />}
        onButtonClick={() => console.log("Export reports")}
      />

      <Card>
        <CardContent>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Report Reason</TableCell>
                  <TableCell>Reported By</TableCell>
                  <TableCell>Report Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportedContentData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((report) => {
                    const statusChipProps = getStatusChipProps(report.status);

                    return (
                      <TableRow key={report.id} hover>
                        <TableCell>{report.title}</TableCell>
                        <TableCell>{report.reportReason}</TableCell>
                        <TableCell>{report.reportedBy}</TableCell>
                        <TableCell>{report.reportDate}</TableCell>
                        <TableCell>
                          <Chip
                            label={report.status}
                            color={statusChipProps.color}
                            size="small"
                            icon={statusChipProps.icon}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            onClick={() => handleViewReport(report)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          {report.status === "Pending" && (
                            <>
                              <IconButton
                                color="warning"
                                onClick={() =>
                                  handleActionDialog(report, "warning")
                                }
                              >
                                <WarningIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() =>
                                  handleActionDialog(report, "suspend")
                                }
                              >
                                <BlockIcon />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={reportedContentData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* View Report Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedReport && (
          <>
            <DialogTitle>Report Details: {selectedReport.title}</DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Report Information
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                        {selectedReport.reportedBy.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          Reported by: {selectedReport.reportedBy}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          on {selectedReport.reportDate}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="subtitle2">Report Reason:</Typography>
                    <Typography variant="body2" paragraph>
                      {selectedReport.reportReason}
                    </Typography>
                    <Typography variant="subtitle2">User Comments:</Typography>
                    <Typography variant="body2" paragraph>
                      {selectedReport.userComments}
                    </Typography>
                    <Typography variant="subtitle2">Current Status:</Typography>
                    <Chip
                      label={selectedReport.status}
                      color={getStatusChipProps(selectedReport.status).color}
                      size="small"
                      icon={getStatusChipProps(selectedReport.status).icon}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Reported Content
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                    <Typography variant="body2" paragraph>
                      {selectedReport.recipeContent}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              {selectedReport.status === "Pending" && (
                <>
                  <Button
                    color="warning"
                    variant="outlined"
                    startIcon={<WarningIcon />}
                    onClick={() => {
                      setDialogOpen(false);
                      handleActionDialog(selectedReport, "warning");
                    }}
                  >
                    Issue Warning
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    startIcon={<BlockIcon />}
                    onClick={() => {
                      setDialogOpen(false);
                      handleActionDialog(selectedReport, "suspend");
                    }}
                  >
                    Suspend Content
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Action Dialog */}
      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
      >
        {selectedReport && (
          <>
            <DialogTitle>
              {actionType === "warning" ? "Issue Warning" : "Suspend Content"}
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" paragraph>
                You are about to{" "}
                {actionType === "warning"
                  ? "issue a warning to"
                  : "suspend content from"}{" "}
                user "{selectedReport.reportedBy}" for their post "
                {selectedReport.title}".
              </Typography>
              <TextField
                fullWidth
                label="Note to User"
                multiline
                rows={4}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder={
                  actionType === "warning"
                    ? "Explain the warning reason to the user..."
                    : "Explain the suspension reason to the user..."
                }
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
              <Button
                color={actionType === "warning" ? "warning" : "error"}
                variant="contained"
                onClick={handleAction}
              >
                Confirm {actionType === "warning" ? "Warning" : "Suspension"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ReportedContent;
