import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./store/store";
// component imports
import Home from "./pages/Home";
import CreateRoom from "./components/CreateRoom/CreateRoom";
import EditorPage from "./pages/EditorPage";
import SignIn from "./components/login/signIn.js";
import ForgotPassword from "./components/forgotPassword/forgotPassword";
import Dashboard from "./components/dashboard/dashboard";
import SignUp from "./components/signUp/SignUp";
import ResetPassword from "./components/reset-password/ResetPassword";
import GetMagicLogin from "./components/GetMagicLogin/GetMagicLogin";
import MagicLogin from "./components/MagicLogin/MagicLogin";
import ConformAccount from "./components/ConformAccount/conformAccount";

function App() {
  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              theme: {
                primary: "#4aed88",
              },
            },
          }}
        ></Toaster>
      </div>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<SignIn title="Sign in" />} />
            <Route path="/signup" exact element={<SignUp title="Sign Up" />} />
            <Route
              path="/forgot-password"
              exact
              element={<ForgotPassword title="Forgot Password" />}
            />
            <Route
              path="/conform-account"
              exact
              element={<ConformAccount title="Conform Account" />}
            />
            <Route
              path="/password-reset"
              exact
              element={<ResetPassword title="Password Reset" />}
            ></Route>
            <Route
              path="/get-ml"
              exact
              element={<GetMagicLogin title="Login with email" />}
            ></Route>
            <Route
              path="/magic-login"
              exact
              element={<MagicLogin title="Magic Login" />}
            ></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/create-room" element={<CreateRoom />}></Route>
            <Route path="/editor/:roomId" element={<EditorPage />}></Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;

/*
main bg color : #1c1e29  hsl(231,19%,14%)rgb(28,30,41)

box bg color : #282a36  hsl(231,15%,18%)rgb(40,42,54)

border color :
#4aed88  hsl(143,82%,61%)rgb(74,237,136)

*/
