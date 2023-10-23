import Input from "../../components/Input";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const ForgotPassword = () => {
  const yupSchema = yup.object().shape({
    email: yup
      .string()
      .required("This field is required")
      .email("Invalid email"),
  });

  const methods = useForm({ resolver: yupResolver(yupSchema) });

  const onSubmit = methods.handleSubmit((data) => {
    console.log(data);
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
