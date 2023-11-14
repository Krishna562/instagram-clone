import Input from "../../components/Input";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import yupLoginSchema from "../../yupSchema/login";
import axios from "../../axios/axios";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setErr } from "../../store/reducers/Error/errReducer";
import {
  checkAuthStatus,
  setCurrentUser,
} from "../../store/reducers/User/userReducer";

const Login = () => {
  const isAuthenticated = useSelector((state) => state.user.isLoggedIn);
  const methods = useForm({ resolver: yupResolver(yupLoginSchema) });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  const onSubmit = methods.handleSubmit(async (data) => {
    const { email, password } = data;
    try {
      const result = await axios.put("/login", {
        email,
        password,
      });
      const user = result.data.user;
      dispatch(setCurrentUser(user));
      dispatch(checkAuthStatus(true));
      navigate("/");
    } catch (err) {
      dispatch(setErr(err.response.data));
    }
  });

  return (
    <FormProvider {...methods}>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Input field={"email"} type={"text"} placeholder={"Email"} />
        <Input field={"password"} type={"password"} placeholder={"Password"} />
        <Link className="form__forgotPassword" to={"/forgotPassword"}>
          forgot password?
        </Link>
        <button className="btn" onClick={onSubmit}>
          Log In
        </button>
        <p className="form__signupLink">
          New to Instagram ? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </FormProvider>
  );
};

export default Login;
