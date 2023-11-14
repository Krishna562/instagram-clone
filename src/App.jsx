import { Routes, Route, useNavigate } from "react-router-dom";
import Signup from "./views/auth/Signup";
import Home from "./views/home/Home";
import Login from "./views/auth/Login";
import ForgotPassword from "./views/auth/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import { useSelector } from "react-redux";
import axios from "./axios/axios.js";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import {
  checkAuthStatus,
  setCurrentUser,
} from "./store/reducers/User/userReducer";
import { setErr } from "./store/reducers/Error/errReducer";
import Layout from "./components/Layout";
import Profile from "./components/Profile/Profile";
import PageNotFound from "./views/page not found/PageNotFound";
import RequestSent from "./views/auth/RequestSent.jsx";
import ResetPassword from "./views/auth/ResetPassword.jsx";
import { setIsDarkTheme } from "./store/reducers/More/moreReducer.js";

function App() {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = useSelector((state) => state.user.isLoggedIn);
  const isDarkTheme = useSelector((state) => state.more.isDarkTheme);

  useEffect(() => {
    userLoggedIn(() => {
      if (JSON.parse(localStorage.getItem("isDarkTheme")) === null) {
        localStorage.setItem("isDarkTheme", JSON.stringify(true));
      } else {
        dispatch(
          setIsDarkTheme(JSON.parse(localStorage.getItem("isDarkTheme")))
        );
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("isDarkTheme"))) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [isDarkTheme]);

  const userLoggedIn = async (cb) => {
    try {
      const result = await axios.get("/loggedIn");
      dispatch(checkAuthStatus(result.data.isLoggedIn));
      dispatch(setCurrentUser(result.data.user));
    } catch (err) {
      dispatch(checkAuthStatus(false));
      dispatch(setErr(err.response.data));
    } finally {
      cb();
    }
  };

  if (!isLoading) {
    return (
      <>
        <Routes>
          <Route
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/:username"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/request-sent" element={<RequestSent />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route element={<PageNotFound />} />
        </Routes>
      </>
    );
  }
}

export default App;
