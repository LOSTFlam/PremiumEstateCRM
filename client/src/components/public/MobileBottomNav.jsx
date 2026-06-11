import { Box, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { FiHeart, FiHome, FiGrid, FiUser } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import useFavoriteCount from "hooks/useFavoriteCount";
import { isAuthenticatedUser } from "utils/authStorage";
import { publicBrand } from "views/public/publicBrand";

const NAV_ITEMS = [
  { key: "home", href: "/", icon: FiHome, labelKey: "homeNav" },
  { key: "catalog", href: "/offers", icon: FiGrid, labelKey: "propertiesNav" },
  { key: "favorites", href: "/favorites", icon: FiHeart, labelKey: "savedOffers", showCount: true },
  { key: "profile", href: "/auth/sign-in", icon: FiUser, labelKey: "signIn", authHref: "/cabinet" },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const { t } = useTranslation();
  const favoriteCount = useFavoriteCount();
  const isAuthenticated = isAuthenticatedUser();

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <Box
      display={{ base: "block", md: "none" }}
      position="fixed"
      left={0}
      right={0}
      bottom={0}
      zIndex={28}
      px={3}
      pb={3}
      pointerEvents="none"
    >
      <HStack
        as="nav"
        aria-label="Mobile navigation"
        justify="space-around"
        bg="rgba(7, 12, 20, 0.92)"
        border="1px solid rgba(227, 211, 184, 0.14)"
        borderRadius="24px"
        py={2}
        px={2}
        backdropFilter="blur(14px)"
        boxShadow={publicBrand.shadows.deep}
        pointerEvents="auto"
      >
        {NAV_ITEMS.map((item) => {
          const href =
            item.key === "profile" && isAuthenticated ? item.authHref : item.href;
          const active = isActive(href);
          return (
            <Box
              key={item.key}
              as={RouterLink}
              to={href}
              flex={1}
              minH="44px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="18px"
              bg={active ? "rgba(212, 175, 55, 0.16)" : "transparent"}
              color={active ? "#f5d076" : "whiteAlpha.700"}
              transition="background 0.2s ease, color 0.2s ease"
              _hover={{ color: "white" }}
            >
              <VStack spacing={0.5}>
                <Box position="relative">
                  <Icon as={item.icon} boxSize={5} />
                  {item.showCount && favoriteCount > 0 ? (
                    <Box
                      position="absolute"
                      top="-6px"
                      right="-10px"
                      minW="16px"
                      h="16px"
                      px={1}
                      borderRadius="full"
                      bg={publicBrand.colors.gold}
                      color={publicBrand.colors.ink}
                      fontSize="10px"
                      fontWeight="700"
                      display="grid"
                      placeItems="center"
                    >
                      {favoriteCount}
                    </Box>
                  ) : null}
                </Box>
                <Text fontSize="10px" fontWeight="600">
                  {t(`publicListing.${item.labelKey}`)}
                </Text>
              </VStack>
            </Box>
          );
        })}
      </HStack>
    </Box>
  );
}
