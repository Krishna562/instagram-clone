import * as yup from "yup";

const yupLoginSchema = yup.object().shape({
  email: yup.string().required("This field is required").email("Invalid email"),
  password: yup.string().required("This field is required"),
});

export default yupLoginSchema;
