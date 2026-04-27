import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Box,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { postApi } from "services/api";
import { generateValidationSchema } from "utils";
import CustomForm from "utils/customForm";
import * as yup from "yup";
import PropertyPhotoManager from "components/property/PropertyPhotoManager";
import { toast } from "react-toastify";

// Функция для генерации slug из названия
const generateSlug = (text) => {
  return (
    text
      ?.toLowerCase()
      .replace(/[^a-z0-9а-яё]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 120) || ""
  );
};

const getInitialFieldValue = (field) => {
  if (field?.type === "check") {
    return false;
  }

  if (field?.type === "photo" || field?.backendType === "Array") {
    return [];
  }

  return "";
};

const Add = (props) => {
  const [isLoding, setIsLoding] = useState(false);

  const initialFieldValues = Object?.fromEntries(
    (props?.propertyData?.fields || [])?.map((field) => [field?.name, getInitialFieldValue(field)])
  );

  const initialValues = {
    ...initialFieldValues,
    createBy: JSON.parse(localStorage.getItem("user"))._id,
    publicSlug: "", // Автоматическая генерация slug
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: yup.object()?.shape(generateValidationSchema(props?.propertyData?.fields)),

    onSubmit: (_values, { resetForm: _resetForm }) => {
      AddData();
    },
  });

  const { errors: _errors, touched: _touched, values, handleSubmit, setFieldValue } = formik;

  // Auto-generate slug when name or propertyAddress changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const name = values?.name || values?.propertyAddress;
    if (name && !values?.publicSlug) {
      const slug = generateSlug(name);
      setFieldValue("publicSlug", slug);
    }
  }, [values?.name, values?.propertyAddress]);

  const AddData = async () => {
    try {
      setIsLoding(true);
      const payload = {
        ...values,
        publicSlug: values?.publicSlug || generateSlug(values?.name || values?.propertyAddress),
        moduleId: props?.propertyData?._id,
      };

      let response = await postApi("api/form/add", payload);
      if (response?.status === 200) {
        // Property created successfully, now user can add photos
        // Keep the drawer open and show photo upload section
        props.setAction((pre) => !pre);
        // Update values with the new property ID
        if (response?.data?._id) {
          formik.setFieldValue("_id", response.data._id);
        }
        toast.success("Property created. You can now upload photos.");
      }
    } catch (e) {
      toast.error(
        e?.response?.data?.message || e?.response?.data?.error || "Failed to create property"
      );
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
            Add Property
            <IconButton onClick={props?.onClose} icon={<CloseIcon />} />
          </DrawerHeader>
          <DrawerBody>
            <CustomForm moduleData={props?.propertyData} form={formik} />
            {/* Photo Upload Section */}
            <Box mt={6} mb={4}>
              <PropertyPhotoManager
                propertyId={values?._id}
                photos={values?.propertyPhotos || []}
                onChange={(newPhotos) => {
                  setFieldValue("propertyPhotos", newPhotos);
                }}
                isOpen={true}
                onClose={() => {}}
              />
            </Box>
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
              {isLoding ? <Spinner /> : "Save"}
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
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Add;
