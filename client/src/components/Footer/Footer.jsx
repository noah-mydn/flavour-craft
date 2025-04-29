import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  useTheme,
  useMediaQuery,
  Divider,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        bgcolor: "primary.dark",
        color: "primary.contrastText",
        py: 6,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and About */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="bold"
              fontFamily={theme.typography.fontFamily[0]}
            >
              FlavourCraft
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, maxWidth: "90%" }}>
              Discover delicious recipes customized to your taste preferences
              and dietary needs.
            </Typography>

            {/* Contact Info */}
            <Stack spacing={1} sx={{ mt: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">
                  123 Culinary Street, Foodie City, FC 12345
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailIcon fontSize="small" />
                <Link
                  href="mailto:info@reciperecommender.com"
                  color="inherit"
                  underline="hover"
                >
                  info@reciperecommender.com
                </Link>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon fontSize="small" />
                <Link href="tel:+11234567890" color="inherit" underline="hover">
                  +1 (123) 456-7890
                </Link>
              </Stack>
            </Stack>
          </Grid>

          {/* Useful Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="bold"
              fontFamily={theme.typography.fontFamily[0]}
            >
              Useful Links
            </Typography>
            <Stack spacing={1} sx={{ mt: 2 }}>
              <Link href="/recipes" color="inherit" underline="hover">
                All Recipes
              </Link>
              <Link href="/recipes/me/saved" color="inherit" underline="hover">
                Saved Recipes
              </Link>
              <Link
                href="/recipes/me/generated"
                color="inherit"
                underline="hover"
              >
                Generated Recipes
              </Link>

              <Link href="/post" color="inherit" underline="hover">
                Community
              </Link>

              <Link href="/terms" color="inherit" underline="hover">
                Terms of Service
              </Link>
            </Stack>
          </Grid>

          {/* Newsletter and Social */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="bold"
              fontFamily={theme.typography.fontFamily[0]}
            >
              Connect With Us
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
              Follow us on social media
            </Typography>

            {/* Social Icons */}
            <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
              <IconButton
                aria-label="Facebook"
                sx={{
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.light" },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                aria-label="Twitter"
                sx={{
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.light" },
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                aria-label="Instagram"
                sx={{
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.light" },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                aria-label="X"
                sx={{
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.light" },
                }}
              >
                <XIcon />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "primary.light", my: 4 }} />

        {/* Copyright */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "center" : "flex-start",
            textAlign: isMobile ? "center" : "left",
            gap: 2,
          }}
        >
          <Typography variant="body2">
            © {currentYear} FlavourCraft. All Rights Reserved.
          </Typography>

          <Typography variant="body2">Designed by May Yadanar</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
