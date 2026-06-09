import * as Yup from "yup";

export const emailValidation = () =>
  Yup.string().email("Invalid email address").required("Email is required");

export const phoneValidation = (required = true) => {
  let schema = Yup.string().matches(/^\+?[\d\s-()]+$/, "Invalid phone number");
  return required ? schema.required("Phone is required") : schema;
};

export const passwordValidation = (minLength = 8) =>
  Yup.string()
    .min(minLength, `Password must be at least ${minLength} characters`)
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required");

export const nameValidation = (fieldName = "Name") =>
  Yup.string()
    .min(2, `${fieldName} must be at least 2 characters`)
    .max(50, `${fieldName} must be at most 50 characters`)
    .required(`${fieldName} is required`);

export const urlValidation = () => Yup.string().url("Invalid URL").required("URL is required");

export const requiredString = (fieldName = "Field") =>
  Yup.string().min(1, `${fieldName} cannot be empty`).required(`${fieldName} is required`);

export const requiredNumber = (fieldName = "Field") =>
  Yup.number().typeError(`${fieldName} must be a number`).required(`${fieldName} is required`);

export const positiveNumber = (fieldName = "Field") =>
  Yup.number()
    .typeError(`${fieldName} must be a number`)
    .positive(`${fieldName} must be positive`)
    .required(`${fieldName} is required`);

export const dateValidation = (fieldName = "Date") =>
  Yup.date().typeError(`${fieldName} must be a valid date`).required(`${fieldName} is required`);

export const futureDateValidation = (fieldName = "Date") =>
  Yup.date()
    .typeError(`${fieldName} must be a valid date`)
    .min(new Date(), `${fieldName} must be in the future`)
    .required(`${fieldName} is required`);

export const pastDateValidation = (fieldName = "Date") =>
  Yup.date()
    .typeError(`${fieldName} must be a valid date`)
    .max(new Date(), `${fieldName} must be in the past`)
    .required(`${fieldName} is required`);

export const fileValidation = (acceptedTypes = [], maxSizeMB = 5, fieldName = "File") => {
  let schema = Yup.mixed().required(`${fieldName} is required`);

  if (acceptedTypes.length > 0) {
    schema = schema.test(
      "fileType",
      `Invalid file type. Accepted: ${acceptedTypes.join(", ")}`,
      (value) => {
        if (!value) return false;
        if (Array.isArray(value)) {
          return value.every((file) => acceptedTypes.includes(file.type));
        }
        return acceptedTypes.includes(value.type);
      }
    );
  }

  if (maxSizeMB > 0) {
    schema = schema.test("fileSize", `File too large. Maximum size: ${maxSizeMB}MB`, (value) => {
      if (!value) return false;
      if (Array.isArray(value)) {
        return value.every((file) => file.size <= maxSizeMB * 1024 * 1024);
      }
      return value.size <= maxSizeMB * 1024 * 1024;
    });
  }

  return schema;
};

export const loginSchema = Yup.object().shape({
  email: emailValidation(),
  password: Yup.string().required("Password is required"),
  rememberMe: Yup.boolean(),
});

export const registerSchema = Yup.object().shape({
  name: nameValidation("Full name"),
  email: emailValidation(),
  password: passwordValidation(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export const propertySchema = Yup.object().shape({
  title: requiredString("Title"),
  description: requiredString("Description"),
  price: positiveNumber("Price"),
  currency: requiredString("Currency"),
  type: requiredString("Type"),
  category: requiredString("Category"),
  address: Yup.object().shape({
    street: requiredString("Street"),
    city: requiredString("City"),
    state: requiredString("State"),
    country: requiredString("Country"),
    zip: requiredString("ZIP code"),
  }),
  features: Yup.object().shape({
    bedrooms: positiveNumber("Bedrooms"),
    bathrooms: positiveNumber("Bathrooms"),
    area: positiveNumber("Area"),
  }),
});

export const leadSchema = Yup.object().shape({
  firstName: nameValidation("First name"),
  lastName: nameValidation("Last name"),
  email: emailValidation(),
  phone: phoneValidation(false),
  status: Yup.string(),
  source: Yup.string(),
  priority: Yup.string(),
});

export const contactSchema = Yup.object().shape({
  firstName: nameValidation("First name"),
  lastName: nameValidation("Last name"),
  email: emailValidation(),
  phone: phoneValidation(false),
  type: requiredString("Type"),
});

export const taskSchema = Yup.object().shape({
  title: requiredString("Title"),
  description: Yup.string(),
  dueDate: dateValidation("Due date"),
  priority: requiredString("Priority"),
  assignedTo: requiredString("Assigned to"),
});

export default {
  emailValidation,
  phoneValidation,
  passwordValidation,
  nameValidation,
  urlValidation,
  requiredString,
  requiredNumber,
  positiveNumber,
  dateValidation,
  futureDateValidation,
  pastDateValidation,
  fileValidation,
  loginSchema,
  registerSchema,
  propertySchema,
  leadSchema,
  contactSchema,
  taskSchema,
};
