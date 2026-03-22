import {
  Button,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonFileUpload from "components/commonFileUpload";
import { useTranslation } from "react-i18next";

const ImportModal = (props) => {
  const { onClose, isOpen, text, customFields } = props;
  const [isLoding, setIsLoding] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialValues = {
    lead: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values, { resetForm }) => {
      AddData();
      resetForm();
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
    resetForm,
  } = formik;

  const AddData = async () => {
    try {
      setIsLoding(true);
      resetForm();

      if (values?.lead) {
        onClose();
        navigate("/leadImport", {
          state: { fileData: values?.lead, customFields: customFields },
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("modules.lead.import.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="repeat(12, 1fr)" gap={3}>
            <GridItem colSpan={{ base: 12 }}>
              <CommonFileUpload
                count={values?.lead?.length}
                onFileSelect={(file) => setFieldValue("lead", file)}
                text={text}
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors?.lead && touched?.lead && t("messages.pleaseSelectFile", { file: text })}
              </Text>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            size="sm"
            onClick={handleSubmit}
            disabled={isLoding ? true : false}
          >
            {isLoding ? <Spinner /> : t("common.save")}
          </Button>
          <Button
            variant="outline"
            colorScheme="red"
            sx={{
              marginLeft: 2,
              textTransform: "capitalize",
            }}
            size="sm"
            onClick={() => {
              onClose();
              formik.resetForm();
            }}
          >
            {t("common.close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImportModal;
