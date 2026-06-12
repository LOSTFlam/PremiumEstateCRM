import { Box, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { FiHeart, FiHome, FiGrid, FiUser } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import useFavoriteCount from "hooks/useFavoriteCount";
import { isAuthenticatedUser } from "utils/authStorage";
import { publicBrand } from "views/public/publicBrand";

const NAV_ITEMS = [
  { key: "home", href: "/", icon: FiHome, labelKey: "home" },
  { key: "catalog", href: "/offers", icon: FiGrid, labelKey: "properties" },
  { key: "favorites", href: "/favorites", icon: FiHeart, labelKey: "favorites", showCount: true },
  {
    key: "profile",
    href: "/auth/sign-in",
    icon: FiUser,
    labelKey: "profile",
    authLabelKey: "cabinet",
    authHref: "/cabinet",
  },
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
      pb="calc(12px + env(safe-area-inset-bottom, 0px))"
      pointerEvents="none"
    >
      <HStack
        className="mobile-bottom-nav"
        as="nav"
        aria-label="Mobile navigation"
        justify="space-between"
        spacing={0}
        bg="rgba(8, 17, 26, 0.92)"
        border="1px solid var(--cinematic-line)"
        borderRadius="24px"
        py={2}
        px={1}
        backdropFilter="blur(14px)"
        boxShadow="var(--cinematic-shadow-deep)"
        pointerEvents="auto"
        mb={1}
      >
        {NAV_ITEMS.map((item) => {
          const href = item.key === "profile" && isAuthenticated ? item.authHref : item.href;
          const active = isActive(href);
          const labelKey =
            item.key === "profile" && isAuthenticated ? item.authLabelKey : item.labelKey;
          const label = t(`publicListing.mobileBottomNav.${labelKey}`);
          return (
            <Box
              key={item.key}
              as={RouterLink}
              to={href}
              className="mobile-bottom-nav__item"
              flex="1 1 0"
              minW={0}
              minH="52px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="18px"
              px={1}
              bg={active ? "rgba(245, 208, 118, 0.92)" : "transparent"}
              color={active ? publicBrand.colors.ink : "whiteAlpha.760"}
              transition="background 0.2s ease, color 0.2s ease"
              _hover={{
                color: active ? publicBrand.colors.ink : "white",
                bg: active ? "rgba(245, 208, 118, 0.96)" : "rgba(255,255,255,0.06)",
              }}
              aria-label={label}
              aria-current={active ? "page" : undefined}
            >
              <VStack spacing={0.5} w="full" align="center" justify="center">
                <Box position="relative" flexShrink={0}>
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
                <Text className="mobile-bottom-nav__label" fontSize="9px" fontWeight="600">
                  {label}
                </Text>
              </VStack>
            </Box>
          );
        })}
      </HStack>
    </Box>
  );
}
