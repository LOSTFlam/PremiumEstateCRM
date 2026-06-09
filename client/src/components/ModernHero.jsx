import { useMemo } from "react";
import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Text,
  usePrefersReducedMotion,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiClock, FiHome, FiSearch, FiShield, FiTrendingUp } from "react-icons/fi";
import { LuBuilding2, LuMapPin, LuSparkles, LuTrees } from "react-icons/lu";
import {
  formatPrice,
  getPhotoCount,
  getPrimaryImage,
  isRichListing,
  normalizePropertyTypeKey,
  normalizeStatus,
  parsePrice,
} from "views/public/catalog/catalogData";
import { publicBrand } from "views/public/publicBrand";
import { useScrollReveal } from "hooks/useScrollReveal";

const heroCopy = {
  ru: {
    eyebrow: "Агентский маркетплейс",
    kicker: "Структурированный поиск, сильная карточка и прямой путь к показу",
    title: "Подберите объект как на сильном портале,",
    accent: "но с личным сопровождением агентства",
    description:
      "Главная теперь работает как настоящая входная точка в рынок: понятные сегменты, быстрый поиск, живые подборки и спокойный маршрут от первого клика до звонка брокеру.",
    searchHint: "Адрес, тип объекта, район, сценарий жизни",
    primary: "Открыть каталог",
    secondary: "Показать подборку ниже",
    trustLine: ["Проверенные карточки", "Сравнение и подборка", "Прямая заявка на просмотр"],
    panelTitle: "С чего начать поиск",
    panelText: "Выберите сегмент, введите запрос и уйдите в каталог уже с нужным контекстом.",
    routesTitle: "Частые маршруты",
    routesText:
      "Быстрые входы в самые востребованные сценарии без длинного фильтрационного экрана.",
    routesCta: "Открыть маршрут",
    statsCatalog: "В каталоге",
    statsRich: "Полных карточек",
    statsAverage: "Средний бюджет",
    pulseTitle: "Срез витрины",
    pulseSubtitle: "Что происходит в каталоге прямо сейчас",
    pulseAvailable: "Доступно сейчас",
    pulseNew: "Новых объявлений",
    pulseTypes: "Активных сегментов",
    heroCardLabel: "Объект недели",
    marketLabel: "Рынок в одном экране",
    marketText:
      "Домашняя страница больше не просто красива. Она сразу ведёт в нужный раздел, подборку или конкретный объект, включая премиальную коммерцию.",
    locationFallback: "Локация уточняется",
    familyTitle: "Семейные дома",
    familyText: "Дома и виллы с 3+ спальнями и коротким путём к личному показу.",
    apartmentTitle: "Городские квартиры",
    apartmentText: "Квартиры и резиденции для жизни, аренды или спокойной инвестиции.",
    verifiedTitle: "Проверенные карточки",
    verifiedText: "Объявления с фото, документами и более сильным уровнем доверия.",
    investmentTitle: "Участки и девелопмент",
    investmentText: "Земля и инвестиционные сценарии с отдельной подборкой.",
  },
  en: {
    eyebrow: "Agency marketplace",
    kicker: "Structured discovery, stronger listing pages, and a direct route to viewing",
    title: "Search property like a serious portal,",
    accent: "with the guidance of a private agency",
    description:
      "The homepage now works as a real market entry point: clearer segments, faster search, live collections, and a calmer route from first click to broker contact.",
    searchHint: "Address, property type, district, lifestyle",
    primary: "Open catalog",
    secondary: "Preview below",
    trustLine: ["Verified listings", "Compare and shortlist", "Direct viewing request"],
    panelTitle: "Start the search with structure",
    panelText:
      "Choose a segment, enter a query, and move into the catalog with the right context already applied.",
    routesTitle: "High-intent routes",
    routesText:
      "Fast entry points into the most common buying scenarios without a long filter screen.",
    routesCta: "Open route",
    statsCatalog: "In catalog",
    statsRich: "Rich listings",
    statsAverage: "Average ticket",
    pulseTitle: "Market pulse",
    pulseSubtitle: "A quick read of the current storefront",
    pulseAvailable: "Available now",
    pulseNew: "New listings",
    pulseTypes: "Active segments",
    heroCardLabel: "Property of the week",
    marketLabel: "The market in one screen",
    marketText:
      "The homepage is no longer only attractive. It routes buyers directly into the right category, collection, or listing, including premium commercial inventory.",
    locationFallback: "Location on request",
    familyTitle: "Family homes",
    familyText: "Houses and villas with 3+ bedrooms and a shorter path to private viewing.",
    apartmentTitle: "City apartments",
    apartmentText:
      "Apartments and residences for living, rental income, or calmer urban investing.",
    verifiedTitle: "Verified listings",
    verifiedText: "Offers with photos, documents, and stronger trust signals.",
    investmentTitle: "Land and development",
    investmentText: "Land deals and investment scenarios collected in one route.",
  },
};

const categoryConfig = [
  {
    key: "house",
    titleKey: "publicListing.categoryHouses",
    descriptionKey: "publicListing.categoryHousesText",
    route: "/offers/houses",
    icon: FiHome,
  },
  {
    key: "apartment",
    titleKey: "publicListing.categoryApartments",
    descriptionKey: "publicListing.categoryApartmentsText",
    route: "/offers/apartments",
    icon: LuBuilding2,
  },
  {
    key: "land",
    titleKey: "publicListing.categoryPlots",
    descriptionKey: "publicListing.categoryPlotsText",
    route: "/offers/plots",
    icon: LuTrees,
  },
  {
    key: "commercial",
    titleKey: "publicListing.categoryCommercial",
    descriptionKey: "publicListing.categoryCommercialText",
    route: "/offers/commercial",
    icon: LuMapPin,
  },
];

const metricValue = (value, fallback = "—") => {
  if (value === null || value === undefined || value === "") return fallback;
  if (Number(value) === 0) return fallback;
  return String(value);
};

const buildCatalogHref = (query) => {
  const params = new URLSearchParams();
  const normalizedQuery = String(query || "").trim();
  if (normalizedQuery) {
    params.set("search", normalizedQuery);
  }
  return params.toString() ? `/offers?${params.toString()}` : "/offers";
};

export default function ModernHero({
  properties,
  onSearch,
  searchQuery,
  setSearchQuery,
  segmentCards = [],
  marketRouteCards = [],
}) {
  const { t, i18n } = useTranslation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const copy = heroCopy[locale];

  const [titleRef, titleRevealed] = useScrollReveal({ threshold: 1, delay: 0 });
  const [panelRef, panelRevealed] = useScrollReveal({ threshold: 1, delay: 0 });
  const [statsRef, statsRevealed] = useScrollReveal({ threshold: 1, delay: 0 });
  const [routesRef, _routesRevealed] = useScrollReveal({ threshold: 1, delay: 0 });
  const [heroCardRef, heroCardRevealed] = useScrollReveal({ threshold: 1, delay: 0 });
  const [pulseRef, pulseRevealed] = useScrollReveal({ threshold: 1, delay: 0 });

  const heroProperty = useMemo(() => {
    const withImages = (properties || []).filter((property) => getPhotoCount(property) > 0);
    return withImages[0] || properties?.[0] || null;
  }, [properties]);

  const typeCounts = useMemo(
    () =>
      (properties || []).reduce((acc, property) => {
        const key = normalizePropertyTypeKey(property?.propertyType);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
    [properties]
  );

  const richCount = useMemo(
    () => (properties || []).filter((property) => isRichListing(property)).length,
    [properties]
  );

  const availableCount = useMemo(
    () =>
      (properties || []).filter((property) =>
        ["available", "active", "new"].includes(String(property?.listingStatus || "").toLowerCase())
      ).length,
    [properties]
  );

  const newCount = useMemo(
    () =>
      (properties || []).filter((property) =>
        String(property?.listingStatus || "")
          .toLowerCase()
          .includes("new")
      ).length,
    [properties]
  );

  const averagePrice = useMemo(() => {
    const priced = (properties || [])
      .map((property) => parsePrice(property?.listingPrice))
      .filter(Boolean);
    if (!priced.length) return 0;
    const total = priced.reduce((sum, value) => sum + value, 0);
    return Math.round(total / priced.length);
  }, [properties]);

  const catalogHref = useMemo(() => buildCatalogHref(searchQuery), [searchQuery]);
  const segmentEntries = useMemo(() => {
    if (Array.isArray(segmentCards) && segmentCards.length) {
      return segmentCards;
    }

    return categoryConfig.map((category) => ({
      key: category.key,
      title: t(category.titleKey),
      text: t(category.descriptionKey),
      href: category.route,
      count: typeCounts[category.key] || 0,
      icon: category.icon,
    }));
  }, [segmentCards, t, typeCounts]);

  const highlightStats = [
    { label: copy.statsCatalog, value: String(properties?.length || 0), icon: FiTrendingUp },
    { label: copy.statsRich, value: String(richCount || 0), icon: FiShield },
    { label: copy.statsAverage, value: formatPrice(averagePrice, t), icon: LuSparkles },
  ];

  const routeCards = useMemo(
    () =>
      Array.isArray(marketRouteCards) && marketRouteCards.length
        ? marketRouteCards
        : [
            {
              key: "family",
              title: copy.familyTitle,
              text: copy.familyText,
              href: "/collections/family-homes",
              count: typeCounts.house || 0,
              icon: FiHome,
            },
            {
              key: "apartments",
              title: copy.apartmentTitle,
              text: copy.apartmentText,
              href: "/collections/city-apartments",
              count: typeCounts.apartment || 0,
              icon: LuBuilding2,
            },
            {
              key: "verified",
              title: copy.verifiedTitle,
              text: copy.verifiedText,
              href: "/collections/verified",
              count: richCount || 0,
              icon: FiShield,
            },
            {
              key: "investment",
              title: copy.investmentTitle,
              text: copy.investmentText,
              href: "/collections/investment-plots",
              count: typeCounts.land || 0,
              icon: LuTrees,
            },
          ],
    [copy, marketRouteCards, richCount, typeCounts.apartment, typeCounts.house, typeCounts.land]
  );

  return (
    <Box
      position="relative"
      overflow="hidden"
      pt={{ base: 24, md: 30, xl: 36 }}
      pb={{ base: 14, md: 18, xl: 22 }}
      bg={publicBrand.gradients.hero}
    >
      <Box
        position="absolute"
        inset="0"
        opacity={0.82}
        bg="radial-gradient(circle at 12% 18%, rgba(247,231,206,0.16) 0%, rgba(247,231,206,0) 28%), radial-gradient(circle at 82% 14%, rgba(185,119,55,0.24) 0%, rgba(185,119,55,0) 34%)"
      />
      <Box
        position="absolute"
        right={{ base: "-12%", xl: "-2%" }}
        top={{ base: "9%", xl: "6%" }}
        w={{ base: "300px", xl: "660px" }}
        h={{ base: "300px", xl: "660px" }}
        borderRadius="full"
        opacity={prefersReducedMotion ? 0.14 : 0.3}
        filter="blur(110px)"
        bg="radial-gradient(circle, rgba(212,175,55,0.24) 0%, rgba(212,175,55,0) 72%)"
      />

      <Box position="relative" zIndex={1} maxW="1560px" mx="auto" px={{ base: 4, md: 8, xl: 10 }}>
        <Grid
          templateColumns={{ base: "1fr", xl: "1fr" }}
          gap={{ base: 8, xl: 10 }}
          alignItems="start"
          width="100%"
        >
          <GridItem>
            <Stack spacing={8}>
              <Stack
                spacing={5}
                maxW="820px"
                ref={titleRef}
                style={{
                  transition:
                    "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: titleRevealed ? 1 : 0,
                  transform: titleRevealed ? "translateY(0)" : "translateY(40px)",
                }}
              >
                <HStack spacing={3} flexWrap="wrap">
                  <Badge
                    px={4}
                    py={1.5}
                    borderRadius="full"
                    bg="rgba(245,208,118,0.14)"
                    border="1px solid rgba(245,208,118,0.26)"
                    color="#f5d076"
                    letterSpacing="0.14em"
                    textTransform="uppercase"
                  >
                    {copy.eyebrow}
                  </Badge>
                  <Text
                    color="whiteAlpha.760"
                    fontSize="sm"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                  >
                    {copy.kicker}
                  </Text>
                </HStack>

                <Heading
                  as="h1"
                  fontSize={{ base: "3xl", md: "5xl", xl: "6xl", "2xl": "7xl" }}
                  lineHeight={{ base: "1.04", md: "0.94" }}
                  letterSpacing="-0.05em"
                  maxW="940px"
                >
                  {copy.title}
                  <Text as="span" display="block" className="text-gradient-animated" mt={2}>
                    {copy.accent}
                  </Text>
                </Heading>

                <Text
                  color="whiteAlpha.800"
                  fontSize={{ base: "lg", md: "xl" }}
                  maxW="760px"
                  lineHeight="1.9"
                >
                  {copy.description}
                </Text>
              </Stack>

              <Box
                ref={panelRef}
                className="public-brand-panel"
                borderRadius={{ base: "28px", md: "34px" }}
                px={{ base: 5, md: 6 }}
                py={{ base: 5, md: 6 }}
                backdropFilter="blur(12px)"
                border="1px solid rgba(227, 211, 184, 0.16)"
                boxShadow="0 28px 80px rgba(4, 8, 14, 0.36)"
                style={{
                  transition:
                    "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: panelRevealed ? 1 : 0,
                  transform: panelRevealed ? "translateY(0)" : "translateY(40px)",
                }}
              >
                <Stack spacing={5}>
                  <Stack spacing={1.5}>
                    <Text
                      color="#f5d076"
                      fontSize="xs"
                      letterSpacing="0.16em"
                      textTransform="uppercase"
                    >
                      {copy.panelTitle}
                    </Text>
                    <Text color="whiteAlpha.760" maxW="640px">
                      {copy.panelText}
                    </Text>
                  </Stack>

                  <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={5}>
                    {segmentEntries.map((category) => (
                      <Box
                        key={category.key}
                        as={RouterLink}
                        to={category.href}
                        borderRadius="32px"
                        px={6}
                        py={6}
                        bg="rgba(255,255,255,0.05)"
                        border="1px solid rgba(227, 211, 184, 0.12)"
                        transition="transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease"
                        _hover={{
                          transform: "translateY(-6px)",
                          borderColor: "rgba(245,208,118,0.30)",
                          boxShadow: "0 24px 56px rgba(0, 0, 0, 0.22)",
                        }}
                      >
                        <HStack justify="space-between" align="start">
                          <Box
                            w="56px"
                            h="56px"
                            borderRadius="22px"
                            display="grid"
                            placeItems="center"
                            bg="rgba(245,208,118,0.12)"
                            color="#f5d076"
                          >
                            <Icon as={category.icon} boxSize={6} />
                          </Box>
                          <Text color="whiteAlpha.620" fontSize="sm">
                            {category.count || 0}
                          </Text>
                        </HStack>
                        <Stack mt={5} spacing={2}>
                          <Text color="white" fontWeight="700" fontSize="lg">
                            {category.title}
                          </Text>
                          <Text color="whiteAlpha.680" fontSize="md" noOfLines={2} lineHeight="1.7">
                            {category.text}
                          </Text>
                        </Stack>
                      </Box>
                    ))}
                  </SimpleGrid>

                  <Grid templateColumns={{ base: "1fr", lg: "minmax(0,1fr) auto auto" }} gap={3}>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none">
                        <FiSearch color="#d7c4a3" />
                      </InputLeftElement>
                      <Input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder={copy.searchHint}
                        color="white"
                        borderColor="rgba(227, 211, 184, 0.14)"
                        bg="rgba(255,255,255,0.05)"
                        borderRadius="20px"
                        h="60px"
                        _placeholder={{ color: "whiteAlpha.500" }}
                        _hover={{ borderColor: "rgba(245,208,118,0.28)" }}
                        _focus={{
                          borderColor: "rgba(245,208,118,0.42)",
                          boxShadow: "0 0 0 1px rgba(245,208,118,0.18)",
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            onSearch?.();
                          }
                        }}
                      />
                    </InputGroup>

                    <Button
                      as={RouterLink}
                      to={catalogHref}
                      leftIcon={<FiSearch />}
                      borderRadius="full"
                      h="60px"
                      px={8}
                      bg={publicBrand.gradients.brass}
                      color={publicBrand.colors.ink}
                      fontWeight="700"
                      _hover={{
                        transform: "translateY(-1px)",
                        boxShadow: publicBrand.shadows.glow,
                      }}
                    >
                      {copy.primary}
                    </Button>

                    <Button
                      onClick={onSearch}
                      rightIcon={<FiArrowRight />}
                      borderRadius="full"
                      h="60px"
                      px={8}
                      bg="rgba(255,255,255,0.05)"
                      color="white"
                      border="1px solid rgba(227, 211, 184, 0.14)"
                      _hover={{ bg: "rgba(255,255,255,0.08)" }}
                    >
                      {copy.secondary}
                    </Button>
                  </Grid>

                  <HStack spacing={{ base: 3, md: 5 }} flexWrap="wrap">
                    {copy.trustLine.map((item) => (
                      <HStack key={item} spacing={2} color="whiteAlpha.820">
                        <Icon as={FiShield} color="#f5d076" />
                        <Text fontSize="sm">{item}</Text>
                      </HStack>
                    ))}
                  </HStack>
                </Stack>
              </Box>

              <SimpleGrid
                ref={statsRef}
                columns={{ base: 1, md: 3 }}
                spacing={4}
                style={{
                  transition:
                    "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: statsRevealed ? 1 : 0,
                  transform: statsRevealed ? "translateY(0)" : "translateY(36px)",
                }}
              >
                {highlightStats.map((stat) => (
                  <Box
                    key={stat.label}
                    borderRadius="28px"
                    px={5}
                    py={5}
                    bg="rgba(255,255,255,0.04)"
                    border="1px solid rgba(227, 211, 184, 0.10)"
                    backdropFilter="blur(10px)"
                  >
                    <HStack justify="space-between" align="start">
                      <Box
                        w="44px"
                        h="44px"
                        borderRadius="18px"
                        display="grid"
                        placeItems="center"
                        bg="rgba(245,208,118,0.10)"
                        color="#f5d076"
                      >
                        <Icon as={stat.icon} />
                      </Box>
                      <Text
                        color="whiteAlpha.560"
                        fontSize="xs"
                        letterSpacing="0.14em"
                        textTransform="uppercase"
                      >
                        {stat.label}
                      </Text>
                    </HStack>
                    <Text
                      mt={5}
                      color="white"
                      fontSize={{ base: "2xl", md: "3xl" }}
                      fontWeight="700"
                      lineHeight="1.1"
                    >
                      {stat.value}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>

              <Box
                ref={routesRef}
                borderRadius="32px"
                px={{ base: 5, md: 6 }}
                py={{ base: 5, md: 6 }}
                bg="rgba(255,255,255,0.04)"
                border="1px solid rgba(227, 211, 184, 0.10)"
              >
                <Stack spacing={6}>
                  <Box>
                    <Text
                      color="#f5d076"
                      fontSize="xs"
                      letterSpacing="0.16em"
                      textTransform="uppercase"
                    >
                      {copy.routesTitle}
                    </Text>
                    <Heading mt={2} fontSize={{ base: "2xl", md: "3xl" }} lineHeight="1.1">
                      {copy.marketLabel}
                    </Heading>
                    <Text mt={4} color="whiteAlpha.760" lineHeight="1.8">
                      {copy.marketText}
                    </Text>
                  </Box>

                  <Box
                    display="grid"
                    gridTemplateColumns={{
                      base: "1fr",
                      md: "repeat(2, 1fr)",
                      lg: "repeat(3, 1fr)",
                      xl: "repeat(4, 1fr)",
                      "2xl": "repeat(5, 1fr)",
                    }}
                    gap={5}
                    width="100%"
                  >
                    {routeCards.map((route) => (
                      <Box
                        key={route.key}
                        as={RouterLink}
                        to={route.href}
                        borderRadius="28px"
                        px={5}
                        py={5}
                        bg="rgba(255,255,255,0.05)"
                        border="1px solid rgba(227, 211, 184, 0.12)"
                        transition="transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease"
                        _hover={{
                          transform: "translateY(-6px)",
                          borderColor: "rgba(245,208,118,0.30)",
                          boxShadow: "0 24px 56px rgba(0,0,0,0.22)",
                        }}
                      >
                        <HStack justify="space-between" align="start">
                          <Box
                            w="48px"
                            h="48px"
                            borderRadius="20px"
                            display="grid"
                            placeItems="center"
                            bg="rgba(245,208,118,0.12)"
                            color="#f5d076"
                          >
                            <Icon as={route.icon} boxSize={5} />
                          </Box>
                          <Text color="whiteAlpha.620" fontSize="sm">
                            {route.count}
                          </Text>
                        </HStack>
                        <Heading mt={4} size="md" color="white">
                          {route.title}
                        </Heading>
                        <Text mt={2} color="whiteAlpha.720" fontSize="md" lineHeight="1.7">
                          {route.text}
                        </Text>
                        <HStack mt={5} spacing={2} color="#f5d076">
                          <Text fontSize="sm" fontWeight="700">
                            {copy.routesCta}
                          </Text>
                          <FiArrowRight />
                        </HStack>
                      </Box>
                    ))}
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </GridItem>

          <GridItem>
            <Stack spacing={5}>
              <Box
                ref={heroCardRef}
                position="relative"
                borderRadius={{ base: "34px", md: "40px" }}
                overflow="hidden"
                boxShadow={publicBrand.shadows.deep}
                minH={{ base: "460px", md: "620px" }}
                style={{
                  transition:
                    "opacity 900ms cubic-bezier(0.4, 0, 0.2, 1), transform 900ms cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: heroCardRevealed ? 1 : 0,
                  transform: heroCardRevealed ? "translateY(0)" : "translateY(44px)",
                }}
              >
                <Image
                  src={getPrimaryImage(heroProperty)}
                  alt={heroProperty?.name || heroProperty?.propertyAddress || publicBrand.name}
                  w="100%"
                  h={{ base: "460px", md: "620px" }}
                  objectFit="cover"
                />
                <Box
                  position="absolute"
                  inset="0"
                  bg="linear-gradient(180deg, rgba(7,12,20,0.02) 0%, rgba(7,12,20,0.24) 28%, rgba(7,12,20,0.90) 100%)"
                />

                <Stack position="absolute" inset="0" justify="space-between" p={{ base: 5, md: 6 }}>
                  <HStack justify="space-between" align="start">
                    <Badge
                      px={3.5}
                      py={1.5}
                      borderRadius="full"
                      bg="rgba(255,255,255,0.14)"
                      color="white"
                      border="1px solid rgba(255,255,255,0.18)"
                    >
                      {copy.heroCardLabel}
                    </Badge>
                    <Box
                      px={4}
                      py={2.5}
                      borderRadius="22px"
                      bg="rgba(7,12,20,0.46)"
                      border="1px solid rgba(227, 211, 184, 0.14)"
                      backdropFilter="blur(14px)"
                    >
                      <Text
                        color="#f5d076"
                        fontSize="xs"
                        letterSpacing="0.14em"
                        textTransform="uppercase"
                      >
                        {normalizeStatus(heroProperty?.listingStatus, t)}
                      </Text>
                    </Box>
                  </HStack>

                  <Stack spacing={5}>
                    <Box
                      w="fit-content"
                      px={5}
                      py={3}
                      borderRadius="24px"
                      bg="rgba(7,12,20,0.50)"
                      border="1px solid rgba(227, 211, 184, 0.14)"
                      backdropFilter="blur(12px)"
                    >
                      <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" lineHeight="1">
                        {formatPrice(heroProperty?.listingPrice, t)}
                      </Text>
                    </Box>

                    <Stack spacing={3} maxW="560px">
                      <Heading
                        fontSize={{ base: "2xl", md: "4xl" }}
                        lineHeight="1.04"
                        letterSpacing="-0.04em"
                        color="white"
                      >
                        {heroProperty?.name || heroProperty?.propertyAddress}
                      </Heading>
                      <HStack spacing={2} color="whiteAlpha.760">
                        <Icon as={LuMapPin} />
                        <Text noOfLines={1}>
                          {heroProperty?.propertyAddress || copy.locationFallback}
                        </Text>
                      </HStack>
                      <Text color="whiteAlpha.780" noOfLines={3} maxW="560px" lineHeight="1.8">
                        {heroProperty?.marketingDescription ||
                          heroProperty?.propertyDescription ||
                          copy.marketText}
                      </Text>
                    </Stack>

                    <SimpleGrid columns={3} spacing={3}>
                      {[
                        {
                          label: t("publicListing.bedrooms"),
                          value: metricValue(heroProperty?.numberofBedrooms),
                        },
                        {
                          label: t("publicListing.bathrooms"),
                          value: metricValue(heroProperty?.numberofBathrooms),
                        },
                        {
                          label: t("publicListing.area"),
                          value: metricValue(heroProperty?.squareFootage),
                        },
                      ].map((item) => (
                        <Box
                          key={item.label}
                          px={4}
                          py={4}
                          borderRadius="22px"
                          bg="rgba(7,12,20,0.46)"
                          border="1px solid rgba(227, 211, 184, 0.14)"
                          backdropFilter="blur(12px)"
                        >
                          <Text
                            color="whiteAlpha.600"
                            fontSize="xs"
                            textTransform="uppercase"
                            letterSpacing="0.12em"
                          >
                            {item.label}
                          </Text>
                          <Text color="white" fontWeight="700" mt={1.5}>
                            {item.value}
                          </Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Stack>
                </Stack>
              </Box>

              <Grid
                ref={pulseRef}
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                gap={4}
                style={{
                  transition:
                    "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: pulseRevealed ? 1 : 0,
                  transform: pulseRevealed ? "translateY(0)" : "translateY(36px)",
                }}
              >
                <Box
                  borderRadius="30px"
                  px={5}
                  py={5}
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid rgba(227, 211, 184, 0.12)"
                >
                  <Text
                    color="#f5d076"
                    fontSize="xs"
                    letterSpacing="0.16em"
                    textTransform="uppercase"
                  >
                    {copy.pulseTitle}
                  </Text>
                  <Text mt={2} color="whiteAlpha.720" lineHeight="1.7">
                    {copy.pulseSubtitle}
                  </Text>
                  <Stack mt={5} spacing={3.5}>
                    {[
                      { label: copy.pulseAvailable, value: availableCount, icon: FiClock },
                      { label: copy.pulseNew, value: newCount, icon: LuSparkles },
                      {
                        label: copy.pulseTypes,
                        value: Object.keys(typeCounts).filter((key) => Number(typeCounts[key]) > 0)
                          .length,
                        icon: FiTrendingUp,
                      },
                    ].map((item) => (
                      <HStack
                        key={item.label}
                        justify="space-between"
                        px={3.5}
                        py={3}
                        borderRadius="18px"
                        bg="rgba(255,255,255,0.04)"
                      >
                        <HStack spacing={3}>
                          <Box
                            w="34px"
                            h="34px"
                            borderRadius="14px"
                            display="grid"
                            placeItems="center"
                            bg="rgba(245,208,118,0.10)"
                            color="#f5d076"
                          >
                            <Icon as={item.icon} />
                          </Box>
                          <Text color="whiteAlpha.820" fontSize="sm">
                            {item.label}
                          </Text>
                        </HStack>
                        <Text color="white" fontWeight="700">
                          {item.value}
                        </Text>
                      </HStack>
                    ))}
                  </Stack>
                </Box>

                <Box
                  borderRadius="30px"
                  px={5}
                  py={5}
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid rgba(227, 211, 184, 0.12)"
                >
                  <Text
                    color="#f5d076"
                    fontSize="xs"
                    letterSpacing="0.16em"
                    textTransform="uppercase"
                  >
                    {copy.marketLabel}
                  </Text>
                  <Heading mt={3} size="md" color="white">
                    {copy.routesTitle}
                  </Heading>
                  <Text mt={3} color="whiteAlpha.740" lineHeight="1.8">
                    {copy.routesText}
                  </Text>
                  <Stack mt={5} spacing={3}>
                    {routeCards.slice(0, 3).map((route) => (
                      <HStack
                        key={route.key}
                        as={RouterLink}
                        to={route.href}
                        justify="space-between"
                        px={3.5}
                        py={3}
                        borderRadius="18px"
                        bg="rgba(255,255,255,0.04)"
                        transition="background-color 0.2s ease, transform 0.2s ease"
                        _hover={{
                          bg: "rgba(255,255,255,0.08)",
                          transform: "translateX(2px)",
                        }}
                      >
                        <Box minW="0">
                          <Text color="white" fontWeight="600" noOfLines={1}>
                            {route.title}
                          </Text>
                          <Text color="whiteAlpha.600" fontSize="sm" noOfLines={1}>
                            {route.count} {locale === "ru" ? "предложений" : "offers"}
                          </Text>
                        </Box>
                        <FiArrowRight color="#f5d076" />
                      </HStack>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            </Stack>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
