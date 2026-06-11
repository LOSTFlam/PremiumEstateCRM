import {
  Badge,
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LuBookmark,
  LuCalendar,
  LuClock3,
  LuHeart,
  LuHouse,
  LuMessageSquare,
  LuSearch,
  LuSparkles,
  LuUser,
} from "react-icons/lu";
import { MdCompareArrows } from "react-icons/md";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCabinetPreferences } from "hooks/useCabinetPreferences";
import CabinetPropertyGrid from "./CabinetPropertyGrid";
import OnboardingTips from "./OnboardingTips";
import { useCabinetTheme } from "./useCabinetTheme";
import { constant } from "constant";
import { getStoredUser } from "utils/authStorage";
import { getApi } from "services/api";
import { fetchPublicCatalog } from "views/public/catalog/catalogService";
import { extractCollection } from "utils/normalizeResponse";

const ConsumerDashboard = () => {
  const { t } = useTranslation();
  const theme = useCabinetTheme();
  const user = getStoredUser();
  const { favoriteIds, compareIds, recentIds, savedSearches } = useCabinetPreferences();
  const [inquiryCount, setInquiryCount] = useState(0);
  const [recommendedIds, setRecommendedIds] = useState([]);

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

  useEffect(() => {
    let cancelled = false;

    const loadRecommendations = async () => {
      const seedIds = [...favoriteIds, ...recentIds].slice(0, 6);
      if (!seedIds.length) {
        const catalog = await fetchPublicCatalog();
        if (!cancelled) {
          setRecommendedIds(catalog.slice(0, 4).map((item) => item._id));
        }
        return;
      }

      try {
        const response = await getApi(`api/property/public/by-ids?ids=${seedIds.join(",")}`, {
          silent: true,
        });
        const seedProperties = extractCollection(response);
        const typeKey = seedProperties[0]?.propertyTypeKey || seedProperties[0]?.propertyType;
        const catalog = await fetchPublicCatalog();
        const matches = catalog
          .filter(
            (item) =>
              item?._id &&
              !seedIds.includes(item._id) &&
              (!typeKey || item.propertyTypeKey === typeKey || item.propertyType === typeKey)
          )
          .slice(0, 4)
          .map((item) => item._id);
        if (!cancelled) setRecommendedIds(matches);
      } catch {
        if (!cancelled) setRecommendedIds([]);
      }
    };

    loadRecommendations();
    return () => {
      cancelled = true;
    };
  }, [favoriteIds, recentIds]);

  const isNewUser = favoriteIds.length === 0 && recentIds.length === 0 && inquiryCount === 0;
  const monthlyViews = recentIds.length;

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
      color: "pink.500",
    },
    {
      label: t("cabinet.stats.recent"),
      value: recentIds.length,
      icon: LuClock3,
      to: "/cabinet/recent",
      color: "cyan.600",
    },
    {
      label: t("cabinet.stats.compare"),
      value: compareIds.length,
      icon: MdCompareArrows,
      to: "/cabinet/compare",
      color: "orange.500",
    },
    {
      label: t("cabinet.stats.searches"),
      value: savedSearches.length,
      icon: LuSearch,
      to: "/cabinet/searches",
      color: "purple.500",
    },
    {
      label: t("cabinet.stats.inquiries"),
      value: inquiryCount,
      icon: LuMessageSquare,
      to: "/cabinet/inquiries",
      color: "blue.500",
    },
  ];

  const quickLinks = useMemo(
    () => [
      { label: t("cabinet.quick.catalog"), to: "/offers", icon: LuHouse },
      { label: t("cabinet.quick.profile"), to: "/cabinet/profile", icon: LuUser },
      { label: t("cabinet.quick.listings"), to: "/my-listings", icon: LuBookmark },
      { label: t("cabinet.quick.schedule"), to: "/contacts", icon: LuCalendar },
      { label: t("cabinet.quick.ask"), to: "/cabinet/inquiries", icon: LuMessageSquare },
    ],
    [t]
  );

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
          bgGradient={theme.heroGradient}
          border="1px solid"
          borderColor={theme.panelBorder}
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
          <Heading size={{ base: "lg", md: "xl" }} color={theme.heroHeading} mb={3}>
            {t("cabinet.welcome", { name: displayName })}
          </Heading>
          <Text color={theme.heroText} maxW="640px" fontSize={{ base: "md", md: "lg" }}>
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
                colorScheme="green"
                borderColor={theme.heroButtonBorder}
                color={theme.heroButtonColor}
              >
                {link.label}
              </Button>
            ))}
          </HStack>
        </Box>

        <Box {...theme.cardStyle}>
          <HStack spacing={4} mb={4}>
            <Box
              boxSize="72px"
              borderRadius="full"
              bg="green.600"
              backgroundImage={avatarSrc ? `url(${avatarSrc})` : undefined}
              backgroundSize="cover"
              backgroundPosition="center"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="2px solid"
              borderColor={theme.panelBorder}
            >
              {!avatarSrc ? <Icon as={LuUser} boxSize={8} color="white" /> : null}
            </Box>
            <Stack spacing={0}>
              <Text color={theme.subtle} fontSize="sm" textTransform="uppercase">
                {t("cabinet.profilePreview")}
              </Text>
              <Text color={theme.heading} fontWeight="700" fontSize="lg">
                {displayName}
              </Text>
              <Text color={theme.muted} fontSize="sm">
                {user?.email}
              </Text>
            </Stack>
          </HStack>
          <Stat>
            <StatLabel color={theme.muted}>{t("cabinet.monthlyViews")}</StatLabel>
            <StatNumber color={theme.heading}>{monthlyViews}</StatNumber>
            <StatHelpText color={theme.subtle}>{t("cabinet.monthlyViewsHelp")}</StatHelpText>
          </Stat>
          <Button as={RouterLink} to="/cabinet/profile" mt={4} colorScheme="green" size="sm">
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
            {...theme.cardStyle}
            transition="transform 0.2s ease"
            _hover={{ transform: "translateY(-2px)", borderColor: "green.300" }}
          >
            <HStack justify="space-between" mb={3}>
              <Icon as={item.icon} boxSize={5} color={item.color} />
              <Text color={theme.heading} fontSize="2xl" fontWeight="800">
                {item.value}
              </Text>
            </HStack>
            <Text color={theme.muted} fontSize="sm">
              {item.label}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      {savedSearches.length > 0 ? (
        <Box {...theme.cardStyle}>
          <HStack justify="space-between" mb={3}>
            <Heading size="sm" color={theme.heading}>
              {t("cabinet.savedSearchMatches")}
            </Heading>
            <Button
              as={RouterLink}
              to="/cabinet/searches"
              size="sm"
              variant="link"
              color={theme.accentLink}
            >
              {t("cabinet.viewAll")}
            </Button>
          </HStack>
          <Text color={theme.muted} fontSize="sm">
            {t("cabinet.savedSearchMatchesText", { count: savedSearches.length })}
          </Text>
        </Box>
      ) : null}

      <Box>
        <HStack justify="space-between" mb={4}>
          <HStack>
            <Icon as={LuSparkles} color={theme.accentIcon} />
            <Heading size="md" color={theme.heading}>
              {t("cabinet.recommended")}
            </Heading>
          </HStack>
          <Button as={RouterLink} to="/offers" variant="link" color={theme.accentLink}>
            {t("cabinet.viewAll")}
          </Button>
        </HStack>
        <CabinetPropertyGrid
          ids={recommendedIds}
          emptyTitle={t("cabinet.recommendedEmpty.title")}
          emptyText={t("cabinet.recommendedEmpty.text")}
        />
      </Box>

      <Box>
        <HStack justify="space-between" mb={4}>
          <HStack>
            <Icon as={LuClock3} color={theme.accentIcon} />
            <Heading size="md" color={theme.heading}>
              {t("cabinet.recentPreview")}
            </Heading>
          </HStack>
          <Button as={RouterLink} to="/cabinet/recent" variant="link" color={theme.accentLink}>
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
