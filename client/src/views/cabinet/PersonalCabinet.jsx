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
import ConsumerDashboard from "./ConsumerDashboard";
import CabinetPropertyGrid from "./CabinetPropertyGrid";
import ProfileSettings from "./ProfileSettings";
import SavedFavoritesSection from "./SavedFavoritesSection";
import InquiriesSection from "./InquiriesSection";
import { buildSavedSearchPath } from "./cabinetExport";
import { useCabinetPreferences } from "hooks/useCabinetPreferences";
import {
  clearCompareIds,
  clearRecentlyViewedIds,
  removeSavedSearch,
} from "views/public/catalog/catalogStorage";

const navButtonStyle = (active) => ({
  justifyContent: "flex-start",
  variant: active ? "solid" : "ghost",
  colorScheme: active ? "green" : "whiteAlpha",
  color: active ? "white" : "whiteAlpha.800",
  bg: active ? "green.700" : "transparent",
  _hover: { bg: active ? "green.600" : "whiteAlpha.100" },
  borderRadius: "16px",
  px: 4,
  py: 6,
  w: "100%",
});

const CabinetSection = ({ title, description, children, actions }) => (
  <Stack spacing={5}>
    <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} gap={4} wrap="wrap">
      <Box>
        <Heading size="md" color="white" mb={2}>
          {title}
        </Heading>
        {description ? (
          <Text color="whiteAlpha.700" maxW="720px">
            {description}
          </Text>
        ) : null}
      </Box>
      {actions}
    </Flex>
    {children}
  </Stack>
);

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
  const { savedSearches, refreshLocal } = useCabinetPreferences({ autoSync: false });

  if (!savedSearches.length) {
    return (
      <CabinetSection title={t("cabinet.sections.searches")} description={t("cabinet.sections.searchesDesc")}>
        <Box
          borderRadius="24px"
          border="1px dashed"
          borderColor="whiteAlpha.300"
          p={8}
          textAlign="center"
        >
          <Text color="white" fontWeight="700" mb={2}>
            {t("cabinet.searchesEmpty.title")}
          </Text>
          <Text color="whiteAlpha.700" mb={4}>
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
    <CabinetSection title={t("cabinet.sections.searches")} description={t("cabinet.sections.searchesDesc")}>
      <Stack spacing={3}>
        {savedSearches.map((search) => (
          <Flex
            key={search.id}
            borderRadius="20px"
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.200"
            p={4}
            align="center"
            justify="space-between"
            gap={4}
            wrap="wrap"
          >
            <Box>
              <Text color="white" fontWeight="700">
                {search.label || search.name || t("cabinet.savedSearchFallback")}
              </Text>
              <Text color="whiteAlpha.700" fontSize="sm">
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
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const tabs = [
    { key: "", label: t("cabinet.tabs.overview"), icon: LuLayoutDashboard, path: "/cabinet" },
    { key: "saved", label: t("cabinet.tabs.saved"), icon: LuHeart, path: "/cabinet/saved" },
    { key: "recent", label: t("cabinet.tabs.recent"), icon: LuClock3, path: "/cabinet/recent" },
    { key: "compare", label: t("cabinet.tabs.compare"), icon: MdCompareArrows, path: "/cabinet/compare" },
    { key: "searches", label: t("cabinet.tabs.searches"), icon: LuSearch, path: "/cabinet/searches" },
    { key: "inquiries", label: t("cabinet.tabs.inquiries"), icon: LuMessageSquare, path: "/cabinet/inquiries" },
    { key: "profile", label: t("cabinet.tabs.profile"), icon: LuUser, path: "/cabinet/profile" },
  ];

  const isActive = (path) => {
    if (path === "/cabinet") {
      return location.pathname === "/cabinet" || location.pathname === "/cabinet/";
    }
    return location.pathname.startsWith(path);
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
          borderRadius="24px"
          bg="rgba(255,255,255,0.04)"
          border="1px solid"
          borderColor="whiteAlpha.200"
          p={3}
          position={{ lg: "sticky" }}
          top={{ lg: "110px" }}
        >
          <Text
            color="whiteAlpha.600"
            fontSize="xs"
            textTransform="uppercase"
            letterSpacing="0.12em"
            px={3}
            py={2}
          >
            {t("cabinet.menu")}
          </Text>
          <Stack spacing={1}>
            {tabs.map((tab) => (
              <Button
                key={tab.path}
                as={RouterLink}
                to={tab.path}
                leftIcon={<Icon as={tab.icon} />}
                size={isMobile ? "md" : "lg"}
                {...navButtonStyle(isActive(tab.path))}
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
