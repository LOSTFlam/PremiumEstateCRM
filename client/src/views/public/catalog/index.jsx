import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Switch,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuBath, LuBedDouble, LuMap, LuSearch } from "react-icons/lu";
import {
  MdArrowForward,
  MdCompareArrows,
  MdFavorite,
  MdFavoriteBorder,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineSquareFoot,
} from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import { getApi } from "services/api";
import {
  formatCompactNumber,
  formatPrice,
  getCatalogDataset,
  getDocumentCount,
  getFloorPlanCount,
  getPhotoCount,
  getPrimaryImage,
  isRichListing,
  normalizePropertyTypeKey,
  normalizeStatus,
  parsePrice,
} from "./catalogData";
import {
  getCompareIds,
  getFavoriteIds,
  getRecentlyViewedIds,
  toggleCompareId,
  toggleFavoriteId,
} from "./catalogStorage";
import { getSeoCollectionCards } from "./seoCollections";

const PAGE_SIZE = 6;
const FILTER_OPTIONS = [1, 2, 3, 4, 5];

const categoryConfig = {
  house: {
    titleKey: "publicListing.categoryHouses",
    descriptionKey: "publicListing.categoryHousesText",
    route: "/offers/houses",
  },
  apartment: {
    titleKey: "publicListing.categoryApartments",
    descriptionKey: "publicListing.categoryApartmentsText",
    route: "/offers/apartments",
  },
  land: {
    titleKey: "publicListing.categoryPlots",
    descriptionKey: "publicListing.categoryPlotsText",
    route: "/offers/plots",
  },
  commercial: {
    titleKey: "publicListing.categoryCommercial",
    descriptionKey: "publicListing.categoryCommercialText",
    route: "/offers/commercial",
  },
};

const getRichScore = (property) => {
  const photoCount = getPhotoCount(property);
  const docCount = getDocumentCount(property);
  const planCount = getFloorPlanCount(property);
  const descriptionSize = String(property?.marketingDescription || property?.propertyDescription || "").length;
  return (isRichListing(property) ? 1000 : 0) + photoCount * 10 + docCount * 5 + planCount * 8 + descriptionSize;
};

export default function PublicCatalog({ forcedType = null }) {
  const { i18n, t } = useTranslation();
  const toast = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState(forcedType || "all");
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [recentIds, setRecentIds] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedroomFilter, setBedroomFilter] = useState("all");
  const [bathroomFilter, setBathroomFilter] = useState("all");
  const [onlyWithPhotos, setOnlyWithPhotos] = useState(false);
  const [onlyRich, setOnlyRich] = useState(false);

  const pageBg = useColorModeValue("#f3ecdf", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const subtleBg = useColorModeValue("#f8f2e7", "whiteAlpha.100");
  const heroBg = useColorModeValue(
    "linear-gradient(135deg, #102d24 0%, #1d4d42 45%, #be935f 100%)",
    "linear-gradient(135deg, #10241d 0%, #22443b 45%, #6f8f7b 100%)",
  );
  const mutedColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("rgba(16,45,36,0.08)", "whiteAlpha.200");

  const syncLocalCollections = () => {
    setFavoriteIds(getFavoriteIds());
    setCompareIds(getCompareIds());
    setRecentIds(getRecentlyViewedIds());
  };

  useEffect(() => {
    if (forcedType) {
      setTypeFilter(forcedType);
      setPage(1);
    }
  }, [forcedType]);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await getApi("api/property/public");
        let propertiesData = [];
        
        if (Array.isArray(response)) {
          propertiesData = response;
        } else if (Array.isArray(response?.data)) {
          propertiesData = response.data;
        }
        
        // If API returned empty array, import sample data
        if (propertiesData.length === 0) {
          console.log('No properties from API, loading sample data');
          const { samplePublicProperties } = await import('./catalogData');
          propertiesData = samplePublicProperties;
        }
        
        setProperties(getCatalogDataset(propertiesData));
      } catch (error) {
        console.error('Error fetching properties:', error);
        // Load sample data on error
        const { samplePublicProperties } = await import('./catalogData');
        setProperties(getCatalogDataset(samplePublicProperties));
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    syncLocalCollections();
    if (typeof window === "undefined") return undefined;

    window.addEventListener("focus", syncLocalCollections);
    return () => window.removeEventListener("focus", syncLocalCollections);
  }, []);

  const statuses = useMemo(
    () => Array.from(new Set(properties.map((item) => normalizeStatus(item?.listingStatus, t)))),
    [properties, t],
  );

  const typeOptions = useMemo(() => {
    const values = Array.from(
      new Set(properties.map((item) => normalizePropertyTypeKey(item?.propertyType)).filter((value) => value && value !== "other")),
    );

    return values.map((value) => ({
      value,
      label: t(categoryConfig[value]?.titleKey || "publicListing.allTypes"),
    }));
  }, [properties, t]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const minValue = parsePrice(minPrice);
    const maxValue = parsePrice(maxPrice);

    const base = properties.filter((item) => {
      const haystack = [
        item?.name,
        item?.propertyAddress,
        item?.propertyType,
        item?.marketingDescription,
        item?.propertyDescription,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const itemTypeKey = normalizePropertyTypeKey(item?.propertyType);
      const price = parsePrice(item?.listingPrice);
      const bedrooms = Number(item?.numberofBedrooms || 0);
      const bathrooms = Number(item?.numberofBathrooms || 0);
      const matchesSearch = !query || haystack.includes(query);
      const matchesStatus = statusFilter === "all" || normalizeStatus(item?.listingStatus, t) === statusFilter;
      const matchesType = typeFilter === "all" || itemTypeKey === typeFilter;
      const matchesMinPrice = !minValue || price >= minValue;
      const matchesMaxPrice = !maxValue || price <= maxValue;
      const matchesBedrooms = bedroomFilter === "all" || bedrooms >= Number(bedroomFilter);
      const matchesBathrooms = bathroomFilter === "all" || bathrooms >= Number(bathroomFilter);
      const matchesPhotos = !onlyWithPhotos || getPhotoCount(item) > 0;
      const matchesRich = !onlyRich || isRichListing(item);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesBedrooms &&
        matchesBathrooms &&
        matchesPhotos &&
        matchesRich
      );
    });

    return [...base].sort((a, b) => {
      if (sortBy === "priceHigh") return parsePrice(b?.listingPrice) - parsePrice(a?.listingPrice);
      if (sortBy === "priceLow") return parsePrice(a?.listingPrice) - parsePrice(b?.listingPrice);
      if (sortBy === "bestFilled") return getRichScore(b) - getRichScore(a);
      return new Date(b?.updatedDate || b?.createdDate || 0) - new Date(a?.updatedDate || a?.createdDate || 0);
    });
  }, [
    bathroomFilter,
    bedroomFilter,
    maxPrice,
    minPrice,
    onlyRich,
    onlyWithPhotos,
    properties,
    search,
    sortBy,
    statusFilter,
    t,
    typeFilter,
  ]);

  const pagesCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  useEffect(() => {
    if (page > pagesCount) setPage(1);
  }, [page, pagesCount]);

  const availableNow = useMemo(
    () =>
      properties.filter((item) => ["available", "active", "new"].includes(String(item?.listingStatus || "available").toLowerCase())).length,
    [properties],
  );

  const avgPrice = useMemo(() => {
    const prices = properties.map((item) => parsePrice(item?.listingPrice)).filter(Boolean);
    if (!prices.length) return t?.("publicListing.priceOnRequest");
    return formatPrice(prices.reduce((sum, item) => sum + item, 0) / prices.length, t);
  }, [properties, t]);

  const richListingsCount = useMemo(() => properties.filter((item) => isRichListing(item)).length, [properties]);
  const favoriteProperties = useMemo(() => favoriteIds.map((id) => properties.find((item) => item?._id === id)).filter(Boolean).slice(0, 3), [favoriteIds, properties]);
  const recentProperties = useMemo(() => recentIds.map((id) => properties.find((item) => item?._id === id)).filter(Boolean).slice(0, 3), [recentIds, properties]);
  const compareProperties = useMemo(() => compareIds.map((id) => properties.find((item) => item?._id === id)).filter(Boolean), [compareIds, properties]);
  const featuredProperty = filtered[0] || properties[0] || null;

  const seoCollections = useMemo(() => getSeoCollectionCards(i18n.language), [i18n.language]);

  const categorySections = Object.entries(categoryConfig)
    .map(([key, config]) => ({
      key,
      config,
      items: properties.filter((item) => normalizePropertyTypeKey(item?.propertyType) === key).slice(0, 3),
    }))
    .filter((section) => section.items.length > 0);

  const headingTitle = forcedType ? t(categoryConfig[forcedType]?.titleKey || "publicListing.catalogTitle") : t?.("publicListing.catalogTitle");
  const headingText = forcedType ? t(categoryConfig[forcedType]?.descriptionKey || "publicListing.heroDescription") : t?.("publicListing.heroDescription");

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter(forcedType || "all");
    setSortBy("latest");
    setPage(1);
    setMinPrice("");
    setMaxPrice("");
    setBedroomFilter("all");
    setBathroomFilter("all");
    setOnlyWithPhotos(false);
    setOnlyRich(false);
  };

  const handleFavoriteToggle = (id) => {
    setFavoriteIds(toggleFavoriteId(id));
  };

  const handleCompareToggle = (id) => {
    if (!compareIds.includes(id) && compareIds.length >= 3) {
      toast({ title: t?.("publicListing.compareLimit"), status: "info" });
      return;
    }

    setCompareIds(toggleCompareId(id));
  };

  const renderMiniCard = (property) => (
    <Box key={property?._id} bg={subtleBg} borderRadius="24px" overflow="hidden">
      <Image src={getPrimaryImage(property)} alt={property?.name || property?.propertyAddress} h="160px" w="100%" objectFit="cover" />
      <Stack p={4} spacing={3}>
        <Heading size="sm" noOfLines={2}>{property?.name || property?.propertyAddress}</Heading>
        <Text color={mutedColor} fontSize="sm" noOfLines={1}>{property?.propertyAddress || t?.("publicListing.notSpecified")}</Text>
        <Heading size="sm" color="green.600">{formatPrice(property?.listingPrice, t)}</Heading>
        <Button as={RouterLink} to={`/offers/${property?.publicSlug || property?._id}`} size="sm" colorScheme="green" variant="outline">
          {t?.("publicListing.viewOffer")}
        </Button>
      </Stack>
    </Box>
  );

  return (
    <Box minH="100vh" bg={pageBg} py={{ base: 6, md: 10 }}>
      <Container maxW="8xl">
        <Stack spacing={8}>
          <Box borderRadius="36px" bg={heroBg} color="white" p={{ base: 6, md: 10 }} boxShadow="0 28px 80px rgba(15,47,36,0.22)">
            <Grid templateColumns={{ base: "1fr", xl: "1.15fr 0.85fr" }} gap={8} alignItems="center">
              <GridItem>
                <Stack spacing={5}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Badge w="fit-content" px={4} py={1.5} borderRadius="full" bg="whiteAlpha.250">
                      {t?.("publicListing.heroBadge")}
                    </Badge>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        variant={i18n.language === "en" ? "solid" : "ghost"}
                        onClick={() => i18n.changeLanguage("en")}
                        colorScheme="whiteAlpha"
                      >
                        EN
                      </Button>
                      <Button
                        size="sm"
                        variant={i18n.language === "ru" ? "solid" : "ghost"}
                        onClick={() => i18n.changeLanguage("ru")}
                        colorScheme="whiteAlpha"
                      >
                        РУ
                      </Button>
                    </HStack>
                  </Flex>
                  <Heading size="2xl" maxW="760px">{headingTitle}</Heading>
                  <Text fontSize={{ base: "md", md: "lg" }} color="whiteAlpha.900" maxW="760px">
                    {headingText}
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} maxW="720px">
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <Box
                        key={key}
                        as={RouterLink}
                        to={config.route}
                        borderWidth="1px"
                        borderColor="whiteAlpha.300"
                        borderRadius="24px"
                        p={4}
                        bg={forcedType === key ? "whiteAlpha.300" : "whiteAlpha.150"}
                        _hover={{ bg: "whiteAlpha.250" }}
                      >
                        <Text fontWeight="700">{t(config.titleKey)}</Text>
                        <Text fontSize="sm" color="whiteAlpha.800">{t(config.descriptionKey)}</Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                  <HStack spacing={3} flexWrap="wrap">
                    <Button as={RouterLink} to="/offers" colorScheme="blackAlpha" variant="solid">
                      {t?.("publicListing.allOffers")}
                    </Button>
                    <Button as={RouterLink} to="/offers/compare" variant="outline" borderColor="whiteAlpha.500">
                      {t?.("publicListing.compareAction")}
                    </Button>
                    <Button as={RouterLink} to="/auth/sign-in" variant="outline" borderColor="whiteAlpha.500">
                      {t?.("auth.signIn.signInButton")}
                    </Button>
                    <Button as={RouterLink} to="/auth/sign-up" variant="solid" colorScheme="green">
                      {t?.("auth.signUp.createAccountButton")}
                    </Button>
                  </HStack>
                </Stack>
              </GridItem>
              <GridItem>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                  <Box bg="whiteAlpha.200" borderRadius="28px" p={5}>
                    <Stat>
                      <StatLabel color="whiteAlpha.800">{t?.("publicListing.totalOffers")}</StatLabel>
                      <StatNumber>{formatCompactNumber(properties.length)}</StatNumber>
                      <StatHelpText color="whiteAlpha.800">{t?.("publicListing.totalOffersHelp")}</StatHelpText>
                    </Stat>
                  </Box>
                  <Box bg="whiteAlpha.200" borderRadius="28px" p={5}>
                    <Stat>
                      <StatLabel color="whiteAlpha.800">{t?.("publicListing.availableNow")}</StatLabel>
                      <StatNumber>{formatCompactNumber(availableNow)}</StatNumber>
                      <StatHelpText color="whiteAlpha.800">{t?.("publicListing.availableHelp")}</StatHelpText>
                    </Stat>
                  </Box>
                  <Box bg="whiteAlpha.200" borderRadius="28px" p={5}>
                    <Stat>
                      <StatLabel color="whiteAlpha.800">{t?.("publicListing.avgPrice")}</StatLabel>
                      <StatNumber fontSize="xl">{avgPrice}</StatNumber>
                      <StatHelpText color="whiteAlpha.800">{t?.("publicListing.avgPriceHelp")}</StatHelpText>
                    </Stat>
                  </Box>
                  <Box bg="whiteAlpha.200" borderRadius="28px" p={5}>
                    <Stat>
                      <StatLabel color="whiteAlpha.800">{t?.("publicListing.richCardBadge")}</StatLabel>
                      <StatNumber>{formatCompactNumber(richListingsCount)}</StatNumber>
                      <StatHelpText color="whiteAlpha.800">{t?.("publicListing.savedOffersHelp")}</StatHelpText>
                    </Stat>
                  </Box>
                </Grid>
              </GridItem>
            </Grid>
          </Box>

          <Box bg={cardBg} borderRadius="32px" p={{ base: 5, md: 6 }} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
            <Grid templateColumns={{ base: "1fr", xl: "1.1fr 0.9fr" }} gap={6} alignItems="start">
              <GridItem>
                <Stack spacing={3}>
                  <Badge w="fit-content" colorScheme="green">{t?.("publicListing.savedOffers")}</Badge>
                  <Heading size="md">{t?.("publicListing.savedOffersHelp")}</Heading>
                  <Text color={mutedColor}>{forcedType ? headingText : t?.("publicListing.catalogSupportText")}</Text>
                </Stack>
              </GridItem>
              <GridItem>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <Box bg={subtleBg} borderRadius="24px" p={4}>
                    <Text fontSize="sm" color={mutedColor}>{t?.("publicListing.favoritesCount")}</Text>
                    <Heading size="md">{favoriteIds.length}</Heading>
                  </Box>
                  <Box bg={subtleBg} borderRadius="24px" p={4}>
                    <Text fontSize="sm" color={mutedColor}>{t?.("publicListing.compareCount")}</Text>
                    <Heading size="md">{compareIds.length}</Heading>
                  </Box>
                  <Box bg={subtleBg} borderRadius="24px" p={4}>
                    <Text fontSize="sm" color={mutedColor}>{t?.("publicListing.recentCount")}</Text>
                    <Heading size="md">{recentIds.length}</Heading>
                  </Box>
                </SimpleGrid>
              </GridItem>
            </Grid>
          </Box>

          {!forcedType && seoCollections.length > 0 && (
            <Box bg={cardBg} borderRadius="32px" p={{ base: 5, md: 6 }} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
              <Stack spacing={5}>
                <Box>
                  <Heading size="lg">{t?.("publicListing.seoCollectionsTitle")}</Heading>
                  <Text color={mutedColor}>{t?.("publicListing.seoCollectionsText")}</Text>
                </Box>
                <SimpleGrid columns={{ base: 1, md: 2, xl: 5 }} gap={4}>
                  {seoCollections.map((item) => (
                    <Box key={item.slug} as={RouterLink} to={"/collections/" + item.slug} bg={subtleBg} borderRadius="24px" p={4} _hover={{ transform: "translateY(-2px)" }} transition="0.2s ease">
                      <Badge mb={3} colorScheme="green">{item.badge}</Badge>
                      <Heading size="sm" mb={3}>{item.title}</Heading>
                      <Text fontSize="sm" color={mutedColor} noOfLines={4}>{item.description}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Stack>
            </Box>
          )}

          {!forcedType && categorySections.length > 0 && (
            <Stack spacing={5}>
              <Flex justify="space-between" align={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} gap={3}>
                <Box>
                  <Heading size="lg">{t?.("publicListing.collectionsTitle")}</Heading>
                  <Text color={mutedColor}>{t?.("publicListing.collectionsText")}</Text>
                </Box>
                <Button as={RouterLink} to="/offers" variant="outline">{t?.("publicListing.allOffers")}</Button>
              </Flex>
              {categorySections.map((section) => (
                <Box key={section.key} bg={cardBg} borderRadius="32px" p={{ base: 5, md: 6 }} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                  <Flex justify="space-between" align={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} gap={3} mb={5}>
                    <Box>
                      <Heading size="md">{t(section.config.titleKey)}</Heading>
                      <Text color={mutedColor}>{t(section.config.descriptionKey)}</Text>
                    </Box>
                    <Button as={RouterLink} to={section.config.route} variant="ghost" colorScheme="green">
                      {t?.("publicListing.openCategory")}
                    </Button>
                  </Flex>
                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
                    {section.items.map((property) => renderMiniCard(property))}
                  </SimpleGrid>
                </Box>
              ))}
            </Stack>
          )}

          {(favoriteProperties.length > 0 || recentProperties.length > 0) && (
            <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={6}>
              <GridItem>
                <Box bg={cardBg} borderRadius="32px" p={{ base: 5, md: 6 }} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                  <Stack spacing={4}>
                    <Heading size="md">{t?.("publicListing.favoritesTitle")}</Heading>
                    <Text color={mutedColor}>{t?.("publicListing.favoritesText")}</Text>
                    {favoriteProperties.length ? <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>{favoriteProperties.map((property) => renderMiniCard(property))}</SimpleGrid> : <Text color={mutedColor}>{t?.("publicListing.notSpecified")}</Text>}
                  </Stack>
                </Box>
              </GridItem>
              <GridItem>
                <Box bg={cardBg} borderRadius="32px" p={{ base: 5, md: 6 }} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                  <Stack spacing={4}>
                    <Heading size="md">{t?.("publicListing.recentlyViewedTitle")}</Heading>
                    <Text color={mutedColor}>{t?.("publicListing.recentlyViewedText")}</Text>
                    {recentProperties.length ? <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>{recentProperties.map((property) => renderMiniCard(property))}</SimpleGrid> : <Text color={mutedColor}>{t?.("publicListing.notSpecified")}</Text>}
                  </Stack>
                </Box>
              </GridItem>
            </Grid>
          )}

          <Box bg={cardBg} borderRadius="32px" p={{ base: 5, md: 6 }} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
            <Stack spacing={5}>
              <Grid templateColumns={{ base: "1fr", xl: "2fr 1fr 1fr 1fr" }} gap={4}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={LuSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder={t?.("publicListing.searchPlaceholder")} />
                </InputGroup>
                <Select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}>
                  <option value="all">{t?.("publicListing.allStatuses")}</option>
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </Select>
                <Select value={typeFilter} onChange={(event) => { setTypeFilter(event.target.value); setPage(1); }} isDisabled={Boolean(forcedType)}>
                  <option value="all">{t?.("publicListing.allTypes")}</option>
                  {typeOptions.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                </Select>
                <Select value={sortBy} onChange={(event) => { setSortBy(event.target.value); setPage(1); }}>
                  <option value="latest">{t?.("publicListing.latest")}</option>
                  <option value="priceHigh">{t?.("publicListing.priceHigh")}</option>
                  <option value="priceLow">{t?.("publicListing.priceLow")}</option>
                  <option value="bestFilled">{t?.("publicListing.bestFilled")}</option>
                </Select>
              </Grid>

              <Box bg={subtleBg} borderRadius="28px" p={5}>
                <Stack spacing={4}>
                  <Heading size="sm">{t?.("publicListing.advancedFiltersTitle")}</Heading>
                  <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)", xl: "repeat(6, 1fr)" }} gap={4}>
                    <Input value={minPrice} onChange={(event) => { setMinPrice(event.target.value); setPage(1); }} placeholder={t?.("publicListing.minPrice")} />
                    <Input value={maxPrice} onChange={(event) => { setMaxPrice(event.target.value); setPage(1); }} placeholder={t?.("publicListing.maxPrice")} />
                    <Select value={bedroomFilter} onChange={(event) => { setBedroomFilter(event.target.value); setPage(1); }}>
                      <option value="all">{t?.("publicListing.bedroomsAny")}</option>
                      {FILTER_OPTIONS.map((value) => <option key={value} value={value}>{value}+</option>)}
                    </Select>
                    <Select value={bathroomFilter} onChange={(event) => { setBathroomFilter(event.target.value); setPage(1); }}>
                      <option value="all">{t?.("publicListing.bathroomsAny")}</option>
                      {FILTER_OPTIONS.map((value) => <option key={value} value={value}>{value}+</option>)}
                    </Select>
                    <HStack justify="space-between" bg={cardBg} borderRadius="18px" px={4}>
                      <Text fontSize="sm">{t?.("publicListing.onlyWithPhotos")}</Text>
                      <Switch isChecked={onlyWithPhotos} onChange={(event) => { setOnlyWithPhotos(event.target.checked); setPage(1); }} />
                    </HStack>
                    <HStack justify="space-between" bg={cardBg} borderRadius="18px" px={4}>
                      <Text fontSize="sm">{t?.("publicListing.onlyRichListings")}</Text>
                      <Switch isChecked={onlyRich} onChange={(event) => { setOnlyRich(event.target.checked); setPage(1); }} />
                    </HStack>
                  </Grid>
                </Stack>
              </Box>
            </Stack>
          </Box>

          {featuredProperty && (
            <Grid templateColumns={{ base: "1fr", xl: "1.1fr 0.9fr" }} gap={6}>
              <GridItem>
                <Box bg={cardBg} borderRadius="32px" overflow="hidden" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                  <Image src={getPrimaryImage(featuredProperty)} alt={featuredProperty?.name || featuredProperty?.propertyAddress} h={{ base: "280px", md: "420px" }} w="100%" objectFit="cover" />
                </Box>
              </GridItem>
              <GridItem>
                <Box bg={cardBg} borderRadius="32px" p={{ base: 5, md: 7 }} boxShadow="sm" borderWidth="1px" borderColor={borderColor} h="100%">
                  <Stack spacing={4} h="100%" justify="space-between">
                    <Stack spacing={4}>
                      <HStack spacing={3} flexWrap="wrap">
                        <Badge w="fit-content" colorScheme="green">{t?.("publicListing.featuredOffer")}</Badge>
                        {isRichListing(featuredProperty) && <Badge w="fit-content" colorScheme="purple">{t?.("publicListing.richCardBadge")}</Badge>}
                      </HStack>
                      <Heading size="xl">{featuredProperty?.name || featuredProperty?.propertyAddress}</Heading>
                      <Text color={mutedColor}>{featuredProperty?.propertyAddress || t?.("publicListing.notSpecified")}</Text>
                      <Text color={mutedColor} noOfLines={4}>{featuredProperty?.marketingDescription || featuredProperty?.propertyDescription || t?.("publicListing.notSpecified")}</Text>
                      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
                        <Box bg={subtleBg} borderRadius="22px" p={4}>
                          <Text fontSize="sm" color={mutedColor}>{t?.("publicListing.type")}</Text>
                          <Text fontWeight="700">{featuredProperty?.propertyType || t?.("publicListing.notSpecified")}</Text>
                        </Box>
                        <Box bg={subtleBg} borderRadius="22px" p={4}>
                          <Text fontSize="sm" color={mutedColor}>{t?.("publicListing.status")}</Text>
                          <Text fontWeight="700">{normalizeStatus(featuredProperty?.listingStatus, t)}</Text>
                        </Box>
                        <Box bg={subtleBg} borderRadius="22px" p={4}>
                          <Text fontSize="sm" color={mutedColor}>{t?.("publicListing.area")}</Text>
                          <Text fontWeight="700">{featuredProperty?.squareFootage || t?.("publicListing.notSpecified")}</Text>
                        </Box>
                        <Box bg={subtleBg} borderRadius="22px" p={4}>
                          <Text fontSize="sm" color={mutedColor}>{t?.("publicListing.priceLabel")}</Text>
                          <Text fontWeight="700">{formatPrice(featuredProperty?.listingPrice, t)}</Text>
                        </Box>
                      </SimpleGrid>
                    </Stack>
                    <HStack justify="space-between" align="end" flexWrap="wrap" spacing={4}>
                      <HStack spacing={4} color={mutedColor} flexWrap="wrap">
                        <Text>{t?.("publicListing.photosCount", { count: getPhotoCount(featuredProperty) })}</Text>
                        <Text>{t?.("publicListing.docsCount", { count: getDocumentCount(featuredProperty) })}</Text>
                        <Text>{t?.("publicListing.plansCount", { count: getFloorPlanCount(featuredProperty) })}</Text>
                      </HStack>
                      <Button as={RouterLink} to={`/offers/${featuredProperty?.publicSlug || featuredProperty?._id}`} colorScheme="green" rightIcon={<MdArrowForward />}>
                        {t?.("publicListing.viewOffer")}
                      </Button>
                    </HStack>
                  </Stack>
                </Box>
              </GridItem>
            </Grid>
          )}

          <Stack spacing={4}>
            <Flex justify="space-between" align={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} gap={3}>
              <Box>
                <Heading size="lg">{headingTitle}</Heading>
                <Text color={mutedColor}>{t?.("publicListing.filteredCount", { count: filtered.length })}</Text>
              </Box>
              <HStack spacing={3} color={mutedColor} flexWrap="wrap">
                <Icon as={LuMap} />
                <Text>{t?.("publicListing.catalogSupportText")}</Text>
              </HStack>
            </Flex>

            {compareProperties.length > 0 && (
              <Box bg={cardBg} borderRadius="24px" p={5} borderWidth="1px" borderColor={borderColor}>
                <Flex justify="space-between" align={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} gap={3}>
                  <Stack spacing={1}>
                    <Heading size="sm">{t?.("publicListing.comparePageTitle")}</Heading>
                    <Text color={mutedColor}>{t?.("publicListing.comparePageText")}</Text>
                  </Stack>
                  <Button as={RouterLink} to="/offers/compare" leftIcon={<MdCompareArrows />} colorScheme="green">
                    {t?.("publicListing.compareAction")}
                  </Button>
                </Flex>
              </Box>
            )}

            {loading ? (
              <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={6}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Box key={index} bg={cardBg} borderRadius="28px" overflow="hidden">
                    <Skeleton h="240px" />
                    <Stack p={5}><Skeleton h="20px" /><Skeleton h="16px" /><Skeleton h="44px" /></Stack>
                  </Box>
                ))}
              </SimpleGrid>
            ) : paginated.length ? (
              <>
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={6}>
                  {paginated.map((property) => {
                    const rich = isRichListing(property);
                    const isFavorite = favoriteIds.includes(property?._id);
                    const isInCompare = compareIds.includes(property?._id);

                    return (
                      <Box key={property?._id} bg={cardBg} borderRadius="28px" overflow="hidden" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                        <Box position="relative">
                          <Image src={getPrimaryImage(property)} alt={property?.name || property?.propertyAddress} h="240px" w="100%" objectFit="cover" />
                          <HStack position="absolute" top={4} left={4} spacing={2} flexWrap="wrap">
                            <Badge colorScheme="green" px={3} py={1} borderRadius="full">{normalizeStatus(property?.listingStatus, t)}</Badge>
                            {rich && <Badge colorScheme="purple" px={3} py={1} borderRadius="full">{t?.("publicListing.richCardBadge")}</Badge>}
                          </HStack>
                          <HStack position="absolute" top={4} right={4} spacing={2}>
                            <IconButton aria-label={isFavorite ? t?.("publicListing.removeFromFavorites") : t?.("publicListing.addToFavorites")} icon={isFavorite ? <MdFavorite /> : <MdFavoriteBorder />} size="sm" colorScheme={isFavorite ? "red" : "blackAlpha"} variant={isFavorite ? "solid" : "outline"} onClick={() => handleFavoriteToggle(property?._id)} />
                            <IconButton aria-label={isInCompare ? t?.("publicListing.removeFromCompare") : t?.("publicListing.addToCompare")} icon={<MdCompareArrows />} size="sm" colorScheme="green" variant={isInCompare ? "solid" : "outline"} onClick={() => handleCompareToggle(property?._id)} />
                          </HStack>
                          <Text position="absolute" left={4} bottom={4} color="white" fontWeight="800" fontSize="2xl">
                            {formatPrice(property?.listingPrice, t)}
                          </Text>
                        </Box>
                        <Stack p={5} spacing={4}>
                          <Box>
                            <Heading size="md" noOfLines={2}>{property?.name || property?.propertyAddress}</Heading>
                            <Text mt={2} color={mutedColor} noOfLines={1}>{property?.propertyAddress || t?.("publicListing.notSpecified")}</Text>
                          </Box>
                          <Text color={mutedColor} minH="48px" noOfLines={2}>{property?.marketingDescription || property?.propertyDescription || t?.("publicListing.notSpecified")}</Text>
                          <SimpleGrid columns={3} gap={3}>
                            <Box><HStack><Icon as={LuBedDouble} /><Text fontSize="sm">{property?.numberofBedrooms || "-"}</Text></HStack></Box>
                            <Box><HStack><Icon as={LuBath} /><Text fontSize="sm">{property?.numberofBathrooms || "-"}</Text></HStack></Box>
                            <Box><HStack><Icon as={MdOutlineSquareFoot} /><Text fontSize="sm">{property?.squareFootage || "-"}</Text></HStack></Box>
                          </SimpleGrid>
                          <SimpleGrid columns={3} gap={3} color={mutedColor} fontSize="sm">
                            <Text>{getPhotoCount(property)}</Text>
                            <Text>{getDocumentCount(property)}</Text>
                            <Text>{getFloorPlanCount(property)}</Text>
                          </SimpleGrid>
                          <Button as={RouterLink} to={`/offers/${property?.publicSlug || property?._id}`} colorScheme="green" rightIcon={<MdArrowForward />}>
                            {t?.("publicListing.viewOffer")}
                          </Button>
                        </Stack>
                      </Box>
                    );
                  })}
                </SimpleGrid>
                <Flex justify="center" align="center" gap={3} pt={2} flexWrap="wrap">
                  <Button leftIcon={<MdKeyboardArrowLeft />} onClick={() => setPage((current) => Math.max(1, current - 1))} isDisabled={page === 1}>
                    {t?.("publicListing.previousPage")}
                  </Button>
                  <Text fontWeight="600">{t?.("publicListing.pageCounter", { page, total: pagesCount })}</Text>
                  <Button rightIcon={<MdKeyboardArrowRight />} onClick={() => setPage((current) => Math.min(pagesCount, current + 1))} isDisabled={page === pagesCount}>
                    {t?.("publicListing.nextPage")}
                  </Button>
                </Flex>
              </>
            ) : (
              <Box bg={cardBg} borderRadius="28px" p={8} borderWidth="1px" borderColor={borderColor}>
                <Stack spacing={3} align="start">
                  <Heading size="md">{t?.("publicListing.noResults")}</Heading>
                  <Text color={mutedColor}>{t?.("publicListing.noResultsText")}</Text>
                  <Button onClick={resetFilters} variant="outline">{t?.("publicListing.resetFilters")}</Button>
                </Stack>
              </Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
