import * as yup from "yup";

const SEQUENTIAL_PATTERN =
  /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i;
const REPEATED_PATTERN = /(.)\1{2,}/;

export const getSignUpSchema = (t) => {
  const passwordHint =
    t?.("auth.validation.passwordComplexity") ||
    "At least 8 characters with uppercase, lowercase, number, and special character";

  return yup.object({
    firstName: yup
      .string()
      .trim()
      .required(t?.("auth.validation.firstNameRequired") || "First Name is required"),
    lastName: yup
      .string()
      .trim()
      .required(t?.("auth.validation.lastNameRequired") || "Last Name is required"),
    email: yup
      .string()
      .trim()
      .email(t?.("auth.validation.emailInvalid") || "Invalid email")
      .required(t?.("auth.validation.emailRequired") || "Email is required"),
    password: yup
      .string()
      .required(t?.("auth.validation.passwordRequired") || "Password is required")
      .min(8, passwordHint)
      .max(128, t?.("auth.validation.passwordMax") || "Password must not exceed 128 characters")
      .matches(/[A-Z]/, passwordHint)
      .matches(/[a-z]/, passwordHint)
      .matches(/\d/, passwordHint)
      .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, passwordHint)
      .test(
        "no-sequential",
        t?.("auth.validation.passwordSequential") ||
          "Password must not contain sequential characters",
        (value) => (value ? !SEQUENTIAL_PATTERN.test(value) : true)
      )
      .test(
        "no-repeated",
        t?.("auth.validation.passwordRepeated") || "Password must not contain repeated characters",
        (value) => (value ? !REPEATED_PATTERN.test(value) : true)
      ),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref("password"), null],
        t?.("auth.validation.passwordsMustMatch") || "Passwords must match"
      )
      .required(t?.("auth.validation.confirmPasswordRequired") || "Confirm Password is required"),
    agreeToTerms: yup
      .boolean()
      .oneOf(
        [true],
        t?.("auth.validation.agreeToTerms") || "You must agree to terms and conditions"
      ),
  });
};

/** @deprecated use getSignUpSchema(t) for localized messages */
export const signUpSchema = getSignUpSchema();
