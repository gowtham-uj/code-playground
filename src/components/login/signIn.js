// material design imports
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { Alert, AlertTitle, CircularProgress, Snackbar } from "@mui/material";
import { DomLink } from "react-router-dom";

import { Divider as HrDivider } from "@react-md/divider";

import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
// import { Alert, AlertTitle } from "@mui/material";

// hooks import
import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
// import useLocalStorage from "../../hooks/useToken";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { authSlice } from "../../store/authSlice";
import { nanoid } from "nanoid";
import { forOwn } from "lodash";

import { getLocalStorage, setLocalStorage } from "../../utils/getToken.js";

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
//         name
//       </Link>{" "}
//       {new Date().getFullYear()}
//       {"."}
//     </Typography>
//   );
// }

export default function SignIn(props) {
  // console.log("rendered");

  const authState = useSelector((state) => {
    return state.auth;
  });

  const dispatch = useDispatch();

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [errorsArray, setErrorsArray] = useState([]);
  const [userData, setUserData] = useState("");
  const [isErrors, setIsErrors] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const displayError = [];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      console.log(token, user);
      navigate("/home");
    }
    setUserData(user);
  }, [userData]);

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  let loadingSpinner = "SignIn";

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

  async function loginUser(credentials) {
    return fetch("/api/v1/auth/login", {
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

  if (authState.error === true) {
    for (const key in authState.errors.signIn) {
      const alertEl = (
        <Alert severity="error" key={nanoid()} sx={{ width: 1, m: 1 }}>
          {/* <AlertTitle>{key}</AlertTitle> */}
          please enter a valid {key}
        </Alert>
      );
      displayError.push(alertEl);
    }
  }

  if (location.state?.redirected) {
    const redirectAlertEl = (
      <Alert severity="error" key={nanoid()} sx={{ width: 1, m: 1 }}>
        {/* <AlertTitle>{key}</AlertTitle> */}
        please login to continue
      </Alert>
    );

    displayError.push(redirectAlertEl);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // console.log(props);
    setIsLoading(true);
    const token = await loginUser({
      email: emailValue,
      password: passwordValue,
    });

    // console.log(token);

    if (token.success === true) {
      dispatch(
        authSlice.actions.signIn({
          user: token.msg,
          error: false,
          isLoggedIn: true,
          jwtToken: token.msg.jwtToken,
        })
      );
      const user = setLocalStorage("user", token.msg);
      const authToken = setLocalStorage("token", token.msg.jwtToken);

      navigate("/home", {
        state: {
          authToken: token.msg,
          fromPage: "login",
        },
      });
    } else if (token.success === false && token.areErrors === true) {
      setIsErrors(true);
      setErrorsArray(token.error);
      // if (token.error === "email") {
      //   dispatch(
      //     authSlice.actions.signIn({
      //       user: {},
      //       error: true,
      //       isLoggedIn: false,
      //       errors: { email: true },
      //     })
      //   );
      // } else if (token.error === "password") {
      //   dispatch(
      //     authSlice.actions.signIn({
      //       user: {},
      //       error: true,
      //       errors: { password: true },
      //     })
      //   );
      // }
      // console.log(token.error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 5,
          marginBottom: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // backgroundColor: "#282a36",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {displayError}
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, mb: 2 }}
        >
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
            autoComplete="current-password"
            onChange={(e) => {
              // console.log(e.target.value);
              setPasswordValue(e.target.value);
            }}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
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
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6} sx={{ textAlign: "left", paddingLeft: "30px" }}>
            <NavLink to="/signup">Create account</NavLink>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            <NavLink to="/forgot-password">Forgot password</NavLink>
          </Grid>
        </Grid>
        <HrDivider />
        <Button
          component={NavLink}
          to="/get-ml"
          variant="contained"
          fullWidth
          color="primary"
          sx={{ mt: 0.5, mb: 4 }}
        >
          login with email
        </Button>
      </Box>
      {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
    </Container>
  );
}
