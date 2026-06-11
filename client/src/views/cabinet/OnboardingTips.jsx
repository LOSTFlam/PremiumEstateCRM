import { Box, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LuHeart, LuSearch, LuUser } from "react-icons/lu";
import { MdCompareArrows } from "react-icons/md";
import { useCabinetTheme } from "./useCabinetTheme";

const OnboardingTips = () => {
  const { t } = useTranslation();
  const theme = useCabinetTheme();

  const tips = [
    { icon: LuHeart, title: t("cabinet.onboarding.tip1Title"), text: t("cabinet.onboarding.tip1Text") },
    { icon: MdCompareArrows, title: t("cabinet.onboarding.tip2Title"), text: t("cabinet.onboarding.tip2Text") },
    { icon: LuSearch, title: t("cabinet.onboarding.tip3Title"), text: t("cabinet.onboarding.tip3Text") },
    { icon: LuUser, title: t("cabinet.onboarding.tip4Title"), text: t("cabinet.onboarding.tip4Text") },
  ];

  return (
    <Box
      borderRadius="24px"
      bg={theme.onboardingBg}
      border="1px solid"
      borderColor={theme.panelBorder}
      p={{ base: 5, md: 6 }}
    >
      <Heading size="sm" color={theme.heading} mb={2}>
        {t("cabinet.onboarding.title")}
      </Heading>
      <Text color={theme.muted} mb={5}>
        {t("cabinet.onboarding.subtitle")}
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {tips.map((tip) => (
          <Stack key={tip.title} {...theme.tipCardStyle} spacing={2}>
            <Box as={tip.icon} boxSize={5} color={theme.accentIcon} />
            <Text color={theme.heading} fontWeight="700">
              {tip.title}
            </Text>
            <Text color={theme.muted} fontSize="sm">
              {tip.text}
            </Text>
          </Stack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default OnboardingTips;
