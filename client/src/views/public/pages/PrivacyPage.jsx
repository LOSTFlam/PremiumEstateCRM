import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import PublicPageShell from "components/public/PublicPageShell";
import ScrollReveal from "components/public/ScrollReveal";
import { publicBrand } from "views/public/publicBrand";

export default function PrivacyPage() {
  const { t } = useTranslation();
  const sections = t("publicPages.privacy.sections", { returnObjects: true }) || [];

  return (
    <PublicPageShell
      title={t("publicPages.privacy.title")}
      subtitle={t("publicPages.privacy.subtitle")}
      badge={t("publicPages.privacy.badge")}
      breadcrumbs={[
        { label: t("publicListing.homeNav"), href: "/" },
        { label: t("publicPages.privacy.title") },
      ]}
      seo={{
        title: t("publicPages.privacy.title"),
        description: t("publicPages.privacy.subtitle"),
        path: "/privacy",
      }}
    >
      <Stack spacing={6} maxW="820px">
        {Array.isArray(sections)
          ? sections.map((section, index) => (
              <ScrollReveal key={section.title} delay={index * 0.06}>
                <Box
                  borderRadius="24px"
                  px={6}
                  py={5}
                  bg="white"
                  border="1px solid rgba(9,18,32,0.08)"
                  boxShadow={publicBrand.shadows.soft}
                >
                  <Heading size="md" mb={3}>
                    {section.title}
                  </Heading>
                  <Text color={publicBrand.colors.textSoft} lineHeight="1.9">
                    {section.text}
                  </Text>
                </Box>
              </ScrollReveal>
            ))
          : null}
      </Stack>
    </PublicPageShell>
  );
}
