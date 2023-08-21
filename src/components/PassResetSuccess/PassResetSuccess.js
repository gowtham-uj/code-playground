import * as React from "react";

import { Container, Typography, Button } from "@mui/material";
import Box from "@mui/material/Box";
import { maxWidth } from "@mui/system";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Alert, AlertTitle } from "@mui/material";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import { forOwn } from "lodash";

function PassResetSuccess() {
  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 8 }}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <CheckCircleIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Password reset
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography component="h1" variant="subtitle1">
            your password has been successfully reset.
          </Typography>
          <Typography component="h1" variant="subtitle1">
            click below to navigate to the login.
          </Typography>

          <Typography
            component="h1"
            variant="body2"
            sx={{ textAlign: "center", marginTop: 2 }}
          >
            <Link to="/">
              <Button variant="contained">Go to Login Page</Button>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default PassResetSuccess;
