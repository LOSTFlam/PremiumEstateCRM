import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  GridItem,
  HStack,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiInstagram, FiLinkedin, FiMail, FiMapPin, FiPhone, FiYoutube } from "react-icons/fi";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import useActiveBranding, { getActiveBrandRecord, getBrandLogoSrc } from "hooks/useActiveBranding";
import {
  getPublicSubline,
  getPublicTagline,
  publicBrand,
  resolvePublicBrandRecord,
} from "views/public/publicBrand";

export default function ModernFooter() {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const branding = useActiveBranding();
  const brandRecord = useMemo(
    () => resolvePublicBrandRecord(getActiveBrandRecord(branding)),
    [branding]
  );
  const footerLogo = getBrandLogoSrc(brandRecord, "large");
  const compactLogo = getBrandLogoSrc(brandRecord, "small");
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";

  const quickLinks = [
    { label: t("publicListing.homeNav"), href: "/" },
    { label: t("publicListing.propertiesNav"), href: "/offers" },
    { label: t("publicListing.savedOffers"), href: "/favorites" },
    { label: t("publicListing.comparePageTitle"), href: "/offers/compare" },
  ];

  const propertyTypes = [
    { label: t("publicListing.housesNav"), href: "/offers/houses" },
    { label: t("publicListing.apartmentsNav"), href: "/offers/apartments" },
    { label: t("publicListing.plotsNav"), href: "/offers/plots" },
    { label: t("publicListing.commercialNav"), href: "/offers/commercial" },
  ];

  const contactInfo = [
    { icon: FiMapPin, text: t("publicListing.footerAddress") },
    { icon: FiPhone, text: t("publicListing.footerPhone") },
    { icon: FiMail, text: t("publicListing.footerEmail") },
  ];

  const socialLinks = [
    { icon: FiInstagram, href: "#", label: "Instagram" },
    { icon: FiLinkedin, href: "#", label: "LinkedIn" },
    { icon: FiYoutube, href: "#", label: "YouTube" },
  ];

  return (
    <Box
      id="contact"
      position="relative"
      overflow="hidden"
      bg={publicBrand.gradients.page}
      color="white"
      borderTop={`1px solid ${publicBrand.colors.line}`}
    >
      <Box
        position="absolute"
        insetX="0"
        top="-160px"
        h="420px"
        bg="radial-gradient(circle at 50% 0%, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0) 68%)"
        pointerEvents="none"
      />

      <Container maxW="8xl" py={{ base: 16, md: 20 }} position="relative" zIndex={1}>
        <Stack spacing={10}>
          <Grid templateColumns={{ base: "1fr", xl: "1.1fr 0.9fr" }} gap={8}>
            <GridItem>
              <Box
                className="public-brand-panel"
                borderRadius="34px"
                px={{ base: 6, md: 8 }}
                py={{ base: 7, md: 8 }}
              >
                <Stack spacing={6}>
                  <HStack spacing={4} align="center">
                    <Box
                      px={4}
                      py={3}
                      borderRadius="24px"
                      bg="rgba(255,255,255,0.04)"
                      border="1px solid rgba(227, 211, 184, 0.16)"
                    >
                      <Image
                        src={footerLogo || compactLogo}
                        alt={publicBrand.name}
                        maxH={{ base: "42px", md: "46px" }}
                        objectFit="contain"
                      />
                    </Box>
                    <Stack spacing={1}>
                      <Text
                        fontSize="xs"
                        letterSpacing="0.18em"
                        textTransform="uppercase"
                        color="#f5d076"
                      >
                        {getPublicTagline(locale)}
                      </Text>
                      <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="600">
                        {getPublicSubline(locale)}
                      </Text>
                    </Stack>
                  </HStack>

                  <Text
                    color="whiteAlpha.760"
                    maxW="700px"
                    fontSize={{ base: "md", md: "lg" }}
                    lineHeight="1.8"
                  >
                    {t("publicListing.footerDescription")}
                  </Text>

                  <SimpleGrid
                    className="footer-contact-grid"
                    columns={{ base: 1, md: 3 }}
                    spacing={4}
                    w="100%"
                  >
                    {contactInfo.map((item) => (
                      <Box
                        key={item.text}
                        borderRadius="22px"
                        px={4}
                        py={4}
                        bg="rgba(255,255,255,0.04)"
                        border="1px solid rgba(227, 211, 184, 0.12)"
                        minW={0}
                        w="100%"
                      >
                        <Stack spacing={3} align="start" w="100%">
                          <Box
                            w="40px"
                            h="40px"
                            borderRadius="16px"
                            display="grid"
                            placeItems="center"
                            bg="rgba(245,208,118,0.12)"
                            color="#f5d076"
                            flexShrink={0}
                          >
                            <Icon as={item.icon} />
                          </Box>
                          <Text
                            color="whiteAlpha.840"
                            fontSize="sm"
                            lineHeight="1.6"
                            wordBreak="break-word"
                            overflowWrap="anywhere"
                            w="100%"
                          >
                            {item.text}
                          </Text>
                        </Stack>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Stack>
              </Box>
            </GridItem>

            <GridItem>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
                <Box className="public-brand-panel" borderRadius="30px" px={6} py={7}>
                  <Stack spacing={5}>
                    <Badge
                      w="fit-content"
                      px={3}
                      py={1.5}
                      borderRadius="full"
                      bg="rgba(245,208,118,0.14)"
                      color="#f5d076"
                      border="1px solid rgba(245,208,118,0.22)"
                    >
                      {t("publicListing.quickLinksNav")}
                    </Badge>
                    <Stack spacing={3}>
                      {quickLinks.map((link) => (
                        <Link
                          key={link.href}
                          as={RouterLink}
                          to={link.href}
                          color="whiteAlpha.820"
                          fontSize="sm"
                          _hover={{ color: "#f5d076" }}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </Stack>
                  </Stack>
                </Box>

                <Box className="public-brand-panel" borderRadius="30px" px={6} py={7}>
                  <Stack spacing={5}>
                    <Badge
                      w="fit-content"
                      px={3}
                      py={1.5}
                      borderRadius="full"
                      bg="rgba(245,208,118,0.14)"
                      color="#f5d076"
                      border="1px solid rgba(245,208,118,0.22)"
                    >
                      {t("publicListing.propertyTypesNav")}
                    </Badge>
                    <Stack spacing={3}>
                      {propertyTypes.map((type) => (
                        <Link
                          key={type.href}
                          as={RouterLink}
                          to={type.href}
                          color="whiteAlpha.820"
                          fontSize="sm"
                          _hover={{ color: "#f5d076" }}
                        >
                          {type.label}
                        </Link>
                      ))}
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
            </GridItem>
          </Grid>

          <Box
            borderRadius="34px"
            px={{ base: 6, md: 8 }}
            py={{ base: 7, md: 8 }}
            bg="rgba(255,255,255,0.04)"
            border="1px solid rgba(227, 211, 184, 0.12)"
          >
            <Grid templateColumns={{ base: "1fr", lg: "1.2fr 0.8fr" }} gap={8} alignItems="center">
              <Stack spacing={4}>
                <Text
                  fontSize="xs"
                  letterSpacing="0.18em"
                  textTransform="uppercase"
                  color="#f5d076"
                >
                  {t("publicListing.contactInfoNav")}
                </Text>
                <Text fontSize={{ base: "2xl", md: "3xl" }} fontFamily="heading" lineHeight="1.1">
                  {locale === "ru"
                    ? "Закрываем путь от первого интереса до частного показа без лишнего шума."
                    : "We guide the journey from first interest to private viewing with calm precision."}
                </Text>
              </Stack>

              <Stack spacing={4} align={{ base: "stretch", lg: "end" }}>
                <HStack spacing={3}>
                  {socialLinks.map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      display="grid"
                      placeItems="center"
                      w="46px"
                      h="46px"
                      borderRadius="18px"
                      bg="rgba(255,255,255,0.05)"
                      border="1px solid rgba(227, 211, 184, 0.12)"
                      _hover={{ bg: "rgba(245,208,118,0.12)", color: "#f5d076" }}
                    >
                      <Icon as={social.icon} />
                    </Link>
                  ))}
                </HStack>
                <Button
                  as={RouterLink}
                  to="/offers"
                  alignSelf={{ base: "stretch", lg: "flex-end" }}
                  borderRadius="full"
                  bg={publicBrand.gradients.brass}
                  color={publicBrand.colors.ink}
                  fontWeight="700"
                  _hover={{ transform: "translateY(-1px)", boxShadow: publicBrand.shadows.glow }}
                >
                  {t("publicListing.viewAllProperties")}
                </Button>
              </Stack>
            </Grid>
          </Box>

          <Divider borderColor="rgba(227, 211, 184, 0.12)" />

          <HStack
            justify="space-between"
            align={{ base: "start", md: "center" }}
            spacing={4}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Text color="whiteAlpha.620" fontSize="sm">
              {t("publicListing.rightsReserved").replace("2024", String(currentYear))}
            </Text>
            <HStack spacing={6} flexWrap="wrap">
              <Text color="whiteAlpha.620" fontSize="sm">
                {t("publicListing.privacyNav")}
              </Text>
              <Text color="whiteAlpha.620" fontSize="sm">
                {t("publicListing.termsNav")}
              </Text>
              <Text color="whiteAlpha.620" fontSize="sm">
                {t("publicListing.cookiesNav")}
              </Text>
            </HStack>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
}
