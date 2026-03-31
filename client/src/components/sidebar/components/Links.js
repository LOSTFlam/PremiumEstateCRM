/* eslint-disable */
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
// chakra imports
import {
  AbsoluteCenter,
  Box,
  Divider,
  Flex,
  HStack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { translateCrmText, translateRouteLabel } from "i18n/crmDictionary";

export function SidebarLinks(props) {
  //   Chakra color mode
  let location = useLocation();
  const { t, i18n } = useTranslation();
  const { textColor } = props;
  let activeColor = useColorModeValue("gray.900", "white");
  let inactiveColor = useColorModeValue("secondaryGray.600", "secondaryGray.600");
  let activeIcon = useColorModeValue("brand.600", "white");
  let textColorDefault = useColorModeValue("gray.700", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");
  let sidebarBgColor = useColorModeValue("rgba(10, 132, 255, 0.12)", "brand.200");

  const user = JSON.parse(localStorage.getItem("user"));

  const { routes, setOpenSidebar, openSidebar } = props;

  const getRouteLabel = (route) => {
    return translateRouteLabel(route, { t, language: i18n.language });
  };

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location?.pathname === routeName;
  };

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes) => {
    return routes?.map((route, index) => {
      if (route?.category) {
        return (
          <>
            <Text
              fontSize={"md"}
              color={activeColor}
              fontWeight="bold"
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              pt="18px"
              pb="10px"
              key={index}
            >
              {getRouteLabel(route)}
            </Text>
            {createLinks(route?.items)}
          </>
        );
      } else if (
        !route?.under &&
        user?.role &&
        route?.layout?.includes(`/${user?.role}`)
      ) {
        return (
          <NavLink key={index} to={route?.path}>
            {route?.separator && (
              <Box position="relative" margin="20px 0">
                <Divider />
                <AbsoluteCenter
                  textTransform={"capitalize"}
                  bg="white"
                  width={"max-content"}
                  padding="0 10px"
                  textAlign={"center"}
                >
                  {translateCrmText(route?.separator, {
                    t,
                    language: i18n.language,
                  })}
                </AbsoluteCenter>
              </Box>
            )}
            {route.icon ? (
              <Box
                backgroundColor={
                  activeRoute(route?.path?.toLowerCase()) ? sidebarBgColor : ""
                }
                borderRadius="24px"
                mx="10px"
                ps={"20px"}
                pe="12px"
                pb={"8px"}
                pt={"12px"}
                boxShadow={
                  activeRoute(route?.path?.toLowerCase())
                    ? "0 18px 40px rgba(10, 132, 255, 0.08)"
                    : "none"
                }
                backdropFilter="blur(14px)"
              >
                <HStack spacing="18px" py="6px">
                  {openSidebar === true ? (
                    <Flex
                      w="100%"
                      alignItems="center"
                      justifyContent="center"
                      // onClick={() => setOpenSidebar(!openSidebar)}
                    >
                      <Box
                        color={
                          activeRoute(route?.path?.toLowerCase())
                            ? activeIcon
                            : textColor || textColorDefault
                        }
                        me="18px"
                      >
                        {route?.icon}
                      </Box>
                      <Text
                        me="auto"
                        pb={"2px"}
                        textTransform={"capitalize"}
                        overflowX="hidden"
                        width="204px"
                        minH="48px"
                        display="-webkit-box"
                        sx={{
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                        lineHeight="1.35"
                        fontSize="sm"
                        color={
                          activeRoute(route?.path?.toLowerCase())
                            ? activeColor
                            : textColor || textColorDefault
                        }
                        fontWeight={
                          activeRoute(route?.path?.toLowerCase())
                            ? "semibold"
                            : "medium"
                        }
                      >
                        <Tooltip hasArrow label={getRouteLabel(route)}>
                          {getRouteLabel(route)}
                        </Tooltip>
                      </Text>
                    </Flex>
                  ) : (
                    <Flex
                      w="100%"
                      alignItems="center"
                      justifyContent="center"
                      //  onClick={() => setOpenSidebar(!openSidebar)}
                    >
                      <Box
                        color={
                          activeRoute(route?.path?.toLowerCase())
                            ? activeIcon
                            : textColor || textColorDefault
                        }
                        me="18px"
                      >
                        {route?.icon}
                      </Box>
                    </Flex>
                  )}
                  <Box
                    // h='36px'
                    w="4px"
                    bg={
                      activeRoute(route?.path?.toLowerCase())
                        ? brandColor
                        : "transparent"
                    }
                    borderRadius="5px"
                  />
                </HStack>
              </Box>
            ) : (
              <Box>
                <HStack
                  spacing={
                    activeRoute(route?.path?.toLowerCase()) ? "22px" : "26px"
                  }
                  py="8px"
                  ps="16px"
                >
                  <Text
                    me="auto"
                    fontSize="sm"
                    lineHeight="1.4"
                    color={
                      activeRoute(route?.path?.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight={
                      activeRoute(route?.path?.toLowerCase())
                        ? "semibold"
                        : "medium"
                    }
                  >
                    {getRouteLabel(route)}
                  </Text>
                  <Box h="36px" w="4px" bg="brand.400" borderRadius="5px" />
                </HStack>
              </Box>
            )}
          </NavLink>
        );
      }
    });
  };
  //  BRAND
  return createLinks(routes);
}

export default SidebarLinks;
