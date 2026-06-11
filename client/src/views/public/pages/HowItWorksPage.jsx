import { Box, Circle, Heading, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import PublicPageShell from "components/public/PublicPageShell";
import ScrollReveal from "components/public/ScrollReveal";
import { publicBrand } from "views/public/publicBrand";

export default function HowItWorksPage() {
  const { t } = useTranslation();
  const steps = t("publicPages.howItWorks.steps", { returnObjects: true }) || [];

  return (
    <PublicPageShell
      title={t("publicPages.howItWorks.title")}
      subtitle={t("publicPages.howItWorks.subtitle")}
      badge={t("publicPages.howItWorks.badge")}
      breadcrumbs={[
        { label: t("publicListing.homeNav"), href: "/" },
        { label: t("publicPages.howItWorks.title") },
      ]}
      seo={{
        title: t("publicPages.howItWorks.title"),
        description: t("publicPages.howItWorks.subtitle"),
        path: "/how-it-works",
      }}
    >
      <Stack spacing={0} maxW="760px" mx="auto" position="relative">
        <Box
          position="absolute"
          left={{ base: "19px", md: "27px" }}
          top="12px"
          bottom="12px"
          w="2px"
          bg="linear-gradient(180deg, rgba(212,175,55,0.2), rgba(212,175,55,0.8), rgba(212,175,55,0.2))"
        />
        {Array.isArray(steps)
          ? steps.map((step, index) => (
              <ScrollReveal key={step.title} delay={index * 0.1}>
                <Stack direction="row" spacing={5} pb={10} align="flex-start">
                  <Circle
                    size={{ base: "40px", md: "56px" }}
                    bg={publicBrand.gradients.brass}
                    color={publicBrand.colors.ink}
                    fontWeight="800"
                    flexShrink={0}
                    boxShadow={publicBrand.shadows.glow}
                  >
                    {index + 1}
                  </Circle>
                  <Box
                    flex={1}
                    borderRadius="24px"
                    px={6}
                    py={5}
                    bg="white"
                    border="1px solid rgba(9,18,32,0.08)"
                    boxShadow={publicBrand.shadows.soft}
                  >
                    <Heading size="md" mb={2}>
                      {step.title}
                    </Heading>
                    <Text color={publicBrand.colors.textSoft} lineHeight="1.8">
                      {step.text}
                    </Text>
                  </Box>
                </Stack>
              </ScrollReveal>
            ))
          : null}
      </Stack>
    </PublicPageShell>
  );
}
