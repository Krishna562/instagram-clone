import Input from "../../components/Input";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { setErr } from "../../store/reducers/Error/errReducer";
import axios from "../../axios/axios";

const ForgotPassword = () => {
  const isAuthenticated = useSelector((state) => state.user.isLoggedIn);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  // IF NOT AUTHENTICATED

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const yupSchema = yup.object().shape({
    email: yup
      .string()
      .required("This field is required")
      .email("Invalid email"),
  });

  const methods = useForm({ resolver: yupResolver(yupSchema) });

  const sendRequestEmail = async (email) => {
    try {
      const result = await axios.put("/resetPass-request", {
        email: email,
      });
      navigate("/request-sent");
    } catch (err) {
      console.log(err.response.data);
      dispatch(setErr(err.response.data));
    }
  };

  const onSubmit = methods.handleSubmit((data) => {
    sendRequestEmail(data.email);
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
        <button className="btn" onClick={onSubmit}>
          Send password reset request
        </button>
      </form>
    </FormProvider>
  );
};

export default ForgotPassword;
