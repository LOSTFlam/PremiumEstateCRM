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
// Custom Components
import { SearchBar as _SearchBar } from "components/navbar/searchBar/SearchBar";
import { SidebarResponsive } from "components/sidebar/Sidebar";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
// Assets
import { MdNotificationsNone } from "react-icons/md";
import { FaEthereum } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getApi, postApi } from "services/api";
import { constant } from "constant";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthStorage } from "utils/authStorage";
import { clearUser } from "../../redux/slices/localSlice";
import { useTranslation } from "react-i18next";
import i18next from "i18n/i18n.config";
import { setLanguage } from "../../redux/slices/languageSlice";
export default function HeaderLinks(props) {
  const { secondary, setOpenSidebar, openSidebar, routes } = props;
  // Chakra Color Mode
  const navbarIcon = useColorModeValue("gray.400", "white");
  let menuBg = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.700", "brand.400");
  const ethColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
  const ethBg = useColorModeValue("secondaryGray.300", "navy.900");
  const ethBox = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const menuItemHoverBg = useColorModeValue("gray.100", "whiteAlpha.100");
  // const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');

  // const [loginUser, setLoginUser] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currentLanguage = useSelector((state) => state?.language?.currentLanguage || "en");

  const handleChangeLanguage = (lng) => {
    dispatch(setLanguage(lng));
    i18next.changeLanguage(lng);
  };

  const userData = useSelector((state) => state?.user?.user);

  const data = typeof userData === "string" ? JSON.parse(userData) : userData;
  const user = data?.firstName + " " + data?.lastName;
  const _userId = JSON.parse(localStorage.getItem("user"))?._id;
  const loginUser = useSelector((state) => state?.user?.user);
  const loginRole = loginUser?.role || data?.role;
  const cabinetPath = loginRole === "user" ? "/cabinet" : "/admin/";
  const profilePath =
    loginRole === "user"
      ? "/cabinet/profile"
      : `/userView/${JSON.parse(localStorage.getItem("user"))?._id}`;
  const avatarSrc = data?.avatarUrl
    ? `${constant.baseUrl.replace(/\/$/, "")}${data.avatarUrl}`
    : undefined;

  const [isLogoutScheduled, setIsLogoutScheduled] = useState(false);

  const logOut = async (message, skipServerLogout = false) => {
    if (isLogoutScheduled) return;
    setIsLogoutScheduled(true);

    if (!skipServerLogout) {
      try {
        await postApi("api/user/logout", {}, {
          rememberMe: false,
          requestConfig: {
            headers: { "X-Silent-Request": "true" },
          },
        });
      } catch {
        // Continue local cleanup even if the server logout fails.
      }
    }

    clearAuthStorage();
    dispatch(clearUser());

    if (message) {
      toast.error(message);
    } else {
      toast.success("Log out Successfully");
    }

    setTimeout(() => {
      window.location.href = "/offers";
    }, 100);
  };

  useEffect(() => {
    let cancelled = false;

    const verifySession = async () => {
      try {
        await getApi("api/user/session", { silent: true });
      } catch (error) {
        if (cancelled || isLogoutScheduled || error?.response?.status !== 401) {
          return;
        }

        try {
          await postApi("api/user/refresh-token", {}, {
            rememberMe: true,
            requestConfig: {
              headers: { "X-Silent-Request": "true" },
            },
          });
          await getApi("api/user/session", { silent: true });
        } catch {
          logOut("Session expired", true);
        }
      }
    };

    verifySession();
    const intervalId = window.setInterval(verifySession, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [isLogoutScheduled]);

  return (
    <Flex
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      justifyContent={"end"}
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
      p="6px"
      mt={2.5}
      borderRadius="30px"
      boxShadow={shadow}
    >
      {/* <SearchBar
        mb={secondary ? { base: "10px", md: "unset" } : "unset"}
        me="10px"
        borderRadius="30px"
        /> */}

      <Flex
        bg={ethBg}
        display={secondary ? "flex" : "none"}
        borderRadius="30px"
        ms="auto"
        p="6px"
        align="center"
        me="6px"
      >
        <Flex
          align="center"
          justify="center"
          bg={ethBox}
          h="29px"
          w="29px"
          borderRadius="30px"
          me="7px"
        >
          <Icon color={ethColor} w="9px" h="14px" as={FaEthereum} />
        </Flex>
        <Text w="max-content" color={ethColor} fontSize="sm" fontWeight="700" me="6px">
          1,924
          <Text as="span" display={{ base: "none", md: "unset" }}>
            {" "}
            ETH
          </Text>
        </Text>
      </Flex>

      <SidebarResponsive
        routes={routes}
        setOpenSidebar={setOpenSidebar}
        openSidebar={openSidebar}
      />

      <Menu>
        <MenuButton
          as={Button}
          variant="ghost"
          p="0px"
          minW="unset"
          height="auto"
          color={textColor}
          fontSize="sm"
          fontWeight="700"
          _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
        >
          {currentLanguage.toUpperCase()}
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="6px"
          borderRadius="12px"
          bg={useColorModeValue("white", "navy.900")}
          border={`1px solid ${useColorModeValue("gray.200", "whiteAlpha.200")}`}
          mt="10px"
          minW="90px"
        >
          <MenuItem
            _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
            _focus={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
            px="10px"
            borderRadius="8px"
            onClick={() => handleChangeLanguage("en")}
          >
            <Text fontSize="sm" fontWeight="600" color={useColorModeValue("gray.800", "white")}>
              EN
            </Text>
          </MenuItem>
          <MenuItem
            _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
            _focus={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
            px="10px"
            borderRadius="8px"
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
          <Icon mt="6px" as={MdNotificationsNone} color={navbarIcon} w="18px" h="18px" me="10px" />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="20px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
          mt="22px"
          me={{ base: "30px", md: "unset" }}
          minW={{ base: "unset", md: "400px", xl: "450px" }}
          maxW={{ base: "360px", md: "unset" }}
        >
          <Flex jusitfy="space-between" w="100%" mb="20px">
            <Text fontSize="md" fontWeight="600" color={textColor}>
              {t?.("navigation.notifications")}
            </Text>
            <Text fontSize="sm" fontWeight="500" color={textColorBrand} ms="auto" cursor="pointer">
              {t?.("navigation.markAllRead")}
            </Text>
          </Flex>
          <Flex flexDirection="column">
            <MenuItem
              _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
              _focus={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
              px="0"
              borderRadius="8px"
              mb="10px"
            >
              <Flex py="10px" px="10px" w="100%">
                <Text fontSize="sm" fontWeight="500" color={textColor}>
                  Horizon UI Dashboard PRO - Alicia
                </Text>
              </Flex>
            </MenuItem>
            <MenuItem
              _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
              _focus={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
              px="0"
              borderRadius="8px"
              mb="10px"
            >
              <Flex py="10px" px="10px" w="100%">
                <Text fontSize="sm" fontWeight="500" color={textColor}>
                  Horizon Design System Free - Josh Henry
                </Text>
              </Flex>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
      {/* <FixedPlugin /> */}

      <Menu style={{ zIndex: 1500 }}>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: "pointer" }}
            color="white"
            name={user || "PremiumEstate"}
            src={avatarSrc}
            bg="#11047A"
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              textTransform={"capitalize"}
              color={textColor}
            >
              👋&nbsp; Hey, {user}
            </Text>
          </Flex>

          <Flex flexDirection="column" p="10px">
            <MenuItem
              _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
              _focus={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
              borderRadius="8px"
              px="14px"
            >
              <Text fontSize="sm" onClick={() => navigate(cabinetPath)} color={textColor}>
                {loginRole === "user"
                  ? t?.("navigation.personalCabinet")
                  : t?.("navigation.dashboard")}
              </Text>
            </MenuItem>

            {loginUser?.role === "superAdmin" && (
              <MenuItem
                _hover={{ bg: menuItemHoverBg }}
                _focus={{ bg: menuItemHoverBg }}
                borderRadius="8px"
                px="14px"
              >
                <Text fontSize="sm" onClick={() => navigate("/admin-setting")} color={textColor}>
                  {t?.("navigation.adminSettings")}
                </Text>
              </MenuItem>
            )}
            <MenuItem
              _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
              _focus={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
              borderRadius="8px"
              px="14px"
            >
              <Text fontSize="sm" onClick={() => navigate(profilePath)} color={textColor}>
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
              borderRadius="8px"
              px="14px"
            >
              <Text fontSize="sm" color={textColor}>
                {t?.("navigation.logout")}
              </Text>
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
