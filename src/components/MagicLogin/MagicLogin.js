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
import { replace } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { getLocalStorage, setLocalStorage } from "../../utils/getToken.js";
import { authSlice } from "../../store/authSlice";

export default function MagicLogin(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMagicLoginSuccess, setIsMagicLoginSuccess] = useState(null);
  const [errorsArray, setErrorsArray] = useState([]);
  const [isErrors, setIsErrors] = useState(false);

  const authState = useSelector((state) => {
    return state.auth;
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let [qParams] = useSearchParams();

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  useEffect(() => {
    (async () => {
      const qRes = await fetch("/api/v1/auth/mg-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: qParams.get("token") }),
      })
        .then((data) => data.json())
        .catch((err) => {
          setIsMagicLoginSuccess(false);
          setIsLoading(false);
        });

      console.log(qRes);
      if (qRes.msg.magicSuccess === true) {
        dispatch(
          authSlice.actions.signIn({
            user: qRes.msg,

            error: false,
            isLoggedIn: true,
          })
        );
        const user = setLocalStorage("user", qRes.msg);
        navigate("/home", {
          replace: true,
          state: {
            authToken: qRes.msg,
            fromPage: "magic-login",
          },
        });
      }
      if (qRes.success === false) {
        setIsMagicLoginSuccess(false);
        setIsLoading(false);
      }
    })();
  }, []);

  if (
    qParams.get("token") === "" ||
    qParams.get("token") === null ||
    !qParams.get("token") ||
    (isLoading === false && isMagicLoginSuccess === false)
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
        <HashLoader loading={isLoading} size={"150"} color={"#1565c0"} />
      </div>
    );
  }
}
