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
import PropertyPhotoUpload from "components/property/PropertyPhotoUpload";
import { useTranslation } from "react-i18next";
import {
  buildEnterLabel,
  buildSelectLabel,
  translateCrmText,
} from "i18n/crmDictionary";

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
  const { t, i18n } = useTranslation();
  const name = field?.name;
  const required = isFieldRequired(field);
  const options = getFieldOptions(field);
  const currentValue = value ?? (field?.type === "check" ? false : "");
  const range = sliderBounds(field);
  const labelOptions = { t, language: i18n.language };
  const displayLabel = translateCrmText(field?.label, labelOptions);
  const hasLeadingIcon = field?.type === "tel" || field?.type === "email";
  const sharedInputProps = {
    id: name,
    name,
    onChange,
    onBlur,
    value: currentValue,
    variant: "main",
    size: "md",
    fontSize: "sm",
    fontWeight: "500",
    borderColor: error ? "red.300" : undefined,
  };

  const renderLabel = field?.type !== "check" && field?.type !== "photo" && name !== "propertyPhotos";

  return (
    <FormControl
      isInvalid={Boolean(error)}
      isRequired={required}
      className="admin-module-form__control"
    >
      {renderLabel ? (
        <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px" htmlFor={name}>
          {displayLabel}
        </FormLabel>
      ) : null}

      {field?.type === "range" ? (
        <Box>
          <Text mb={2} fontSize="sm" fontWeight="600">
            {currentValue || 0}
          </Text>
          <Slider
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
            {options.map((option) => (
              <Radio key={`${name}-${option.value}`} value={String(option.value)}>
                {option.label}
              </Radio>
            ))}
          </HStack>
        </RadioGroup>
      ) : field?.type === "select" ? (
        <Select {...sharedInputProps}>
          <option value="">{buildSelectLabel(displayLabel || "value", labelOptions)}</option>
          {options.map((option) => (
            <option key={`${name}-${option.value}`} value={option.value}>
              {translateCrmText(option.label, labelOptions)}
            </option>
          ))}
        </Select>
      ) : field?.type === "textarea" ? (
        <Textarea
          {...sharedInputProps}
          placeholder={buildEnterLabel(displayLabel || name, labelOptions)}
          rows={4}
          minH="140px"
          resize="vertical"
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
          {displayLabel}
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
            type={field?.type || "text"}
            placeholder={buildEnterLabel(displayLabel || name, labelOptions)}
            ps={hasLeadingIcon ? "3rem" : undefined}
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
  excludeFieldNames = [],
}) =>
  fields.map((field, index) => {
    const name = field?.name;
    if (excludeFieldNames.includes(name)) {
      return null;
    }
    const error = getFieldError(name, errors, touched);

    return (
      <GridItem colSpan={{ base: 12, sm: 6 }} key={`${name || "field"}-${index}`}>
        <Box className="admin-module-form__field">
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
        </Box>
      </GridItem>
    );
  });

const ModuleDrivenForm = memo(function ModuleDrivenForm(props) {
  const { moduleData = {} } = props;
  const headings = Array.isArray(moduleData?.headings) ? moduleData.headings : [];
  const fields = Array.isArray(moduleData?.fields) ? moduleData.fields : [];
  const excludeFieldNames = Array.isArray(props.excludeFieldNames)
    ? props.excludeFieldNames
    : [];
  const ungroupedFields = fields.filter(
    (field) => !field?.belongsTo && !field?.ref,
  );

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={4} className="admin-module-form">
      {headings.length > 0
        ? headings.map((heading, index) => (
            <React.Fragment key={heading?._id || `heading-${index}`}>
              <GridItem colSpan={{ base: 12 }}>
                <Box className="admin-module-form__sectionHeader">
                  <Heading
                    as="h1"
                    size="md"
                    mt="0"
                    className="admin-module-form__sectionHeading"
                  >
                    {index + 1}. {heading?.heading}
                  </Heading>
                </Box>
              </GridItem>
              {renderModuleFields({
                ...props,
                fields: fields.filter((field) => field?.belongsTo === heading?._id),
                excludeFieldNames,
              })}
            </React.Fragment>
          ))
        : null}
      {renderModuleFields({ ...props, fields: ungroupedFields, excludeFieldNames })}
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
    <FormControl
      isInvalid={Boolean(error)}
      isRequired={isRequired}
      className="admin-module-form__control"
    >
      {label ? <FormLabel>{label}</FormLabel> : null}
      {type === "select" ? (
        <Select {...sharedProps} variant="main">
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : type === "textarea" ? (
        <Textarea {...sharedProps} variant="main" minH="140px" resize="vertical" />
      ) : (
        <Input type={type} {...sharedProps} variant="main" />
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
    <Box as="form" onSubmit={onSubmit} className="admin-module-form-shell">
      <Stack spacing={6}>
        <SimpleGrid columns={columns} spacing={5}>
          {fields.map((field) => (
            <Box key={field.name} className="admin-module-form__field">
              <CommonField
                {...field}
                value={values[field.name]}
                error={errors[field.name]}
                onChange={onChange}
              />
            </Box>
          ))}
        </SimpleGrid>
        {children}
        <Button type="submit" variant="brand" alignSelf="flex-start">
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  );
});

export { CommonField, ModuleDrivenForm };
export default CommonForm;
