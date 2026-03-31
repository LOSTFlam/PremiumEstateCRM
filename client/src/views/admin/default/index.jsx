import {
  Badge,
  Box,
  Button,
  Circle,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
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
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LuBath,
  LuBedDouble,
  LuBuilding2,
  LuCalendarClock,
  LuSearch,
  LuSparkles,
} from "react-icons/lu";
import {
  MdArrowForward,
  MdOutlineLocationOn,
  MdOutlineSquareFoot,
  MdOutlineTune,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getApi } from "services/api";
import { isRussianLocale, translateCrmText } from "i18n/crmDictionary";

const statusColorMap = {
  available: "green",
  active: "green",
  new: "teal",
  pending: "orange",
  booked: "orange",
  reserved: "yellow",
  sold: "red",
  inactive: "gray",
};

const getStatusKey = (value) =>
  ({
    available: "available",
    "доступно": "available",
    active: "active",
    "активно": "active",
    new: "new",
    "новое": "new",
    "новый": "new",
    pending: "pending",
    "в ожидании": "pending",
    booked: "booked",
    reserved: "reserved",
    "зарезервировано": "reserved",
    sold: "sold",
    "продано": "sold",
    inactive: "inactive",
  }[
    String(value ?? "")
      .toLowerCase()
      .replace(/[-_]+/g, " ")
      .trim()
  ] || "gray");

const placeholderImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%2312372a'/%3E%3Cstop offset='0.55' stop-color='%23436850'/%3E%3Cstop offset='1' stop-color='%23d7e7c3'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3Cpath d='M120 560L330 370l150 125 165-215 270 280H120Z' fill='rgba(255,255,255,0.22)'/%3E%3Ccircle cx='920' cy='180' r='72' fill='rgba(255,255,255,0.18)'/%3E%3C/svg%3E";

const formatPrice = (value, t, language) => {
  const amount = Number(String(value ?? "").replace(/[^\d.]/g, ""));

  if (!Number.isFinite(amount) || amount <= 0) {
    return t?.("modules.dashboardHome.priceOnRequest");
  }

  return new Intl.NumberFormat(
    isRussianLocale(language) ? "ru-RU" : "en-US",
    {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    },
  ).format(amount);
};

const normalizeStatus = (value, t, language) => {
  if (!value) {
    return t?.("modules.dashboardHome.statusAvailable");
  }

  const normalized = String(value)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return translateCrmText(normalized, { t, language });
};

const getPropertyType = (property, t, language) =>
  property?.propertyType
    ? translateCrmText(
        String(property.propertyType).replace(/\b\w/g, (letter) =>
          letter.toUpperCase(),
        ),
        { t, language },
      )
    : t?.("modules.dashboardHome.propertyFallback");

const getPropertyName = (property, t, language) => {
  if (property?.name) {
    return property.name;
  }

  if (property?.propertyType && property?.propertyAddress) {
    return isRussianLocale(language)
      ? `${getPropertyType(property, t, language)}: ${property.propertyAddress}`
      : `${getPropertyType(property, t, language)} in ${property.propertyAddress}`;
  }

  return property?.propertyAddress || t?.("modules.dashboardHome.untitledProperty");
};

const getShortDescription = (property, t) => {
  const text = property?.marketingDescription || property?.propertyDescription;

  if (!text) {
    return t?.("modules.dashboardHome.spotlightFallbackDescription");
  }

  return text.length > 150 ? `${text.slice(0, 147)}...` : text;
};

const getPrimaryImage = (property) => {
  if (property?.propertyPhotos?.length > 0) {
    return property.propertyPhotos[0]?.img;
  }

  if (property?.floorPlans?.length > 0) {
    return property.floorPlans[0]?.img;
  }

  return placeholderImage;
};

const getArea = (property, t, language) => {
  if (!property?.squareFootage) {
    return t?.("modules.dashboardHome.notSet");
  }

  return isRussianLocale(language)
    ? `${property.squareFootage} кв. футов`
    : `${property.squareFootage} sq ft`;
};

const toSearchableValue = (property) =>
  [
    property?.name,
    property?.propertyAddress,
    property?.propertyType,
    property?.listingStatus,
    property?.marketingDescription,
    property?.propertyDescription,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const parsePrice = (value) => Number(String(value ?? "").replace(/[^\d.]/g, "")) || 0;

const PropertyMetric = ({ icon, label, value, iconColor, valueSize = "md" }) => (
  <Box
    borderRadius="24px"
    px={{ base: 5, md: 6, lg: 7 }}
    py={{ base: 4, md: 5, lg: 6 }}
    bg="rgba(255,255,255,0.72)"
    border="1px solid rgba(18,55,42,0.08)"
    backdropFilter="blur(8px)"
    minW={0}
    w="100%"
  >
    <HStack spacing={{ base: 3, md: 4 }} align="start" wrap="wrap">
      <Circle size={{ base: "42px", md: "48px" }} bg={iconColor} color="white" flexShrink={0}>
        <Icon as={icon} boxSize={{ base: 5, md: 6 }} />
      </Circle>
      <Box flex={1} minW={0}>
        <Text 
          fontSize={{ base: "sm", md: "md", lg: "lg" }} 
          textTransform="uppercase" 
          letterSpacing="0.08em" 
          color="gray.500"
          noOfLines={2}
          lineHeight="1.3"
          sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}
        >
          {label}
        </Text>
        <Text 
          fontWeight="800" 
          fontSize={{ base: "xl", md: "2xl", lg: "3xl" }} 
          color="gray.800"
          mt={2}
          lineHeight="1.2"
          sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}
        >
          {value}
        </Text>
      </Box>
    </HStack>
  </Box>
);

export default function PropertyLandingPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user"));

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const pageBg = useColorModeValue("#f8f9fa", "#0f1419");
  const surfaceBg = useColorModeValue("white", "#1a1f2e");
  const borderColor = useColorModeValue("rgba(0,0,0,0.08)", "rgba(255,255,255,0.1)");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const heroGradient = useColorModeValue(
    "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    "linear-gradient(135deg, #1a1c2e 0%, #2d1b4e 50%, #4a1c6e 100%)",
  );
  const subtlePanel = useColorModeValue("rgba(102, 126, 234, 0.08)", "rgba(102, 126, 234, 0.12)");
  const softShadow = useColorModeValue("0 10px 40px rgba(102, 126, 234, 0.15)", "0 10px 40px rgba(0,0,0,0.4)");

  // Wide layout constants
  const wideCardPadding = { base: 6, md: 8, lg: 10 };
  const wideGap = { base: 6, md: 8, lg: 10 };
  const extraWideBorderRadius = { base: "24px", md: "32px", lg: "40px" };

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);

      try {
        const endpoint =
          user?.role === "superAdmin"
            ? "api/property/"
            : `api/property/?createBy=${user?._id}`;
        const response = await getApi(endpoint);
        console.log('Dashboard properties response:', response);
        // API returns array directly, handle different structures
        const propertiesData = Array.isArray(response?.data) 
          ? response.data 
          : Array.isArray(response) 
            ? response 
            : [];
        setProperties(propertiesData);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [user?._id, user?.role]);

  const uniqueStatuses = useMemo(
    () =>
      Array.from(
        new Set(
          properties.map((property) =>
            normalizeStatus(property?.listingStatus, t, i18n.language),
          ),
        ),
      ).filter(Boolean),
    [properties, t, i18n.language],
  );

  const uniqueTypes = useMemo(
    () =>
      Array.from(
        new Set(
          properties.map((property) =>
            getPropertyType(property, t, i18n.language),
          ),
        ),
      ).filter(Boolean),
    [properties, t, i18n.language],
  );

  const filteredProperties = useMemo(() => {
    const query = search.trim().toLowerCase();

      const list = properties.filter((property) => {
        const matchesSearch = !query || toSearchableValue(property).includes(query);
        const matchesStatus =
        statusFilter === "all" ||
        normalizeStatus(property?.listingStatus, t, i18n.language) === statusFilter;
      const matchesType =
        typeFilter === "all" ||
        getPropertyType(property, t, i18n.language) === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    return [...list].sort((left, right) => {
      if (sortBy === "price-high") {
        return parsePrice(right?.listingPrice) - parsePrice(left?.listingPrice);
      }

      if (sortBy === "price-low") {
        return parsePrice(left?.listingPrice) - parsePrice(right?.listingPrice);
      }

      return new Date(right?.createdAt || right?.updatedAt || 0) - new Date(left?.createdAt || left?.updatedAt || 0);
    });
  }, [properties, search, sortBy, statusFilter, typeFilter, t, i18n.language]);

  const featuredProperty = filteredProperties[0];
  const remainingProperties = featuredProperty ? filteredProperties.slice(1) : [];

  const availableInventory = properties.filter((property) => {
    const status = String(property?.listingStatus || "available").toLowerCase();
    return ["available", "active", "new", "доступно", "активно", "новый", "новое"].includes(status);
  }).length;

  const averagePrice = useMemo(() => {
    const values = properties.map((property) => parsePrice(property?.listingPrice)).filter(Boolean);

    if (!values.length) {
      return t?.("modules.dashboardHome.priceOnRequest");
    }

    return formatPrice(
      values.reduce((sum, current) => sum + current, 0) / values.length,
      t,
      i18n.language,
    );
  }, [properties, t, i18n.language]);

  const sortModeLabel =
    {
      latest: t?.("modules.dashboardHome.newestFirst"),
      "price-high": t?.("modules.dashboardHome.highestPrice"),
      "price-low": t?.("modules.dashboardHome.lowestPrice"),
    }[sortBy] || sortBy;

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSortBy("latest");
  };

  return (
    <Box
      minH="100vh"
      bg={pageBg}
      backgroundImage="radial-gradient(circle at top left, rgba(173,188,159,0.35), transparent 34%), radial-gradient(circle at bottom right, rgba(18,55,42,0.08), transparent 28%)"
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 6 }}
    >
      <Stack spacing={6}>
        <Card
          overflow="hidden"
          border="1px solid rgba(255,255,255,0.18)"
          bg={heroGradient}
          color="white"
          boxShadow={softShadow}
          position="relative"
        >
          <Box
            position="absolute"
            inset="0"
            backgroundImage="linear-gradient(115deg, rgba(255,255,255,0.12), transparent 40%), radial-gradient(circle at 85% 18%, rgba(255,255,255,0.18), transparent 18%)"
          />
          <Grid templateColumns={{ base: "1fr", xl: "1.2fr 0.8fr" }} gap={6} position="relative">
            <GridItem>
              <Stack spacing={5} p={{ base: 1, md: 2 }}>
                <Wrap spacing={3}>
                  <WrapItem>
                    <Badge px={4} py={1.5} borderRadius="full" bg="whiteAlpha.230" color="white">
                      {t?.("modules.dashboardHome.badgePrimary")}
                    </Badge>
                  </WrapItem>
                  <WrapItem>
                    <Badge px={4} py={1.5} borderRadius="full" bg="rgba(255,255,255,0.14)" color="whiteAlpha.900">
                      {t?.("modules.dashboardHome.badgeSecondary")}
                    </Badge>
                  </WrapItem>
                </Wrap>

                <Heading size="2xl" lineHeight="1.02" maxW="820px">
                  {t?.("modules.dashboardHome.heroTitle")}
                </Heading>
                <Text color="whiteAlpha.900" fontSize={{ base: "md", md: "lg" }} maxW="2xl">
                  {t?.("modules.dashboardHome.heroDescription")}
                </Text>

                <HStack spacing={{ base: 4, md: 5, lg: 6 }} wrap="wrap" justify="space-between" w="100%">
                  <Box 
                    flex={{ base: "1 1 100%", md: "1 1 30%", lg: "1 1 30%" }} 
                    borderRadius="30px" 
                    bg={subtlePanel} 
                    p={{ base: 5, md: 6, lg: 7 }} 
                    backdropFilter="blur(10px)" 
                    minW={0}
                  >
                    <Stat>
                      <StatLabel 
                        color="whiteAlpha.780" 
                        fontSize={{ base: "md", md: "lg", lg: "xl" }}
                        noOfLines={2}
                        lineHeight="1.3"
                        sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}
                      >
                        {t?.("modules.dashboardHome.totalInventory")}
                      </StatLabel>
                      <StatNumber fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>{properties.length}</StatNumber>
                      <StatHelpText 
                        color="whiteAlpha.780" 
                        fontSize={{ base: "sm", md: "md" }}
                        noOfLines={2}
                        lineHeight="1.4"
                        sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}
                      >
                        {t?.("modules.dashboardHome.totalInventoryHelp")}
                      </StatHelpText>
                    </Stat>
                  </Box>
                  <Box 
                    flex={{ base: "1 1 100%", md: "1 1 30%", lg: "1 1 30%" }} 
                    borderRadius="30px" 
                    bg={subtlePanel} 
                    p={{ base: 5, md: 6, lg: 7 }} 
                    backdropFilter="blur(10px)" 
                    minW={0}
                  >
                    <Stat>
                      <StatLabel 
                        color="whiteAlpha.780" 
                        fontSize={{ base: "md", md: "lg", lg: "xl" }}
                        noOfLines={2}
                        lineHeight="1.3"
                        sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}
                      >
                        {t?.("modules.dashboardHome.openInventory")}
                      </StatLabel>
                      <StatNumber fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>{availableInventory}</StatNumber>
                      <StatHelpText 
                        color="whiteAlpha.780" 
                        fontSize={{ base: "sm", md: "md" }}
                        noOfLines={2}
                        lineHeight="1.4"
                        sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}
                      >
                        {t?.("modules.dashboardHome.openInventoryHelp")}
                      </StatHelpText>
                    </Stat>
                  </Box>
                  <Box 
                    flex={{ base: "1 1 100%", md: "1 1 30%", lg: "1 1 30%" }} 
                    borderRadius="30px" 
                    bg={subtlePanel} 
                    p={{ base: 5, md: 6, lg: 7 }} 
                    backdropFilter="blur(10px)" 
                    minW={0}
                  >
                    <Stat>
                      <StatLabel 
                        color="whiteAlpha.780" 
                        fontSize={{ base: "md", md: "lg", lg: "xl" }}
                        noOfLines={2}
                        lineHeight="1.3"
                        sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}
                      >
                        {t?.("modules.dashboardHome.averagePrice")}
                      </StatLabel>
                      <StatNumber fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}>{averagePrice}</StatNumber>
                      <StatHelpText 
                        color="whiteAlpha.780" 
                        fontSize={{ base: "sm", md: "md" }}
                        noOfLines={2}
                        lineHeight="1.4"
                        sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}
                      >
                        {t?.("modules.dashboardHome.averagePriceHelp")}
                      </StatHelpText>
                    </Stat>
                  </Box>
                </HStack>
              </Stack>
            </GridItem>

            <GridItem>
              <Card
                bg="rgba(255,255,255,0.94)"
                color="gray.900"
                borderRadius="30px"
                boxShadow="0 20px 60px rgba(0,0,0,0.16)"
              >
                <Stack spacing={4}>
                  <Flex justify="space-between" align="center">
                    <Heading size="md">{t?.("modules.dashboardHome.findInventory")}</Heading>
                    <Circle size="42px" bg="green.50" color="green.700">
                      <Icon as={MdOutlineTune} boxSize={5} />
                    </Circle>
                  </Flex>

                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={LuSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder={t?.("modules.dashboardHome.searchPlaceholder")}
                      bg="white"
                      borderRadius="18px"
                    />
                  </InputGroup>

                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                    <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} borderRadius="18px">
                      <option value="all">{t?.("modules.dashboardHome.allStatuses")}</option>
                      {uniqueStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Select>
                    <Select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} borderRadius="18px">
                      <option value="all">{t?.("modules.dashboardHome.allTypes")}</option>
                      {uniqueTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>
                  </SimpleGrid>

                  <Select value={sortBy} onChange={(event) => setSortBy(event.target.value)} borderRadius="18px">
                    <option value="latest">{t?.("modules.dashboardHome.newestFirst")}</option>
                    <option value="price-high">{t?.("modules.dashboardHome.highestPrice")}</option>
                    <option value="price-low">{t?.("modules.dashboardHome.lowestPrice")}</option>
                  </Select>

                  <HStack spacing={3} w="100%">
                    <Button 
                      flex={1} 
                      colorScheme="green" 
                      borderRadius="18px" 
                      onClick={() => navigate("/properties")}
                      h="48px"
                      fontSize="md"
                    >
                      {t?.("modules.dashboardHome.fullTable")}
                    </Button>
                    <Button 
                      flex={1} 
                      variant="outline" 
                      borderRadius="18px" 
                      onClick={resetFilters}
                      h="48px"
                      fontSize="md"
                    >
                      {t?.("common.reset")}
                    </Button>
                  </HStack>
                </Stack>
              </Card>
            </GridItem>
          </Grid>
        </Card>

        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={{ base: 4, md: 5, lg: 6 }}>
          <PropertyMetric 
            icon={LuBuilding2} 
            label={t?.("modules.dashboardHome.filteredResults")} 
            value={filteredProperties.length} 
            iconColor="green.500" 
            valueSize="lg"
          />
          <PropertyMetric 
            icon={MdOutlineLocationOn} 
            label={t?.("modules.dashboardHome.propertyTypes")} 
            value={uniqueTypes.length || 0} 
            iconColor="teal.500"
            valueSize="lg"
          />
          <PropertyMetric 
            icon={LuSparkles} 
            label={t?.("modules.dashboardHome.statusesUsed")} 
            value={uniqueStatuses.length || 0} 
            iconColor="orange.400"
            valueSize="lg"
          />
          <PropertyMetric 
            icon={LuCalendarClock} 
            label={t?.("modules.dashboardHome.sortMode")} 
            value={sortModeLabel} 
            iconColor="gray.700" 
            valueSize="sm"
          />
        </SimpleGrid>

        <Flex justify="space-between" align={{ base: "start", md: "end" }} direction={{ base: "column", md: "row" }} gap={3}>
          <Box>
            <Heading size="lg">{t?.("modules.dashboardHome.curatedTitle")}</Heading>
            <Text color={mutedText} mt={1}>
              {t?.("modules.dashboardHome.curatedDescription")}
            </Text>
          </Box>
          <Wrap spacing={2}>
            {uniqueStatuses.slice(0, 6).map((status) => (
              <WrapItem key={status}>
                <Badge borderRadius="full" px={3} py={1.5} colorScheme={statusColorMap[getStatusKey(status)] || "gray"}>
                  {status}
                </Badge>
              </WrapItem>
            ))}
          </Wrap>
        </Flex>

        {isLoading ? (
          <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
            <Card p={0} overflow="hidden">
              <Skeleton h="420px" />
            </Card>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} p={0} overflow="hidden">
                  <Skeleton h="290px" />
                </Card>
              ))}
            </SimpleGrid>
          </SimpleGrid>
        ) : filteredProperties.length > 0 ? (
          <Stack spacing={5}>
            {featuredProperty && (
              <Card p={0} overflow="hidden" bg={surfaceBg} border={`1px solid ${borderColor}`} backdropFilter="blur(10px)">
                <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={0}>
                  <GridItem position="relative" minH={{ base: "280px", xl: "100%" }}>
                    <Image
                      src={getPrimaryImage(featuredProperty)}
                      alt={getPropertyName(featuredProperty, t, i18n.language)}
                      h="100%"
                      w="100%"
                      minH={{ base: "280px", xl: "100%" }}
                      objectFit="cover"
                    />
                    <Box
                      position="absolute"
                      inset="0"
                      bg="linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.56))"
                    />
                    <Wrap position="absolute" top={5} left={5} spacing={3}>
                      <WrapItem>
                        <Badge colorScheme={statusColorMap[getStatusKey(featuredProperty?.listingStatus)] || "gray"} px={4} py={2} borderRadius="full" fontSize="sm">
                          {normalizeStatus(featuredProperty?.listingStatus, t, i18n.language)}
                        </Badge>
                      </WrapItem>
                      <WrapItem>
                        <Badge bg="blackAlpha.600" color="white" px={4} py={2} borderRadius="full" fontSize="sm">
                          {getPropertyType(featuredProperty, t, i18n.language)}
                        </Badge>
                      </WrapItem>
                    </Wrap>
                    <Box position="absolute" left={5} right={5} bottom={5} color="white">
                      <Text fontSize="xs" letterSpacing="0.16em" textTransform="uppercase" mb={2}>
                        {t?.("modules.dashboardHome.spotlight")}
                      </Text>
                      <Heading size="lg" mb={2} noOfLines={2} sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                        {getPropertyName(featuredProperty, t, i18n.language)}
                      </Heading>
                      <Text color="whiteAlpha.880" noOfLines={2} sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                        {featuredProperty?.propertyAddress || t?.("modules.dashboardHome.addressNotSpecified")}
                      </Text>
                    </Box>
                  </GridItem>

                  <GridItem>
                    <Stack spacing={6} p={{ base: 6, md: 8, lg: 10 }}>
                      <Flex justify="space-between" align="start" gap={4}>
                        <Box>
                          <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.16em" color="gray.500" mb={2}>
                            {t?.("modules.dashboardHome.flagship")}
                          </Text>
                          <Heading size="xl" color="gray.800">
                            {formatPrice(featuredProperty?.listingPrice, t, i18n.language)}
                          </Heading>
                        </Box>
                        <Circle size="52px" bg="green.50" color="green.700">
                          <Icon as={LuSparkles} boxSize={6} />
                        </Circle>
                      </Flex>

                      <Text color={mutedText} fontSize="md">
                        {getShortDescription(featuredProperty, t)}
                      </Text>

                      <HStack spacing={{ base: 2, md: 3, lg: 4 }} wrap="wrap" justify="space-between" w="100%">
                        <HStack
                          flex={{ base: "1 1 28%", md: "1 1 auto" }}
                          spacing={3}
                          p={3}
                          borderRadius="16px"
                          bg="rgba(255,255,255,0.6)"
                          border="1px solid rgba(0,0,0,0.05)"
                        >
                          <Circle size="36px" bg="green.500" color="white" flexShrink={0}>
                            <Icon as={LuBedDouble} boxSize={4} />
                          </Circle>
                          <Box minW={0}>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.08em" noOfLines={1}>
                              {t?.("modules.dashboardHome.bedrooms")}
                            </Text>
                            <Text fontWeight="700" color="gray.800" fontSize="lg">
                              {featuredProperty?.numberofBedrooms || "-"}
                            </Text>
                          </Box>
                        </HStack>

                        <HStack
                          flex={{ base: "1 1 28%", md: "1 1 auto" }}
                          spacing={3}
                          p={3}
                          borderRadius="16px"
                          bg="rgba(255,255,255,0.6)"
                          border="1px solid rgba(0,0,0,0.05)"
                        >
                          <Circle size="36px" bg="teal.500" color="white" flexShrink={0}>
                            <Icon as={LuBath} boxSize={4} />
                          </Circle>
                          <Box minW={0}>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.08em" noOfLines={1}>
                              {t?.("modules.dashboardHome.bathrooms")}
                            </Text>
                            <Text fontWeight="700" color="gray.800" fontSize="lg">
                              {featuredProperty?.numberofBathrooms || "-"}
                            </Text>
                          </Box>
                        </HStack>

                        <HStack
                          flex={{ base: "1 1 28%", md: "1 1 auto" }}
                          spacing={4}
                          p={3}
                          borderRadius="16px"
                          bg="rgba(255,255,255,0.6)"
                          border="1px solid rgba(0,0,0,0.08)"
                          boxShadow="0 4px 12px rgba(0,0,0,0.08)"
                        >
                          <Circle size="36px" bg="orange.400" color="white" flexShrink={0}>
                            <Icon as={MdOutlineSquareFoot} boxSize={4} />
                          </Circle>
                          <Box minW={0}>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.08em" noOfLines={1}>
                              {t?.("modules.dashboardHome.area")}
                            </Text>
                            <Text fontWeight="700" color="gray.800" fontSize="lg" noOfLines={1}>
                              {getArea(featuredProperty, t, i18n.language)}
                            </Text>
                          </Box>
                        </HStack>
                      </HStack>

                      <Divider />

                      <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                        <Box>
                          <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="gray.500">
                            {t?.("modules.dashboardHome.propertyType")}
                          </Text>
                          <Text fontWeight="700" color="gray.800">
                            {getPropertyType(featuredProperty, t, i18n.language)}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="gray.500">
                            {t?.("modules.dashboardHome.currentStatus")}
                          </Text>
                          <Text fontWeight="700" color="gray.800">
                            {normalizeStatus(featuredProperty?.listingStatus, t, i18n.language)}
                          </Text>
                        </Box>
                      </SimpleGrid>

                      <Flex justify="space-between" align={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} gap={3}>
                        <Text color={mutedText}>
                          {t?.("modules.dashboardHome.crmDescription")}
                        </Text>
                        <Button
                          colorScheme="green"
                          rightIcon={<MdArrowForward />}
                          borderRadius="18px"
                          onClick={() => navigate(`/propertyView/${featuredProperty?._id}`)}
                        >
                          {t?.("common.viewDetails")}
                        </Button>
                      </Flex>
                    </Stack>
                  </GridItem>
                </Grid>
              </Card>
            )}

            {remainingProperties.length > 0 && (
              <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={5}>
                {remainingProperties.map((property) => {
                  const statusLabel = normalizeStatus(property?.listingStatus, t, i18n.language);
                  const statusColor = statusColorMap[getStatusKey(property?.listingStatus)] || "gray";

                  return (
                    <Card
                      key={property?._id}
                      p={0}
                      overflow="hidden"
                      bg={surfaceBg}
                      border={`1px solid ${borderColor}`}
                      backdropFilter="blur(10px)"
                      transition="transform 0.2s ease, box-shadow 0.2s ease"
                      _hover={{ transform: "translateY(-4px)", boxShadow: "0 20px 60px rgba(15,47,36,0.12)" }}
                    >
                      <Box position="relative">
                        <Image src={getPrimaryImage(property)} alt={getPropertyName(property, t, i18n.language)} h="236px" w="100%" objectFit="cover" />
                        <Box position="absolute" inset="0" bg="linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.42))" />
                        <Wrap position="absolute" top={4} left={4} spacing={2}>
                          <WrapItem>
                            <Badge colorScheme={statusColor} px={3} py={1} borderRadius="full">
                              {statusLabel}
                            </Badge>
                          </WrapItem>
                          <WrapItem>
                            <Badge bg="blackAlpha.650" color="white" px={3} py={1} borderRadius="full">
                              {getPropertyType(property, t, i18n.language)}
                            </Badge>
                          </WrapItem>
                        </Wrap>
                        <Text position="absolute" left={4} bottom={4} color="white" fontWeight="800" fontSize="xl">
                          {formatPrice(property?.listingPrice, t, i18n.language)}
                        </Text>
                      </Box>

                      <Stack spacing={4} p={5}>
                        <Box>
                          <Heading size="md" noOfLines={2} color="gray.800">
                            {getPropertyName(property, t, i18n.language)}
                          </Heading>
                          <Text color={mutedText} mt={2} noOfLines={1}>
                            {property?.propertyAddress || t?.("modules.dashboardHome.addressNotSpecified")}
                          </Text>
                        </Box>

                        <Text color={mutedText} fontSize="sm" minH="60px">
                          {getShortDescription(property, t)}
                        </Text>

                        <HStack spacing={2} wrap="wrap" justify="space-between">
                          <HStack 
                            flex={{ base: "1 1 30%", md: "1 1 auto" }} 
                            spacing={2} 
                            p={2.5} 
                            borderRadius="14px" 
                            bg="rgba(255,255,255,0.6)"
                            border="1px solid rgba(0,0,0,0.05)"
                          >
                            <Circle size="32px" bg="green.500" color="white" flexShrink={0}>
                              <Icon as={LuBedDouble} boxSize={3.5} />
                            </Circle>
                            <Box minW={0}>
                              <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.08em" noOfLines={1}>
                                {t?.("modules.dashboardHome.beds")}
                              </Text>
                              <Text fontWeight="700" color="gray.800" fontSize="md">
                                {property?.numberofBedrooms || "-"}
                              </Text>
                            </Box>
                          </HStack>
                          
                          <HStack 
                            flex={{ base: "1 1 30%", md: "1 1 auto" }} 
                            spacing={2} 
                            p={2.5} 
                            borderRadius="14px" 
                            bg="rgba(255,255,255,0.6)"
                            border="1px solid rgba(0,0,0,0.05)"
                          >
                            <Circle size="32px" bg="teal.500" color="white" flexShrink={0}>
                              <Icon as={LuBath} boxSize={3.5} />
                            </Circle>
                            <Box minW={0}>
                              <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.08em" noOfLines={1}>
                                {t?.("modules.dashboardHome.baths")}
                              </Text>
                              <Text fontWeight="700" color="gray.800" fontSize="md">
                                {property?.numberofBathrooms || "-"}
                              </Text>
                            </Box>
                          </HStack>
                          
                          <HStack 
                            flex={{ base: "1 1 30%", md: "1 1 auto" }} 
                            spacing={2} 
                            p={2.5} 
                            borderRadius="14px" 
                            bg="rgba(255,255,255,0.6)"
                            border="1px solid rgba(0,0,0,0.05)"
                          >
                            <Circle size="32px" bg="orange.400" color="white" flexShrink={0}>
                              <Icon as={MdOutlineSquareFoot} boxSize={3.5} />
                            </Circle>
                            <Box minW={0}>
                              <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.08em" noOfLines={1}>
                                {t?.("modules.dashboardHome.area")}
                              </Text>
                              <Text fontWeight="700" color="gray.800" fontSize="md" noOfLines={1}>
                                {getArea(property, t, i18n.language)}
                              </Text>
                            </Box>
                          </HStack>
                        </HStack>

                        <Button
                          size="sm"
                          borderRadius="18px"
                          colorScheme="green"
                          rightIcon={<MdArrowForward />}
                          onClick={() => navigate(`/propertyView/${property?._id}`)}
                        >
                          {t?.("modules.dashboardHome.openProperty")}
                        </Button>
                      </Stack>
                    </Card>
                  );
                })}
              </SimpleGrid>
            )}
          </Stack>
        ) : (
          <Card bg={surfaceBg} border={`1px solid ${borderColor}`}>
            <Stack spacing={3} align="start">
              <Heading size="md">{t?.("modules.dashboardHome.noPropertiesTitle")}</Heading>
              <Text color={mutedText}>
                {t?.("modules.dashboardHome.noPropertiesDescription")}
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                <Button colorScheme="green" onClick={() => navigate("/properties")}>
                  {t?.("modules.dashboardHome.fullTable")}
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  {t?.("common.reset")}
                </Button>
              </SimpleGrid>
            </Stack>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
