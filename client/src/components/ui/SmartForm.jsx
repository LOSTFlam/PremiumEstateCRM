import React, { useMemo } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid as _Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { EmailIcon, PhoneIcon, StarIcon } from "@chakra-ui/icons";
import { Formik, Field, FieldArray as _FieldArray } from "formik";
import * as Yup from "yup";
// FormFieldConfig type available in types/utils.ts

const fieldIconMap = {
  email: EmailIcon,
  tel: PhoneIcon,
  phone: PhoneIcon,
};

const fieldToInputType = {
  text: "text",
  email: "email",
  tel: "tel",
  phone: "tel",
  number: "number",
  url: "url",
  password: "password",
  date: "date",
  time: "time",
  color: "color",
};

const buildValidationSchema = (fields) => {
  const shape = {};
  fields.forEach((field) => {
    let schema = Yup.mixed();

    switch (field.type) {
      case "email":
        schema = Yup.string().email("Invalid email");
        break;
      case "tel":
      case "phone":
        schema = Yup.string().matches(/^\+?[\d\s-()]+$/, "Invalid phone");
        break;
      case "number":
        schema = Yup.number();
        break;
      case "url":
        schema = Yup.string().url("Invalid URL");
        break;
      case "select":
      case "radio":
        schema = Yup.string();
        break;
      case "check":
        schema = Yup.boolean();
        break;
      default:
        schema = Yup.string();
    }

    if (field.required || field.isRequired) {
      if (field.type === "check") {
        schema = schema.oneOf([true], "Required");
      } else {
        schema = schema.required("Required");
      }
    }

    if (field.min !== undefined) {
      schema = schema.min(field.min, `Minimum ${field.min}`);
    }
    if (field.max !== undefined) {
      schema = schema.max(field.max, `Maximum ${field.max}`);
    }
    if (field.pattern) {
      schema = schema.matches(new RegExp(field.pattern), field.patternMessage || "Invalid format");
    }

    shape[field.name] = schema;
  });

  return Yup.object().shape(shape);
};

const buildInitialValues = (fields, initialValues = {}) => {
  const values = {};
  fields.forEach((field) => {
    values[field.name] = initialValues[field.name] ?? (field.type === "check" ? false : "");
  });
  return values;
};

const SmartField = React.memo(function SmartField({ field, form, ...rest }) {
  const {
    name,
    label,
    type = "text",
    placeholder,
    options = [],
    icon,
    min = 0,
    max = 100,
    required,
  } = field;
  const { value, onChange, onBlur } = form;
  const error = form.errors[name];
  const touched = form.touched[name];
  const showError = touched && error;

  const IconComponent = icon ? fieldIconMap[icon] || icon : fieldIconMap[type] || null;

  const fieldProps = {
    id: name,
    name,
    value: value ?? "",
    onChange,
    onBlur,
    fontSize: "sm",
    fontWeight: "500",
    borderColor: showError ? "red.300" : undefined,
    placeholder: placeholder || `Enter ${label || name}`,
  };

  return (
    <FormControl isInvalid={showError} isRequired={required}>
      {type !== "check" ? (
        <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px" htmlFor={name}>
          {label}
        </FormLabel>
      ) : null}

      {type === "select" ? (
        <Select {...fieldProps} {...rest}>
          <option value="">{`Select ${label || "value"}`}</option>
          {options.map((option, index) => (
            <option key={`${name}-${option.value}-${index}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : type === "textarea" ? (
        <Textarea {...fieldProps} {...rest} rows={4} />
      ) : type === "radio" ? (
        <RadioGroup
          value={String(value ?? "")}
          onChange={(nextValue) => form.setFieldValue(name, nextValue)}
        >
          <HStack spacing="24px" flexWrap="wrap">
            {options.map((option, index) => (
              <Radio key={`${name}-${option.value}-${index}`} value={String(option.value)}>
                {option.label}
              </Radio>
            ))}
          </HStack>
        </RadioGroup>
      ) : type === "range" ? (
        <Box>
          <Text mb={2} fontSize="sm" fontWeight="600">
            {value || 0}
          </Text>
          <Slider
            id={name}
            ml={2}
            aria-label={`${name}-slider`}
            colorScheme="yellow"
            value={Number(value || 0)}
            min={min}
            max={max}
            step={0.1}
            onChange={(nextValue) => form.setFieldValue(name, nextValue)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={6}>
              <Box color="yellow.300" as={StarIcon} />
            </SliderThumb>
          </Slider>
        </Box>
      ) : type === "check" ? (
        <Checkbox
          id={name}
          isChecked={Boolean(value)}
          onChange={() => form.setFieldValue(name, !value)}
        >
          {label}
        </Checkbox>
      ) : (
        <InputGroup>
          {IconComponent ? (
            <InputLeftElement pointerEvents="none">
              <IconComponent color="gray.300" borderRadius="16px" />
            </InputLeftElement>
          ) : null}
          <Input {...fieldProps} type={fieldToInputType[type] || "text"} {...rest} />
        </InputGroup>
      )}

      {showError ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
});

const SmartForm = React.memo(function SmartForm({
  fields = [],
  initialValues: externalInitialValues,
  validationSchema: externalValidationSchema,
  onSubmit,
  submitLabel = "Save",
  columns = { base: 1, md: 2 },
  submitProps = {},
  children,
  formProps = {},
}) {
  const computedInitialValues = useMemo(
    () => buildInitialValues(fields, externalInitialValues),
    [fields, externalInitialValues]
  );

  const computedValidationSchema = useMemo(
    () => externalValidationSchema || buildValidationSchema(fields),
    [fields, externalValidationSchema]
  );

  return (
    <Formik
      initialValues={computedInitialValues}
      validationSchema={computedValidationSchema}
      onSubmit={onSubmit}
      {...formProps}
    >
      {(formik) => (
        <Box as="form" onSubmit={formik.handleSubmit} {...formProps.containerProps}>
          <Stack spacing={6}>
            <SimpleGrid columns={columns} spacing={4}>
              {fields.map((field) => (
                <GridItem colSpan={field.colSpan || { base: 12, sm: 6 }} key={field.name}>
                  <Field name={field.name} component={SmartField} field={field} />
                </GridItem>
              ))}
            </SimpleGrid>
            {children}
            <Button
              type="submit"
              colorScheme="teal"
              alignSelf="flex-start"
              isLoading={formik.isSubmitting}
              {...submitProps}
            >
              {submitLabel}
            </Button>
          </Stack>
        </Box>
      )}
    </Formik>
  );
});

export { SmartField, buildValidationSchema, buildInitialValues };
export default SmartForm;
