import React, { useEffect, useMemo } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  Link,
  HStack,
} from "@chakra-ui/react";
import DefaultAuth from "layouts/auth/Default";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { postApi } from "services/api";
import { getSignUpSchema } from "schema";
import { getLocalizedError } from "utils/errorMessages";
import { toast } from "react-toastify";
import Spinner from "components/spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchImage } from "../../../redux/slices/imageSlice";
import { setUser } from "../../../redux/slices/localSlice";
import { persistUser } from "utils/authStorage";
import { useTranslation } from "react-i18next";

function SignUp() {
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.500";
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [isLoading, setIsLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const dispatch = useDispatch();
  const _navigate = useNavigate();
  const image = useSelector((state) => state?.images?.images);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    dispatch(fetchImage("?isActive=true"));
  }, [dispatch]);

  const showPass = () => setShow(!show);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  };

  const validationSchema = useMemo(() => getSignUpSchema(t), [t, i18n.language]);

  const {
    errors,
    values,
    touched,
    handleBlur,
    handleChange,
    resetForm,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {
      register();
    },
  });

  const register = async () => {
    try {
      setIsLoading(true);

      const payload = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        password: values.password,
      };

      const result = await postApi("/api/user/register", payload, false);

      if (
        result &&
        (result.status === 200 || result.status === 201) &&
        result.data &&
        result.data.user
      ) {
        const newUser = result.data.user;
        if (newUser) {
          persistUser(newUser, false);
        }

        // Dispatch user to Redux
        dispatch(setUser(newUser));

        resetForm();
        toast.success(t?.("auth.signUp.registrationSuccessful") || "Registration successful!");

        // Force reload to ensure App component re-renders with new auth state
        setTimeout(() => {
          window.location.href = newUser?.role === "user" ? "/cabinet" : "/dashboard";
        }, 500);
      } else {
        toast.error(
          t?.("auth.signUp.registrationFailed") || "Registration failed. Please try again."
        );
      }
    } catch (e) {
      const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
      toast.error(
        getLocalizedError(e, locale) ||
          t?.("auth.signUp.registrationFailed") ||
          "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultAuth
      illustrationBackground={image?.length > 0 && image[0]?.authImg}
      image={image?.length > 0 && image[0]?.authImg}
    >
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="fit-content"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Flex justify="space-between" align="center" w="100%">
            <Box>
              <Heading as="h1" color={textColor} fontSize="36px" mb="10px">
                {t?.("auth.signUp.title")}
              </Heading>
              <Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
                {t?.("auth.signUp.subtitle")}
              </Text>
            </Box>
            <HStack spacing={2}>
              <Button
                size="sm"
                variant={i18n.language === "en" ? "solid" : "ghost"}
                onClick={() => i18n.changeLanguage("en")}
              >
                EN
              </Button>
              <Button
                size="sm"
                variant={i18n.language === "ru" ? "solid" : "ghost"}
                onClick={() => i18n.changeLanguage("ru")}
              >
                РУ
              </Button>
            </HStack>
          </Flex>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: "100%", md: "420px" }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          mb={{ base: "20px", md: "auto" }}
        >
          <form onSubmit={handleSubmit}>
            <Flex gap={4} mb="24px">
              <FormControl isInvalid={errors?.firstName && touched?.firstName}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  {t?.("auth.signUp.firstName")}
                  <Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.firstName}
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder={t?.("auth.signUp.firstName")}
                  fontWeight="500"
                  size="lg"
                  borderColor={errors?.firstName && touched?.firstName ? "red.300" : null}
                />

                {errors?.firstName && touched?.firstName && (
                  <FormErrorMessage>{errors?.firstName}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={errors?.lastName && touched?.lastName}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  {t?.("auth.signUp.lastName")}
                  <Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.lastName}
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder={t?.("auth.signUp.lastName")}
                  fontWeight="500"
                  size="lg"
                  borderColor={errors?.lastName && touched?.lastName ? "red.300" : null}
                />

                {errors?.lastName && touched?.lastName && (
                  <FormErrorMessage>{errors?.lastName}</FormErrorMessage>
                )}
              </FormControl>
            </Flex>

            <FormControl isInvalid={errors?.email && touched?.email} mb="24px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                {t?.("auth.signUp.email")}
                <Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.email}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="mail@example.com"
                fontWeight="500"
                size="lg"
                borderColor={errors?.email && touched?.email ? "red.300" : null}
              />

              {errors?.email && touched?.email && (
                <FormErrorMessage>{errors?.email}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={errors?.password && touched?.password} mb="24px">
              <FormLabel ms="4px" fontSize="sm" fontWeight="500" color={textColor} display="flex">
                {t?.("auth.signUp.password")}
                <Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder={t?.("auth.signUp.password")}
                  name="password"
                  value={values?.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="lg"
                  variant="auth"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  borderColor={errors?.password && touched?.password ? "red.300" : null}
                />

                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={showPass}
                  />
                </InputRightElement>
              </InputGroup>
              {errors?.password && touched?.password && (
                <FormErrorMessage>{errors?.password}</FormErrorMessage>
              )}
              <Text mt={1} fontSize="xs" color={textColorSecondary}>
                {t?.("auth.validation.passwordHint")}
              </Text>
            </FormControl>

            <FormControl isInvalid={errors?.confirmPassword && touched?.confirmPassword} mb="24px">
              <FormLabel ms="4px" fontSize="sm" fontWeight="500" color={textColor} display="flex">
                {t?.("auth.signUp.confirmPassword")}
                <Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder={t?.("auth.signUp.confirmPassword")}
                  name="confirmPassword"
                  value={values?.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="lg"
                  variant="auth"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  borderColor={
                    errors?.confirmPassword && touched?.confirmPassword ? "red.300" : null
                  }
                />

                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={showPass}
                  />
                </InputRightElement>
              </InputGroup>
              {errors?.confirmPassword && touched?.confirmPassword && (
                <FormErrorMessage>{errors?.confirmPassword}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl display="flex" alignItems="center" mb="24px">
              <Checkbox
                onChange={(e) => setFieldValue("agreeToTerms", e.target.checked)}
                id="agree-terms"
                checked={values.agreeToTerms}
                colorScheme="brandScheme"
                me="10px"
              />

              <FormLabel
                htmlFor="agree-terms"
                mb="0"
                fontWeight="normal"
                color={textColor}
                fontSize="sm"
              >
                {t?.("auth.signUp.agreeToTerms")}
              </FormLabel>
            </FormControl>

            <Button
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              type="submit"
              mb="24px"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : t?.("auth.signUp.createAccountButton")}
            </Button>
          </form>

          <Flex justifyContent="center" alignItems="center" mt="10px">
            <Text color={textColorSecondary} fontWeight="normal" fontSize="sm">
              {t?.("auth.signUp.alreadyHave")}{" "}
              <Link as={RouterLink} to="/auth/sign-in" color="brand.500" fontWeight="600">
                {t?.("auth.signUp.signIn")}
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignUp;
