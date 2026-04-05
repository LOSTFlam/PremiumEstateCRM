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
const getStatusKey = (value) =>
  ({
    available: "available",
    доступно: "available",
    active: "active",
    активно: "active",
    new: "new",
    новое: "new",
    новый: "new",
    pending: "pending",
    "в ожидании": "pending",
    booked: "booked",
    reserved: "reserved",
    зарезервировано: "reserved",
    sold: "sold",
    продано: "sold",
    inactive: "inactive",
  })[
    String(value ?? "")
      .toLowerCase()
      .replace(/[-_]+/g, " ")
      .trim()
  ] || "gray";

const placeholderImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%2312372a'/%3E%3Cstop offset='0.55' stop-color='%23436850'/%3E%3Cstop offset='1' stop-color='%23d7e7c3'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3Cpath d='M120 560L330 370l150 125 165-215 270 280H120Z' fill='rgba(255,255,255,0.22)'/%3E%3Ccircle cx='920' cy='180' r='72' fill='rgba(255,255,255,0.18)'/%3E%3C/svg%3E";

const formatPrice = (value, t) => {
  const amount = Number(String(value ?? "").replace(/[^\d.]/g, ""));

  if (!Number.isFinite(amount) || amount <= 0) {
    return t?.("modules.dashboardHome.priceOnRequest");
  }

  return new Intl.NumberFormat(isRussianLocale(language) ? "ru-RU" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const normalizeStatus = (value, t) => {
  if (!value) {
    return t?.("modules.dashboardHome.statusAvailable");
  }

  return String(value)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getPropertyType = (property, t) =>
  property?.propertyType || t?.("modules.dashboardHome.propertyFallback");

const getPropertyName = (property, t) => {
  if (property?.name) {
    return property.name;
  }

  if (property?.propertyType && property?.propertyAddress) {
    return `${property.propertyType} in ${property.propertyAddress}`;
  }

  return (
    property?.propertyAddress || t?.("modules.dashboardHome.untitledProperty")
  );
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

const getArea = (property, t) => {
  if (!property?.squareFootage) {
    return t?.("modules.dashboardHome.notSet");
  }

  return `${property.squareFootage} sq ft`;
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

const parsePrice = (value) =>
  Number(String(value ?? "").replace(/[^\d.]/g, "")) || 0;

const parseStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Unable to parse stored user", error);
    return null;
  }
};

const buildPropertyFacts = (property, t, language) => [
  {
    key: "bedrooms",
    label: t?.("modules.dashboardHome.bedrooms"),
    shortLabel: t?.("modules.dashboardHome.beds"),
    value: property?.numberofBedrooms || "-",
    icon: LuBedDouble,
    color: "green.500",
  },
  {
    key: "bathrooms",
    label: t?.("modules.dashboardHome.bathrooms"),
    shortLabel: t?.("modules.dashboardHome.baths"),
    value: property?.numberofBathrooms || "-",
    icon: LuBath,
    color: "teal.500",
  },
  {
    key: "area",
    label: t?.("modules.dashboardHome.area"),
    shortLabel: t?.("modules.dashboardHome.area"),
    value: getArea(property, t, language),
    icon: MdOutlineSquareFoot,
    color: "orange.400",
  },
];

const HeroStatCard = ({ label, value, help, bg }) => (
  <Box
    borderRadius="30px"
    bg={bg}
    p={{ base: 5, md: 6, xl: 7 }}
    backdropFilter="blur(12px)"
    minW={0}
  >
    <Stat>
      <StatLabel
        color="whiteAlpha.780"
        fontSize={{ base: "md", md: "lg" }}
        lineHeight="1.35"
        sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}
      >
        {label}
      </StatLabel>
      <StatNumber
        mt={2}
        fontSize={{ base: "3xl", md: "4xl", xl: "5xl" }}
        sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}
      >
        {value}
      </StatNumber>
      <StatHelpText
        color="whiteAlpha.760"
        fontSize={{ base: "sm", md: "md" }}
        lineHeight="1.5"
        sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}
      >
        {help}
      </StatHelpText>
    </Stat>
  </Box>
);

const PropertyMetric = ({ icon, label, value, iconColor }) => (
  <Box
    borderRadius="26px"
    px={{ base: 5, md: 6, lg: 7 }}
    py={{ base: 5, md: 6 }}
    bg="rgba(255,255,255,0.78)"
    border="1px solid rgba(18,55,42,0.08)"
    backdropFilter="blur(8px)"
  >
    <HStack spacing={{ base: 3, md: 4 }} align="start" wrap="wrap">
      <Circle
        size={{ base: "44px", md: "50px" }}
        bg={iconColor}
        color="white"
        flexShrink={0}
      >
        <Icon as={icon} boxSize={{ base: 5, md: 6 }} />
      </Circle>
      <Box flex={1} minW={0}>
        <Text
          fontSize={{ base: "sm", md: "md" }}
          textTransform="uppercase"
          letterSpacing="0.08em"
          color="gray.500"
          lineHeight="1.35"
          sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}
        >
          {label}
        </Text>
        <Text
          fontWeight="800"
          fontSize={{ base: "xl", md: "2xl", xl: "3xl" }}
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

const PropertyFactPill = ({ fact, compact = false }) => (
  <HStack
    spacing={compact ? 2.5 : 3}
    p={compact ? 3 : 4}
    borderRadius={compact ? "18px" : "20px"}
    bg="rgba(255,255,255,0.6)"
    border="1px solid rgba(0,0,0,0.05)"
    align="start"
  >
    <Circle
      size={compact ? "34px" : "40px"}
      bg={fact.color}
      color="white"
      flexShrink={0}
    >
      <Icon as={fact.icon} boxSize={compact ? 3.5 : 4} />
    </Circle>
    <Box minW={0}>
      <Text
        fontSize="xs"
        color="gray.500"
        textTransform="uppercase"
        letterSpacing="0.08em"
        noOfLines={1}
      >
        {compact ? fact.shortLabel : fact.label}
      </Text>
      <Text
        fontWeight="700"
        color="gray.800"
        fontSize={compact ? "md" : "lg"}
        noOfLines={1}
      >
        {fact.value}
      </Text>
    </Box>
  </HStack>
);

const FilterChip = ({ label }) => (
  <Badge
    px={3.5}
    py={1.5}
    borderRadius="full"
    bg="rgba(18,55,42,0.08)"
    color="#12372a"
    border="1px solid rgba(18,55,42,0.12)"
    fontWeight="600"
  >
    {label}
  </Badge>
);

export default function PropertyLandingPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const user = useMemo(() => parseStoredUser(), []);

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const pageBg = useColorModeValue("#eef2ec", "#0f1419");
  const surfaceBg = useColorModeValue("rgba(255,255,255,0.92)", "#1a1f2e");
  const borderColor = useColorModeValue(
    "rgba(18,55,42,0.08)",
    "rgba(255,255,255,0.1)",
  );
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const heroGradient = useColorModeValue(
    "linear-gradient(140deg, #12372a 0%, #2c5f47 42%, #b97737 100%)",
    "linear-gradient(140deg, #0f1714 0%, #163128 44%, #3a2a19 100%)",
  );
  const subtlePanel = useColorModeValue(
    "rgba(255,255,255,0.12)",
    "rgba(255,255,255,0.08)",
  );
  const softShadow = useColorModeValue(
    "0 24px 80px rgba(18,55,42,0.16)",
    "0 18px 60px rgba(0,0,0,0.42)",
  );

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);

      try {
        const endpoint =
          user?.role === "superAdmin"
            ? "api/property/"
            : `api/property/?createBy=${user?._id}`;
        const response = await getApi(endpoint);
        const propertiesData = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching properties:", error);
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
    [i18n.language, properties, t],
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
    [i18n.language, properties, t],
  );

  const filteredProperties = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = properties.filter((property) => {
      const matchesSearch =
        !query || toSearchableValue(property).includes(query);
      const matchesStatus =
        statusFilter === "all" ||
        normalizeStatus(property?.listingStatus, t, i18n.language) ===
          statusFilter;
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

      return (
        new Date(right?.createdAt || right?.updatedAt || 0) -
        new Date(left?.createdAt || left?.updatedAt || 0)
      );
    });
  }, [i18n.language, properties, search, sortBy, statusFilter, t, typeFilter]);

  const featuredProperty = filteredProperties[0];
  const remainingProperties = featuredProperty
    ? filteredProperties.slice(1)
    : [];

  const availableInventory = useMemo(
    () =>
      properties.filter((property) => {
        const status = String(
          property?.listingStatus || "available",
        ).toLowerCase();
        return [
          "available",
          "active",
          "new",
          "доступно",
          "активно",
          "новый",
          "новое",
        ].includes(status);
      }).length,
    [properties],
  );

  const averagePrice = useMemo(() => {
    const values = properties
      .map((property) => parsePrice(property?.listingPrice))
      .filter(Boolean);

    if (!values.length) {
      return t?.("modules.dashboardHome.priceOnRequest");
    }

    return formatPrice(
      values.reduce((sum, current) => sum + current, 0) / values.length,
      t,
      i18n.language,
    );
  }, [i18n.language, properties, t]);

  const sortModeLabel =
    {
      latest: t?.("modules.dashboardHome.newestFirst"),
      "price-high": t?.("modules.dashboardHome.highestPrice"),
      "price-low": t?.("modules.dashboardHome.lowestPrice"),
    }[sortBy] || sortBy;

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (search.trim()) {
      chips.push(search.trim());
    }
    if (statusFilter !== "all") {
      chips.push(statusFilter);
    }
    if (typeFilter !== "all") {
      chips.push(typeFilter);
    }
    if (sortBy !== "latest") {
      chips.push(sortModeLabel);
    }

    return chips;
  }, [search, sortBy, sortModeLabel, statusFilter, typeFilter]);

  const selectionSummary = useMemo(() => {
    if (search.trim()) {
      return isRussianLocale(i18n.language)
        ? `По текущему запросу найдено ${filteredProperties.length} объектов.`
        : `${filteredProperties.length} properties match the current query.`;
    }

    return isRussianLocale(i18n.language)
      ? "Фильтры ниже помогают быстро собрать спокойную, чистую витрину по нужному спросу."
      : "Use the filters below to build a calmer, cleaner shortlist around the right demand segment.";
  }, [filteredProperties.length, i18n.language, search]);

  const heroStats = useMemo(
    () => [
      {
        key: "inventory",
        label: t?.("modules.dashboardHome.totalInventory"),
        value: properties.length,
        help: t?.("modules.dashboardHome.totalInventoryHelp"),
      },
      {
        key: "available",
        label: t?.("modules.dashboardHome.openInventory"),
        value: availableInventory,
        help: t?.("modules.dashboardHome.openInventoryHelp"),
      },
      {
        key: "price",
        label: t?.("modules.dashboardHome.averagePrice"),
        value: averagePrice,
        help: t?.("modules.dashboardHome.averagePriceHelp"),
      },
    ],
    [availableInventory, averagePrice, properties.length, t],
  );

  const overviewMetrics = useMemo(
    () => [
      {
        key: "filtered",
        icon: LuBuilding2,
        label: t?.("modules.dashboardHome.filteredResults"),
        value: filteredProperties.length,
        iconColor: "green.500",
      },
      {
        key: "types",
        icon: MdOutlineLocationOn,
        label: t?.("modules.dashboardHome.propertyTypes"),
        value: uniqueTypes.length || 0,
        iconColor: "teal.500",
      },
      {
        key: "statuses",
        icon: LuSparkles,
        label: t?.("modules.dashboardHome.statusesUsed"),
        value: uniqueStatuses.length || 0,
        iconColor: "orange.400",
      },
      {
        key: "sort",
        icon: LuCalendarClock,
        label: t?.("modules.dashboardHome.sortMode"),
        value: sortModeLabel,
        iconColor: "gray.700",
      },
    ],
    [
      filteredProperties.length,
      sortModeLabel,
      t,
      uniqueStatuses.length,
      uniqueTypes.length,
    ],
  );

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
      backgroundImage="radial-gradient(circle at top left, rgba(173,188,159,0.28), transparent 34%), radial-gradient(circle at bottom right, rgba(18,55,42,0.10), transparent 30%)"
      px={{ base: 4, md: 6, xl: 8, "2xl": 10 }}
      py={{ base: 4, md: 6, xl: 8 }}
    >
      <Box maxW={PAGE_MAX_W} mx="auto">
        <Stack spacing={{ base: 6, xl: 8 }}>
          <Card
            overflow="hidden"
            border="1px solid rgba(255,255,255,0.16)"
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
            <Stack
              spacing={{ base: 6, xl: 8 }}
              p={{ base: 6, md: 8, xl: 10 }}
              position="relative"
            >
              <Wrap spacing={3}>
                <WrapItem>
                  <Badge
                    px={4}
                    py={1.5}
                    borderRadius="full"
                    bg="whiteAlpha.230"
                    color="white"
                  >
                    {t?.("modules.dashboardHome.badgePrimary")}
                  </Badge>
                </WrapItem>
                <WrapItem>
                  <Badge
                    px={4}
                    py={1.5}
                    borderRadius="full"
                    bg="rgba(255,255,255,0.14)"
                    color="whiteAlpha.900"
                  >
                    {t?.("modules.dashboardHome.badgeSecondary")}
                  </Badge>
                </WrapItem>
              </Wrap>

              <Grid
                templateColumns={{
                  base: "1fr",
                  xl: "minmax(0, 1.08fr) minmax(320px, 0.92fr)",
                  "2xl": "minmax(0, 1.14fr) minmax(380px, 0.86fr)",
                }}
                gap={8}
                alignItems="end"
              >
                <GridItem>
                  <Stack spacing={5} maxW="920px">
                    <Heading size="2xl" lineHeight="1.02">
                      {t?.("modules.dashboardHome.heroTitle")}
                    </Heading>
                    <Text
                      color="whiteAlpha.900"
                      fontSize={{ base: "md", md: "lg" }}
                      maxW="3xl"
                      lineHeight="1.9"
                    >
                      {t?.("modules.dashboardHome.heroDescription")}
                    </Text>
                  </Stack>
                </GridItem>

                <GridItem>
                  <Box
                    borderRadius="32px"
                    bg={subtlePanel}
                    p={{ base: 5, md: 6 }}
                    backdropFilter="blur(12px)"
                  >
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      letterSpacing="0.16em"
                      color="whiteAlpha.760"
                    >
                      {t?.("modules.dashboardHome.findInventory")}
                    </Text>
                    <Heading mt={3} size="lg">
                      {filteredProperties.length}
                    </Heading>
                    <Text mt={2} color="whiteAlpha.860" lineHeight="1.8">
                      {selectionSummary}
                    </Text>
                    <Wrap mt={4} spacing={2.5}>
                      {activeFilterChips.length ? (
                        activeFilterChips.map((item) => (
                          <Badge
                            key={item}
                            px={3.5}
                            py={1.5}
                            borderRadius="full"
                            bg="rgba(255,255,255,0.12)"
                            color="white"
                            border="1px solid rgba(255,255,255,0.18)"
                          >
                            {item}
                          </Badge>
                        ))
                      ) : (
                        <Badge
                          px={3.5}
                          py={1.5}
                          borderRadius="full"
                          bg="rgba(255,255,255,0.12)"
                          color="white"
                          border="1px solid rgba(255,255,255,0.18)"
                        >
                          {sortModeLabel}
                        </Badge>
                      )}
                    </Wrap>
                  </Box>
                </GridItem>
              </Grid>

              <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
                {heroStats.map((item) => (
                  <HeroStatCard
                    key={item.key}
                    label={item.label}
                    value={item.value}
                    help={item.help}
                    bg={subtlePanel}
                  />
                ))}
              </SimpleGrid>
            </Stack>
          </Card>

          <Card
            bg={surfaceBg}
            border={`1px solid ${borderColor}`}
            boxShadow={softShadow}
          >
            <Grid
              templateColumns={{
                base: "1fr",
                xl: "minmax(280px, 0.38fr) minmax(0, 0.62fr)",
                "2xl": "minmax(320px, 0.34fr) minmax(0, 0.66fr)",
              }}
              gap={6}
              p={{ base: 6, md: 7, xl: 8 }}
            >
              <GridItem>
                <Stack spacing={4}>
                  <HStack spacing={4} align="start">
                    <Circle
                      size="48px"
                      bg="green.50"
                      color="green.700"
                      flexShrink={0}
                    >
                      <Icon as={MdOutlineTune} boxSize={5} />
                    </Circle>
                    <Box>
                      <Text
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="0.16em"
                        color="green.700"
                      >
                        {t?.("modules.dashboardHome.findInventory")}
                      </Text>
                      <Heading mt={1} size="lg">
                        {t?.("modules.dashboardHome.curatedTitle")}
                      </Heading>
                    </Box>
                  </HStack>
                  <Text color={mutedText} lineHeight="1.8">
                    {t?.("modules.dashboardHome.curatedDescription")}
                  </Text>
                  <Wrap spacing={2.5}>
                    {activeFilterChips.length ? (
                      activeFilterChips.map((item) => (
                        <FilterChip key={item} label={item} />
                      ))
                    ) : (
                      <FilterChip
                        label={t?.("modules.dashboardHome.newestFirst")}
                      />
                    )}
                  </Wrap>
                </Stack>
              </GridItem>

              <GridItem>
                <Stack spacing={4}>
                  <Grid
                    templateColumns={{
                      base: "1fr",
                      md: "repeat(2, minmax(0, 1fr))",
                      xl: "minmax(0, 1.2fr) repeat(3, minmax(0, 0.86fr))",
                    }}
                    gap={4}
                  >
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none">
                        <Icon as={LuSearch} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={t?.(
                          "modules.dashboardHome.searchPlaceholder",
                        )}
                        bg="white"
                        borderRadius="18px"
                      />
                    </InputGroup>

                    <Select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                      borderRadius="18px"
                    >
                      <option value="all">
                        {t?.("modules.dashboardHome.allStatuses")}
                      </option>
                      {uniqueStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Select>

                    <Select
                      value={typeFilter}
                      onChange={(event) => setTypeFilter(event.target.value)}
                      borderRadius="18px"
                    >
                      <option value="all">
                        {t?.("modules.dashboardHome.allTypes")}
                      </option>
                      {uniqueTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>

                    <Select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      borderRadius="18px"
                    >
                      <option value="latest">
                        {t?.("modules.dashboardHome.newestFirst")}
                      </option>
                      <option value="price-high">
                        {t?.("modules.dashboardHome.highestPrice")}
                      </option>
                      <option value="price-low">
                        {t?.("modules.dashboardHome.lowestPrice")}
                      </option>
                    </Select>
                  </Grid>

                  <Flex
                    justify="space-between"
                    align={{ base: "stretch", md: "center" }}
                    direction={{ base: "column", md: "row" }}
                    gap={3}
                  >
                    <HStack spacing={3} w={{ base: "100%", md: "auto" }}>
                      <Button
                        flex={{ base: 1, md: "unset" }}
                        colorScheme="green"
                        borderRadius="18px"
                        onClick={() => navigate("/properties")}
                        h="48px"
                        px={6}
                      >
                        {t?.("modules.dashboardHome.fullTable")}
                      </Button>
                      <Button
                        flex={{ base: 1, md: "unset" }}
                        variant="outline"
                        borderRadius="18px"
                        onClick={resetFilters}
                        h="48px"
                        px={6}
                      >
                        {t?.("common.reset")}
                      </Button>
                    </HStack>
                    <Text color={mutedText} fontSize="sm">
                      {selectionSummary}
                    </Text>
                  </Flex>
                </Stack>
              </GridItem>
            </Grid>
          </Card>

          <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={6}>
            {overviewMetrics.map((metric) => (
              <PropertyMetric
                key={metric.key}
                icon={metric.icon}
                label={metric.label}
                value={metric.value}
                iconColor={metric.iconColor}
              />
            ))}
          </SimpleGrid>

          <Flex
            justify="space-between"
            align={{ base: "start", md: "end" }}
            direction={{ base: "column", md: "row" }}
            gap={4}
          >
            <Box>
              <Heading size="lg">
                {t?.("modules.dashboardHome.curatedTitle")}
              </Heading>
              <Text color={mutedText} mt={1}>
                {t?.("modules.dashboardHome.curatedDescription")}
              </Text>
            </Box>
            <Wrap spacing={2}>
              {uniqueStatuses.slice(0, 6).map((status) => (
                <WrapItem key={status}>
                  <Badge
                    borderRadius="full"
                    px={3.5}
                    py={1.5}
                    colorScheme={statusColorMap[getStatusKey(status)] || "gray"}
                  >
                    {status}
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>
          </Flex>

          {isLoading ? (
            <SimpleGrid columns={{ base: 1, xl: 2 }} gap={6}>
              <Card p={0} overflow="hidden">
                <Skeleton h="460px" />
              </Card>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} p={0} overflow="hidden">
                    <Skeleton h="320px" />
                  </Card>
                ))}
              </SimpleGrid>
            </SimpleGrid>
          ) : filteredProperties.length > 0 ? (
            <Stack spacing={6}>
              {featuredProperty ? (
                <Card
                  p={0}
                  overflow="hidden"
                  bg={surfaceBg}
                  border={`1px solid ${borderColor}`}
                  backdropFilter="blur(10px)"
                >
                  <Grid
                    templateColumns={{
                      base: "1fr",
                      xl: "minmax(0, 1.04fr) minmax(420px, 0.96fr)",
                    }}
                    gap={0}
                  >
                    <GridItem
                      position="relative"
                      minH={{ base: "320px", xl: "100%" }}
                    >
                      <Image
                        src={getPrimaryImage(featuredProperty)}
                        alt={getPropertyName(
                          featuredProperty,
                          t,
                          i18n.language,
                        )}
                        h="100%"
                        w="100%"
                        minH={{ base: "320px", xl: "100%" }}
                        objectFit="cover"
                      />
                      <Box
                        position="absolute"
                        inset="0"
                        bg="linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.58))"
                      />
                      <Wrap position="absolute" top={5} left={5} spacing={3}>
                        <WrapItem>
                          <Badge
                            colorScheme={
                              statusColorMap[
                                getStatusKey(featuredProperty?.listingStatus)
                              ] || "gray"
                            }
                            px={4}
                            py={2}
                            borderRadius="full"
                            fontSize="sm"
                          >
                            {normalizeStatus(
                              featuredProperty?.listingStatus,
                              t,
                              i18n.language,
                            )}
                          </Badge>
                        </WrapItem>
                        <WrapItem>
                          <Badge
                            bg="blackAlpha.600"
                            color="white"
                            px={4}
                            py={2}
                            borderRadius="full"
                            fontSize="sm"
                          >
                            {getPropertyType(
                              featuredProperty,
                              t,
                              i18n.language,
                            )}
                          </Badge>
                        </WrapItem>
                      </Wrap>
                      <Box
                        position="absolute"
                        left={5}
                        right={5}
                        bottom={5}
                        color="white"
                      >
                        <Text
                          fontSize="xs"
                          letterSpacing="0.16em"
                          textTransform="uppercase"
                          mb={2}
                        >
                          {t?.("modules.dashboardHome.spotlight")}
                        </Text>
                        <Heading
                          size="lg"
                          mb={2}
                          noOfLines={2}
                          sx={{
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          {getPropertyName(featuredProperty, t, i18n.language)}
                        </Heading>
                        <Text color="whiteAlpha.880" noOfLines={2}>
                          {featuredProperty?.propertyAddress ||
                            t?.("modules.dashboardHome.addressNotSpecified")}
                        </Text>
                      </Box>
                    </GridItem>

                    <GridItem>
                      <Stack spacing={6} p={{ base: 6, md: 8, xl: 10 }}>
                        <Flex justify="space-between" align="start" gap={4}>
                          <Box>
                            <Text
                              fontSize="sm"
                              textTransform="uppercase"
                              letterSpacing="0.16em"
                              color="gray.500"
                              mb={2}
                            >
                              {t?.("modules.dashboardHome.flagship")}
                            </Text>
                            <Heading size="xl" color="gray.800">
                              {formatPrice(
                                featuredProperty?.listingPrice,
                                t,
                                i18n.language,
                              )}
                            </Heading>
                          </Box>
                          <Circle size="52px" bg="green.50" color="green.700">
                            <Icon as={LuSparkles} boxSize={6} />
                          </Circle>
                        </Flex>

                        <Text color={mutedText} fontSize="md" lineHeight="1.8">
                          {getShortDescription(featuredProperty, t)}
                        </Text>

                        <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
                          {buildPropertyFacts(
                            featuredProperty,
                            t,
                            i18n.language,
                          ).map((fact) => (
                            <PropertyFactPill key={fact.key} fact={fact} />
                          ))}
                        </SimpleGrid>

                        <Divider />

                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                          <Box>
                            <Text
                              fontSize="xs"
                              textTransform="uppercase"
                              letterSpacing="0.08em"
                              color="gray.500"
                            >
                              {t?.("modules.dashboardHome.propertyType")}
                            </Text>
                            <Text fontWeight="700" color="gray.800">
                              {getPropertyType(
                                featuredProperty,
                                t,
                                i18n.language,
                              )}
                            </Text>
                          </Box>
                          <Box>
                            <Text
                              fontSize="xs"
                              textTransform="uppercase"
                              letterSpacing="0.08em"
                              color="gray.500"
                            >
                              {t?.("modules.dashboardHome.currentStatus")}
                            </Text>
                            <Text fontWeight="700" color="gray.800">
                              {normalizeStatus(
                                featuredProperty?.listingStatus,
                                t,
                                i18n.language,
                              )}
                            </Text>
                          </Box>
                        </SimpleGrid>

                        <Flex
                          justify="space-between"
                          align={{ base: "start", md: "center" }}
                          direction={{ base: "column", md: "row" }}
                          gap={3}
                        >
                          <Text color={mutedText}>
                            {t?.("modules.dashboardHome.crmDescription")}
                          </Text>
                          <Button
                            colorScheme="green"
                            rightIcon={<MdArrowForward />}
                            borderRadius="18px"
                            onClick={() =>
                              navigate(`/propertyView/${featuredProperty?._id}`)
                            }
                          >
                            {t?.("common.viewDetails")}
                          </Button>
                        </Flex>
                      </Stack>
                    </GridItem>
                  </Grid>
                </Card>
              ) : null}

              {remainingProperties.length > 0 ? (
                <SimpleGrid columns={PROPERTY_GRID_COLUMNS} gap={6}>
                  {remainingProperties.map((property) => {
                    const statusLabel = normalizeStatus(
                      property?.listingStatus,
                      t,
                      i18n.language,
                    );
                    const statusColor =
                      statusColorMap[getStatusKey(property?.listingStatus)] ||
                      "gray";

                    return (
                      <Card
                        key={property?._id}
                        p={0}
                        overflow="hidden"
                        bg={surfaceBg}
                        border={`1px solid ${borderColor}`}
                        backdropFilter="blur(10px)"
                        transition="transform 0.2s ease, box-shadow 0.2s ease"
                        _hover={{
                          transform: "translateY(-4px)",
                          boxShadow: "0 20px 60px rgba(15,47,36,0.12)",
                        }}
                      >
                        <Box position="relative">
                          <Image
                            src={getPrimaryImage(property)}
                            alt={getPropertyName(property, t, i18n.language)}
                            h={{ base: "250px", md: "280px" }}
                            w="100%"
                            objectFit="cover"
                          />
                          <Box
                            position="absolute"
                            inset="0"
                            bg="linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.42))"
                          />
                          <Wrap
                            position="absolute"
                            top={4}
                            left={4}
                            spacing={2}
                          >
                            <WrapItem>
                              <Badge
                                colorScheme={statusColor}
                                px={3}
                                py={1}
                                borderRadius="full"
                              >
                                {statusLabel}
                              </Badge>
                            </WrapItem>
                            <WrapItem>
                              <Badge
                                bg="blackAlpha.650"
                                color="white"
                                px={3}
                                py={1}
                                borderRadius="full"
                              >
                                {getPropertyType(property, t, i18n.language)}
                              </Badge>
                            </WrapItem>
                          </Wrap>
                          <Text
                            position="absolute"
                            left={4}
                            bottom={4}
                            color="white"
                            fontWeight="800"
                            fontSize="xl"
                          >
                            {formatPrice(
                              property?.listingPrice,
                              t,
                              i18n.language,
                            )}
                          </Text>
                        </Box>

                        <Stack spacing={5} p={{ base: 5, md: 6 }}>
                          <Box>
                            <Heading size="md" noOfLines={2} color="gray.800">
                              {getPropertyName(property, t, i18n.language)}
                            </Heading>
                            <Text color={mutedText} mt={2} noOfLines={1}>
                              {property?.propertyAddress ||
                                t?.(
                                  "modules.dashboardHome.addressNotSpecified",
                                )}
                            </Text>
                          </Box>

                          <Text
                            color={mutedText}
                            fontSize="sm"
                            lineHeight="1.8"
                            minH={{ base: "unset", md: "72px" }}
                          >
                            {getShortDescription(property, t)}
                          </Text>

                          <SimpleGrid columns={{ base: 1, sm: 3 }} gap={3}>
                            {buildPropertyFacts(property, t, i18n.language).map(
                              (fact) => (
                                <PropertyFactPill
                                  key={`${property?._id}-${fact.key}`}
                                  fact={fact}
                                  compact
                                />
                              ),
                            )}
                          </SimpleGrid>

                          <Button
                            size="md"
                            borderRadius="18px"
                            colorScheme="green"
                            rightIcon={<MdArrowForward />}
                            onClick={() =>
                              navigate(`/propertyView/${property?._id}`)
                            }
                          >
                            {t?.("modules.dashboardHome.openProperty")}
                          </Button>
                        </Stack>
                      </Card>
                    );
                  })}
                </SimpleGrid>
              ) : null}
            </Stack>
          ) : (
            <Card bg={surfaceBg} border={`1px solid ${borderColor}`}>
              <Stack spacing={4} align="start">
                <Heading size="md">
                  {t?.("modules.dashboardHome.noPropertiesTitle")}
                </Heading>
                <Text color={mutedText}>
                  {t?.("modules.dashboardHome.noPropertiesDescription")}
                </Text>
                <SimpleGrid
                  columns={{ base: 1, md: 2 }}
                  gap={3}
                  w={{ base: "100%", md: "auto" }}
                >
                  <Button
                    colorScheme="green"
                    onClick={() => navigate("/properties")}
                  >
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
    </Box>
  );
}
