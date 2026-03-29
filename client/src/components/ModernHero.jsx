import { useMemo } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
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
import { FiArrowRight, FiHome, FiSearch, FiShield } from "react-icons/fi";
import { MdCompareArrows } from "react-icons/md";
import { LuBuilding2, LuMapPin, LuSparkles, LuTrees } from "react-icons/lu";
import {
  formatPrice,
  getDocumentCount,
  getPhotoCount,
  getPrimaryImage,
  normalizePropertyTypeKey,
  normalizeStatus,
} from "views/public/catalog/catalogData";
import { publicBrand } from "views/public/publicBrand";
import { useScrollReveal } from "hooks/useScrollReveal";

const heroCopy = {
  ru: {
    kicker: "Кураторская недвижимость и приватные сделки",
    eyebrow: "Премиальная витрина",
    accent: "для современного образа жизни",
    primary: "Открыть коллекцию",
    secondary: "Сравнить предложения",
    searchHint: "Ищите по адресу, типу, району или сценарию жизни",
    searchButton: "Найти",
    trust1: "Проверенные предложения",
    trust2: "Быстрый путь к показу",
    trust3: "Частный брокеридж",
    collectionKicker: "Выбор редакции",
    collectionText: "Резиденции, участки и инвестиционные объекты с сильной подачей, чистой структурой и коротким путем к личной консультации.",
    heroCardLabel: "Подбор недели",
    statsAvailable: "Открытых предложений",
    statsCatalog: "Объектов в каталоге",
    statsRich: "Полных карточек",
  },
  en: {
    kicker: "Curated estates and private brokerage",
    eyebrow: "Premium showcase",
    accent: "for contemporary living",
    primary: "Open the collection",
    secondary: "Compare offers",
    searchHint: "Search by address, type, district, or lifestyle scenario",
    searchButton: "Search",
    trust1: "Verified offers",
    trust2: "Fast route to viewing",
    trust3: "Private brokerage",
    collectionKicker: "Editor's selection",
    collectionText: "Residences, land, and investment opportunities presented with strong imagery, cleaner structure, and a short route to private consultation.",
    heroCardLabel: "Selection of the week",
    statsAvailable: "Open offers",
    statsCatalog: "Catalog properties",
    statsRich: "Rich listings",
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

const metricValue = (value, suffix = "") => {
  if (!value && value !== 0) return "—";
  return `${value}${suffix}`;
};

export default function ModernHero({
  properties,
  t,
  onSearch,
  searchQuery,
  setSearchQuery,
}) {
  const { i18n } = useTranslation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const copy = heroCopy[locale];
  const isAuthenticated = Boolean(localStorage.getItem("token") || sessionStorage.getItem("token"));

  // Scroll reveal refs for staggered animations
  const [heroTitleRef, heroTitleRevealed] = useScrollReveal({ threshold: 0.2, rootMargin: "0px" });
  const [heroSearchRef, heroSearchRevealed] = useScrollReveal({ threshold: 0.2, delay: 200 });
  const [heroTrustRef, heroTrustRevealed] = useScrollReveal({ threshold: 0.2, delay: 400 });
  const [heroCategoriesRef, heroCategoriesRevealed] = useScrollReveal({ threshold: 0.1, delay: 600 });
  const [heroImageRef, heroImageRevealed] = useScrollReveal({ threshold: 0.2, delay: 300 });
  const [heroCollectionRef, heroCollectionRevealed] = useScrollReveal({ threshold: 0.2, delay: 500 });
  const [heroStatsRef, heroStatsRevealed] = useScrollReveal({ threshold: 0.2, delay: 700 });

  const availableNow = useMemo(
    () =>
      properties?.filter((item) =>
        ["available", "active", "new"].includes(String(item?.listingStatus || "").toLowerCase()),
      ).length || 0,
    [properties],
  );

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
    [properties],
  );

  const richCount = useMemo(
    () =>
      (properties || []).filter((property) => {
        const descriptionLength = String(
          property?.marketingDescription || property?.propertyDescription || "",
        ).length;
        return getPhotoCount(property) > 0 && descriptionLength > 80 && getDocumentCount(property) > 0;
      }).length,
    [properties],
  );

  const highlightStats = [
    { label: copy.statsAvailable, value: String(availableNow || 0) },
    { label: copy.statsCatalog, value: String(properties?.length || 0) },
    { label: copy.statsRich, value: String(richCount || 0) },
  ];

  return (
    <Box
      position="relative"
      overflow="hidden"
      pt={{ base: 28, md: 32 }}
      pb={{ base: 12, md: 16 }}
      bg={publicBrand.gradients.hero}
    >
      <Box
        position="absolute"
        inset="0"
        opacity={0.6}
        bg="radial-gradient(circle at 12% 22%, rgba(247,231,206,0.08) 0%, rgba(247,231,206,0) 28%), radial-gradient(circle at 84% 18%, rgba(185,119,55,0.16) 0%, rgba(185,119,55,0) 34%)"
      />
      <Box
        position="absolute"
        right={{ base: "-10%", xl: "-2%" }}
        top={{ base: "12%", xl: "9%" }}
        w={{ base: "320px", xl: "560px" }}
        h={{ base: "320px", xl: "560px" }}
        borderRadius="full"
        opacity={prefersReducedMotion ? 0.18 : 0.3}
        filter="blur(70px)"
        bg="radial-gradient(circle, rgba(212,175,55,0.24) 0%, rgba(212,175,55,0) 70%)"
      />

      <Container maxW="8xl" position="relative" zIndex={1}>
        <Grid templateColumns={{ base: "1fr", xl: "1.08fr 0.92fr" }} gap={{ base: 10, xl: 12 }} alignItems="center">
          <GridItem>
            <Stack spacing={8} maxW="760px">
              <Stack spacing={4} ref={heroTitleRef} style={{
                transition: "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: heroTitleRevealed ? 1 : 0,
                transform: heroTitleRevealed ? "translateY(0)" : "translateY(40px)",
              }}>
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
                    className="animate-fade-in-up"
                  >
                    {copy.eyebrow}
                  </Badge>
                  <Text color="whiteAlpha.760" fontSize="sm" letterSpacing="0.12em" textTransform="uppercase">
                    {copy.kicker}
                  </Text>
                </HStack>

                <Heading
                  as="h1"
                  fontSize={{ base: "4xl", md: "6xl", xl: "7xl" }}
                  lineHeight={{ base: "1.05", md: "0.95" }}
                  letterSpacing="-0.05em"
                  maxW="900px"
                >
                  {t("publicListing.heroTitle")}
                  <Text as="span" display="block" className="text-gradient-animated" mt={2}>
                    {copy.accent}
                  </Text>
                </Heading>

                <Text color="whiteAlpha.780" fontSize={{ base: "lg", md: "xl" }} maxW="700px" lineHeight="1.8">
                  {t("publicListing.heroDescription")}
                </Text>
              </Stack>

              <Box
                className="public-brand-panel animate-fade-in-up"
                ref={heroSearchRef}
                style={{
                  transition: "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: heroSearchRevealed ? 1 : 0,
                  transform: heroSearchRevealed ? "translateY(0)" : "translateY(40px)",
                }}
                borderRadius={{ base: "28px", md: "32px" }}
                px={{ base: 4, md: 5 }}
                py={{ base: 4, md: 5 }}
              >
                <Stack spacing={4}>
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
                      h="62px"
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

                  <HStack spacing={3} flexWrap="wrap">
                    <Button
                      onClick={onSearch}
                      leftIcon={<FiSearch />}
                      borderRadius="full"
                      h="54px"
                      px={8}
                      bg={publicBrand.gradients.brass}
                      color={publicBrand.colors.ink}
                      fontWeight="700"
                      _hover={{ transform: "translateY(-1px)", boxShadow: publicBrand.shadows.glow }}
                    >
                      {copy.searchButton}
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/offers"
                      rightIcon={<FiArrowRight />}
                      borderRadius="full"
                      h="54px"
                      px={8}
                      bg="rgba(255,255,255,0.05)"
                      color="white"
                      border="1px solid rgba(227, 211, 184, 0.14)"
                      _hover={{ bg: "rgba(255,255,255,0.08)" }}
                    >
                      {copy.primary}
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/offers/compare"
                      leftIcon={<MdCompareArrows />}
                      borderRadius="full"
                      h="54px"
                      px={7}
                      variant="ghost"
                      color="whiteAlpha.860"
                      _hover={{ bg: "rgba(255,255,255,0.08)", color: "white" }}
                    >
                      {copy.secondary}
                    </Button>
                    {!isAuthenticated ? (
                      <Button
                        as={RouterLink}
                        to="/auth/sign-in"
                        borderRadius="full"
                        h="54px"
                        px={7}
                        bg="transparent"
                        color="whiteAlpha.820"
                        border="1px solid rgba(227, 211, 184, 0.14)"
                        _hover={{ bg: "rgba(255,255,255,0.05)", color: "white" }}
                      >
                        {t("publicListing.signIn")}
                      </Button>
                    ) : null}
                  </HStack>
                </Stack>
              </Box>

              <HStack spacing={{ base: 3, md: 6 }} flexWrap="wrap" ref={heroTrustRef} style={{
                transition: "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: heroTrustRevealed ? 1 : 0,
                transform: heroTrustRevealed ? "translateY(0)" : "translateY(30px)",
              }}>
                {[copy.trust1, copy.trust2, copy.trust3].map((item, idx) => (
                  <HStack key={item} spacing={2} color="whiteAlpha.820" className={`delay-${idx * 100}`}>
                    <Icon as={FiShield} color="#f5d076" />
                    <Text fontSize="sm">{item}</Text>
                  </HStack>
                ))}
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} ref={heroCategoriesRef} style={{
                transition: "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: heroCategoriesRevealed ? 1 : 0,
                transform: heroCategoriesRevealed ? "translateY(0)" : "translateY(40px)",
              }}>
                {categoryConfig.map((category, idx) => (
                  <Box
                    key={category.key}
                    as={RouterLink}
                    to={category.route}
                    className={`hover-lift stagger-${idx}`}
                    borderRadius="40px"
                    px={4}
                    py={5}
                    bg="transparent"
                    border="1px solid rgba(227, 211, 184, 0.08)"
                    transition="transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease"
                    _hover={{
                      transform: "translateY(-6px)",
                      borderColor: "rgba(245,208,118,0.3)",
                      boxShadow: "0 0 30px rgba(212, 175, 55, 0.15)",
                    }}
                  >
                    <Stack spacing={3}>
                      <HStack justify="space-between">
                        <Box
                          w="50px"
                          h="50px"
                          borderRadius="25px"
                          display="grid"
                          placeItems="center"
                          bg="rgba(245,208,118,0.1)"
                          color="#f5d076"
                        >
                          <Icon as={category.icon} boxSize={5} />
                        </Box>
                        <Text color="whiteAlpha.620" fontSize="sm">
                          {typeCounts[category.key] || 0}
                        </Text>
                      </HStack>
                      <Stack spacing={1}>
                        <Text color="white" fontWeight="600">
                          {t(category.titleKey)}
                        </Text>
                        <Text color="whiteAlpha.680" fontSize="sm" noOfLines={2}>
                          {t(category.descriptionKey)}
                        </Text>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </SimpleGrid>
            </Stack>
          </GridItem>

          <GridItem>
            <Stack spacing={5} ref={heroImageRef} style={{
              transition: "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: heroImageRevealed ? 1 : 0,
              transform: heroImageRevealed ? "translateY(0)" : "translateY(50px)",
            }}>
              <Box
                position="relative"
                borderRadius={{ base: "32px", md: "38px" }}
                overflow="hidden"
                boxShadow={publicBrand.shadows.deep}
                minH={{ base: "420px", md: "560px" }}
                className="hover-scale"
                _hover={{
                  boxShadow: "0 40px 120px rgba(0, 0, 0, 0.4), 0 0 60px rgba(212, 175, 55, 0.2)",
                }}
              >
                <Image
                  src={getPrimaryImage(heroProperty)}
                  alt={heroProperty?.name || heroProperty?.propertyAddress || publicBrand.name}
                  w="100%"
                  h={{ base: "420px", md: "560px" }}
                  objectFit="cover"
                />
                <Box
                  position="absolute"
                  inset="0"
                  bg="linear-gradient(180deg, rgba(7,12,20,0.08) 0%, rgba(7,12,20,0.38) 38%, rgba(7,12,20,0.88) 100%)"
                />
                <Stack position="absolute" inset="0" justify="space-between" p={{ base: 5, md: 6 }}>
                  <HStack justify="space-between" align="start">
                    <Badge
                      px={3.5}
                      py={1.5}
                      borderRadius="full"
                      bg="rgba(255,255,255,0.12)"
                      color="white"
                      border="1px solid rgba(255,255,255,0.16)"
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
                      <Text color="#f5d076" fontSize="xs" letterSpacing="0.14em" textTransform="uppercase">
                        {normalizeStatus(heroProperty?.listingStatus, t)}
                      </Text>
                    </Box>
                  </HStack>

                  <Stack spacing={5}>
                    <Box
                      w="fit-content"
                      px={5}
                      py={3}
                      borderRadius="26px"
                      bg="rgba(7,12,20,0.52)"
                      border="1px solid rgba(227, 211, 184, 0.14)"
                      backdropFilter="blur(12px)"
                    >
                      <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" lineHeight="1">
                        {formatPrice(heroProperty?.listingPrice, t)}
                      </Text>
                    </Box>

                    <Stack spacing={3} maxW="540px">
                      <Heading fontSize={{ base: "2xl", md: "4xl" }} lineHeight="1.02" letterSpacing="-0.04em">
                        {heroProperty?.name || heroProperty?.propertyAddress}
                      </Heading>
                      <HStack spacing={2} color="whiteAlpha.760">
                        <Icon as={LuMapPin} />
                        <Text noOfLines={1}>
                          {heroProperty?.propertyAddress || t("publicListing.notSpecified")}
                        </Text>
                      </HStack>
                      <Text color="whiteAlpha.780" noOfLines={3} maxW="560px" lineHeight="1.8">
                        {heroProperty?.marketingDescription ||
                          heroProperty?.propertyDescription ||
                          copy.collectionText}
                      </Text>
                    </Stack>

                    <SimpleGrid columns={3} spacing={3}>
                      {[
                        { label: t("publicListing.bedrooms"), value: metricValue(heroProperty?.numberofBedrooms) },
                        { label: t("publicListing.bathrooms"), value: metricValue(heroProperty?.numberofBathrooms) },
                        { label: t("publicListing.area"), value: metricValue(heroProperty?.squareFootage) },
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
                          <Text color="whiteAlpha.600" fontSize="xs" textTransform="uppercase" letterSpacing="0.12em">
                            {item.label}
                          </Text>
                          <Text fontWeight="700" mt={1.5}>
                            {item.value}
                          </Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Stack>
                </Stack>
              </Box>

              <Grid templateColumns={{ base: "1fr", md: "1.1fr 0.9fr" }} gap={4} ref={heroCollectionRef} style={{
                transition: "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: heroCollectionRevealed ? 1 : 0,
                transform: heroCollectionRevealed ? "translateY(0)" : "translateY(40px)",
              }}>
                <GridItem>
                  <Box
                    className="public-brand-panel hover-lift"
                    borderRadius="30px"
                    px={5}
                    py={5}
                    minH="100%"
                    transition="transform 0.3s ease, box-shadow 0.3s ease"
                    _hover={{
                      transform: "translateY(-5px)",
                      boxShadow: "0 15px 50px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <Stack spacing={3}>
                      <Text color="#f5d076" fontSize="xs" textTransform="uppercase" letterSpacing="0.16em">
                        {copy.collectionKicker}
                      </Text>
                      <Text fontSize={{ base: "lg", md: "xl" }} lineHeight="1.5">
                        {copy.collectionText}
                      </Text>
                    </Stack>
                  </Box>
                </GridItem>
                <GridItem>
                  <SimpleGrid columns={1} spacing={4} ref={heroStatsRef} style={{
                    transition: "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
                    opacity: heroStatsRevealed ? 1 : 0,
                    transform: heroStatsRevealed ? "translateY(0)" : "translateY(40px)",
                  }}>
                    {highlightStats.map((item, idx) => (
                      <Box
                        key={item.label}
                        className={`hover-lift stagger-${idx}`}
                        borderRadius="28px"
                        px={5}
                        py={4}
                        bg="rgba(255,255,255,0.05)"
                        border="1px solid rgba(227, 211, 184, 0.14)"
                        transition="transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease"
                        _hover={{
                          transform: "translateY(-4px)",
                          borderColor: "rgba(245,208,118,0.3)",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <Text color="whiteAlpha.600" fontSize="xs" letterSpacing="0.14em" textTransform="uppercase">
                          {item.label}
                        </Text>
                        <Text mt={1.5} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700">
                          {item.value}
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </GridItem>
              </Grid>
            </Stack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
