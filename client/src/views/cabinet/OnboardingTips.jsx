import { Box, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LuHeart, LuSearch, LuUser } from "react-icons/lu";
import { MdCompareArrows } from "react-icons/md";

const tipCard = {
  borderRadius: "20px",
  bg: "rgba(255,255,255,0.05)",
  border: "1px solid",
  borderColor: "whiteAlpha.200",
  p: 5,
};

const OnboardingTips = () => {
  const { t } = useTranslation();

  const tips = [
    { icon: LuHeart, title: t("cabinet.onboarding.tip1Title"), text: t("cabinet.onboarding.tip1Text") },
    { icon: MdCompareArrows, title: t("cabinet.onboarding.tip2Title"), text: t("cabinet.onboarding.tip2Text") },
    { icon: LuSearch, title: t("cabinet.onboarding.tip3Title"), text: t("cabinet.onboarding.tip3Text") },
    { icon: LuUser, title: t("cabinet.onboarding.tip4Title"), text: t("cabinet.onboarding.tip4Text") },
  ];

  return (
    <Box
      borderRadius="24px"
      bg="rgba(16, 52, 38, 0.45)"
      border="1px solid"
      borderColor="whiteAlpha.200"
      p={{ base: 5, md: 6 }}
    >
      <Heading size="sm" color="white" mb={2}>
        {t("cabinet.onboarding.title")}
      </Heading>
      <Text color="whiteAlpha.700" mb={5}>
        {t("cabinet.onboarding.subtitle")}
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {tips.map((tip) => (
          <Stack key={tip.title} {...tipCard} spacing={2}>
            <Box as={tip.icon} boxSize={5} color="green.300" />
            <Text color="white" fontWeight="700">
              {tip.title}
            </Text>
            <Text color="whiteAlpha.700" fontSize="sm">
              {tip.text}
            </Text>
          </Stack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default OnboardingTips;
