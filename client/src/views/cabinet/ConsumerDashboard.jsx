import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LuBookmark,
  LuClock3,
  LuHeart,
  LuHouse,
  LuMessageSquare,
  LuSearch,
  LuSparkles,
  LuUser,
} from "react-icons/lu";
import { MdCompareArrows } from "react-icons/md";
import { useCallback, useEffect, useState } from "react";
import { useCabinetPreferences } from "hooks/useCabinetPreferences";
import CabinetPropertyGrid from "./CabinetPropertyGrid";
import OnboardingTips from "./OnboardingTips";
import { constant } from "constant";
import { getStoredUser } from "utils/authStorage";
import { getApi } from "services/api";

const statCard = {
  p: { base: 5, md: 6 },
  borderRadius: "24px",
  bg: "rgba(255,255,255,0.06)",
  border: "1px solid",
  borderColor: "whiteAlpha.200",
  backdropFilter: "blur(12px)",
};

const ConsumerDashboard = () => {
  const { t } = useTranslation();
  const user = getStoredUser();
  const { favoriteIds, compareIds, recentIds, savedSearches } = useCabinetPreferences();
  const [inquiryCount, setInquiryCount] = useState(0);

  const fetchInquiryCount = useCallback(async () => {
    try {
      const response = await getApi("api/user/inquiries", { silent: true });
      const items = response?.inquiries || [];
      setInquiryCount(Array.isArray(items) ? items.length : 0);
    } catch {
      setInquiryCount(0);
    }
  }, []);

  useEffect(() => {
    fetchInquiryCount();
  }, [fetchInquiryCount]);

  const isNewUser = favoriteIds.length === 0 && recentIds.length === 0 && inquiryCount === 0;

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    t("cabinet.guest");

  const avatarSrc = user?.avatarUrl
    ? `${constant.baseUrl.replace(/\/$/, "")}${user.avatarUrl}`
    : undefined;

  const stats = [
    {
      label: t("cabinet.stats.favorites"),
      value: favoriteIds.length,
      icon: LuHeart,
      to: "/cabinet/saved",
      color: "pink.300",
    },
    {
      label: t("cabinet.stats.recent"),
      value: recentIds.length,
      icon: LuClock3,
      to: "/cabinet/recent",
      color: "cyan.300",
    },
    {
      label: t("cabinet.stats.compare"),
      value: compareIds.length,
      icon: MdCompareArrows,
      to: "/cabinet/compare",
      color: "orange.300",
    },
    {
      label: t("cabinet.stats.searches"),
      value: savedSearches.length,
      icon: LuSearch,
      to: "/cabinet/searches",
      color: "purple.300",
    },
    {
      label: t("cabinet.stats.inquiries"),
      value: inquiryCount,
      icon: LuMessageSquare,
      to: "/cabinet/inquiries",
      color: "blue.300",
    },
  ];

  const quickLinks = [
    { label: t("cabinet.quick.catalog"), to: "/offers", icon: LuHouse },
    { label: t("cabinet.quick.profile"), to: "/cabinet/profile", icon: LuUser },
    { label: t("cabinet.quick.listings"), to: "/my-listings", icon: LuBookmark },
  ];

  return (
    <Stack spacing={{ base: 6, md: 8 }}>
      <Grid
        templateColumns={{ base: "1fr", xl: "1.4fr 0.9fr" }}
        gap={{ base: 5, md: 6 }}
        alignItems="stretch"
      >
        <Box
          borderRadius="28px"
          p={{ base: 6, md: 8 }}
          bgGradient="linear(135deg, rgba(16, 52, 38, 0.95), rgba(8, 28, 22, 0.92))"
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <Badge
            colorScheme="green"
            variant="subtle"
            borderRadius="full"
            px={3}
            py={1}
            mb={4}
            textTransform="uppercase"
            letterSpacing="0.08em"
          >
            {t("cabinet.badge")}
          </Badge>
          <Heading size={{ base: "lg", md: "xl" }} color="white" mb={3}>
            {t("cabinet.welcome", { name: displayName })}
          </Heading>
          <Text color="whiteAlpha.800" maxW="640px" fontSize={{ base: "md", md: "lg" }}>
            {t("cabinet.subtitle")}
          </Text>
          <HStack mt={6} spacing={3} flexWrap="wrap">
            {quickLinks.map((link) => (
              <Button
                key={link.to}
                as={RouterLink}
                to={link.to}
                leftIcon={<Icon as={link.icon} />}
                variant="outline"
                colorScheme="whiteAlpha"
                borderColor="whiteAlpha.300"
                color="white"
              >
                {link.label}
              </Button>
            ))}
          </HStack>
        </Box>

        <Box {...statCard}>
          <HStack spacing={4} mb={4}>
            <Box
              boxSize="72px"
              borderRadius="full"
              bg="green.700"
              backgroundImage={avatarSrc ? `url(${avatarSrc})` : undefined}
              backgroundSize="cover"
              backgroundPosition="center"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="2px solid"
              borderColor="whiteAlpha.400"
            >
              {!avatarSrc ? (
                <Icon as={LuUser} boxSize={8} color="whiteAlpha.900" />
              ) : null}
            </Box>
            <Stack spacing={0}>
              <Text color="whiteAlpha.600" fontSize="sm" textTransform="uppercase">
                {t("cabinet.profilePreview")}
              </Text>
              <Text color="white" fontWeight="700" fontSize="lg">
                {displayName}
              </Text>
              <Text color="whiteAlpha.700" fontSize="sm">
                {user?.email}
              </Text>
            </Stack>
          </HStack>
          <Text color="whiteAlpha.700" fontSize="sm">
            {t("cabinet.profileHint")}
          </Text>
          <Button
            as={RouterLink}
            to="/cabinet/profile"
            mt={4}
            colorScheme="green"
            size="sm"
          >
            {t("cabinet.editProfile")}
          </Button>
        </Box>
      </Grid>

      {isNewUser ? <OnboardingTips /> : null}

      <SimpleGrid columns={{ base: 2, md: 3, xl: 5 }} spacing={4}>
        {stats.map((item) => (
          <Box
            key={item.to}
            as={RouterLink}
            to={item.to}
            {...statCard}
            transition="transform 0.2s ease"
            _hover={{ transform: "translateY(-2px)", borderColor: "whiteAlpha.400" }}
          >
            <HStack justify="space-between" mb={3}>
              <Icon as={item.icon} boxSize={5} color={item.color} />
              <Text color="white" fontSize="2xl" fontWeight="800">
                {item.value}
              </Text>
            </HStack>
            <Text color="whiteAlpha.800" fontSize="sm">
              {item.label}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <Box>
        <HStack justify="space-between" mb={4}>
          <HStack>
            <Icon as={LuSparkles} color="green.300" />
            <Heading size="md" color="white">
              {t("cabinet.recentPreview")}
            </Heading>
          </HStack>
          <Button as={RouterLink} to="/cabinet/recent" variant="link" color="green.300">
            {t("cabinet.viewAll")}
          </Button>
        </HStack>
        <CabinetPropertyGrid
          ids={recentIds.slice(0, 4)}
          emptyTitle={t("cabinet.recentEmpty.title")}
          emptyText={t("cabinet.recentEmpty.text")}
        />
      </Box>
    </Stack>
  );
};

export default ConsumerDashboard;
