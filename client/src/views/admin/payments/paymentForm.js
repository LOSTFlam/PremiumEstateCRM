import { Button, FormLabel, GridItem, Input, Text, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { postApi } from "services/api";

export default function PaymentForm() {
  const { t } = useTranslation();
  const toast = useToast();
  const initialValues = {
    name: "",
    amount: "",
    email: "",
  };

  const validation = yup.object({
    name: yup.string().min(2).required("First Name is required"),
    amount: yup
      .number()
      .max(999999.99, "total amount due must be no more than ₹999,999.99.")
      .required("Amount is required"),
    email: yup.string().email().required("Email is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        await addPayment(values);
        resetForm();
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { errors, touched, values, handleBlur, handleChange, handleSubmit, isSubmitting } = formik;

  const addPayment = async (formValues) => {
    try {
      const response = await postApi("api/payment/add", {
        items: [
          {
            quantity: 1,
            price: formValues?.amount,
            name: formValues?.name,
            description: "send to PremiumEstate",
          },
        ],
        customer_email: formValues?.email,
      });

      const checkoutUrl = response?.url || response?.data?.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      toast({
        title: t("messages.errorOccurred", { defaultValue: "Payment could not be started" }),
        status: "error",
        duration: 3000,
      });
    } catch {
      toast({
        title: t("messages.errorOccurred", { defaultValue: "Payment could not be started" }),
        description: t("messages.tryAgainLater", { defaultValue: "Please try again later." }),
        status: "error",
        duration: 4000,
      });
    }
  };

  return (
    <>
      <GridItem display="flex" justifyContent="center" gap="20px" padding="10px 0 50px 0">
        <img src={require("../../../assets/img/masterCard.png")} width="100px" alt="Mastercard" />
        <img src={require("../../../assets/img/visa.png")} width="100px" alt="Visa" />
      </GridItem>
      <GridItem sx={{ m: 1, width: "100%" }}>
        <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
          {t?.("fields.name")}
        </FormLabel>
        <Input
          type="text"
          fontSize="sm"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values?.name}
          name="name"
          placeholder={t?.("fields.enterName")}
          fontWeight="500"
          borderColor={errors?.name && touched?.name ? "red.300" : null}
        />

        <Text mb="10px" color={"red"}>
          {errors?.name && touched?.name && errors?.name}
        </Text>
      </GridItem>
      <GridItem sx={{ m: 1, width: "100%" }}>
        <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
          {t?.("fields.email")}
        </FormLabel>
        <Input
          type="text"
          fontSize="sm"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values?.email}
          name="email"
          placeholder={t?.("fields.enterEmail")}
          fontWeight="500"
          borderColor={errors?.email && touched?.email ? "red.300" : null}
        />

        <Text mb="10px" color={"red"}>
          {errors?.email && touched?.email && errors?.email}
        </Text>
      </GridItem>
      <GridItem sx={{ m: 1, width: "100%" }}>
        <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
          {t?.("fields.amount")}
        </FormLabel>
        <Input
          type="number"
          fontSize="sm"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values?.amount}
          placeholder={t?.("fields.enterAmount")}
          name="amount"
          fontWeight="500"
          borderColor={errors?.amount && touched?.amount ? "red.300" : null}
        />

        <Text mb="10px" color={"red"}>
          {errors?.amount && touched?.amount && errors?.amount}
        </Text>
      </GridItem>
      <Button onClick={handleSubmit} variant="brand" size="sm" isLoading={isSubmitting}>
        {t?.("common.pay")}
      </Button>
    </>
  );
}
