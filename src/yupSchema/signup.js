import * as yup from "yup";

const yupSignupSchema = yup.object().shape({
  username: yup
    .string()
    .required("This field is required")
    .min(3, "Username must be atleast 3 characters long"),
  email: yup.string().required("This field is required").email("Invalid email"),
  password: yup
    .string()
    .required("This field is required")
    .min(4, "Password must be atleast 4 characters long"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("This field is required"),
});

export default yupSignupSchema;
