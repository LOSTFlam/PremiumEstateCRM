import React from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  buildEnterLabel,
  buildSelectLabel,
  translateCrmText,
} from "i18n/crmDictionary";

const AdvanceSearch = ({
  handleAdvanceSearch,
  setAdvaceSearch,
  search,
  advaceSearch,
  isLoding,
  allData,
  setDisplaySearchData,
  setSearchedData,
  setGetTagValues,
  setSearchClear,
  tableCustomFields,
  setSearchbox,
}) => {
  const { t, i18n } = useTranslation();
  const labelOptions = { t, language: i18n.language };
  const initialFieldValues = Object?.fromEntries(
    (tableCustomFields || [])?.flatMap((field) => {
      if (field?.type === "date") {
        return [
          [`from${field?.name}`, ""],
          [`to${field?.name}`, ""],
        ];
      } else {
        return [[field?.name, ""]];
      }
    }),
  );

  const initialValues = {
    ...initialFieldValues,
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      handleAdvanceSearch(values);
      resetForm();
    },
  });
  // const formik = useFormik({
  //     initialValues: initialValues,
  //     enableReinitialize: true,
  //     onSubmit: (values, { resetForm }) => {
  //         const searchResult = allData?.filter(item => {
  //             return tableCustomFields.every(field => {
  //                 const fieldValue = values[field.name];
  //                 const itemValue = item[field.name];

  //                 if (field.type === 'select') {
  //                     return !fieldValue || itemValue === fieldValue;
  //                 }
  //                 else if (field.type === 'number') {
  //                     // return (
  //                     //     [null, undefined, ''].includes(fieldValue) ||
  //                     //     (itemValue !== undefined &&
  //                     //         (parseInt(itemValue, 10) >= parseInt(fieldValue, 10) || 0))
  //                     // );
  //                     // return (
  //                     //     [null, undefined, ''].includes(fieldValue) ||
  //                     //     (itemValue !== undefined &&
  //                     //         (parseInt(itemValue, 10) === parseInt(fieldValue, 10)))
  //                     // );
  //                     return (
  //                         [null, undefined, ''].includes(fieldValue) ||
  //                         (itemValue !== undefined &&
  //                             itemValue.toString().includes(fieldValue.toString()))
  //                     );
  //                 }
  //                 else if (field.type === 'date') {
  //                     const fromDate = values[`from${field.name}`];
  //                     const toDate = values[`to${field.name}`];

  //                     if (!fromDate && !toDate) {
  //                         return true; // No date range specified
  //                     }

  //                     const timeItemDate = new Date(itemValue);
  //                     const timeMomentDate = moment(timeItemDate).format('YYYY-MM-DD');

  //                     return (
  //                         (!fromDate || (timeMomentDate >= fromDate)) &&
  //                         (!toDate || (timeMomentDate <= toDate))
  //                     );
  //                 }
  //                 else {
  //                     // Default case for text, email
  //                     return !fieldValue || itemValue?.toLowerCase()?.includes(fieldValue?.toLowerCase());
  //                 }
  //             });
  //         });

  //         // let getValue = tableCustomFields.map(field => values[field.name]).filter(value => value);
  //         const getValue = tableCustomFields.map(field => {
  //             if (field.type === 'date') {
  //                 const fromDate = values[`from${field.name}`];
  //                 const toDate = values[`to${field.name}`];

  //                 return (fromDate || toDate) && `From: ${fromDate} To: ${toDate}`;
  //             } else {
  //                 return values[field.name];
  //             }
  //         }).filter(value => value);

  //         setGetTagValues(getValue);
  //         setSearchedData(searchResult);
  //         setDisplaySearchData(true);
  //         setAdvaceSearch(false);
  //         resetForm();
  //         if (setSearchbox) {
  //             setSearchbox('');
  //         }
  //     }
  // })

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = formik;

  return (
    <Modal
      onClose={() => {
        setAdvaceSearch(false);
        resetForm();
      }}
      isOpen={advaceSearch}
      isCentered
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent className="admin-density-shell">
        <ModalHeader className="admin-density-shell__header">
          {translateCrmText("Advance Search", labelOptions)}
        </ModalHeader>
        <ModalCloseButton
          onClick={() => {
            setAdvaceSearch(false);
            resetForm();
          }}
        />
        <ModalBody className="admin-density-shell__body">
          <Grid templateColumns="repeat(12, 1fr)" mb={1} gap={4}>
            {tableCustomFields?.map((field) => (
              <GridItem
                colSpan={{ base: 12, sm: field?.type === "date" ? 12 : 6 }}
                key={field?.name}
              >
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="600"
                  color={"#000"}
                  mb="0"
                  mt={2}
                  htmlFor={field?.name}
                >
                  {translateCrmText(field?.label, labelOptions)}
                </FormLabel>
                {field?.type === "select" ? (
                  <Select
                    variant="main"
                    fontSize="sm"
                    id={field?.name}
                    name={field?.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.[field?.name]}
                    fontWeight="500"
                    // borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
                  >
                    <option value="">
                      {buildSelectLabel(field?.label || "value", labelOptions)}
                    </option>
                    {field.options?.map((option) => (
                      <option key={option?._id} value={option?.value}>
                        {translateCrmText(
                          option?.name || option?.label || option?.value,
                          labelOptions,
                        )}
                      </option>
                    ))}
                  </Select>
                ) : field?.type === "date" ? (
                  <>
                    <Flex justifyContent="space-between" gap={3}>
                      <Box flex="1 1 0">
                        <FormLabel
                          display="flex"
                          ms="4px"
                          fontSize="sm"
                          fontWeight="600"
                          color={"#000"}
                          mb="0"
                        >
                          {t("common.from")}
                        </FormLabel>
                        <Input
                          variant="main"
                          fontSize="sm"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values[`from${field?.name}`]}
                          type="date"
                          name={`from${field?.name}`}
                          fontWeight="500"
                        />
                      </Box>
                      <Box flex="1 1 0">
                        <FormLabel
                          display="flex"
                          ms="4px"
                          fontSize="sm"
                          fontWeight="600"
                          color={"#000"}
                          mb="0"
                        >
                          {t("common.to")}
                        </FormLabel>
                        <Input
                          variant="main"
                          fontSize="sm"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values[`to${field?.name}`]}
                          type="date"
                          min={values[`from${field?.name}`]}
                          name={`to${field?.name}`}
                          fontWeight="500"
                        />
                      </Box>
                    </Flex>
                    {/* <Text mb='10px' color={'red'}> {errors.fromLeadScore && touched.fromLeadScore && errors.fromLeadScore}</Text> */}
                  </>
                ) : (
                  <InputGroup>
                    {/* {field.type === 'tel' && <InputLeftElement
                                                pointerEvents="none"
                                                children={<PhoneIcon color="gray.300" borderRadius="16px" />}
                                            />} */}
                    <Input
                      variant="main"
                      fontSize="sm"
                      type={field?.type}
                      id={field?.name}
                      name={field?.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values[field?.name]}
                      fontWeight="500"
                      placeholder={buildEnterLabel(field?.label || field?.name, labelOptions)}
                      // borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
                    />
                  </InputGroup>
                )}
              </GridItem>
            ))}
          </Grid>
        </ModalBody>
        <ModalFooter className="admin-density-shell__footer">
          <Button
            variant="brand"
            size="sm"
            mr={2}
            onClick={handleSubmit}
            disabled={isLoding ? true : false}
          >
            {isLoding ? <Spinner /> : t("common.search")}
          </Button>
          <Button colorScheme="red" size="sm" onClick={() => resetForm()}>
            {t("common.clear")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdvanceSearch;
