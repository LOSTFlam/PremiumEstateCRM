import React from "react";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  FaHome,
  FaCheckCircle,
  FaKey,
  FaHeadset,
  FaUsers,
  FaClock,
  FaLightbulb,
  FaHeart,
} from "react-icons/fa";
import GlassCard from "./GlassCard";

const featuresData = [
  {
    icon: FaHome,
    titleKey: "publicListing.premiumProperties",
    textKey: "publicListing.premiumPropertiesText",
  },
  {
    icon: FaCheckCircle,
    titleKey: "publicListing.verifiedListings",
    textKey: "publicListing.verifiedListingsText",
  },
  {
    icon: FaKey,
    titleKey: "publicListing.exclusiveAccess",
    textKey: "publicListing.exclusiveAccessText",
  },
  {
    icon: FaHeadset,
    titleKey: "publicListing.premiumSupport",
    textKey: "publicListing.premiumSupportText",
  },
  {
    icon: FaUsers,
    titleKey: "publicListing.expertAgents",
    textKey: "publicListing.expertAgentsText",
  },
  { icon: FaClock, titleKey: "publicListing.support247", textKey: "publicListing.support247Text" },
  {
    icon: FaLightbulb,
    titleKey: "publicListing.expertAdvice",
    textKey: "publicListing.expertAdviceText",
  },
  {
    icon: FaHeart,
    titleKey: "publicListing.personalizedService",
    textKey: "publicListing.personalizedServiceText",
  },
];

export default function WhyChooseUs() {
  const { t } = useTranslation();

  const sectionBg = useColorModeValue(
    "linear-gradient(135deg, rgba(173, 188, 159, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)",
    "linear-gradient(135deg, rgba(18, 55, 42, 0.4) 0%, rgba(0, 0, 0, 0.3) 100%)"
  );

  const titleColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Box py={{ base: 20, md: 28 }} bg={sectionBg} position="relative" overflow="hidden">
      {/* Decorative gradient orbs */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        width="600px"
        height="600px"
        bg="radial-gradient(circle, rgba(100, 200, 150, 0.15) 0%, transparent 70%)"
        borderRadius="50%"
        filter="blur(60px)"
      />

      <Box
        position="absolute"
        bottom="-20%"
        left="-10%"
        width="500px"
        height="500px"
        bg="radial-gradient(circle, rgba(173, 188, 159, 0.15) 0%, transparent 70%)"
        borderRadius="50%"
        filter="blur(60px)"
      />

      <Container maxW="7xl" position="relative" zIndex={1}>
        <Stack spacing={12}>
          {/* Header */}
          <Stack spacing={4} align="center" textAlign="center">
            <Heading size="2xl" color={titleColor} lineHeight="1.1">
              {t("publicListing.whyChooseUs")}
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color={textColor} maxW="3xl">
              {t("publicListing.whyChooseUsHelp")}
            </Text>
            <Text fontSize={{ base: "md", md: "lg" }} color={textColor} maxW="4xl">
              {t("publicListing.whyChooseUsText")}
            </Text>
          </Stack>

          {/* Feature Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {featuresData.map((feature, index) => (
              <GlassCard key={feature.titleKey || index} p={6} height="100%">
                <Stack spacing={4} align="center" textAlign="center" height="100%" justify="center">
                  <Box p={4} borderRadius="20px" bg="rgba(100, 200, 150, 0.15)" color="teal.500">
                    <Icon as={feature.icon} boxSize={8} />
                  </Box>
                  <Heading size="md" color={titleColor}>
                    {t(feature.titleKey)}
                  </Heading>
                  <Text color={textColor} fontSize="sm">
                    {t(feature.textKey)}
                  </Text>
                </Stack>
              </GlassCard>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
