import { useState } from "react";
import {
  Avatar,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { constant } from "constant";
import { postApi } from "services/api";
import { clearAuthStorage } from "utils/authStorage";
import {
  getProfilePath,
  getPublicSitePath,
  getRoleHomePath,
  resolveAuthUser,
} from "utils/authPaths";
import { clearUser } from "../../redux/slices/localSlice";

export default function PublicUserMenu({ onNavigate }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state?.user?.user);
  const user = resolveAuthUser(reduxUser);
  const [isLogoutScheduled, setIsLogoutScheduled] = useState(false);

  const menuBg = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
  const menuItemHoverBg = useColorModeValue("gray.100", "whiteAlpha.100");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );

  if (!user?.role) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  const displayName = fullName || user.email || t("navigation.profile");
  const role = user.role;
  const homePath = getRoleHomePath(role);
  const profilePath = getProfilePath(role, user._id);
  const avatarSrc = user.avatarUrl
    ? `${constant.baseUrl.replace(/\/$/, "")}${user.avatarUrl}`
    : undefined;

  const goTo = (path) => {
    navigate(path);
    onNavigate?.();
  };

  const logOut = async () => {
    if (isLogoutScheduled) return;
    setIsLogoutScheduled(true);

    try {
      await postApi(
        "api/user/logout",
        {},
        {
          rememberMe: false,
          requestConfig: {
            headers: { "X-Silent-Request": "true" },
          },
        }
      );
    } catch {
      // Continue local cleanup even if the server logout fails.
    }

    clearAuthStorage();
    dispatch(clearUser());
    toast.success(t("navigation.logoutSuccess", { defaultValue: "Logged out successfully" }));
    onNavigate?.();
    navigate(getPublicSitePath());
  };

  return (
    <Menu isLazy>
      <MenuButton
        as={Button}
        variant="ghost"
        color="whiteAlpha.700"
        fontSize="sm"
        px={2}
        bg="transparent"
        _hover={{ bg: "transparent", color: "white" }}
        leftIcon={
          <Avatar size="sm" name={displayName} src={avatarSrc} bg="#11047A" w="32px" h="32px" />
        }
      >
        <Text display={{ base: "none", xl: "inline" }} fontWeight="600" maxW="140px" isTruncated>
          {displayName}
        </Text>
      </MenuButton>
      <MenuList boxShadow={shadow} p="0px" mt="10px" borderRadius="20px" bg={menuBg} border="none">
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
            color={textColor}
          >
            {t("adminSettingsHub.welcome", {
              name: displayName,
              defaultValue: `Hi, ${displayName}`,
            })}
          </Text>
        </Flex>
        <Flex flexDirection="column" p="10px">
          <MenuItem
            _hover={{ bg: menuItemHoverBg }}
            _focus={{ bg: menuItemHoverBg }}
            borderRadius="8px"
            px="14px"
            onClick={() => goTo(homePath)}
          >
            <Text fontSize="sm" color={textColor}>
              {role === "user" ? t("navigation.personalCabinet") : t("navigation.dashboard")}
            </Text>
          </MenuItem>
          {role === "superAdmin" ? (
            <>
              <MenuItem
                _hover={{ bg: menuItemHoverBg }}
                _focus={{ bg: menuItemHoverBg }}
                borderRadius="8px"
                px="14px"
                onClick={() => goTo("/admin-setting")}
              >
                <Text fontSize="sm" color={textColor}>
                  {t("navigation.adminSettings")}
                </Text>
              </MenuItem>
              <MenuItem
                _hover={{ bg: menuItemHoverBg }}
                _focus={{ bg: menuItemHoverBg }}
                borderRadius="8px"
                px="14px"
                onClick={() => goTo("/homepage-editor")}
              >
                <Text fontSize="sm" color={textColor}>
                  {t("navigation.homepageContent")}
                </Text>
              </MenuItem>
            </>
          ) : null}
          <MenuItem
            _hover={{ bg: menuItemHoverBg }}
            _focus={{ bg: menuItemHoverBg }}
            borderRadius="8px"
            px="14px"
            onClick={() => goTo(profilePath)}
          >
            <Text fontSize="sm" color={textColor}>
              {t("navigation.profileSettings")}
            </Text>
          </MenuItem>
          <MenuItem
            _hover={{ bg: menuItemHoverBg }}
            _focus={{ bg: menuItemHoverBg }}
            color="red.400"
            borderRadius="8px"
            px="14px"
            onClick={logOut}
          >
            <Text fontSize="sm" color={textColor}>
              {t("navigation.logout")}
            </Text>
          </MenuItem>
        </Flex>
      </MenuList>
    </Menu>
  );
}
