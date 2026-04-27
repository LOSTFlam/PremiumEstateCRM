import * as yup from "yup";

export const loginSchema = yup.object({
  identity: yup.string().trim().required("Email or username is required"),
  password: yup.string().required("Password is required"),
});
