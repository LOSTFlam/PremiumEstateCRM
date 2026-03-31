import React, { memo } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
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
import { HSeparator } from "components/separator/Separator";
import PropertyPhotoUpload from "components/property/PropertyPhotoUpload";

const getFieldOptions = (field = {}) =>
  Array.isArray(field?.options)
    ? field.options.map((option) => ({
        label: option?.name ?? option?.label ?? option?.value ?? "",
        value: option?.value ?? option?._id ?? option?.label ?? "",
      }))
    : [];

const isFieldRequired = (field = {}) =>
  Array.isArray(field?.validation) &&
  field.validation.some((validation) => validation?.require);

const getFieldError = (name, errors = {}, touched = {}, explicitError) => {
  if (explicitError) return explicitError;
  if (!name) return "";
  return touched?.[name] ? errors?.[name] : "";
};

const sliderBounds = (field = {}) => ({
  min: Number(field?.validation?.[1]?.value ?? 0),
  max: Number(field?.validation?.[2]?.value ?? 100),
});

const ModuleFieldControl = memo(function ModuleFieldControl({
  field,
  value,
  onChange,
  onBlur,
  setFieldValue,
  error,
  touched,
  values,
}) {
  const name = field?.name;
  const required = isFieldRequired(field);
  const options = getFieldOptions(field);
  const currentValue = value ?? (field?.type === "check" ? false : "");
  const range = sliderBounds(field);
  const sharedInputProps = {
    id: name,
    name,
    onChange,
    onBlur,
    value: currentValue,
    fontSize: "sm",
    fontWeight: "500",
    borderColor: error ? "red.300" : undefined,
  };

  const renderLabel = field?.type !== "check" && field?.type !== "photo" && name !== "propertyPhotos";

  return (
    <FormControl isInvalid={Boolean(error)} isRequired={required}>
      {renderLabel ? (
        <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px" htmlFor={name}>
          {field?.label}
        </FormLabel>
      ) : null}

      {field?.type === "range" ? (
        <Box>
          <Text mb={2} fontSize="sm" fontWeight="600">
            {currentValue || 0}
          </Text>
          <Slider
            id={name}
            ml={2}
            aria-label={`${name}-slider`}
            colorScheme="yellow"
            value={Number(currentValue || 0)}
            min={range.min}
            max={range.max}
            step={0.1}
            onChange={(nextValue) => setFieldValue?.(name, nextValue)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={6}>
              <Box color="yellow.300" as={StarIcon} />
            </SliderThumb>
          </Slider>
        </Box>
      ) : field?.type === "radio" ? (
        <RadioGroup
          name={name}
          value={String(currentValue ?? "")}
          onChange={(nextValue) => setFieldValue?.(name, nextValue)}
        >
          <HStack spacing="24px" flexWrap="wrap">
            {options.map((option, index) => (
              <Radio key={`${name}-${option.value}-${index}`} value={String(option.value)}>
                {option.label}
              </Radio>
            ))}
          </HStack>
        </RadioGroup>
      ) : field?.type === "select" ? (
        <Select {...sharedInputProps}>
          <option value="">{`Select ${field?.label || "value"}`}</option>
          {options.map((option, index) => (
            <option key={`${name}-${option.value}-${index}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : field?.type === "textarea" ? (
        <Textarea
          {...sharedInputProps}
          id={name}
          placeholder={`Enter ${field?.label || name}`}
          rows={4}
        />
      ) : field?.type === "photo" || name === "propertyPhotos" ? (
        <PropertyPhotoUpload
          propertyId={values?._id}
          photos={values?.propertyPhotos || []}
          onChange={(photos) => setFieldValue?.("propertyPhotos", photos)}
        />
      ) : field?.type === "check" ? (
        <Checkbox
          isChecked={Boolean(currentValue)}
          onChange={() => setFieldValue?.(name, !currentValue)}
        >
          {field?.label}
        </Checkbox>
      ) : (
        <InputGroup>
          {field?.type === "tel" ? (
            <InputLeftElement pointerEvents="none">
              <PhoneIcon color="gray.300" borderRadius="16px" />
            </InputLeftElement>
          ) : null}
          {field?.type === "email" ? (
            <InputLeftElement pointerEvents="none">
              <EmailIcon color="gray.300" borderRadius="16px" />
            </InputLeftElement>
          ) : null}
          <Input
            {...sharedInputProps}
            id={name}
            type={field?.type || "text"}
            placeholder={`Enter ${field?.label || name}`}
          />
        </InputGroup>
      )}

      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
});

const renderModuleFields = ({
  fields = [],
  values = {},
  handleChange,
  handleBlur,
  errors = {},
  touched = {},
  setFieldValue,
}) =>
  fields.map((field, index) => {
    const name = field?.name;
    const error = getFieldError(name, errors, touched);

    return (
      <GridItem colSpan={{ base: 12, sm: 6 }} key={`${name || "field"}-${index}`}>
        <ModuleFieldControl
          field={field}
          value={values?.[name]}
          values={values}
          onChange={handleChange}
          onBlur={handleBlur}
          setFieldValue={setFieldValue}
          error={error}
          touched={touched}
        />
      </GridItem>
    );
  });

const ModuleDrivenForm = memo(function ModuleDrivenForm(props) {
  const { moduleData = {} } = props;
  const headings = Array.isArray(moduleData?.headings) ? moduleData.headings : [];
  const fields = Array.isArray(moduleData?.fields) ? moduleData.fields : [];
  const ungroupedFields = fields.filter((field) => !field?.belongsTo && !field?.ref);

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
      {headings.length > 0
        ? headings.map((heading, index) => (
            <React.Fragment key={heading?._id || `heading-${index}`}>
              <GridItem colSpan={{ base: 12 }}>
                {index !== 0 ? <HSeparator /> : null}
                <Heading as="h1" size="md" mt="10px">
                  {index + 1}. {heading?.heading}
                </Heading>
              </GridItem>
              {renderModuleFields({
                ...props,
                fields: fields.filter((field) => field?.belongsTo === heading?._id),
              })}
            </React.Fragment>
          ))
        : null}
      {renderModuleFields({ ...props, fields: ungroupedFields })}
    </Grid>
  );
});

const CommonField = memo(function CommonField({
  type = "text",
  name,
  label,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  isRequired = false,
  ...rest
}) {
  const sharedProps = {
    name,
    value: value ?? "",
    onChange,
    placeholder,
    ...rest,
  };

  return (
    <FormControl isInvalid={Boolean(error)} isRequired={isRequired}>
      {label ? <FormLabel>{label}</FormLabel> : null}
      {type === "select" ? (
        <Select {...sharedProps}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : type === "textarea" ? (
        <Textarea {...sharedProps} />
      ) : (
        <Input type={type} {...sharedProps} />
      )}
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
});

const CommonForm = memo(function CommonForm({
  moduleData,
  values = {},
  handleChange,
  handleBlur,
  errors = {},
  touched = {},
  setFieldValue,
  fields = [],
  onChange,
  onSubmit,
  submitLabel = "Save",
  columns = { base: 1, md: 2 },
  children,
}) {
  if (moduleData) {
    return (
      <ModuleDrivenForm
        moduleData={moduleData}
        values={values}
        handleChange={handleChange}
        handleBlur={handleBlur}
        errors={errors}
        touched={touched}
        setFieldValue={setFieldValue}
      />
    );
  }

  return (
    <Box as="form" onSubmit={onSubmit}>
      <Stack spacing={6}>
        <SimpleGrid columns={columns} spacing={4}>
          {fields.map((field) => (
            <CommonField
              key={field.name}
              {...field}
              value={values[field.name]}
              error={errors[field.name]}
              onChange={onChange}
            />
          ))}
        </SimpleGrid>
        {children}
        <Button type="submit" colorScheme="teal" alignSelf="flex-start">
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  );
});

export { CommonField, ModuleDrivenForm };
export default CommonForm;
