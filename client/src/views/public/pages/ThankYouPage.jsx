import { useEffect } from "react";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { useTranslation } from "react-i18next";
import PublicPageShell from "components/public/PublicPageShell";
import { publicBrand } from "views/public/publicBrand";

export default function ThankYouPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const source = params.get("source") || "form";

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 72,
      origin: { y: 0.65 },
      colors: ["#d4af37", "#f7e7ce", "#0a2540", "#ffffff"],
    });
  }, []);

  return (
    <PublicPageShell
      hero={false}
      seo={{
        title: t("publicPages.thankYou.title"),
        description: t("publicPages.thankYou.subtitle"),
        path: "/thank-you",
      }}
    >
      <Stack
        align="center"
        textAlign="center"
        spacing={6}
        py={{ base: 16, md: 24 }}
        maxW="620px"
        mx="auto"
      >
        <Box
          w="88px"
          h="88px"
          borderRadius="full"
          display="grid"
          placeItems="center"
          bg="rgba(212,175,55,0.16)"
          color={publicBrand.colors.copper}
          fontSize="3xl"
        >
          ✓
        </Box>
        <Heading size="xl" fontFamily="heading">
          {t("publicPages.thankYou.title")}
        </Heading>
        <Text color={publicBrand.colors.textSoft} fontSize="lg" lineHeight="1.8">
          {source === "contact"
            ? t("publicPages.thankYou.contactMessage")
            : t("publicPages.thankYou.subtitle")}
        </Text>
        <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
          <Button as={RouterLink} to="/" borderRadius="full" variant="outline">
            {t("publicListing.homeNav")}
          </Button>
          <Button
            as={RouterLink}
            to="/offers"
            borderRadius="full"
            bg={publicBrand.gradients.brass}
            color={publicBrand.colors.ink}
          >
            {t("publicListing.viewAllProperties")}
          </Button>
        </Stack>
      </Stack>
    </PublicPageShell>
  );
}
