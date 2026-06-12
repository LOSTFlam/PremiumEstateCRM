import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PublicPageShell from "components/public/PublicPageShell";
import { publicBrand } from "views/public/publicBrand";

const MotionText = motion.create(Text);

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <PublicPageShell
      hero={false}
      seo={{ title: "404", description: t("publicPages.notFound.subtitle"), path: "/404" }}
    >
      <Stack
        align="center"
        textAlign="center"
        spacing={6}
        py={{ base: 16, md: 24 }}
        maxW="640px"
        mx="auto"
      >
        <MotionText
          fontSize={{ base: "7xl", md: "9xl" }}
          fontWeight="800"
          lineHeight="1"
          color={publicBrand.colors.ink}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          404
        </MotionText>
        <Heading size="xl" fontFamily="heading">
          {t("publicPages.notFound.title")}
        </Heading>
        <Text color={publicBrand.colors.textSoft} fontSize="lg" lineHeight="1.8">
          {t("publicPages.notFound.subtitle")}
        </Text>
        <Button
          as={RouterLink}
          to="/"
          borderRadius="full"
          size="lg"
          bg={publicBrand.gradients.brass}
          color={publicBrand.colors.ink}
        >
          {t("publicPages.notFound.cta")}
        </Button>
        <Box w="120px" h="4px" borderRadius="full" bg={publicBrand.gradients.accentLine} mt={4} />
      </Stack>
    </PublicPageShell>
  );
}
