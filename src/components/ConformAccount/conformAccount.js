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
import { Alert, AlertTitle } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { nanoid } from "nanoid";
import { forOwn } from "lodash";

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import ReactLoading from "react-loading";
import HashLoader from "react-spinners/HashLoader";

import "./conformAccount.css";

function ConformAccount(props) {
  // extract the token from  the query string and do a request to the server with that token and get the response and based on that response show a success msg and give an option to go to the login page.

  const [errorsArray, setErrorsArray] = useState([]);
  const [isErrors, setIsErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConformAccountSuccess, setIsConformAccountSuccess] = useState(null);

  let [qParams] = useSearchParams();
  const displayError = [];

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  useEffect(() => {
    (async () => {
      const qRes = await fetch("/api/v1/auth/conform-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: qParams.get("token") }),
      })
        .then((data) => data.json())
        .catch((err) => {
          setIsConformAccountSuccess(false);
          setIsLoading(false);
        });

      // console.log(qRes);
      if (qRes.success === true) {
        setIsConformAccountSuccess(true);
        setIsLoading(false);
      }
      if (qRes.success === false && qRes.areErrors === true) {
        setIsConformAccountSuccess(false);
        setIsLoading(false);
        setIsErrors(true);
        setErrorsArray(qRes.error);
      }
    })();
  }, []);

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

  if (
    qParams.get("token") === "" ||
    qParams.get("token") === null ||
    !qParams.get("token") ||
    (isLoading === false && isConformAccountSuccess === false)
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
            <Typography variant="body">Went Wrong .</Typography>
          </Typography>
          {displayError}
          <Link to="/">
            <Button variant="contained">Go to Login Page</Button>
          </Link>
        </Box>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <div className="sweet-loading">
        {/* <ReactLoading type={"bars"} color={"blue"} height={667} width={375} /> */}
        <HashLoader loading={isLoading} size={"150"} color={"#1565c0"} />
      </div>
    );
  }
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
          Account Conformed !!!
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography component="h1" variant="subtitle1">
            your account has been successfully conformed .
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

export default ConformAccount;
