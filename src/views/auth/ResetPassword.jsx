import { useDispatch } from "react-redux";
import Input from "../../components/Input";
import { FormProvider, useForm } from "react-hook-form";
import { setErr } from "../../store/reducers/Error/errReducer";
import axios from "../../axios/axios";
import { useNavigate, useParams } from "react-router-dom";
import resetPasswordSchema from "../../yupSchema/resetPassword";
import { yupResolver } from "@hookform/resolvers/yup";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useParams().token;
  console.log(token);

  const methods = useForm({ resolver: yupResolver(resetPasswordSchema) });

  const onSubmit = methods.handleSubmit(async (data) => {
    const newPassword = data.newPassword;
    try {
      const result = await axios.put("/reset-password", {
        newPassword: newPassword,
        resetToken: token,
      });
      console.log(result.data.messsage);
      navigate("/login");
    } catch (err) {
      console.log(err);
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
        <Input
          field={"newPassword"}
          type={"password"}
          placeholder={"New password"}
        />
        <Input
          field={"confirmNewPassword"}
          type={"password"}
          placeholder={"Confirm new password"}
        />
        <button className="btn" onClick={onSubmit}>
          Change Password
        </button>
      </form>
    </FormProvider>
  );
};

export default ResetPassword;
