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
  Flex,
  IconButton,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { translateCrmText } from "i18n/crmDictionary";
import { getApi, putApi } from "services/api";
import { generateValidationSchema } from "utils";
import CustomForm from "utils/customForm";
import * as yup from "yup";

const Edit = (props) => {
  const { t, i18n } = useTranslation();
  const { data } = props;
  const labelOptions = { t, language: i18n.language };
  const initialFieldValues = Object.fromEntries(
    (props?.leadData?.fields || [])?.map((field) => [field?.name, ""])
  );
  const [initialValues, setInitialValues] = useState({
    ...initialFieldValues,
    createBy: JSON.parse(localStorage.getItem("user"))._id,
  });

  const param = useParams();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: yup.object()?.shape(generateValidationSchema(props?.propertyData?.fields)),
    enableReinitialize: true,
    onSubmit: (_values, { resetForm: _resetForm }) => {
      EditData();
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

  const [isLoding, setIsLoding] = useState(false);

  const EditData = async () => {
    try {
      setIsLoding(true);
      let response = await putApi(`api/property/edit/${props?.selectedId || param?.id}`, values);
      if (response?.status === 200) {
        props.onClose();
        props.setAction((pre) => !pre);
      }
    } catch (e) {
      // Console statement removed
    } finally {
      setIsLoding(false);
    }
  };

  const handleClose = () => {
    props.onClose(false);
    props.setSelectedId && props?.setSelectedId();
  };

  let response;

  const fetchData = async () => {
    if (data) {
      setInitialValues((prev) => ({ ...prev, ...data }));
    } else if (props?.selectedId) {
      try {
        setIsLoding(true);
        response = await getApi("api/property/view/", props?.selectedId);
        setInitialValues((prev) => ({ ...prev, ...response?.data?.property }));
      } catch (e) {
        // Console statement removed
      } finally {
        setIsLoding(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [props?.selectedId, data]);

  return (
    <div>
      <Drawer isOpen={props?.isOpen} size={props?.size}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader alignItems={"center"} justifyContent="space-between" display="flex">
            {`${translateCrmText("Edit Property", labelOptions)}${
              values?.name ? `: ${values.name}` : ""
            }`}
            <IconButton onClick={handleClose} icon={<CloseIcon />} />
          </DrawerHeader>
          <DrawerBody>
            {isLoding ? (
              <Flex justifyContent={"center"} alignItems={"center"} width="100%">
                <Spinner />
              </Flex>
            ) : (
              <>
                <CustomForm moduleData={props?.propertyData} form={formik} />
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={4}>
                  <FormControl>
                    <FormLabel>Bedrooms</FormLabel>
                    <Input
                      type="number"
                      min={0}
                      value={ensureNumericFields().numberofBedrooms}
                      onChange={(e) =>
                        _setFieldValue("numberofBedrooms", Number(e.target.value || 0))
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Bathrooms</FormLabel>
                    <Input
                      type="number"
                      min={0}
                      value={ensureNumericFields().numberofBathrooms}
                      onChange={(e) =>
                        _setFieldValue("numberofBathrooms", Number(e.target.value || 0))
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Area (sq ft)</FormLabel>
                    <Input
                      type="number"
                      min={0}
                      value={ensureNumericFields().squareFootage}
                      onChange={(e) =>
                        _setFieldValue("squareFootage", String(e.target.value || ""))
                      }
                    />
                  </FormControl>
                </SimpleGrid>
              </>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button
              size="sm"
              sx={{ textTransform: "capitalize" }}
              variant="brand"
              disabled={isLoding ? true : false}
              type="submit"
              onClick={handleSubmit}
            >
              {isLoding ? <Spinner /> : translateCrmText("Update", labelOptions)}
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              sx={{
                marginLeft: 2,
                textTransform: "capitalize",
              }}
              onClick={() => {
                props.onClose(false);
              }}
            >
              {t("common.close")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Edit;
