import * as yup from "yup";

export const getLoginSchema = (t) =>
  yup.object({
    email: yup
      .string()
      .email(t?.("auth.validation.emailInvalid") || "Invalid email format")
      .required(t?.("auth.validation.emailRequired") || "Email is required"),
    password: yup
      .string()
      .required(t?.("auth.validation.passwordRequired") || "Password is required"),
  });

/** @deprecated use getLoginSchema(t) for localized messages */
export const loginSchema = getLoginSchema();
