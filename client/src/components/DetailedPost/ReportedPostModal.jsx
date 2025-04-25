import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Box,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";

const ReportPostModal = ({ open, onClose, postId, onSubmit }) => {
  const theme = useTheme();
  const [reportReason, setReportReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    "Inappropriate content",
    "Harmful or dangerous recipe",
    "Misinformation about ingredients/methods",
    "Spam or promotional content",
    "Copyright violation",
    "Other",
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const reason =
      reportReason === "Other" && otherReason.trim()
        ? otherReason.trim()
        : reportReason;

    try {
      await onSubmit(postId, reason);
      handleClose();
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReportReason("");
    setOtherReason("");
    onClose();
  };

  const isSubmitDisabled =
    !reportReason || (reportReason === "Other" && !otherReason.trim());

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: theme.palette.common.white,
          bgcolor: theme.palette.primary.main,
        }}
      >
        <FlagIcon />
        <Typography variant="h6" component="span" fontWeight={600}>
          Report Recipe Post
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please select a reason for reporting this post. Your report will be
          reviewed by our moderation team.
        </Typography>

        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          >
            {reportReasons.map((reason) => (
              <FormControlLabel
                key={reason}
                value={reason}
                control={
                  <Radio
                    sx={{
                      color: theme.palette.text.secondary,
                      "&.Mui-checked": {
                        color: theme.palette.error.main,
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: reportReason === reason ? 500 : 400,
                      color:
                        reportReason === reason
                          ? theme.palette.text.primary
                          : theme.palette.text.secondary,
                    }}
                  >
                    {reason}
                  </Typography>
                }
                sx={{
                  mb: 1,
                  pb: 0.5,
                  borderRadius: 1,
                  backgroundColor:
                    reportReason === reason
                      ? alpha(theme.palette.error.main, 0.05)
                      : "transparent",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.error.main, 0.05),
                  },
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {reportReason === "Other" && (
          <Box mt={2}>
            <TextField
              label="Please specify"
              fullWidth
              multiline
              rows={3}
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="Please explain why you're reporting this post..."
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
              }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            color: theme.palette.text.primary,
            borderColor: theme.palette.divider,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitDisabled || isSubmitting}
          color="primary"
          disableElevation
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            ml: 1,
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportPostModal;
