import * as yup from "yup";

const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("This field is required")
    .min(4, "The password must be atleast 4 characters long"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")])
    .required("This field is required"),
});

export default resetPasswordSchema;
