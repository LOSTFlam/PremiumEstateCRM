import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { postApi, putApi } from "services/api";
import * as yup from "yup";
import { IoLogoUsd } from "react-icons/io";
import { buildEnterLabel, translateCrmText } from "i18n/crmDictionary";

const AddEditUnits = (props) => {
  const { isOpen, onClose, setAction, selectedUnitType, actionType } = props;
  const param = useParams();
  const [isLoding, setIsLoding] = useState(false);
  const { t, i18n } = useTranslation();
  const labelOptions = { t, language: i18n.language };
  const isRu = i18n.language?.startsWith("ru");

  const [initialValues, setInitialValues] = useState({
    name: "",
    sqm: "",
    price: "",
    executive: "",
  });

  const validationSchema = yup.object({
    name: yup.string().required(isRu ? "Название обязательно" : "Name is required"),
    sqm: yup
      .number()
      .required(isRu ? "Площадь обязательна" : "Sqm is required")
      .typeError(isRu ? "Площадь должна быть числом" : "Sqm must be a number"),
    price: yup
      .number()
      .required(isRu ? "Цена обязательна" : "Price is required")
      .typeError(isRu ? "Цена должна быть числом" : "Price must be a number"),
    executive: yup.string().required(isRu ? "Ответственный обязателен" : "Executive is required"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (_values) => {
      AddUpdateData();
    },
  });

  const { errors, touched, values, handleBlur, handleChange, handleSubmit, resetForm } = formik;

  const AddUpdateData = async () => {
    try {
      setIsLoding(true);
      let response;
      if (actionType === "Edit") {
        response = await putApi(`api/property/edit-unit/${param?.id}`, values);
      } else {
        response = await postApi(`api/property/add-units/${param?.id}`, {
          units: values,
          type: "A",
        });
      }

      if (response && response.status === 200) {
        onClose();
        resetForm();
        setAction((pre) => !pre);
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (e) {
      // Console statement removed
    } finally {
      setIsLoding(false);
    }
  };

  const handelClose = () => {
    resetForm();
    onClose();
    setInitialValues({
      name: "",
      sqm: "",
      price: "",
      executive: "",
    });
  };

  useEffect(() => {
    actionType === "Edit" && setInitialValues(selectedUnitType);
  }, [selectedUnitType]);

  return (
    <Modal isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader justifyContent="space-between" display="flex">
          {translateCrmText(actionType === "Edit" ? "Edit Unit" : "Add Unit", labelOptions)}
          <IconButton onClick={handelClose} icon={<CloseIcon />} />
        </ModalHeader>
        <ModalBody>
          <Grid templateColumns="repeat(12, 1fr)" gap={3}>
            <GridItem colSpan={{ base: 12 }}>
              <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
                {t("common.name")}
                <Text color={"red"}>*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.name}
                name="name"
                placeholder={buildEnterLabel(t("common.name"), labelOptions)}
                fontWeight="500"
                borderColor={errors?.name && touched?.name ? "red.300" : null}
              />

              <Text mb="10px" color={"red"}>
                {errors?.name && touched?.name && errors?.name}
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
                {translateCrmText("Sqm", labelOptions)}
                <Text color={"red"}>*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.sqm}
                name="sqm"
                placeholder={buildEnterLabel(translateCrmText("Sqm", labelOptions), labelOptions)}
                fontWeight="500"
                borderColor={errors?.sqm && touched?.sqm ? "red.300" : null}
              />

              <Text mb="10px" color={"red"}>
                {errors?.sqm && touched?.sqm && errors?.sqm}
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
                {translateCrmText("Executive", labelOptions)}
                <Text color={"red"}>*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.executive}
                name="executive"
                placeholder={buildEnterLabel(
                  translateCrmText("Executive", labelOptions),
                  labelOptions
                )}
                fontWeight="500"
                borderColor={errors?.executive && touched?.executive ? "red.300" : null}
              />

              <Text mb="10px" color={"red"}>
                {errors?.executive && touched?.executive && errors?.executive}
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
                {translateCrmText("Price", labelOptions)}
                <Text color={"red"}>*</Text>
              </FormLabel>
              <InputGroup>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.price}
                  name="price"
                  placeholder={buildEnterLabel(
                    translateCrmText("Price", labelOptions),
                    labelOptions
                  )}
                  fontWeight="500"
                  borderColor={errors?.price && touched?.price ? "red.300" : null}
                />

                <InputRightElement pointerEvents="none">
                  <IoLogoUsd color="gray.300" borderRadius="16px" />
                </InputRightElement>
              </InputGroup>
              <Text mb="10px" color={"red"}>
                {errors?.price && touched?.price && errors?.price}
              </Text>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            size="sm"
            disabled={isLoding ? true : false}
            onClick={handleSubmit}
          >
            {isLoding ? (
              <Spinner />
            ) : actionType === "Edit" ? (
              isRu ? (
                "Обновить"
              ) : (
                "Update"
              )
            ) : (
              t("common.save")
            )}
          </Button>
          <Button
            sx={{
              marginLeft: 2,
              textTransform: "capitalize",
            }}
            variant="outline"
            colorScheme="red"
            size="sm"
            onClick={handelClose}
          >
            {t("common.close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddEditUnits;
