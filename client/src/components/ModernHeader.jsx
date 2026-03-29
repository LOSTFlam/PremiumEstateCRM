import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Image,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiHeart, FiMenu, FiUser, FiX } from "react-icons/fi";
import { MdCompareArrows } from "react-icons/md";
import { useTranslation } from "react-i18next";
import useActiveBranding, {
  getActiveBrandRecord,
  getBrandLogoSrc,
} from "hooks/useActiveBranding";
import {
  getPublicSubline,
  getPublicTagline,
  publicBrand,
  resolvePublicBrandRecord,
} from "views/public/publicBrand";
import ThemeToggle from "components/ThemeToggle";

const brandShellStyles = {
  bg: "rgba(7, 12, 20, 0.45)",
  border: `1px solid rgba(227, 211, 184, 0.08)`,
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(20px)",
};

export default function ModernHeader({ largeLogo = [] }) {
  const { i18n, t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const branding = useActiveBranding(largeLogo);
  const isAuthenticated = Boolean(localStorage.getItem("token") || sessionStorage.getItem("token"));
  const currentLanguage = i18n.language?.startsWith("ru") ? "ru" : "en";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const brandRecord = useMemo(
    () => resolvePublicBrandRecord(getActiveBrandRecord(branding)),
    [branding],
  );
  const desktopLogo = useMemo(() => getBrandLogoSrc(brandRecord, "large"), [brandRecord]);
  const mobileLogo = useMemo(
    () => getBrandLogoSrc(brandRecord, "small") || desktopLogo,
    [brandRecord, desktopLogo],
  );
  const navLinks = useMemo(
    () => [
      { label: t("publicListing.homeNav"), href: "/" },
      { label: t("publicListing.propertiesNav"), href: "/offers" },
      { label: t("publicListing.aboutNav"), href: "/#about" },
      { label: t("publicListing.contactNav"), href: "/#contact" },
    ],
    [t],
  );

  const navigateAndClose = (href) => {
    navigate(href);
    onClose();
  };

  const isActivePath = (href) => {
    const basePath = href.split("#")[0];
    if (!basePath) return false;
    if (basePath === "/") return location.pathname === "/";
    return location.pathname.startsWith(basePath);
  };

  const langLabel = currentLanguage === "ru" ? "RU" : "EN";
  const subline = getPublicSubline(currentLanguage);
  const tagline = getPublicTagline(currentLanguage);

  return (
    <>
      <Box position="fixed" top="0" left="0" right="0" zIndex="30" px={{ base: 2, md: 3 }} pt={{ base: 2, md: 3 }}>
        <style>{`
          @keyframes logo-shimmer {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
          }
          @keyframes logo-glow {
            0%, 100% { filter: drop-shadow(0 0 2px rgba(212, 175, 55, 0.3)); }
            50% { filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.6)); }
          }
          .logo-container {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .logo-container:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);
          }
          .logo-image {
            animation: logo-shimmer 3s ease-in-out infinite;
          }
          .logo-container:hover .logo-image {
            animation: logo-glow 2s ease-in-out infinite;
          }
        `}</style>
        <Container maxW="8xl" px={{ base: 0, md: 1 }}>
          <Flex
            align="center"
            justify="space-between"
            px={{ base: 3, md: 4 }}
            py={{ base: 2, md: 2.5 }}
            borderRadius={{ base: "20px", md: "24px" }}
            bg={isScrolled || location.pathname !== "/" ? "rgba(7, 12, 20, 0.65)" : "rgba(7, 12, 20, 0.35)"}
            border="1px solid rgba(227, 211, 184, 0.06)"
            boxShadow={isScrolled || location.pathname !== "/" ? "0 4px 30px rgba(0, 0, 0, 0.15)" : "none"}
            backdropFilter={isScrolled || location.pathname !== "/" ? "blur(20px)" : "blur(10px)"}
            transition="all 0.3s ease"
          >
            <RouterLink to="/">
              <HStack spacing={{ base: 2, md: 3 }} align="center" className="logo-container">
                <Box
                  px={{ base: 2, md: 3 }}
                  py={{ base: 1.5, md: 2 }}
                  borderRadius="20px"
                  bg="transparent"
                  border="1px solid rgba(227, 211, 184, 0.06)"
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{
                    borderColor: "rgba(212, 175, 55, 0.2)",
                    boxShadow: "0 0 20px rgba(212, 175, 55, 0.1)",
                  }}
                >
                  <Image
                    src={desktopLogo || mobileLogo}
                    alt={publicBrand.name}
                    maxH={{ base: "28px", md: "32px" }}
                    objectFit="contain"
                    className="logo-image"
                    filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))"
                  />
                </Box>
                <Box display={{ base: "none", md: "block" }}>
                  <HStack spacing={2} align="center">
                    <Text
                      color="white"
                      fontWeight="600"
                      fontSize="xx-small"
                      letterSpacing="0.18em"
                      textTransform="uppercase"
                      opacity={0.7}
                    >
                      {tagline}
                    </Text>
                    <Badge
                      borderRadius="full"
                      px={2}
                      py={0.5}
                      bg="rgba(245, 208, 118, 0.1)"
                      color="#f5d076"
                      border="1px solid rgba(245, 208, 118, 0.15)"
                      fontSize="xx-small"
                    >
                      {langLabel}
                    </Badge>
                  </HStack>
                </Box>
              </HStack>
            </RouterLink>

            <HStack spacing={2} display={{ base: "none", xl: "flex" }}>
              {navLinks.map((link) => {
                const active = isActivePath(link.href);
                return (
                  <Button
                    key={link.href}
                    onClick={() => navigate(link.href)}
                    variant="ghost"
                    position="relative"
                    color="whiteAlpha.600"
                    fontWeight="500"
                    px={3}
                    fontSize="sm"
                    bg="transparent"
                    _hover={{ color: "white", bg: "transparent" }}
                    _after={
                      active
                        ? {
                            content: '""',
                            position: "absolute",
                            left: "12px",
                            right: "12px",
                            bottom: "4px",
                            h: "1.5px",
                            borderRadius: "999px",
                            bg: "rgba(212, 175, 55, 0.5)",
                          }
                        : undefined
                    }
                  >
                    {link.label}
                  </Button>
                );
              })}
            </HStack>

            <HStack spacing={1.5} display={{ base: "none", lg: "flex" }}>
              {/* Theme Toggle */}
              <ThemeToggle />
              
              <HStack
                spacing={1}
                px={2}
                py={1.5}
                borderRadius="full"
                bg="transparent"
                border="1px solid rgba(227, 211, 184, 0.06)"
              >
                <Button
                  size="xs"
                  minW="32px"
                  borderRadius="full"
                  variant={currentLanguage === "en" ? "solid" : "ghost"}
                  bg={currentLanguage === "en" ? "rgba(212, 175, 55, 0.2)" : "transparent"}
                  color={currentLanguage === "en" ? "white" : "whiteAlpha.600"}
                  fontSize="xx-small"
                  _hover={{
                    bg: currentLanguage === "en" ? "rgba(212, 175, 55, 0.25)" : "rgba(255,255,255,0.05)",
                  }}
                  onClick={() => i18n.changeLanguage("en")}
                >
                  EN
                </Button>
                <Button
                  size="xs"
                  minW="32px"
                  borderRadius="full"
                  variant={currentLanguage === "ru" ? "solid" : "ghost"}
                  bg={currentLanguage === "ru" ? "rgba(212, 175, 55, 0.2)" : "transparent"}
                  color={currentLanguage === "ru" ? "white" : "whiteAlpha.600"}
                  fontSize="xx-small"
                  _hover={{
                    bg: currentLanguage === "ru" ? "rgba(212, 175, 55, 0.25)" : "rgba(255,255,255,0.05)",
                  }}
                  onClick={() => i18n.changeLanguage("ru")}
                >
                  RU
                </Button>
              </HStack>

              <Button
                as={RouterLink}
                to="/offers/compare"
                variant="ghost"
                color="whiteAlpha.500"
                fontSize="sm"
                px={2}
                bg="transparent"
                _hover={{ bg: "transparent", color: "white" }}
              >
                <MdCompareArrows size={18} />
              </Button>

              <Button
                as={RouterLink}
                to="/favorites"
                variant="ghost"
                color="whiteAlpha.500"
                fontSize="sm"
                px={2}
                bg="transparent"
                _hover={{ bg: "transparent", color: "white" }}
              >
                <FiHeart size={18} />
              </Button>

              {isAuthenticated ? (
                <Button
                  as={RouterLink}
                  to="/dashboard"
                  variant="ghost"
                  color="whiteAlpha.600"
                  fontSize="sm"
                  px={2}
                  bg="transparent"
                  _hover={{ bg: "transparent", color: "white" }}
                >
                  <FiUser size={18} />
                </Button>
              ) : (
                <Button
                  as={RouterLink}
                  to="/auth/sign-in"
                  variant="ghost"
                  color="whiteAlpha.500"
                  fontSize="sm"
                  px={2}
                  bg="transparent"
                  _hover={{ bg: "transparent", color: "white" }}
                >
                  Sign In
                </Button>
              )}
            </HStack>

            <IconButton
              display={{ base: "inline-flex", lg: "none" }}
              aria-label="Open menu"
              icon={isOpen ? <FiX /> : <FiMenu />}
              onClick={isOpen ? onClose : onOpen}
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.100" }}
            />
          </Flex>
        </Container>
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={publicBrand.colors.ink} color="white">
          <DrawerCloseButton />
          <DrawerHeader pt={8}>
            <Stack spacing={4}>
              <HStack spacing={4}>
                <Box
                  px={3}
                  py={2.5}
                  borderRadius="20px"
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid rgba(227, 211, 184, 0.14)"
                  className="logo-container"
                >
                  <Image
                    src={mobileLogo || desktopLogo}
                    alt={publicBrand.name}
                    maxH="40px"
                    objectFit="contain"
                    className="logo-image"
                    filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))"
                  />
                </Box>
                <Stack spacing={0.5}>
                  <Text fontWeight="700" color="#f5d076" fontSize="xs" letterSpacing="0.16em" textTransform="uppercase">
                    {tagline}
                  </Text>
                  <Text color="whiteAlpha.760" fontSize="sm">
                    {subline}
                  </Text>
                </Stack>
              </HStack>
            </Stack>
          </DrawerHeader>
          <DrawerBody pb={8}>
            <Stack spacing={6}>
              <Stack spacing={3}>
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    onClick={() => navigateAndClose(link.href)}
                    justifyContent="space-between"
                    variant="ghost"
                    color="white"
                    h="52px"
                    borderRadius="18px"
                    bg={isActivePath(link.href) ? "rgba(255,255,255,0.08)" : "transparent"}
                    _hover={{ bg: "rgba(255,255,255,0.08)" }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Stack>

              <Divider borderColor="rgba(227, 211, 184, 0.14)" />

              <HStack spacing={3}>
                <Button
                  flex="1"
                  borderRadius="full"
                  bg={currentLanguage === "en" ? publicBrand.gradients.brass : "rgba(255,255,255,0.05)"}
                  color={currentLanguage === "en" ? publicBrand.colors.ink : "white"}
                  onClick={() => i18n.changeLanguage("en")}
                >
                  English
                </Button>
                <Button
                  flex="1"
                  borderRadius="full"
                  bg={currentLanguage === "ru" ? publicBrand.gradients.brass : "rgba(255,255,255,0.05)"}
                  color={currentLanguage === "ru" ? publicBrand.colors.ink : "white"}
                  onClick={() => i18n.changeLanguage("ru")}
                >
                  Русский
                </Button>
              </HStack>

              <Stack spacing={3}>
                <Button as={RouterLink} to="/offers/compare" onClick={onClose} leftIcon={<MdCompareArrows />}>
                  {t("publicListing.compareAction")}
                </Button>
                <Button as={RouterLink} to="/favorites" onClick={onClose} leftIcon={<FiHeart />}>
                  {t("publicListing.favoritesTitle") || t("publicListing.savedOffers")}
                </Button>
              </Stack>

              {isAuthenticated ? (
                <Button
                  as={RouterLink}
                  to="/dashboard"
                  onClick={onClose}
                  leftIcon={<FiUser />}
                  borderRadius="full"
                  bg={publicBrand.gradients.brass}
                  color={publicBrand.colors.ink}
                >
                  {t("navigation.dashboard")}
                </Button>
              ) : (
                <Stack spacing={3}>
                  <Button as={RouterLink} to="/auth/sign-in" onClick={onClose} variant="outline" color="white" borderColor="rgba(227, 211, 184, 0.24)">
                    {t("auth.signIn.signInButton")}
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/auth/sign-up"
                    onClick={onClose}
                    borderRadius="full"
                    bg={publicBrand.gradients.brass}
                    color={publicBrand.colors.ink}
                    fontWeight="700"
                  >
                    {t("auth.signUp.createAccountButton")}
                  </Button>
                </Stack>
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
