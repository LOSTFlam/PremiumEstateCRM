import {
  Badge,
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { FiBookmark, FiFilter, FiHome, FiLink, FiShield, FiTrendingUp, FiX } from "react-icons/fi";
import { MdArrowForward, MdCompareArrows, MdFavoriteBorder } from "react-icons/md";
import { LuBuilding2, LuTrees } from "react-icons/lu";
import ModernFooter from "components/ModernFooter";
import ModernHeader from "components/ModernHeader";
import ModernPropertyCard from "components/ModernPropertyCard";
import GuidedFinder from "components/property/AIPropertyMatcher";
import {
  COLLECTION_STOREFRONT_SLUGS,
  PRIMARY_STOREFRONT_SLUGS,
  getStorefrontPresetMeta,
} from "utils/storefrontPresets";
import { publicBrand } from "views/public/publicBrand";
import { countCatalogProperties, extractPresetFilters } from "./catalogFilters";
import { getSeoCollectionConfig } from "./seoCollections";
import { PROPERTY_CARD_GRID_SPACING, PROPERTY_CARD_MIN_WIDTH } from "./propertyCardLayout";
import { usePublicCatalog } from "./usePublicCatalog";

const shellCopy = {
  ru: {
    badge: "Кураторская витрина",
    title: "Каталог домов, квартир, участков и коммерческой недвижимости",
    subtitle:
      "Плотная витрина с инструментами выбора, сохраненными поисками и карточками, в которых удобно сравнивать, возвращаться и принимать решение.",
    filterTitle: "Параметры подбора",
    filterText:
      "Соберите подборку по типу, бюджету и наполненности карточек. Состояние фильтров синхронизируется с адресной строкой.",
    searchLabel: "Поиск",
    searchPlaceholder: "Адрес, тип, район, описание",
    typeLabel: "Тип объекта",
    dealLabel: "Тип сделки",
    dealAll: "Продажа и аренда",
    dealSale: "Продажа",
    dealRent: "Аренда",
    statusLabel: "Статус",
    bedroomsLabel: "Спальни от",
    bathroomsLabel: "Санузлы от",
    verificationLabel: "Проверка",
    collectionLabel: "Подборка",
    withPhotos: "Только с фото",
    richListings: "Только полные карточки",
    reset: "Сбросить",
    saveSearch: "Сохранить поиск",
    copyLink: "Скопировать ссылку",
    allResults: "Все",
    featuredTitle: "Актуальные предложения",
    recentTitle: "Недавно просмотренные",
    savedTitle: "Сохраненные поиски",
    collectionTitle: "Редакционные подборки",
    noResults: "По текущим фильтрам ничего не найдено",
    noResultsText: "Снимите часть ограничений или вернитесь ко всей коллекции.",
    browseAll: "Открыть все предложения",
    filters: "Фильтры",
    sortLatest: "Сначала новые",
    sortHigh: "Цена по убыванию",
    sortLow: "Цена по возрастанию",
    sortRich: "Лучшее наполнение",
    resultsLabel: "объектов",
    savedShortlist: "в подборке",
    compareLabel: "в сравнении",
    favoritesLabel: "в избранном",
    richLabel: "объектов с полной карточкой",
    typeAll: "Все объекты",
    typeHouse: "Дома",
    typeApartment: "Квартиры",
    typeLand: "Участки",
    typeCommercial: "Коммерция",
    statusAll: "Все статусы",
    statusAvailable: "Доступно",
    statusNew: "Новое",
    statusActive: "Активно",
    statusPending: "В резерве",
    verificationAll: "Любая проверка",
    verificationVerified: "Проверено",
    verificationReview: "На проверке",
    verificationPending: "Ожидает проверки",
    collectionAll: "Все подборки",
    minBudget: "Бюджет от",
    maxBudget: "Бюджет до",
    applySaved: "Применить",
    removeSaved: "Удалить",
    openCollection: "Открыть подборку",
    summaryTitle: "Витрина для уверенного выбора",
    summaryText:
      "Каталог остается быстрым и прикладным, но теперь визуально соответствует премиальной подаче и спокойному сценарию выбора.",
  },
  en: {
    badge: "Signature collection",
    title: "A premium catalog of houses, apartments, land, and commercial property",
    subtitle:
      "A denser storefront built for shortlist building, comparison, saved searches, and faster movement toward the right offer.",
    filterTitle: "Search parameters",
    filterText:
      "Build a calmer shortlist by type, budget, and listing quality. Filter state stays synced with the URL.",
    searchLabel: "Search",
    searchPlaceholder: "Address, type, district, description",
    typeLabel: "Property type",
    dealLabel: "Deal type",
    dealAll: "Sale and rent",
    dealSale: "For sale",
    dealRent: "For rent",
    statusLabel: "Status",
    bedroomsLabel: "Bedrooms from",
    bathroomsLabel: "Bathrooms from",
    verificationLabel: "Verification",
    collectionLabel: "Collection",
    withPhotos: "Only with photos",
    richListings: "Only rich listings",
    reset: "Reset",
    saveSearch: "Save search",
    copyLink: "Copy link",
    allResults: "All",
    featuredTitle: "Current offers",
    recentTitle: "Recently viewed",
    savedTitle: "Saved searches",
    collectionTitle: "Editorial collections",
    noResults: "No properties match the current filters",
    noResultsText: "Remove a few restrictions or reopen the full collection.",
    browseAll: "Open all offers",
    filters: "Filters",
    sortLatest: "Latest first",
    sortHigh: "Price high to low",
    sortLow: "Price low to high",
    sortRich: "Best listing quality",
    resultsLabel: "properties",
    savedShortlist: "in shortlist",
    compareLabel: "in compare",
    favoritesLabel: "in favorites",
    richLabel: "full-detail listings",
    typeAll: "All properties",
    typeHouse: "Houses",
    typeApartment: "Apartments",
    typeLand: "Land plots",
    typeCommercial: "Commercial",
    statusAll: "All statuses",
    statusAvailable: "Available",
    statusNew: "New",
    statusActive: "Active",
    statusPending: "Pending",
    verificationAll: "Any verification",
    verificationVerified: "Verified",
    verificationReview: "Under review",
    verificationPending: "Pending verification",
    collectionAll: "All collections",
    minBudget: "Budget from",
    maxBudget: "Budget to",
    applySaved: "Apply",
    removeSaved: "Remove",
    openCollection: "Open collection",
    summaryTitle: "A storefront built for confident selection",
    summaryText:
      "The catalog stays fast and practical, but now looks aligned with a premium brand and a calmer buyer journey.",
  },
};

const optionStyles = {
  bg: "white",
  borderColor: "rgba(9,18,32,0.08)",
  borderRadius: "18px",
  h: "54px",
};

const PAGE_MAX_W = "1920px";
const SURFACE_PANEL_PROPS = {
  borderRadius: { base: "24px", md: "30px", xl: "34px" },
  px: { base: 4, md: 7, xl: 8 },
  py: { base: 5, md: 7, xl: 8 },
  bg: "white",
  border: "1px solid rgba(9,18,32,0.08)",
  boxShadow: publicBrand.shadows.soft,
};

const buildActiveFilterChips = (filters, copy, collectionLabelMap = new Map()) => {
  const chips = [];
  if (filters.search) chips.push({ key: "search", label: filters.search });
  if (filters.type !== "all") chips.push({ key: "type", label: filters.type });
  if (filters.dealType && filters.dealType !== "all")
    chips.push({
      key: "dealType",
      label: filters.dealType === "rent" ? copy.dealRent : copy.dealSale,
    });
  if (filters.status !== "all") chips.push({ key: "status", label: filters.status });
  if (filters.minPrice)
    chips.push({
      key: "minPrice",
      label: `${copy.minBudget}: ${filters.minPrice}`,
    });
  if (filters.maxPrice)
    chips.push({
      key: "maxPrice",
      label: `${copy.maxBudget}: ${filters.maxPrice}`,
    });
  if (filters.bedrooms !== "all")
    chips.push({
      key: "bedrooms",
      label: `${copy.bedroomsLabel} ${filters.bedrooms}+`,
    });
  if (filters.bathrooms !== "all")
    chips.push({
      key: "bathrooms",
      label: `${copy.bathroomsLabel} ${filters.bathrooms}+`,
    });
  if (filters.verificationStatus !== "all") {
    const verificationLabels = {
      verified: copy.verificationVerified,
      review: copy.verificationReview,
      pending: copy.verificationPending,
    };

    chips.push({
      key: "verificationStatus",
      label: `${copy.verificationLabel}: ${
        verificationLabels[filters.verificationStatus] || filters.verificationStatus
      }`,
    });
  }
  if (filters.featuredCollection) {
    chips.push({
      key: "featuredCollection",
      label: `${copy.collectionLabel}: ${
        collectionLabelMap.get(filters.featuredCollection) || filters.featuredCollection
      }`,
    });
  }
  if (filters.onlyWithPhotos) chips.push({ key: "onlyWithPhotos", label: copy.withPhotos });
  if (filters.onlyRich) chips.push({ key: "onlyRich", label: copy.richListings });
  return chips;
};

const CatalogFiltersPanel = ({
  copy,
  filters,
  updateFilters,
  resetFilters,
  saveCurrentSearch,
  activeFilterCount,
  collectionOptions,
}) => (
  <Stack
    spacing={5}
    p={{ base: 5, md: 6 }}
    borderRadius="34px"
    className="public-brand-panel"
    position={{ base: "static", lg: "sticky" }}
    top="110px"
  >
    <Stack spacing={2}>
      <HStack justify="space-between" align="start">
        <Box>
          <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.14em" color="#f5d076">
            {copy.filters}
          </Text>
          <Heading size="md" mt={1}>
            {copy.filterTitle}
          </Heading>
        </Box>
        {activeFilterCount ? (
          <Badge borderRadius="full" px={3} py={1.5} bg="rgba(245,208,118,0.14)" color="#f5d076">
            {activeFilterCount}
          </Badge>
        ) : null}
      </HStack>
      <Text color="whiteAlpha.740" fontSize="sm" lineHeight="1.8">
        {copy.filterText}
      </Text>
    </Stack>

    <FormControl>
      <FormLabel color="whiteAlpha.860">{copy.searchLabel}</FormLabel>
      <Input
        value={filters.search}
        onChange={(event) => updateFilters({ search: event.target.value })}
        placeholder={copy.searchPlaceholder}
        bg="rgba(255,255,255,0.08)"
        color="white"
        borderColor="rgba(227, 211, 184, 0.14)"
        borderRadius="18px"
        h="54px"
        _placeholder={{ color: "whiteAlpha.500" }}
      />
    </FormControl>

    <SimpleGrid columns={{ base: 1, md: 2, lg: 1 }} spacing={4}>
      <FormControl>
        <FormLabel color="whiteAlpha.860">{copy.typeLabel}</FormLabel>
        <Select
          value={filters.type}
          onChange={(event) => updateFilters({ type: event.target.value })}
          {...optionStyles}
        >
          <option value="all">{copy.typeAll}</option>
          <option value="house">{copy.typeHouse}</option>
          <option value="apartment">{copy.typeApartment}</option>
          <option value="land">{copy.typeLand}</option>
          <option value="commercial">{copy.typeCommercial}</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel color="whiteAlpha.860">{copy.dealLabel}</FormLabel>
        <Select
          value={filters.dealType}
          onChange={(event) => updateFilters({ dealType: event.target.value })}
          {...optionStyles}
        >
          <option value="all">{copy.dealAll}</option>
          <option value="sale">{copy.dealSale}</option>
          <option value="rent">{copy.dealRent}</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel color="whiteAlpha.860">{copy.statusLabel}</FormLabel>
        <Select
          value={filters.status}
          onChange={(event) => updateFilters({ status: event.target.value })}
          {...optionStyles}
        >
          <option value="all">{copy.statusAll}</option>
          <option value="available">{copy.statusAvailable}</option>
          <option value="new">{copy.statusNew}</option>
          <option value="active">{copy.statusActive}</option>
          <option value="pending">{copy.statusPending}</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel color="whiteAlpha.860">{copy.minBudget}</FormLabel>
        <Input
          value={filters.minPrice}
          onChange={(event) => updateFilters({ minPrice: event.target.value })}
          placeholder="0"
          {...optionStyles}
        />
      </FormControl>
      <FormControl>
        <FormLabel color="whiteAlpha.860">{copy.maxBudget}</FormLabel>
        <Input
          value={filters.maxPrice}
          onChange={(event) => updateFilters({ maxPrice: event.target.value })}
          placeholder="1000000"
          {...optionStyles}
        />
      </FormControl>
      <FormControl>
        <FormLabel color="whiteAlpha.860">{copy.bedroomsLabel}</FormLabel>
        <Select
          value={filters.bedrooms}
          onChange={(event) => updateFilters({ bedrooms: event.target.value })}
          {...optionStyles}
        >
          <option value="all">{copy.allResults}</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel color="whiteAlpha.860">{copy.bathroomsLabel}</FormLabel>
        <Select
          value={filters.bathrooms}
          onChange={(event) => updateFilters({ bathrooms: event.target.value })}
          {...optionStyles}
        >
          <option value="all">{copy.allResults}</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel color="whiteAlpha.860">{copy.verificationLabel}</FormLabel>
        <Select
          value={filters.verificationStatus}
          onChange={(event) => updateFilters({ verificationStatus: event.target.value })}
          {...optionStyles}
        >
          <option value="all">{copy.verificationAll}</option>
          <option value="verified">{copy.verificationVerified}</option>
          <option value="review">{copy.verificationReview}</option>
          <option value="pending">{copy.verificationPending}</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel color="whiteAlpha.860">{copy.collectionLabel}</FormLabel>
        <Select
          value={filters.featuredCollection}
          onChange={(event) => updateFilters({ featuredCollection: event.target.value })}
          {...optionStyles}
        >
          <option value="">{copy.collectionAll}</option>
          {collectionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>
    </SimpleGrid>

    <Stack spacing={3}>
      <Flex justify="space-between" align="center">
        <Text color="whiteAlpha.820">{copy.withPhotos}</Text>
        <Switch
          colorScheme="orange"
          isChecked={filters.onlyWithPhotos}
          onChange={(event) => updateFilters({ onlyWithPhotos: event.target.checked })}
        />
      </Flex>
      <Flex justify="space-between" align="center">
        <Text color="whiteAlpha.820">{copy.richListings}</Text>
        <Switch
          colorScheme="orange"
          isChecked={filters.onlyRich}
          onChange={(event) => updateFilters({ onlyRich: event.target.checked })}
        />
      </Flex>
    </Stack>

    <SimpleGrid columns={2} spacing={3}>
      <Button
        variant="outline"
        color="white"
        borderColor="rgba(227, 211, 184, 0.22)"
        onClick={resetFilters}
      >
        {copy.reset}
      </Button>
      <Button
        bg={publicBrand.gradients.brass}
        color={publicBrand.colors.ink}
        fontWeight="700"
        onClick={saveCurrentSearch}
        _hover={{
          transform: "translateY(-1px)",
          boxShadow: publicBrand.shadows.glow,
        }}
      >
        {copy.saveSearch}
      </Button>
    </SimpleGrid>
  </Stack>
);

export default function PublicCatalogShell({ forcedType = null, collectionSlug = "", children }) {
  const { i18n } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const copy = shellCopy[i18n.language?.startsWith("ru") ? "ru" : "en"];
  const {
    properties,
    loading,
    paginatedProperties,
    featuredProperties,
    savedSearches,
    favoriteIds,
    compareIds,
    filters,
    currentPage,
    totalPages,
    updateFilters,
    resetFilters,
    toggleFavorite,
    toggleCompare,
    saveCurrentSearch,
    applySavedSearch,
    removeSavedSearch,
    stats,
    activeFilterCount,
    collectionConfig,
    activePresetSlug,
    storefrontPresets,
  } = usePublicCatalog({
    forcedType,
    collectionSlug,
    pageSize: 9,
    language: i18n.language,
  });

  const activePresetMeta = useMemo(
    () => getStorefrontPresetMeta(activePresetSlug, i18n.language),
    [activePresetSlug, i18n.language]
  );
  const presetMap = useMemo(
    () => new Map((storefrontPresets || []).map((preset) => [preset.slug, preset])),
    [storefrontPresets]
  );
  const title = collectionConfig?.title || activePresetMeta?.title || copy.title;
  const subtitle = collectionConfig?.description || activePresetMeta?.description || copy.subtitle;
  const badgeLabel = collectionConfig?.badge || activePresetMeta?.badge || copy.badge;
  const collectionOptions = useMemo(
    () =>
      COLLECTION_STOREFRONT_SLUGS.map((slug) => {
        const meta = getStorefrontPresetMeta(slug, i18n.language);
        return {
          value: slug,
          label: meta?.adminLabel || slug,
        };
      }),
    [i18n.language]
  );
  const collectionLabelMap = useMemo(
    () => new Map(collectionOptions.map((option) => [option.value, option.label])),
    [collectionOptions]
  );
  const activeChips = useMemo(
    () => buildActiveFilterChips(filters, copy, collectionLabelMap),
    [collectionLabelMap, copy, filters]
  );
  const experienceCopy = useMemo(
    () =>
      i18n.language?.startsWith("ru")
        ? {
            segmentsTitle: "Сегменты каталога",
            segmentsText: "Сильные входы в основные типы спроса без возврата на главную.",
            routesTitle: "Высокоинтентные маршруты",
            routesText:
              "Собрали ключевые сценарии прямо в каталоге: семейные дома, городские квартиры, проверенные карточки, участки под инвестиции и премиальную коммерцию.",
            routeOpen: "Открыть маршрут",
          }
        : {
            segmentsTitle: "Catalog segments",
            segmentsText:
              "Direct entry points into the main demand types without going back to the homepage.",
            routesTitle: "High-intent routes",
            routesText:
              "The main demand scenarios are available directly in the catalog: family homes, city apartments, verified listings, investment land, and premium commercial property.",
            routeOpen: "Open route",
          },
    [i18n.language]
  );
  const segmentLinks = useMemo(
    () =>
      PRIMARY_STOREFRONT_SLUGS.map((slug) => {
        const preset = presetMap.get(slug);
        const meta = getStorefrontPresetMeta(slug, i18n.language);

        if (!preset?.isActive || !meta) return null;

        return {
          key: slug,
          label: meta.adminLabel,
          href: meta.route,
          count: countCatalogProperties(properties, extractPresetFilters(preset)),
        };
      }).filter(Boolean),
    [i18n.language, presetMap, properties]
  );
  const quickRouteCards = useMemo(() => {
    const iconMap = {
      "family-homes": FiHome,
      "city-apartments": LuBuilding2,
      verified: FiShield,
      "investment-plots": LuTrees,
      "premium-commercial": FiTrendingUp,
    };

    return COLLECTION_STOREFRONT_SLUGS.map((slug) => {
      const preset = presetMap.get(slug);
      const config = getSeoCollectionConfig(slug, i18n.language);
      const meta = getStorefrontPresetMeta(slug, i18n.language);

      if (!preset?.isActive || !config || !meta) return null;

      return {
        key: slug,
        title: config.title,
        text: config.description,
        href: meta.route,
        count: countCatalogProperties(properties, extractPresetFilters(preset)),
        icon: iconMap[slug] || FiTrendingUp,
        badge: config.badge,
      };
    }).filter(Boolean);
  }, [i18n.language, presetMap, properties]);

  const handleSaveSearch = () => {
    saveCurrentSearch();
    toast({
      title: copy.saveSearch,
      description: i18n.language?.startsWith("ru")
        ? "Текущий набор фильтров сохранен."
        : "Current filter state has been saved.",
      status: "success",
      duration: 2000,
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: copy.copyLink, status: "success", duration: 2000 });
    } catch (error) {
      toast({
        title: copy.copyLink,
        description: i18n.language?.startsWith("ru")
          ? "Не удалось скопировать ссылку."
          : "Unable to copy link.",
        status: "error",
      });
    }
  };

  return (
    <Box
      className="public-brand-shell"
      minH="100vh"
      bg={publicBrand.colors.paper}
      color={publicBrand.colors.ink}
      overflowX="hidden"
      maxW="100vw"
    >
      <Box bg={publicBrand.gradients.hero} color="white" position="relative" overflow="hidden">
        <Box
          position="absolute"
          inset="0"
          bg="radial-gradient(circle at 18% 22%, rgba(245,208,118,0.16) 0%, rgba(245,208,118,0) 26%), radial-gradient(circle at 82% 18%, rgba(185,119,55,0.18) 0%, rgba(185,119,55,0) 34%)"
        />
        <ModernHeader />
        <Container
          maxW={PAGE_MAX_W}
          pt={{ base: 28, md: 32 }}
          pb={{ base: 16, md: 20 }}
          position="relative"
          px={{ base: 4, md: 6, xl: 8 }}
        >
          <Grid
            templateColumns={{
              base: "1fr",
              xl: "minmax(0, 1.12fr) minmax(360px, 0.88fr)",
              "2xl": "minmax(0, 1.18fr) minmax(420px, 0.82fr)",
            }}
            gap={{ base: 8, xl: 12, "2xl": 14 }}
            alignItems="start"
          >
            <GridItem>
              <Stack spacing={{ base: 6, xl: 7 }}>
                <Badge
                  w="fit-content"
                  px={4}
                  py={1.5}
                  borderRadius="full"
                  bg="rgba(245,208,118,0.14)"
                  color="#f5d076"
                  border="1px solid rgba(245,208,118,0.24)"
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                >
                  {badgeLabel}
                </Badge>
                <Heading
                  as="h1"
                  className="catalog-hero-title"
                  fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
                  lineHeight={{ base: "1.12", md: "0.98" }}
                  maxW="920px"
                >
                  {title}
                </Heading>
                <Text
                  maxW="760px"
                  fontSize={{ base: "md", md: "lg" }}
                  color="whiteAlpha.800"
                  lineHeight="1.9"
                >
                  {subtitle}
                </Text>
                <Flex wrap="wrap" gap={3} className="catalog-toolbar-actions">
                  <Button
                    bg={publicBrand.gradients.brass}
                    color={publicBrand.colors.ink}
                    size={{ base: "md", md: "lg" }}
                    onClick={handleSaveSearch}
                    leftIcon={<FiBookmark />}
                    borderRadius="full"
                    whiteSpace="normal"
                    h="auto"
                    minH="44px"
                    py={2}
                  >
                    {copy.saveSearch}
                  </Button>
                  <Button
                    variant="outline"
                    color="white"
                    borderColor="rgba(227, 211, 184, 0.24)"
                    onClick={handleCopyLink}
                    leftIcon={<FiLink />}
                    borderRadius="full"
                    size={{ base: "md", md: "lg" }}
                    whiteSpace="normal"
                    h="auto"
                    minH="44px"
                    py={2}
                  >
                    {copy.copyLink}
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/offers/compare"
                    variant="ghost"
                    color="white"
                    leftIcon={<MdCompareArrows />}
                    size={{ base: "md", md: "lg" }}
                    whiteSpace="normal"
                    h="auto"
                    minH="44px"
                    py={2}
                  >
                    {compareIds.length} {copy.compareLabel}
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/favorites"
                    variant="ghost"
                    color="white"
                    leftIcon={<MdFavoriteBorder />}
                    size={{ base: "md", md: "lg" }}
                    whiteSpace="normal"
                    h="auto"
                    minH="44px"
                    py={2}
                  >
                    {favoriteIds.length} {copy.favoritesLabel}
                  </Button>
                </Flex>

                <Box>
                  <Text
                    color="#f5d076"
                    fontSize="xs"
                    letterSpacing="0.16em"
                    textTransform="uppercase"
                  >
                    {experienceCopy.segmentsTitle}
                  </Text>
                  <Text mt={2} color="whiteAlpha.760" maxW="720px" lineHeight="1.8">
                    {experienceCopy.segmentsText}
                  </Text>
                  <SimpleGrid columns={{ base: 1, sm: 2, xl: 3, "2xl": 5 }} spacing={3.5} mt={4}>
                    {segmentLinks.map((segment) => (
                      <Box
                        key={segment.key}
                        as={RouterLink}
                        to={segment.href}
                        borderRadius="24px"
                        px={5}
                        py={4.5}
                        bg="rgba(255,255,255,0.05)"
                        border="1px solid rgba(227, 211, 184, 0.12)"
                        transition="transform 0.25s ease, border-color 0.25s ease"
                        _hover={{
                          transform: "translateY(-3px)",
                          borderColor: "rgba(245,208,118,0.22)",
                        }}
                      >
                        <Text color="white" fontWeight="700" fontSize="sm">
                          {segment.label}
                        </Text>
                        <Text
                          mt={1.5}
                          color="whiteAlpha.620"
                          fontSize="xs"
                          textTransform="uppercase"
                          letterSpacing="0.14em"
                        >
                          {segment.count}
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack spacing={5}>
                <SimpleGrid
                  className="catalog-stat-grid"
                  columns={{ base: 1, sm: 2, xl: 1 }}
                  spacing={4}
                >
                  {[
                    { label: copy.resultsLabel, value: stats.totalLabel },
                    { label: copy.richLabel, value: String(stats.rich) },
                    {
                      label: copy.savedShortlist,
                      value: String(stats.activeShortlist),
                    },
                  ].map((item) => (
                    <Stat
                      key={item.label}
                      bg="rgba(255,255,255,0.06)"
                      border="1px solid rgba(227, 211, 184, 0.14)"
                      borderRadius="28px"
                      px={5}
                      py={5}
                      backdropFilter="blur(12px)"
                    >
                      <StatLabel
                        color="whiteAlpha.620"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="0.14em"
                      >
                        {item.label}
                      </StatLabel>
                      <StatNumber mt={2} fontSize={{ base: "2xl", md: "3xl" }}>
                        {item.value}
                      </StatNumber>
                    </Stat>
                  ))}
                </SimpleGrid>

                <GuidedFinder
                  properties={featuredProperties}
                  variant="dark"
                  onMatchFound={(match) =>
                    updateFilters({
                      type: match?.propertyTypeKey || "all",
                      search: match?.name || match?.propertyAddress || "",
                    })
                  }
                />
              </Stack>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      <Container maxW={PAGE_MAX_W} py={{ base: 8, md: 12, xl: 14 }} px={{ base: 4, md: 6, xl: 8 }}>
        <Grid
          templateColumns={{
            base: "1fr",
            xl: "390px minmax(0, 1fr)",
            "2xl": "430px minmax(0, 1fr)",
          }}
          gap={{ base: 8, xl: 10 }}
          alignItems="start"
        >
          <GridItem display={{ base: "none", xl: "block" }}>
            <CatalogFiltersPanel
              copy={copy}
              filters={filters}
              updateFilters={updateFilters}
              resetFilters={resetFilters}
              saveCurrentSearch={handleSaveSearch}
              activeFilterCount={activeFilterCount}
              collectionOptions={collectionOptions}
            />
          </GridItem>

          <GridItem>
            <Stack spacing={{ base: 8, xl: 9 }}>
              <Box {...SURFACE_PANEL_PROPS}>
                <Flex
                  justify="space-between"
                  align={{ base: "stretch", md: "center" }}
                  direction={{ base: "column", md: "row" }}
                  gap={4}
                >
                  <Stack spacing={1.5}>
                    <Text
                      fontSize="xs"
                      color={publicBrand.colors.copper}
                      letterSpacing="0.16em"
                      textTransform="uppercase"
                    >
                      {copy.summaryTitle}
                    </Text>
                    <Heading size="lg" color={publicBrand.colors.ink}>
                      {copy.featuredTitle}
                    </Heading>
                    <Text color={publicBrand.colors.textSoft} lineHeight="1.8">
                      {copy.summaryText}
                    </Text>
                  </Stack>

                  <HStack
                    className="catalog-toolbar"
                    spacing={3}
                    flexWrap="wrap"
                    w={{ base: "full", md: "auto" }}
                  >
                    <IconButton
                      display={{ base: "inline-flex", xl: "none" }}
                      aria-label={copy.filters}
                      icon={<FiFilter />}
                      onClick={onOpen}
                      borderRadius="full"
                      minW="44px"
                      minH="44px"
                    />
                    <Select
                      maxW={{ base: "100%", md: "260px" }}
                      flex={{ base: 1, md: "none" }}
                      bg="white"
                      borderColor="rgba(9,18,32,0.08)"
                      borderRadius="18px"
                      value={filters.sortBy}
                      onChange={(event) => updateFilters({ sortBy: event.target.value })}
                    >
                      <option value="latest">{copy.sortLatest}</option>
                      <option value="priceHigh">{copy.sortHigh}</option>
                      <option value="priceLow">{copy.sortLow}</option>
                      <option value="bestFilled">{copy.sortRich}</option>
                    </Select>
                  </HStack>
                </Flex>

                {activeChips.length ? (
                  <HStack mt={5} spacing={3} flexWrap="wrap">
                    {activeChips.map((chip) => (
                      <HStack
                        key={chip.key}
                        spacing={2}
                        px={3.5}
                        py={2}
                        borderRadius="full"
                        bg="rgba(212,175,55,0.10)"
                        border="1px solid rgba(212,175,55,0.16)"
                      >
                        <Text fontSize="sm" color={publicBrand.colors.ink}>
                          {chip.label}
                        </Text>
                        <IconButton
                          aria-label={`remove-${chip.key}`}
                          icon={<FiX />}
                          size="xs"
                          variant="ghost"
                          onClick={() => {
                            if (chip.key === "onlyWithPhotos" || chip.key === "onlyRich") {
                              updateFilters({ [chip.key]: false });
                              return;
                            }

                            if (
                              chip.key === "search" ||
                              chip.key === "minPrice" ||
                              chip.key === "maxPrice"
                            ) {
                              updateFilters({ [chip.key]: "" });
                              return;
                            }

                            if (chip.key === "featuredCollection") {
                              updateFilters({ featuredCollection: "" });
                              return;
                            }

                            updateFilters({ [chip.key]: "all" });
                          }}
                        />
                      </HStack>
                    ))}
                  </HStack>
                ) : null}
              </Box>

              <Box {...SURFACE_PANEL_PROPS}>
                <Stack spacing={6}>
                  <Box maxW="920px">
                    <Text
                      fontSize="xs"
                      color={publicBrand.colors.copper}
                      letterSpacing="0.16em"
                      textTransform="uppercase"
                    >
                      {experienceCopy.routesTitle}
                    </Text>
                    <Heading mt={2} size="lg" color={publicBrand.colors.ink}>
                      {experienceCopy.routesTitle}
                    </Heading>
                    <Text mt={3} color={publicBrand.colors.textSoft} lineHeight="1.8">
                      {experienceCopy.routesText}
                    </Text>
                  </Box>

                  <SimpleGrid columns={{ base: 1, md: 2, xl: 3, "2xl": 5 }} spacing={4}>
                    {quickRouteCards.map((route) => (
                      <Box
                        key={route.key}
                        as={RouterLink}
                        to={route.href}
                        position="relative"
                        overflow="hidden"
                        borderRadius="28px"
                        px={5}
                        py={5}
                        minH={{ base: "auto", xl: "100%" }}
                        bg="linear-gradient(180deg, rgba(244,238,229,0.92) 0%, rgba(244,238,229,0.72) 100%)"
                        border="1px solid rgba(9,18,32,0.08)"
                        transition="transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease"
                        _before={{
                          content: '""',
                          position: "absolute",
                          inset: 0,
                          bg: "radial-gradient(circle at top right, rgba(212,175,55,0.14), transparent 36%)",
                        }}
                        _hover={{
                          transform: "translateY(-4px)",
                          boxShadow: "0 18px 46px rgba(6,10,16,0.12)",
                          borderColor: "rgba(185,119,55,0.16)",
                        }}
                      >
                        <Stack position="relative" zIndex={1} spacing={4} h="100%">
                          <HStack justify="space-between" align="start">
                            <Box
                              w="46px"
                              h="46px"
                              borderRadius="18px"
                              display="grid"
                              placeItems="center"
                              bg="rgba(212,175,55,0.10)"
                              color={publicBrand.colors.copper}
                            >
                              <Icon as={route.icon} boxSize={5} />
                            </Box>
                            <Box
                              minW="42px"
                              px={3}
                              py={1.5}
                              borderRadius="full"
                              bg="white"
                              color={publicBrand.colors.ink}
                              fontSize="sm"
                              fontWeight="700"
                              textAlign="center"
                            >
                              {route.count}
                            </Box>
                          </HStack>
                          <Heading size="sm" color={publicBrand.colors.ink} lineHeight="1.35">
                            {route.title}
                          </Heading>
                          <Text
                            color={publicBrand.colors.textSoft}
                            lineHeight="1.8"
                            fontSize="sm"
                            flex={1}
                          >
                            {route.text}
                          </Text>
                          <HStack mt="auto" spacing={2} color={publicBrand.colors.copper}>
                            <Text fontWeight="700" fontSize="sm">
                              {experienceCopy.routeOpen}
                            </Text>
                            <MdArrowForward />
                          </HStack>
                        </Stack>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Stack>
              </Box>

              {savedSearches.length ? (
                <Box {...SURFACE_PANEL_PROPS}>
                  <Heading size="md" mb={4} color={publicBrand.colors.ink}>
                    {copy.savedTitle}
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, "2xl": 3 }} spacing={4}>
                    {savedSearches.slice(0, 6).map((search) => (
                      <Box
                        key={search.id}
                        borderRadius="24px"
                        px={4}
                        py={4}
                        bg="rgba(244,238,229,0.82)"
                        border="1px solid rgba(9,18,32,0.08)"
                      >
                        <Text fontWeight="700" color={publicBrand.colors.ink}>
                          {search.label}
                        </Text>
                        <Text
                          fontSize="sm"
                          color={publicBrand.colors.textSoft}
                          mt={1}
                          noOfLines={1}
                        >
                          {search.pathname}
                        </Text>
                        <HStack mt={4} spacing={2}>
                          <Button
                            size="sm"
                            borderRadius="full"
                            bg={publicBrand.colors.ink}
                            color="white"
                            onClick={() => applySavedSearch(search)}
                          >
                            {copy.applySaved}
                          </Button>
                          <Button
                            size="sm"
                            borderRadius="full"
                            variant="ghost"
                            onClick={() => removeSavedSearch(search.id)}
                          >
                            {copy.removeSaved}
                          </Button>
                        </HStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              ) : null}

              {loading ? (
                <SimpleGrid
                  className="property-card-grid"
                  minChildWidth={PROPERTY_CARD_MIN_WIDTH}
                  spacing={PROPERTY_CARD_GRID_SPACING}
                >
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={`skeleton-${index}`} h="520px" borderRadius="34px" />
                  ))}
                </SimpleGrid>
              ) : paginatedProperties.length ? (
                <SimpleGrid
                  className="property-card-grid"
                  minChildWidth={PROPERTY_CARD_MIN_WIDTH}
                  spacing={PROPERTY_CARD_GRID_SPACING}
                >
                  {paginatedProperties.map((property) => (
                    <ModernPropertyCard
                      key={property?._id}
                      property={property}
                      isFavorite={favoriteIds.includes(property?._id)}
                      isInCompare={compareIds.includes(property?._id)}
                      onFavoriteToggle={toggleFavorite}
                      onCompareToggle={toggleCompare}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <Box {...SURFACE_PANEL_PROPS}>
                  <Stack spacing={4} align="start">
                    <Heading size="md" color={publicBrand.colors.ink}>
                      {copy.noResults}
                    </Heading>
                    <Text color={publicBrand.colors.textSoft} maxW="560px">
                      {copy.noResultsText}
                    </Text>
                    <Button
                      onClick={resetFilters}
                      borderRadius="full"
                      bg={publicBrand.gradients.brass}
                      color={publicBrand.colors.ink}
                    >
                      {copy.browseAll}
                    </Button>
                  </Stack>
                </Box>
              )}

              {totalPages > 1 ? (
                <HStack spacing={2} justify="center" flexWrap="wrap">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <Button
                      key={`page-${page}`}
                      size="sm"
                      borderRadius="full"
                      bg={currentPage === page ? publicBrand.colors.ink : "white"}
                      color={currentPage === page ? "white" : publicBrand.colors.ink}
                      border="1px solid rgba(9,18,32,0.08)"
                      onClick={() => updateFilters({ page })}
                    >
                      {page}
                    </Button>
                  ))}
                </HStack>
              ) : null}

              {quickRouteCards.length ? (
                <Box>
                  <Heading size="lg" mb={5} color={publicBrand.colors.ink}>
                    {copy.collectionTitle}
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, "2xl": 3 }} spacing={4}>
                    {quickRouteCards.map((collection) => (
                      <Box
                        key={collection.key}
                        as={RouterLink}
                        to={collection.href}
                        borderRadius="32px"
                        p={5}
                        bg={publicBrand.gradients.panel}
                        color="white"
                        border="1px solid rgba(227, 211, 184, 0.14)"
                        boxShadow={publicBrand.shadows.deep}
                        transition="transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease"
                        _hover={{
                          transform: "translateY(-4px)",
                          borderColor: "rgba(245,208,118,0.22)",
                          boxShadow: "0 26px 70px rgba(4, 8, 14, 0.24)",
                        }}
                      >
                        <Badge bg="rgba(245,208,118,0.14)" color="#f5d076" mb={4}>
                          {collection.badge}
                        </Badge>
                        <Heading size="md">{collection.title}</Heading>
                        <Text mt={3} color="whiteAlpha.800" noOfLines={3}>
                          {collection.text}
                        </Text>
                        <HStack mt={5} color="#f5d076" spacing={2}>
                          <Box
                            as="span"
                            display="grid"
                            placeItems="center"
                            w={{ base: "34px", sm: "auto" }}
                            h={{ base: "34px", sm: "auto" }}
                            borderRadius={{ base: "full", sm: "none" }}
                            bg={{ base: "rgba(245,208,118,0.14)", sm: "transparent" }}
                            border={{ base: "1px solid rgba(245,208,118,0.24)", sm: "none" }}
                            aria-label={copy.openCollection}
                          >
                            <Icon as={MdArrowForward} />
                          </Box>
                          <Text fontWeight="700" display={{ base: "none", sm: "block" }}>
                            {copy.openCollection}
                          </Text>
                        </HStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              ) : null}

              {children}
            </Stack>
          </GridItem>
        </Grid>
      </Container>

      <ModernFooter />

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent bg={publicBrand.colors.ink} color="white">
          <DrawerCloseButton />
          <DrawerHeader>{copy.filters}</DrawerHeader>
          <DrawerBody>
            <CatalogFiltersPanel
              copy={copy}
              filters={filters}
              updateFilters={updateFilters}
              resetFilters={resetFilters}
              saveCurrentSearch={handleSaveSearch}
              activeFilterCount={activeFilterCount}
              collectionOptions={collectionOptions}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
