import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { forOwn } from "lodash";

// material design imports
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert, AlertTitle, CircularProgress, Snackbar } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function SignUp(props) {
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  const [nameValue, setNameValue] = useState("");

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [conformPasswordVal, setConformPasswordVal] = useState("");
  const [errorsArray, setErrorsArray] = useState([]);
  const [isErrors, setIsErrors] = useState(false);
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function signUpUser(signUpData) {
    return fetch("/api/v1/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpData),
    })
      .then((data) => {
        setIsLoading(false);
        return data.json();
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }

  const displayError = [];
  let loadingSpinner = "SignUp";

  if (isLoading) {
    loadingSpinner = <CircularProgress />;
  }
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

  // if (isSignUpSuccess === true) {
  //   return <></>;
  // }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // console.log(props);
    setIsLoading(true);
    const queryRes = await signUpUser({
      name: nameValue,
      email: emailValue,
      password: passwordValue,
      conformPassword: conformPasswordVal,
    });

    console.log(queryRes);
    if (!queryRes) {
      return;
    }

    // console.log(queryRes);
    if (queryRes.success === true && queryRes.msg.userCreated === true) {
      setIsSignUpSuccess(true);
    } else if (queryRes.success === false && queryRes.areErrors === true) {
      setIsErrors(true);
      setErrorsArray(queryRes.error);
      setIsSignUpSuccess(false);
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 3,
          marginBottom: 7,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <AccountCircleIcon fontSize="medium" />
        </Avatar>
        <Typography variant="h3" component="h2">
          SignUp
        </Typography>
        {displayError}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="your name"
            name="name"
            autoComplete="name"
            autoFocus
            // error={}
            onChange={(e) => {
              setNameValue(e.target.value);
            }}
          />
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={(e) => {
              // console.log(e.target.value);
              setPasswordValue(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="conformPassword"
            label="Conform Password"
            type="password"
            id="conformPassword"
            onChange={(e) => {
              // console.log(e.target.value);
              setConformPasswordVal(e.target.value);
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

          <Grid container>
            <Grid item sx={{ mb: 3 }}>
              <NavLink to="/">
                {"Already a member, please login to continue"}
              </NavLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={isSignUpSuccess}
        // message={`successfully created a user \n please login to continue`}
        autoHideDuration={6000}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {`successfully created a user \n please login to continue`}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={isSignUpSuccess}
        // message={`successfully created a user \n please login to continue`}
        autoHideDuration={6000}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {`please verify your account by following the instructions send to your given mail id .`}
        </Alert>
      </Snackbar>
    </Container>
  );
}
