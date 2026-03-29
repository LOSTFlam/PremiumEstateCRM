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
import {
  FiBookmark,
  FiFilter,
  FiLink,
  FiSearch,
  FiX,
} from "react-icons/fi";
import {
  MdArrowForward,
  MdCompareArrows,
  MdFavoriteBorder,
} from "react-icons/md";
import ModernFooter from "components/ModernFooter";
import ModernHeader from "components/ModernHeader";
import ModernPropertyCard from "components/ModernPropertyCard";
import GuidedFinder from "components/property/AIPropertyMatcher";
import { publicBrand } from "views/public/publicBrand";
import { getSeoCollectionCards } from "./seoCollections";
import { usePublicCatalog } from "./usePublicCatalog";

const shellCopy = {
  ru: {
    badge: "Signature collection",
    title: "Каталог домов, квартир, участков и коммерческой недвижимости",
    subtitle:
      "Плотная витрина с buyer tools, сохраненными поисками и карточками, в которых удобно сравнивать, возвращаться и принимать решение.",
    filterTitle: "Параметры подбора",
    filterText:
      "Соберите shortlist по типу, бюджету и наполненности карточек. Состояние фильтров синхронизируется с URL.",
    searchLabel: "Поиск",
    searchPlaceholder: "Адрес, тип, район, описание",
    typeLabel: "Тип объекта",
    statusLabel: "Статус",
    bedroomsLabel: "Спальни от",
    bathroomsLabel: "Санузлы от",
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
    savedShortlist: "в shortlist",
    compareLabel: "в сравнении",
    favoritesLabel: "в избранном",
    richLabel: "полных карточек",
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
    minBudget: "Бюджет от",
    maxBudget: "Бюджет до",
    applySaved: "Применить",
    removeSaved: "Удалить",
    openCollection: "Открыть подборку",
    summaryTitle: "Витрина для уверенного выбора",
    summaryText:
      "Каталог остается быстрым и прикладным, но теперь визуально соответствует премиальной подаче и buyer journey.",
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
    statusLabel: "Status",
    bedroomsLabel: "Bedrooms from",
    bathroomsLabel: "Bathrooms from",
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
    richLabel: "rich listings",
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

const buildActiveFilterChips = (filters, copy) => {
  const chips = [];
  if (filters.search) chips.push({ key: "search", label: filters.search });
  if (filters.type !== "all") chips.push({ key: "type", label: filters.type });
  if (filters.status !== "all") chips.push({ key: "status", label: filters.status });
  if (filters.minPrice) chips.push({ key: "minPrice", label: `${copy.minBudget}: ${filters.minPrice}` });
  if (filters.maxPrice) chips.push({ key: "maxPrice", label: `${copy.maxBudget}: ${filters.maxPrice}` });
  if (filters.bedrooms !== "all") chips.push({ key: "bedrooms", label: `${copy.bedroomsLabel} ${filters.bedrooms}+` });
  if (filters.bathrooms !== "all") chips.push({ key: "bathrooms", label: `${copy.bathroomsLabel} ${filters.bathrooms}+` });
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
      <Button variant="outline" color="white" borderColor="rgba(227, 211, 184, 0.22)" onClick={resetFilters}>
        {copy.reset}
      </Button>
      <Button
        bg={publicBrand.gradients.brass}
        color={publicBrand.colors.ink}
        fontWeight="700"
        onClick={saveCurrentSearch}
        _hover={{ transform: "translateY(-1px)", boxShadow: publicBrand.shadows.glow }}
      >
        {copy.saveSearch}
      </Button>
    </SimpleGrid>
  </Stack>
);

export default function PublicCatalogShell({
  mode = "landing",
  forcedType = null,
  collectionSlug = "",
  children,
}) {
  const { i18n } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const copy = shellCopy[i18n.language?.startsWith("ru") ? "ru" : "en"];
  const collections = useMemo(() => getSeoCollectionCards(i18n.language), [i18n.language]);
  const {
    loading,
    paginatedProperties,
    featuredProperties,
    recentProperties,
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
  } = usePublicCatalog({
    forcedType,
    collectionSlug,
    pageSize: mode === "landing" ? 6 : 9,
    language: i18n.language,
  });

  const title = collectionConfig?.title || copy.title;
  const subtitle = collectionConfig?.description || copy.subtitle;
  const badgeLabel = collectionConfig?.badge || copy.badge;
  const activeChips = useMemo(() => buildActiveFilterChips(filters, copy), [copy, filters]);

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
    <Box minH="100vh" bg={publicBrand.colors.paper} color={publicBrand.colors.ink}>
      <Box
        bg={publicBrand.gradients.hero}
        color="white"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          inset="0"
          bg="radial-gradient(circle at 18% 22%, rgba(245,208,118,0.16) 0%, rgba(245,208,118,0) 26%), radial-gradient(circle at 82% 18%, rgba(185,119,55,0.18) 0%, rgba(185,119,55,0) 34%)"
        />
        <ModernHeader />
        <Container maxW="8xl" pt={{ base: 28, md: 32 }} pb={{ base: 14, md: 18 }} position="relative">
          <Grid templateColumns={{ base: "1fr", xl: "1.02fr 0.98fr" }} gap={10} alignItems="end">
            <GridItem>
              <Stack spacing={6}>
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
                  fontSize={{ base: "4xl", md: "6xl" }}
                  lineHeight={{ base: "1.08", md: "0.98" }}
                  maxW="920px"
                >
                  {title}
                </Heading>
                <Text maxW="760px" fontSize={{ base: "md", md: "lg" }} color="whiteAlpha.800" lineHeight="1.9">
                  {subtitle}
                </Text>
                <HStack spacing={3} flexWrap="wrap">
                  <Button
                    bg={publicBrand.gradients.brass}
                    color={publicBrand.colors.ink}
                    size="lg"
                    onClick={handleSaveSearch}
                    leftIcon={<FiBookmark />}
                    borderRadius="full"
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
                  >
                    {copy.copyLink}
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/offers/compare"
                    variant="ghost"
                    color="white"
                    leftIcon={<MdCompareArrows />}
                  >
                    {compareIds.length} {copy.compareLabel}
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/favorites"
                    variant="ghost"
                    color="white"
                    leftIcon={<MdFavoriteBorder />}
                  >
                    {favoriteIds.length} {copy.favoritesLabel}
                  </Button>
                </HStack>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack spacing={5}>
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                  {[
                    { label: copy.resultsLabel, value: stats.totalLabel },
                    { label: copy.richLabel, value: String(stats.rich) },
                    { label: copy.savedShortlist, value: String(stats.activeShortlist) },
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
                      <StatLabel color="whiteAlpha.620" fontSize="xs" textTransform="uppercase" letterSpacing="0.14em">
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

      <Container maxW="8xl" py={{ base: 8, md: 12 }}>
        <Grid templateColumns={{ base: "1fr", lg: "350px minmax(0, 1fr)" }} gap={8} alignItems="start">
          <GridItem display={{ base: "none", lg: "block" }}>
            <CatalogFiltersPanel
              copy={copy}
              filters={filters}
              updateFilters={updateFilters}
              resetFilters={resetFilters}
              saveCurrentSearch={handleSaveSearch}
              activeFilterCount={activeFilterCount}
            />
          </GridItem>

          <GridItem>
            <Stack spacing={8}>
              <Box
                borderRadius="34px"
                px={{ base: 5, md: 6 }}
                py={{ base: 5, md: 6 }}
                bg="white"
                border="1px solid rgba(9,18,32,0.08)"
                boxShadow={publicBrand.shadows.soft}
              >
                <Flex
                  justify="space-between"
                  align={{ base: "stretch", md: "center" }}
                  direction={{ base: "column", md: "row" }}
                  gap={4}
                >
                  <Stack spacing={1.5}>
                    <Text fontSize="xs" color={publicBrand.colors.copper} letterSpacing="0.16em" textTransform="uppercase">
                      {copy.summaryTitle}
                    </Text>
                    <Heading size="lg" color={publicBrand.colors.ink}>
                      {copy.featuredTitle}
                    </Heading>
                    <Text color={publicBrand.colors.textSoft} lineHeight="1.8">
                      {copy.summaryText}
                    </Text>
                  </Stack>

                  <HStack spacing={3} flexWrap="wrap">
                    <IconButton
                      display={{ base: "inline-flex", lg: "none" }}
                      aria-label={copy.filters}
                      icon={<FiFilter />}
                      onClick={onOpen}
                      borderRadius="full"
                    />
                    <Select
                      maxW="260px"
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

                            if (chip.key === "search" || chip.key === "minPrice" || chip.key === "maxPrice") {
                              updateFilters({ [chip.key]: "" });
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

              {savedSearches.length ? (
                <Box
                  borderRadius="34px"
                  px={{ base: 5, md: 6 }}
                  py={{ base: 5, md: 6 }}
                  bg="white"
                  border="1px solid rgba(9,18,32,0.08)"
                  boxShadow={publicBrand.shadows.soft}
                >
                  <Heading size="md" mb={4} color={publicBrand.colors.ink}>
                    {copy.savedTitle}
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
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
                        <Text fontSize="sm" color={publicBrand.colors.textSoft} mt={1} noOfLines={1}>
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
                          <Button size="sm" borderRadius="full" variant="ghost" onClick={() => removeSavedSearch(search.id)}>
                            {copy.removeSaved}
                          </Button>
                        </HStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              ) : null}

              {loading ? (
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={`skeleton-${index}`} h="520px" borderRadius="34px" />
                  ))}
                </SimpleGrid>
              ) : paginatedProperties.length ? (
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
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
                <Box
                  borderRadius="34px"
                  px={{ base: 6, md: 8 }}
                  py={{ base: 8, md: 10 }}
                  bg="white"
                  border="1px solid rgba(9,18,32,0.08)"
                  boxShadow={publicBrand.shadows.soft}
                >
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

              {mode === "landing" && recentProperties.length ? (
                <Box>
                  <Heading size="lg" mb={5} color={publicBrand.colors.ink}>
                    {copy.recentTitle}
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                    {recentProperties.slice(0, 3).map((property) => (
                      <ModernPropertyCard
                        key={`recent-${property?._id}`}
                        property={property}
                        isFavorite={favoriteIds.includes(property?._id)}
                        isInCompare={compareIds.includes(property?._id)}
                        onFavoriteToggle={toggleFavorite}
                        onCompareToggle={toggleCompare}
                      />
                    ))}
                  </SimpleGrid>
                </Box>
              ) : null}

              {mode === "landing" ? (
                <Box>
                  <Heading size="lg" mb={5} color={publicBrand.colors.ink}>
                    {copy.collectionTitle}
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
                    {collections.slice(0, 6).map((collection) => (
                      <Box
                        key={collection.slug}
                        as={RouterLink}
                        to={`/collections/${collection.slug}`}
                        borderRadius="32px"
                        p={5}
                        bg={publicBrand.gradients.panel}
                        color="white"
                        border="1px solid rgba(227, 211, 184, 0.14)"
                        boxShadow={publicBrand.shadows.deep}
                      >
                        <Badge bg="rgba(245,208,118,0.14)" color="#f5d076" mb={4}>
                          {collection.badge}
                        </Badge>
                        <Heading size="md">{collection.title}</Heading>
                        <Text mt={3} color="whiteAlpha.800" noOfLines={3}>
                          {collection.description}
                        </Text>
                        <HStack mt={5} color="#f5d076">
                          <Icon as={MdArrowForward} />
                          <Text fontWeight="700">{copy.openCollection}</Text>
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
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
