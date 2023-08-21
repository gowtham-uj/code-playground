// function MagicLogin() {
//   return <h1> magic login form</h1>;
// }

// material design imports
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockResetIcon from "@mui/icons-material/LockReset";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert, AlertTitle } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

// other import
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { nanoid } from "nanoid";
import { forOwn } from "lodash";

async function getMagicLink(email) {
  return fetch("/api/v1/auth/gml", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  }).then((data) => data.json());
}

export default function MagicLogin(props) {
  const [emailValue, setEmailValue] = useState();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorsArray, setErrorsArray] = useState([]);
  const [isErrors, setIsErrors] = useState(false);
  // const [successMsgEl, ]
  let displaySuccess = [];

  const displayError = [];
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  if (isErrors === true) {
    errorsArray.forEach((errObj) => {
      forOwn(errObj, (value, key) => {
        const errorObj = (
          <Alert severity="error" key={nanoid()} sx={{ width: 1, m: 1 }}>
            <AlertTitle>{key}</AlertTitle>
            {value}
          </Alert>
        );
        displayError.push(errorObj);
      });
    });
  }

  if (isSuccess === true) {
    const successMsg = (
      <Alert severity="success" key={nanoid()} sx={{ width: 1, m: 1 }}>
        {/* <AlertTitle>{key}</AlertTitle> */}A magic link has been sent to your
        mail id if your account is registered with our app. The magic links
        helps to login in to your account with out entering password, please
        check your mail id to login with out password .
      </Alert>
    );

    displaySuccess.push(successMsg);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(emailValue);

    const queryRes = await getMagicLink(emailValue);
    console.log(queryRes);
    if (queryRes.success === true) {
      // const successMsg = (
      //   <Alert severity="success" key={nanoid()} sx={{ width: 1, m: 1 }}>
      //     {/* <AlertTitle>{key}</AlertTitle> */}a password instruction has been
      //     sent to the given email if your email is registered with our
      //     application.
      //   </Alert>
      // );

      // displaySuccess.push(successMsg);
      setIsSuccess(true);
    } else if (queryRes.success === false && queryRes.areErrors === true) {
      setIsErrors(true);
      setErrorsArray(queryRes.error);
    }
  }
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
          <LockIcon fontSize="medium" />
        </Avatar>
        <Typography variant="h3" component="h2" sx={{ mb: 1 }}>
          Magic Login
        </Typography>
        <Typography
          component="h6"
          variant="subtitle1"
          sx={{ color: "text.secondary" }}
        >
          tired of entering long passwords, no worries we will send a magic link
          to your mail id that logs u into your account without entering your
          password .
        </Typography>
        {displayError}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            // error={}
            onChange={(e) => {
              setEmailValue(e.target.value);
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send magic link
          </Button>
          {displaySuccess}
          <Grid container>
            <Grid item xs sx={{ mt: 3 }}>
              <NavLink to="/">
                <ArrowBackIcon fontSize="small" />
                Back to login
              </NavLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
