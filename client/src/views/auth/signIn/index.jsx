import React, { useEffect } from "react";
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
import { loginSchema } from "schema";
import { toast } from "react-toastify";
import Spinner from "components/spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchImage } from "../../../redux/slices/imageSlice";
import { setUser } from "../../../redux/slices/localSlice";
import { useTranslation } from "react-i18next";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeIdentity = (value) => String(value || "").trim();

const buildLoginPayload = (identity, password) => {
  const normalizedIdentity = normalizeIdentity(identity);

  if (EMAIL_PATTERN.test(normalizedIdentity)) {
    return { email: normalizedIdentity, password };
  }

  return { username: normalizedIdentity, password };
};

function SignIn() {
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [isLoding, setIsLoding] = React.useState(false);
  const [checkBox, setCheckBox] = React.useState(true);
  const [show, setShow] = React.useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const image = useSelector((state) => state?.images?.images);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    dispatch(fetchImage("?isActive=true"));
  }, [dispatch]);

  const showPass = () => setShow(!show);
  const identityLabel = i18n.language?.startsWith("ru")
    ? "Email или username"
    : "Email or username";

  const initialValues = {
    identity: "",
    password: "",
  };

  const { errors, values, touched, handleBlur, handleChange, resetForm, handleSubmit } = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async () => {
      await login();
    },
  });

  const login = async () => {
    // Validate manually
    if (!values.identity || !values.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoding(true);
      const payload = buildLoginPayload(values.identity, values.password);

      const result = await postApi("api/user/login", payload, checkBox);

      // Check if it's an error response
      if (result?.response) {
        const errorMsg =
          result.response?.data?.error || result.response?.data?.message || "Login failed";
        // Error handled silently
        toast.error(errorMsg);
        setIsLoding(false);
        return;
      }

      // Check for successful login (status 200 or 201)
      if (
        result &&
        (result.status === 200 || result.status === 201) &&
        result.data &&
        result.data.user
      ) {
        const currentUser = result?.data?.user;
        const token = result?.data?.token;

        if (token) {
          // Save token and user directly
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(currentUser));
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("user", JSON.stringify(currentUser));
        }

        dispatch(setUser(currentUser));
        resetForm();
        toast.success(t?.("auth.signIn.loginSuccessfully"));

        setTimeout(() => {
          if (!currentUser?.role) {
            navigate("/auth/sign-in", { replace: true });
            return;
          }

          // Force reload to ensure the app shell re-renders with the latest auth state.
          window.location.href = "/dashboard";
        }, 500);
      } else {
        // Error handled silently
        toast.error("Login failed. Please try again.");
      }
    } catch (e) {
      // Error handled silently
      toast.error(e?.response?.data?.error || e?.message || "Login failed");
    } finally {
      setIsLoding(false);
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
              <Heading color={textColor} fontSize="36px" mb="10px">
                {t?.("auth.signIn.title")}
              </Heading>
              <Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
                {t?.("auth.signIn.subtitle")}
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
            <FormControl isInvalid={errors?.identity && touched?.identity}>
              <FormLabel
                htmlFor="identity"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                {identityLabel}
                <Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                id="identity"
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.identity}
                name="identity"
                ms={{ base: "0px", md: "0px" }}
                type="text"
                placeholder="admin@gmail.com or username"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                mb={errors?.identity && touched?.identity ? undefined : "24px"}
                fontWeight="500"
                size="lg"
                borderColor={errors?.identity && touched?.identity ? "red.300" : null}
              />
              {errors?.identity && touched?.identity && (
                <FormErrorMessage mb="24px">{errors?.identity}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={errors?.password && touched?.password} mb="24px">
              <FormLabel
                htmlFor="password"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                {t?.("auth.signIn.password")}
                <Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  id="password"
                  isRequired={true}
                  fontSize="sm"
                  placeholder="Enter Your Password"
                  name="password"
                  mb={errors?.password && touched?.password ? undefined : "24px"}
                  value={values?.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="lg"
                  variant="auth"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
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
                <FormErrorMessage mb="24px">{errors?.password}</FormErrorMessage>
              )}

              <Flex justifyContent="space-between" align="center" mb="24px">
                <FormControl display="flex" alignItems="center">
                  <Checkbox
                    onChange={(e) => setCheckBox(e?.target?.checked)}
                    id="remember-login"
                    isChecked={checkBox}
                    colorScheme="brandScheme"
                    me="10px"
                  />
                  <FormLabel
                    htmlFor="remember-login"
                    mb="0"
                    fontWeight="normal"
                    color={textColor}
                    fontSize="sm"
                  >
                    {t?.("auth.signIn.keepLoggedIn")}
                  </FormLabel>
                </FormControl>
              </Flex>

              <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                type="submit"
                mb="24px"
                disabled={isLoding}
              >
                {isLoding ? <Spinner /> : t?.("auth.signIn.signInButton")}
              </Button>
            </FormControl>
          </form>

          <Flex justifyContent="center" alignItems="center" mt="10px">
            <Text color={textColorSecondary} fontWeight="normal" fontSize="sm">
              {t?.("auth.signIn.noAccount")}{" "}
              <Link as={RouterLink} to="/auth/sign-up" color="brand.500" fontWeight="600">
                {t?.("auth.signIn.createAccount")}
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
