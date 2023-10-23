import { Link } from "react-router-dom";
import Input from "../../components/Input";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "../../axios/axios.js";
import { useDispatch } from "react-redux";
import yupSignupSchema from "../../yupSchema/signup";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "../../store/reducers/User/userReducer";
import { setErr } from "../../store/reducers/Error/errReducer";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const methods = useForm({ resolver: yupResolver(yupSignupSchema) });
  const onSumbit = methods.handleSubmit(async (data) => {
    const { username, email, password, confirmPassword } = data;
    try {
      const result = await axios.put("/signup", {
        username,
        email,
        password,
        confirmPassword,
      });
      const user = result.data.user;
      dispatch(setCurrentUser(user));
      navigate("/login");
    } catch (err) {
      console.log(err);
      dispatch(setErr(err.response.data || err.message));
    }
  });

  return (
    <FormProvider {...methods}>
      <form
        className="form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Input placeholder="Username" type="text" field="username" />
        <Input placeholder="Email" type="text" field="email" />
        <Input placeholder="Password" type="password" field="password" />
        <Input
          placeholder="Confirm Password"
          type="password"
          field="confirmPassword"
        />
        <button
          className="btn"
          onClick={() => {
            onSumbit();
          }}
        >
          Sign Up
        </button>
        <p className="form__loginLink">
          Already a user ? <Link to="/login">Log In</Link>
        </p>
      </form>
    </FormProvider>
  );
};

export default Signup;
