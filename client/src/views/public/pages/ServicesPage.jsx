import { Box, Button, Heading, Icon, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiBriefcase, FiHome, FiKey, FiSearch, FiShield, FiTrendingUp } from "react-icons/fi";
import PublicPageShell from "components/public/PublicPageShell";
import ScrollReveal from "components/public/ScrollReveal";
import { publicBrand } from "views/public/publicBrand";

const SERVICE_ICONS = [FiSearch, FiHome, FiKey, FiTrendingUp, FiShield, FiBriefcase];

export default function ServicesPage() {
  const { t } = useTranslation();
  const services = t("publicPages.services.items", { returnObjects: true }) || [];

  return (
    <PublicPageShell
      title={t("publicPages.services.title")}
      subtitle={t("publicPages.services.subtitle")}
      badge={t("publicPages.services.badge")}
      breadcrumbs={[
        { label: t("publicListing.homeNav"), href: "/" },
        { label: t("publicPages.services.title") },
      ]}
      seo={{
        title: t("publicPages.services.title"),
        description: t("publicPages.services.subtitle"),
        path: "/services",
      }}
    >
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={5}>
        {Array.isArray(services)
          ? services.map((service, index) => {
              const IconComponent = SERVICE_ICONS[index % SERVICE_ICONS.length];
              return (
                <ScrollReveal key={service.title} delay={index * 0.08}>
                  <Box
                    borderRadius="28px"
                    px={6}
                    py={7}
                    bg="white"
                    border="1px solid rgba(9,18,32,0.08)"
                    boxShadow={publicBrand.shadows.soft}
                    transition="transform 0.3s ease, box-shadow 0.3s ease"
                    _hover={{
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                    }}
                    h="100%"
                  >
                    <Stack spacing={4} h="100%">
                      <Box
                        w="52px"
                        h="52px"
                        borderRadius="16px"
                        display="grid"
                        placeItems="center"
                        bg="rgba(212,175,55,0.12)"
                        color={publicBrand.colors.copper}
                      >
                        <Icon as={IconComponent} boxSize={6} />
                      </Box>
                      <Heading size="md" fontFamily="heading">
                        {service.title}
                      </Heading>
                      <Text color={publicBrand.colors.textSoft} lineHeight="1.8" flex={1}>
                        {service.text}
                      </Text>
                      <Button
                        as={RouterLink}
                        to="/contacts"
                        alignSelf="flex-start"
                        borderRadius="full"
                        bg={publicBrand.gradients.brass}
                        color={publicBrand.colors.ink}
                        size="sm"
                      >
                        {t("publicPages.services.cta")}
                      </Button>
                    </Stack>
                  </Box>
                </ScrollReveal>
              );
            })
          : null}
      </SimpleGrid>
    </PublicPageShell>
  );
}
