// Chakra Imports
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { SidebarResponsive } from "components/sidebar/Sidebar";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
// Assets
import { MdNotificationsNone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import i18next from "i18n/i18n.config";
import { setLanguage } from "../../redux/slices/languageSlice";
import {
  getBrandLabel,
  isRussianLocale,
  translateCrmText,
} from "i18n/crmDictionary";
export default function HeaderLinks(props) {
  const { secondary, setOpenSidebar, openSidebar, routes } = props;
  // Chakra Color Mode
  const navbarIcon = useColorModeValue("gray.600", "white");
  let menuBg = useColorModeValue("rgba(255, 255, 255, 0.78)", "navy.800");
  const textColor = useColorModeValue("gray.800", "white");
  const textColorBrand = useColorModeValue("brand.700", "brand.400");
  const borderColor = useColorModeValue("rgba(148, 163, 184, 0.18)", "rgba(135, 140, 189, 0.3)");
  const shadow = useColorModeValue(
    "0 18px 44px rgba(15, 23, 42, 0.08)",
    "0 18px 44px rgba(15, 23, 42, 0.18)",
  );
  // const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');

  // const [loginUser, setLoginUser] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isRu = isRussianLocale(i18n.language);
  const currentLanguage = useSelector(
    (state) => state?.language?.currentLanguage || "en",
  );

  const handleChangeLanguage = (lng) => {
    dispatch(setLanguage(lng));
    i18next.changeLanguage(lng);
  };

  const userData = useSelector((state) => state?.user?.user);

  const data = typeof userData === "string" ? JSON.parse(userData) : userData;
  const user = [data?.firstName, data?.lastName].filter(Boolean).join(" ");
  const loginUser = useSelector((state) => state?.user?.user);

  const [isLogoutScheduled, setIsLogoutScheduled] = useState(false);

  const logOut = (message) => {
    localStorage.clear();
    sessionStorage.clear();
    setIsLogoutScheduled(true);
    
    if (message) {
      toast.error(message);
    } else {
      toast.success(
        translateCrmText("Logged out successfully", {
          t,
          language: i18n.language,
        }),
      );
    }
    
    // Navigate to offers page after logout
    setTimeout(() => {
      window.location.href = "/offers";
    }, 100);
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
        if (decodedToken?.exp < currentTime) {
          if (!isLogoutScheduled) {
            logOut(
              translateCrmText("Token has expired", {
                t,
                language: i18n.language,
              }),
            );
          }
        } else {
          // Schedule automatic logout when the token expires
          const timeToExpire = (decodedToken?.exp - currentTime) * 1000; // Convert seconds to milliseconds
          setTimeout(() => {
            if (!isLogoutScheduled) {
              logOut(
                translateCrmText("Token has expired", {
                  t,
                  language: i18n.language,
                }),
              );
            }
          }, timeToExpire);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [isLogoutScheduled]);

  return (
    <Flex
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      justifyContent={"end"}
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
      p="10px"
      mt={2.5}
      gap={{ base: "6px", md: "8px" }}
      borderRadius="32px"
      boxShadow={shadow}
      backdropFilter="blur(24px)"
      border="1px solid"
      borderColor={borderColor}
    >
      {/* <SearchBar
				mb={secondary ? { base: "10px", md: "unset" } : "unset"}
				me="10px"
				borderRadius="30px"
			/> */}

      <SidebarResponsive
        routes={routes}
        setOpenSidebar={setOpenSidebar}
        openSidebar={openSidebar}
      />

      <Menu>
        <MenuButton
          as={Button}
          variant="ghost"
          px="12px"
          py="10px"
          minW="unset"
          minH="44px"
          color={textColor}
          fontSize="sm"
          fontWeight="600"
          _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
        >
          {currentLanguage.toUpperCase()}
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="10px"
          borderRadius="22px"
          bg={useColorModeValue("rgba(255, 255, 255, 0.9)", "navy.900")}
          backdropFilter="blur(24px)"
          border={`1px solid ${useColorModeValue("rgba(148, 163, 184, 0.18)", "whiteAlpha.200")}`}
          mt="10px"
          minW="90px"
        >
          <MenuItem
            _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
            _focus={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
            px="12px"
            py="8px"
            borderRadius="14px"
            onClick={() => handleChangeLanguage("en")}
          >
            <Text fontSize="sm" fontWeight="600" color={useColorModeValue("gray.800", "white")}>
              EN
            </Text>
          </MenuItem>
          <MenuItem
            _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
            _focus={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
            px="12px"
            py="8px"
            borderRadius="14px"
            onClick={() => handleChangeLanguage("ru")}
          >
            <Text fontSize="sm" fontWeight="600" color={useColorModeValue("gray.800", "white")}>
              RU
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton p="0px">
          <Icon
            mt="2px"
            as={MdNotificationsNone}
            color={navbarIcon}
            w="20px"
            h="20px"
            me="8px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="24px"
          borderRadius="26px"
          bg={menuBg}
          backdropFilter="blur(24px)"
          border={`1px solid ${borderColor}`}
          mt="22px"
          me={{ base: "30px", md: "unset" }}
          minW={{ base: "unset", md: "400px", xl: "450px" }}
          maxW={{ base: "360px", md: "unset" }}
        >
          <Flex jusitfy="space-between" w="100%" mb="20px">
            <Text fontSize="md" fontWeight="600" color={textColor}>
              {t?.("navigation.notifications")}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="500"
              color={textColorBrand}
              ms="auto"
              cursor="pointer"
            >
              {t?.("navigation.markAllRead")}
            </Text>
          </Flex>
          <Flex
            minH="120px"
            px={2}
            py={4}
            direction="column"
            align="center"
            justify="center"
            textAlign="center"
            gap={2}
          >
            <Text fontWeight="700" color={textColor}>
              {translateCrmText("No new notifications", {
                t,
                language: i18n.language,
              })}
            </Text>
            <Text color="gray.500" fontSize="sm" maxW="320px" lineHeight="1.7">
              {translateCrmText(
                "System notifications will appear here when leads, tasks, or clients need attention.",
                {
                  t,
                  language: i18n.language,
                },
              )}
            </Text>
          </Flex>
        </MenuList>
      </Menu>

      <Menu style={{ zIndex: 1500 }}>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: "pointer" }}
            color="white"
            name={user || getBrandLabel(i18n.language)}
            bg="brand.500"
            size="sm"
            w="42px"
            h="42px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="8px"
          mt="10px"
          borderRadius="26px"
          bg={menuBg}
          backdropFilter="blur(24px)"
          border={`1px solid ${borderColor}`}
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="14px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
              lineHeight="1.6"
            >
              {isRu ? "Профиль" : "Profile"}: {user || getBrandLabel(i18n.language)}
            </Text>
          </Flex>

          <Flex flexDirection="column" p="8px" gap="4px">
            <MenuItem
              _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
              _focus={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
              borderRadius="14px"
              px="14px"
              py="10px"
            >
              <Text fontSize="sm" onClick={() => navigate(`/admin/`)} color={textColor}>
                {t?.("navigation.dashboard")}
              </Text>
            </MenuItem>

            {loginUser?.role === "superAdmin" && (
              <MenuItem
                _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
                _focus={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
                borderRadius="14px"
                px="14px"
                py="10px"
              >
                <Text fontSize="sm" onClick={() => navigate("/admin-setting")} color={textColor}>
                  {t?.("navigation.adminSettings")}
                </Text>
              </MenuItem>
            )}
            <MenuItem
              _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
              _focus={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
              borderRadius="14px"
              px="14px"
              py="10px"
            >
              <Text
                fontSize="sm"
                onClick={() =>
                  navigate(
                    `/userView/${JSON.parse(localStorage.getItem("user"))?._id}`,
                  )
                }
                color={textColor}
              >
                {t?.("navigation.profileSettings")}
              </Text>
            </MenuItem>
            {/*<MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} borderRadius="8px" px="14px">
							<Text fontSize="sm">Newsletter Settings</Text>
						</MenuItem> */}
            <MenuItem
              _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
              onClick={logOut}
              _focus={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
              color="red.400"
              borderRadius="14px"
              px="14px"
              py="10px"
            >
              <Text fontSize="sm" color={textColor}>{t?.("navigation.logout")}</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes?.string,
  fixed: PropTypes?.bool,
  secondary: PropTypes?.bool,
  onOpen: PropTypes?.func,
};
