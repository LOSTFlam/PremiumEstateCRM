import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { translateCrmText } from "i18n/crmDictionary";
import { postApi } from "services/api";
import { generateValidationSchema } from "utils";
import CustomForm from "utils/customForm";
import * as yup from "yup";

const Add = (props) => {
  const { t, i18n } = useTranslation();
  const [isLoding, setIsLoding] = useState(false);
  const labelOptions = { t, language: i18n.language };

  const initialFieldValues = Object.fromEntries(
    (props?.propertyData?.fields || [])?.map((field) => [field?.name, ""])
  );

  const initialValues = {
    ...initialFieldValues,
    createBy: JSON.parse(localStorage.getItem("user"))._id,
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: yup.object().shape(generateValidationSchema(props?.propertyData?.fields)),

    onSubmit: (_values, { resetForm: _resetForm }) => {
      AddData();
    },
  });

  const {
    errors: _errors,
    touched: _touched,
    values,
    handleSubmit,
    setFieldValue: _setFieldValue,
  } = formik;
  const ensureNumericFields = () => ({
    numberofBedrooms: values?.numberofBedrooms ?? "",
    numberofBathrooms: values?.numberofBathrooms ?? "",
    squareFootage: values?.squareFootage ?? "",
  });

  const AddData = async () => {
    try {
      setIsLoding(true);
      let response = await postApi("api/form/add", {
        ...values,
        moduleId: props?.propertyData?._id,
      });
      if (response?.status === 200) {
        props.onClose();
        formik.resetForm();
        props.setAction((pre) => !pre);
      }
    } catch (e) {
      // Console statement removed
    } finally {
      setIsLoding(false);
    }
  };

  return (
    <div>
      <Drawer isOpen={props?.isOpen} size={props?.size}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader alignItems={"center"} justifyContent="space-between" display="flex">
            {translateCrmText("Add Property", labelOptions)}
            <IconButton onClick={props?.onClose} icon={<CloseIcon />} />
          </DrawerHeader>
          <DrawerBody>
            <CustomForm moduleData={props?.propertyData} form={formik} />
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={4}>
              <FormControl>
                <FormLabel>Bedrooms</FormLabel>
                <Input
                  type="number"
                  min={0}
                  value={ensureNumericFields().numberofBedrooms}
                  onChange={(e) => _setFieldValue("numberofBedrooms", Number(e.target.value || 0))}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Bathrooms</FormLabel>
                <Input
                  type="number"
                  min={0}
                  value={ensureNumericFields().numberofBathrooms}
                  onChange={(e) => _setFieldValue("numberofBathrooms", Number(e.target.value || 0))}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Area (sq ft)</FormLabel>
                <Input
                  type="number"
                  min={0}
                  value={ensureNumericFields().squareFootage}
                  onChange={(e) => _setFieldValue("squareFootage", String(e.target.value || ""))}
                />
              </FormControl>
            </SimpleGrid>
          </DrawerBody>

          <DrawerFooter>
            <Button
              size="sm"
              sx={{ textTransform: "capitalize" }}
              disabled={isLoding ? true : false}
              variant="brand"
              type="submit"
              onClick={handleSubmit}
            >
              {isLoding ? <Spinner /> : t("common.save")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              sx={{
                marginLeft: 2,
                textTransform: "capitalize",
              }}
              onClick={props?.onClose}
            >
              {t("common.close")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Add;
