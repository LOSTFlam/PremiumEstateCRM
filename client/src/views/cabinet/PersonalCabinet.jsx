import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  LuClock3,
  LuHeart,
  LuLayoutDashboard,
  LuMessageSquare,
  LuSearch,
  LuUser,
} from "react-icons/lu";
import { MdCompareArrows } from "react-icons/md";
import CabinetNotificationsCenter from "components/cabinet/CabinetNotificationsCenter";
import ConsumerDashboard from "./ConsumerDashboard";
import { useCabinetPreferences } from "hooks/useCabinetPreferences";
import CabinetPropertyGrid from "./CabinetPropertyGrid";
import ProfileSettings from "./ProfileSettings";
import SavedFavoritesSection from "./SavedFavoritesSection";
import InquiriesSection from "./InquiriesSection";
import { buildSavedSearchPath } from "./cabinetExport";
import { useCallback, useEffect, useState } from "react";
import { getApi } from "services/api";
import { useCabinetTheme } from "./useCabinetTheme";
import {
  clearCompareIds,
  clearRecentlyViewedIds,
  removeSavedSearch,
} from "views/public/catalog/catalogStorage";

const CabinetSection = ({ title, description, children, actions }) => {
  const theme = useCabinetTheme();

  return (
    <Stack spacing={5}>
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        gap={4}
        wrap="wrap"
      >
        <Box>
          <Heading size="md" color={theme.heading} mb={2}>
            {title}
          </Heading>
          {description ? (
            <Text color={theme.muted} maxW="720px">
              {description}
            </Text>
          ) : null}
        </Box>
        {actions}
      </Flex>
      {children}
    </Stack>
  );
};

const RecentSection = () => {
  const { t } = useTranslation();
  const { recentIds, refreshLocal } = useCabinetPreferences({ autoSync: false });

  return (
    <CabinetSection
      title={t("cabinet.sections.recent")}
      description={t("cabinet.sections.recentDesc")}
      actions={
        recentIds.length > 0 ? (
          <Button
            variant="outline"
            colorScheme="orange"
            onClick={() => {
              clearRecentlyViewedIds();
              refreshLocal();
            }}
          >
            {t("cabinet.clearHistory")}
          </Button>
        ) : null
      }
    >
      <CabinetPropertyGrid
        ids={recentIds}
        emptyTitle={t("cabinet.recentEmpty.title")}
        emptyText={t("cabinet.recentEmpty.text")}
      />
    </CabinetSection>
  );
};

const CompareSection = () => {
  const { t } = useTranslation();
  const { compareIds, refreshLocal } = useCabinetPreferences({ autoSync: false });

  return (
    <CabinetSection
      title={t("cabinet.sections.compare")}
      description={t("cabinet.sections.compareDesc")}
      actions={
        <HStack>
          {compareIds.length > 0 ? (
            <Button
              as={RouterLink}
              to={`/offers/compare?ids=${compareIds.join(",")}`}
              colorScheme="green"
            >
              {t("cabinet.openCompare")}
            </Button>
          ) : null}
          {compareIds.length > 0 ? (
            <Button
              variant="outline"
              onClick={() => {
                clearCompareIds();
                refreshLocal();
              }}
            >
              {t("cabinet.clearCompare")}
            </Button>
          ) : null}
        </HStack>
      }
    >
      <CabinetPropertyGrid
        ids={compareIds}
        emptyTitle={t("cabinet.compareEmpty.title")}
        emptyText={t("cabinet.compareEmpty.text")}
      />
    </CabinetSection>
  );
};

const SearchesSection = () => {
  const { t } = useTranslation();
  const theme = useCabinetTheme();
  const { savedSearches, refreshLocal } = useCabinetPreferences({ autoSync: false });

  if (!savedSearches.length) {
    return (
      <CabinetSection
        title={t("cabinet.sections.searches")}
        description={t("cabinet.sections.searchesDesc")}
      >
        <Box {...theme.emptyStateStyle}>
          <Text color={theme.heading} fontWeight="700" mb={2}>
            {t("cabinet.searchesEmpty.title")}
          </Text>
          <Text color={theme.muted} mb={4}>
            {t("cabinet.searchesEmpty.text")}
          </Text>
          <Button as={RouterLink} to="/offers" colorScheme="green">
            {t("cabinet.empty.browse")}
          </Button>
        </Box>
      </CabinetSection>
    );
  }

  return (
    <CabinetSection
      title={t("cabinet.sections.searches")}
      description={t("cabinet.sections.searchesDesc")}
    >
      <Stack spacing={3}>
        {savedSearches.map((search) => (
          <Flex
            key={search.id}
            {...theme.listItemStyle}
            align="center"
            justify="space-between"
            gap={4}
            wrap="wrap"
          >
            <Box>
              <Text color={theme.heading} fontWeight="700">
                {search.label || search.name || t("cabinet.savedSearchFallback")}
              </Text>
              <Text color={theme.muted} fontSize="sm">
                {search.summary || search.query || t("cabinet.savedSearchNoSummary")}
              </Text>
            </Box>
            <HStack>
              <Button
                as={RouterLink}
                to={buildSavedSearchPath(search)}
                size="sm"
                colorScheme="green"
                variant="outline"
              >
                {t("cabinet.applySearch")}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => {
                  removeSavedSearch(search.id);
                  refreshLocal();
                }}
              >
                {t("common.delete")}
              </Button>
            </HStack>
          </Flex>
        ))}
      </Stack>
    </CabinetSection>
  );
};

const PersonalCabinet = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const theme = useCabinetTheme();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { favoriteIds, savedSearches, notifications } = useCabinetPreferences({ autoSync: false });
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

  const tabs = [
    { key: "", label: t("cabinet.tabs.overview"), icon: LuLayoutDashboard, path: "/cabinet" },
    { key: "saved", label: t("cabinet.tabs.saved"), icon: LuHeart, path: "/cabinet/saved" },
    { key: "recent", label: t("cabinet.tabs.recent"), icon: LuClock3, path: "/cabinet/recent" },
    {
      key: "compare",
      label: t("cabinet.tabs.compare"),
      icon: MdCompareArrows,
      path: "/cabinet/compare",
    },
    {
      key: "searches",
      label: t("cabinet.tabs.searches"),
      icon: LuSearch,
      path: "/cabinet/searches",
    },
    {
      key: "inquiries",
      label: t("cabinet.tabs.inquiries"),
      icon: LuMessageSquare,
      path: "/cabinet/inquiries",
    },
    { key: "profile", label: t("cabinet.tabs.profile"), icon: LuUser, path: "/cabinet/profile" },
  ];

  const isActive = (path) => {
    if (path === "/cabinet") {
      return location.pathname === "/cabinet" || location.pathname === "/cabinet/";
    }
    return location.pathname.startsWith(path);
  };

  const navButtonProps = (active) =>
    active
      ? {
          variant: "solid",
          colorScheme: "green",
          color: "white",
          bg: "green.700",
          _hover: { bg: "green.600" },
        }
      : {
          variant: "ghost",
          color: theme.navInactive,
          bg: "transparent",
          _hover: { bg: theme.navHoverBg },
        };

  return (
    <Box maxW="1400px" mx="auto" w="100%">
      <Stack
        direction={{ base: "column", lg: "row" }}
        align="flex-start"
        spacing={{ base: 5, lg: 8 }}
      >
        <Box
          w={{ base: "100%", lg: "260px" }}
          flexShrink={0}
          {...theme.sidebarStyle}
          position={{ lg: "sticky" }}
          top={{ lg: "110px" }}
        >
          <HStack justify="space-between" px={3} py={2}>
            <Text
              color={theme.navMenuLabel}
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="0.12em"
            >
              {t("cabinet.menu")}
            </Text>
            <CabinetNotificationsCenter
              inquiryCount={inquiryCount}
              favoriteCount={favoriteIds.length}
              savedSearchCount={savedSearches.length}
              priceAlertsEnabled={Boolean(notifications?.priceChanges)}
            />
          </HStack>
          <Stack spacing={1}>
            {tabs.map((tab) => (
              <Button
                key={tab.path}
                as={RouterLink}
                to={tab.path}
                leftIcon={<Icon as={tab.icon} />}
                size={isMobile ? "md" : "lg"}
                justifyContent="flex-start"
                borderRadius="16px"
                px={4}
                py={6}
                w="100%"
                {...navButtonProps(isActive(tab.path))}
              >
                {tab.label}
              </Button>
            ))}
          </Stack>
        </Box>

        <Box flex="1" minW={0}>
          <Routes>
            <Route index element={<ConsumerDashboard />} />
            <Route path="saved" element={<SavedFavoritesSection />} />
            <Route path="recent" element={<RecentSection />} />
            <Route path="compare" element={<CompareSection />} />
            <Route path="searches" element={<SearchesSection />} />
            <Route path="inquiries" element={<InquiriesSection />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="*" element={<Navigate to="/cabinet" replace />} />
          </Routes>
        </Box>
      </Stack>
    </Box>
  );
};

export default PersonalCabinet;
