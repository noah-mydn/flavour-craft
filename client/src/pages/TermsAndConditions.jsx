import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import theme from "../theme/theme";

const TermsAndConditions = () => {
  return (
    <Box
      sx={{
        padding: "1rem 3rem",
      }}
    >
      <Typography variant="h3">Terms & Conditions</Typography>

      <Box
        sx={{
          color: "#2F4F4F",
          //width: "70%",
          textAlign: "justify",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            paddingTop: "1rem",
          }}
        >
          Welcome to FlavourCraft! We’re excited to have you here. These Terms
          and Conditions outline how you can use FlavourCraft, including our
          website, app, and services. By signing up, browsing, or contributing,
          you agree to these terms. If not, kindly refrain from using our
          platform.
        </Typography>

        <Box
          sx={{ padding: "2rem 0" }}
          fontFamily={theme.typography.fontFamily[2]}
        >
          FlavourCraft is a space to discover, share, and enjoy recipes. To keep
          it a safe and enjoyable experience for all:
          <ul style={{ listStyle: "outside", paddingTop: "15px" }}>
            <li>
              You must be at least 13 years old (or have parental consent if
              under 18).
            </li>
            <li>
              Ensure that any details you provide are accurate and up to date.
            </li>
            <li>
              Keep your account secure—any misuse or suspicious activity should
              be reported immediately.{" "}
            </li>
            <li>
              We reserve the right to suspend accounts that violate our
              guidelines.
            </li>
          </ul>
        </Box>
      </Box>
      <Divider />
      <Box
        py={2}
        sx={{
          color: "#2F4F4F",
          //width: "70%",
          textAlign: "justify",
        }}
      >
        <Typography variant="h5" pb={1} fontWeight="bold">
          Privacy Policy
        </Typography>
        <Typography variant="body1" textAlign="justify">
          Your privacy matters to us: We only store data to refine and improve
          personalized recommendations. Your data is never shared with third
          parties. If you wish to remove personal data, you can delete it at any
          time. You have the option to delete your account permanently.
        </Typography>
      </Box>
      <Divider />
      <Box
        py={2}
        sx={{
          color: "#2F4F4F",
          //width: "70%",
          textAlign: "justify",
        }}
      >
        <Typography variant="h5" pb={1} fontWeight="bold">
          Rights, Responsibilities & Liabilities
        </Typography>
        <Typography variant="body1" textAlign="justify">
          Our logo, brand, and original content belong to FlavourCraft—don’t use
          them without permission. FlavourCraft is provided "as is"—we can’t
          guarantee uninterrupted or error-free service. We’re not liable for
          damages arising from your use of the platform. These terms may be
          updated occasionally. Continuing to use FlavourCraft after changes
          means you accept the new terms.
        </Typography>
      </Box>
    </Box>
  );
};

export default TermsAndConditions;
