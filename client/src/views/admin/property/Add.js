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
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import PropertyPriceEditor from "components/property/PropertyPriceEditor";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { postApi } from "services/api";
import { getPreferredCurrency } from "utils/pricing";
import { generateValidationSchema } from "utils";
import CustomForm from "utils/customForm";
import * as yup from "yup";
import PropertyPhotoManager from "components/property/PropertyPhotoManager";
import { Flex, Box, Input } from "@chakra-ui/react";
import { toast } from "react-toastify";

// Функция для генерации slug из названия
const generateSlug = (text) => {
  return text
    ?.toLowerCase()
    .replace(/[^a-z0-9а-яё]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || '';
};

const Add = (props) => {
  const [isLoding, setIsLoding] = useState(false);

  const initialFieldValues = Object?.fromEntries(
    (props?.propertyData?.fields || [])?.map((field) => [field?.name, ""]),
  );

  const initialValues = {
    ...initialFieldValues,
    createBy: JSON.parse(localStorage.getItem("user"))._id,
    publicSlug: '', // Автоматическая генерация slug
    priceCurrency: getPreferredCurrency(localStorage.getItem("i18nextLng") || "en"),
    listingPriceRub: "",
    priceExchangeRate: "",
    priceExchangeUpdatedAt: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: yup
      .object()
      ?.shape(generateValidationSchema(props?.propertyData?.fields)),

    onSubmit: (values, { resetForm }) => {
      AddData();
    },
  });

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = formik;

  // Авто-генерация slug при изменении name или propertyAddress
  useEffect(() => {
    const name = values?.name || values?.propertyAddress;
    if (name && !values?.publicSlug) {
      const slug = generateSlug(name);
      setFieldValue('publicSlug', slug);
    }
  }, [values?.name, values?.propertyAddress]);

  const AddData = async () => {
    try {
      setIsLoding(true);
      let response = await postApi("api/property/add", values);
      if (response?.status === 200) {
        // Property created successfully, now user can add photos
        // Keep the drawer open and show photo upload section
        props.setAction((pre) => !pre);
        // Update values with the new property ID
        if (response?.data?._id) {
          formik.setFieldValue('_id', response.data._id);
        }
        toast.success("Property created. You can now upload photos.");
      }
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.error || "Failed to create property");
    } finally {
      setIsLoding(false);
    }
  };

  return (
    <div>
      <Drawer isOpen={props?.isOpen} size={props?.size}>
        <DrawerOverlay />
        <DrawerContent className="admin-density-shell">
          <DrawerHeader
            className="admin-density-shell__header"
            alignItems={"center"}
            justifyContent="space-between"
            display="flex"
          >
            Add Property
            <IconButton onClick={props?.onClose} icon={<CloseIcon />} />
          </DrawerHeader>
          <DrawerBody className="admin-density-shell__body">
            <CustomForm
              moduleData={props?.propertyData}
              values={values}
              setFieldValue={setFieldValue}
              handleChange={handleChange}
              handleBlur={handleBlur}
              errors={errors}
              touched={touched}
              excludeFieldNames={[
                "listingPrice",
                "listingPriceRub",
                "priceCurrency",
                "priceExchangeRate",
                "priceExchangeUpdatedAt",
              ]}
            />
            <PropertyPriceEditor values={values} setFieldValue={setFieldValue} />
            {/* Photo Upload Section */}
            <Box mt={6} mb={4}>
              <PropertyPhotoManager
                propertyId={values?._id}
                photos={values?.propertyPhotos || []}
                onChange={(newPhotos) => {
                  setFieldValue('propertyPhotos', newPhotos);
                }}
                isOpen={true}
                onClose={() => {}}
              />
            </Box>
          </DrawerBody>

          <DrawerFooter className="admin-density-shell__footer">
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
