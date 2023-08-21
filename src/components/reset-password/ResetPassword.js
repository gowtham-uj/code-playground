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
import KeyIcon from "@mui/icons-material/Key";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";

import { nanoid } from "nanoid";
import { forOwn } from "lodash";

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import PassResetSuccess from "../PassResetSuccess/PassResetSuccess";

// function Copyright(props) {
//   return (
//     <Typography
//       variant="body2"
//       color="text.secondary"
//       align="center"
//       {...props}
//     >
//       {"Copyright © "}
//       <Link color="inherit" href="#">
//         HR Helper
//       </Link>{" "}
//       {new Date().getFullYear()}
//       {"."}
//     </Typography>
//   );
// }

function ResetPassword(props) {
  let [qParams] = useSearchParams();
  const [newPasswordVal, setNewPasswordVal] = useState("");
  const [confNewPasswordVal, setConNewPasswordVal] = useState("");
  const [isPassResetSuccess, setIsPassResetSuccess] = useState(null);
  const [areErrors, setAreErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorsArray, setErrorsArray] = useState([]);
  const [isErrors, setIsErrors] = useState(false);

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  let loadingSpinner = "SignIn";

  if (isLoading) {
    loadingSpinner = <CircularProgress />;
  }

  const [displayError, setDisplayError] = useState([]);

  async function resetPassword(credentials) {
    return fetch("/api/v1/auth/password-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((data) => {
        setIsLoading(false);
        return data.json();
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }

  if (
    qParams.get("token") === "" ||
    qParams.get("token") === null ||
    !qParams.get("token")
  ) {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "40vw",
          }}
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{ marginTop: 2, marginBottom: 2 }}
          >
            <Typography variant="body">Something </Typography>
            <Typography variant="body">Went Wrong.</Typography>
          </Typography>
          <Link to="/">
            <Button variant="contained">Go to Login Page</Button>
          </Link>
        </Box>
      </Container>
    );
  }

  if (isPassResetSuccess) {
    return <PassResetSuccess />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    let resetPassReq = await resetPassword({
      token: qParams.get("token"),
      password: newPasswordVal,
      conformPassword: confNewPasswordVal,
    });

    console.log(resetPassReq);
    if (resetPassReq.success) {
      setIsPassResetSuccess(true);
    } else if (resetPassReq.success === false) {
      setDisplayError([
        <Alert severity="error" key={nanoid()} sx={{ width: 1, m: 1 }}>
          {/* <AlertTitle>{key}</AlertTitle> */}
          something went wrong please try again later
        </Alert>,
      ]);
    }

    // console.log(props);
  };

  return (
    <Container component="main" maxWidth="xs">
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
          <KeyIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Set new password
        </Typography>
        {displayError}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="new-password"
            label="New Password"
            name="new-password"
            type="password"
            autoFocus
            // error={}
            onChange={(e) => {
              setNewPasswordVal(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="conform-new-password"
            label="Conform New Password"
            type="password"
            id="conform-new-password"
            onChange={(e) => {
              // console.log(e.target.value);
              setConNewPasswordVal(e.target.value);
            }}
          />
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loadingSpinner}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ResetPassword;
