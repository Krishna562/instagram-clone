import { Routes, Route } from "react-router-dom";
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
import Profile from "./components/profile";
import PageNotFound from "./views/page not found/pageNotFound";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector((state) => state.user.isLoggedIn);
  const userLoggedIn = async (cb) => {
    try {
      const result = await axios.get("/loggedIn");
      dispatch(checkAuthStatus(result.data.isLoggedIn));
      dispatch(setCurrentUser(result.data.user));
    } catch (err) {
      dispatch(setErr(err.response.data));
    } finally {
      cb();
    }
  };

  useEffect(() => {
    userLoggedIn(() => {
      setIsLoading(false);
    });
  }, []);

  if (!isLoading) {
    return (
      <>
        <Routes>
          <Route element={<Layout />}>
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
          <Route path="/404" element={<PageNotFound />} />
        </Routes>
      </>
    );
  }
}

export default App;
