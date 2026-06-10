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
  useDisclosure,
} from "@chakra-ui/react";

export function SidebarLinks(props) {
  //   Chakra color mode
  let location = useLocation();
  const { t } = useTranslation();
  const { textColor } = props;
  let activeColor = useColorModeValue("brand.600", "white");
  let inactiveColor = useColorModeValue("secondaryGray.600", "secondaryGray.600");
  let activeIcon = useColorModeValue("brand.600", "white");
  let textColorDefault = useColorModeValue("gray.700", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");
  let sidebarBgColor = useColorModeValue("gray.200", "brand.200");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const user = JSON.parse(localStorage.getItem("user"));

  const { routes, setOpenSidebar, openSidebar } = props;

  const routeNameToI18nKey = {
    Dashboard: "navigation.dashboard",
    "My Listings": "navigation.myListings",
    Properties: "navigation.properties",
    Leads: "navigation.leads",
    Contacts: "navigation.contacts",
    Invoices: "navigation.invoices",
    Quotes: "navigation.quotes",
    "Offer Letter": "navigation.offerLetters",
    Opportunities: "navigation.opportunities",
    Account: "navigation.account",
    Tasks: "navigation.tasks",
    Meetings: "navigation.meetings",
    Calls: "navigation.phoneCall",
    Emails: "navigation.emails",
    "Email Template": "navigation.emailTemplate",
    Calender: "navigation.calendar",
    Payments: "navigation.payments",
    Documents: "navigation.documents",
    Calls: "navigation.phoneCall",
    "Reporting and Analytics": "navigation.reports",
    Reports: "navigation.reports",
    "Admin Setting": "navigation.adminSettings",
    "Storefront Filters": "navigation.storefrontFilters",
    Settings: "navigation.settings",
    Users: "navigation.users",
    Roles: "navigation.roles",
    "Custom Fields": "navigation.customFields",
    "Table Fields": "navigation.tableFields",
    "Active Deactive Module": "navigation.activeModules",
    Module: "navigation.modules",
    Documents: "navigation.documents",
    Validation: "navigation.validations",
    "Change Images": "navigation.changeImages",
    "Bank Details": "navigation.bankDetails",
    Moderation: "navigation.moderation",
  };

  const getRouteLabel = (route) => {
    if (route?.i18nKey) return t(route.i18nKey);
    const rawName = route?.name;
    const name = typeof rawName === "string" ? rawName.trim() : rawName;
    const i18nKey = routeNameToI18nKey[name];
    return i18nKey ? t(i18nKey) : rawName;
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
      } else if (!route?.under && user?.role && route?.layout?.includes(`/${user?.role}`)) {
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
                  {route?.separator}
                </AbsoluteCenter>
              </Box>
            )}
            {route.icon ? (
              <Box
                backgroundColor={activeRoute(route?.path?.toLowerCase()) ? sidebarBgColor : ""}
                ps={"25px"}
                pb={"6px"}
                pt={"10px"}
              >
                <HStack
                  spacing={activeRoute(route?.path?.toLowerCase()) ? "22px" : "26px"}
                  py="5px"
                >
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
                        pb={"3px"}
                        textOverflow={"ellipsis"}
                        textTransform={"capitalize"}
                        overflowX="hidden"
                        whiteSpace="nowrap"
                        width="190px"
                        color={
                          activeRoute(route?.path?.toLowerCase())
                            ? activeColor
                            : textColor || textColorDefault
                        }
                        fontWeight={activeRoute(route?.path?.toLowerCase()) ? "bold" : "normal"}
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
                    bg={activeRoute(route?.path?.toLowerCase()) ? brandColor : brandColor}
                    borderRadius="5px"
                  />
                </HStack>
              </Box>
            ) : (
              <Box>
                <HStack
                  spacing={activeRoute(route?.path?.toLowerCase()) ? "22px" : "26px"}
                  py="5px"
                  ps="10px"
                >
                  <Text
                    me="auto"
                    color={activeRoute(route?.path?.toLowerCase()) ? activeColor : inactiveColor}
                    fontWeight={activeRoute(route?.path?.toLowerCase()) ? "bold" : "normal"}
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
