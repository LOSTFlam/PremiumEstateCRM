import * as yup from "yup";

const PASSWORD_HINT =
  "At least 8 characters with uppercase, lowercase, number, and special character";
const SEQUENTIAL_PATTERN =
  /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i;
const REPEATED_PATTERN = /(.)\1{2,}/;

export const signUpSchema = yup.object({
  firstName: yup.string().trim().required("First Name is required"),
  lastName: yup.string().trim().required("Last Name is required"),
  email: yup.string().trim().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, PASSWORD_HINT)
    .max(128, "Password must not exceed 128 characters")
    .matches(/[A-Z]/, PASSWORD_HINT)
    .matches(/[a-z]/, PASSWORD_HINT)
    .matches(/\d/, PASSWORD_HINT)
    .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, PASSWORD_HINT)
    .test("no-sequential", "Password must not contain sequential characters", (value) =>
      value ? !SEQUENTIAL_PATTERN.test(value) : true
    )
    .test("no-repeated", "Password must not contain repeated characters", (value) =>
      value ? !REPEATED_PATTERN.test(value) : true
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  agreeToTerms: yup.boolean().oneOf([true], "You must agree to terms and conditions"),
});
